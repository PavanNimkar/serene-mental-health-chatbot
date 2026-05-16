"""
apps/chat/memory.py  (UPGRADED — Phase 2)
──────────────────────────────────────────
Builds a rich UserMemory from ALL data sources:
  - MoodEntry       → mood trend summary
  - TestResult      → PHQ-9 / GAD-7 severity
  - JournalEntry    → RAG semantic search over entries
  - Goal            → active goals + progress
  - Message         → last session recap (auto-generated summary)
  - User            → name, chat style, concerns, age, safety status

Everything is injected into the system prompt as plain text.
No model retraining. No external memory service.
"""

import logging
from dataclasses import dataclass, field
from datetime import timedelta

from django.utils import timezone

logger = logging.getLogger("apps.chat")


# ── Data container ─────────────────────────────────────────────────────────────


@dataclass
class UserMemory:
    preferred_name: str = ""
    chat_style: str = "supportive"
    age_range: str = ""
    primary_concerns: list[str] = field(default_factory=list)
    safety_note: str = ""

    # Mood
    recent_mood_summary: str = ""  # "Avg 4.2/10 this week (low, anxious), declining"

    # Assessments
    assessment_insights: str = ""  # "PHQ-9: 14/27 moderate (5d ago)"

    # Goals
    active_goals: list[str] = field(
        default_factory=list
    )  # ["Reduce panic attacks (40%)"]

    # Last session
    last_session_summary: str = ""  # auto-generated or last assistant reply snippet

    # RAG — journal entries
    relevant_journal_snippets: list[str] = field(default_factory=list)

    def to_prompt_block(self) -> str:
        """Renders a compact block for injection into the system prompt."""
        parts = []

        if self.preferred_name:
            parts.append(
                f"User: {self.preferred_name}"
                + (f" ({self.age_range})" if self.age_range else "")
            )

        if self.primary_concerns:
            parts.append(f"Concerns: {', '.join(self.primary_concerns)}")

        if self.recent_mood_summary:
            parts.append(f"Mood (7d): {self.recent_mood_summary}")

        if self.assessment_insights:
            parts.append(f"Assessments: {self.assessment_insights}")

        if self.active_goals:
            goals_str = "; ".join(self.active_goals[:3])
            parts.append(f"Active goals: {goals_str}")

        if self.last_session_summary:
            parts.append(f"Last session: {self.last_session_summary}")

        if self.relevant_journal_snippets:
            snippets = "\n  • ".join(self.relevant_journal_snippets)
            parts.append(f"Relevant journal context:\n  • {snippets}")

        if self.safety_note:
            parts.append(f"⚠ Safety note: {self.safety_note}")

        return (
            "\n".join(parts)
            if parts
            else "No prior context — this may be the user's first session."
        )


# ── Main builder ───────────────────────────────────────────────────────────────


def build_user_memory(user, current_message: str) -> UserMemory:
    """
    Assembles UserMemory from Django ORM + FAISS RAG.
    Called once per chat message before the LLM is invoked.

    Args:
        user:            Django User instance (request.user)
        current_message: The user's current message text (for RAG query)
    """
    memory = UserMemory(
        preferred_name=user.display_name or user.username,
        chat_style=user.chat_style or "supportive",
        age_range=user.age_range or "",
        primary_concerns=user.primary_concerns or [],
    )

    # Safety flag
    if user.safety_status == "yes":
        memory.safety_note = "User has previously indicated thoughts of self-harm. Be especially gentle and watch for crisis signals."

    # ── Mood ──────────────────────────────────────────────────────────────────
    try:
        memory.recent_mood_summary = _mood_summary(user)
    except Exception as exc:
        logger.warning("memory mood failed user=%s: %s", user.id, exc)

    # ── Assessments ───────────────────────────────────────────────────────────
    try:
        memory.assessment_insights = _assessment_summary(user)
    except Exception as exc:
        logger.warning("memory assessments failed user=%s: %s", user.id, exc)

    # ── Goals ─────────────────────────────────────────────────────────────────
    try:
        memory.active_goals = _active_goals_summary(user)
    except Exception as exc:
        logger.warning("memory goals failed user=%s: %s", user.id, exc)

    # ── Last session ──────────────────────────────────────────────────────────
    try:
        memory.last_session_summary = _last_session_summary(user)
    except Exception as exc:
        logger.warning("memory last session failed user=%s: %s", user.id, exc)

    # ── RAG: journal + mood notes ─────────────────────────────────────────────
    try:
        memory.relevant_journal_snippets = retrieve_relevant_entries(
            user_id=user.id,
            query=current_message,
            top_k=3,
        )
    except Exception as exc:
        logger.warning("memory RAG failed user=%s: %s", user.id, exc)

    return memory


# ── Mood ───────────────────────────────────────────────────────────────────────


def _mood_summary(user) -> str:
    from apps.mood.models import MoodEntry

    since = timezone.now().date() - timedelta(days=7)
    entries = list(
        MoodEntry.objects.filter(user=user, logged_date__gte=since)
        .order_by("logged_date")
        .values("mood_score", "mood_label")
    )
    if not entries:
        return ""

    scores = [e["mood_score"] for e in entries]
    avg = round(sum(scores) / len(scores), 1)
    labels = list(dict.fromkeys(e["mood_label"] for e in entries))  # ordered unique
    trend = (
        "improving"
        if scores[-1] > scores[0]
        else "declining" if scores[-1] < scores[0] else "stable"
    )
    return f"avg {avg}/10 ({', '.join(labels[:3])}), {trend}"


# ── Assessments ────────────────────────────────────────────────────────────────


def _assessment_summary(user) -> str:
    from apps.tests_app.models import TestResult

    parts = []
    for test_type in ["PHQ-9", "GAD-7"]:
        r = (
            TestResult.objects.filter(user=user, test_type=test_type)
            .order_by("-taken_at")
            .first()
        )
        if r:
            days_ago = (timezone.now() - r.taken_at).days
            when = f"{days_ago}d ago" if days_ago > 0 else "today"
            parts.append(f"{r.test_type} {r.score}/{r.max_score} {r.severity} ({when})")

    return "; ".join(parts)


# ── Goals ──────────────────────────────────────────────────────────────────────


def _active_goals_summary(user) -> list[str]:
    """Returns up to 3 active goals as short strings."""
    try:
        from apps.goals.models import Goal

        goals = Goal.objects.filter(user=user, status="active").order_by("-created_at")[
            :3
        ]
        result = []
        for g in goals:
            pct = f" ({g.progress_pct}%)" if g.progress_pct > 0 else ""
            result.append(f"{g.title}{pct}")
        return result
    except Exception:
        # goals app may not be installed yet — fail gracefully
        return []


# ── Last session summary ───────────────────────────────────────────────────────


def _last_session_summary(user) -> str:
    """
    Returns the auto-generated session summary from the most recent
    PREVIOUS conversation, or falls back to the last assistant reply snippet.
    """
    from apps.chat.models import Conversation, Message

    # Most recent completed conversation (not current)
    prev = (
        Conversation.objects.filter(user=user, is_active=True)
        .order_by("-updated_at")[1:2]
        .first()
    )
    if not prev:
        return ""

    # Prefer stored summary on the conversation (set by generate_session_summary)
    if hasattr(prev, "summary") and prev.summary:
        return prev.summary[:250]

    # Fallback: last assistant message snippet
    last_reply = (
        Message.objects.filter(conversation=prev, role=Message.Role.ASSISTANT)
        .order_by("-created_at")
        .values_list("content", flat=True)
        .first()
    )
    if last_reply:
        return last_reply[:200] + ("..." if len(last_reply) > 200 else "")
    return ""


# ── RAG: semantic retrieval over journal + mood notes ─────────────────────────


def retrieve_relevant_entries(
    user_id: int,
    query: str,
    top_k: int = 3,
) -> list[str]:
    """
    Searches the user's FAISS index (built by apps.journal.services.index_entry_for_rag
    and _index_mood_notes) for the top_k most semantically relevant entries.

    Falls back to mood notes only if no journal index exists.
    Requires: pip install faiss-cpu openai
    """
    import os, pickle
    from django.conf import settings as django_settings

    RAG_DIR = getattr(django_settings, "RAG_INDEX_DIR", "./rag_indexes")

    try:
        import faiss, numpy as np
        from openai import OpenAI

        openai_client = OpenAI(api_key=_get_openai_key())

        # Embed query
        resp = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=[query],
        )
        q_vec = np.array([resp.data[0].embedding], dtype="float32")
        faiss.normalize_L2(q_vec)

        results = []

        # ── Try journal FAISS index first ─────────────────────────────────────
        journal_index_path = os.path.join(RAG_DIR, f"user_{user_id}.faiss")
        journal_meta_path = os.path.join(RAG_DIR, f"user_{user_id}_meta.pkl")

        if os.path.exists(journal_index_path) and os.path.exists(journal_meta_path):
            index = faiss.read_index(journal_index_path)
            with open(journal_meta_path, "rb") as f:
                metadata = pickle.load(f)

            if index.ntotal > 0:
                k = min(top_k, index.ntotal)
                scores, ids = index.search(q_vec, k)
                for score, fid in zip(scores[0], ids[0]):
                    if fid >= 0 and fid in metadata and score > 0.3:
                        text = metadata[fid].get("text", "")
                        date = metadata[fid].get("date", "")
                        snippet = text[:200] + ("..." if len(text) > 200 else "")
                        results.append(f"[{date}] {snippet}" if date else snippet)

        # ── Fill remaining slots from mood notes ──────────────────────────────
        if len(results) < top_k:
            mood_results = _rag_mood_notes(
                user_id, query, top_k - len(results), openai_client, q_vec, RAG_DIR
            )
            results.extend(mood_results)

        return results[:top_k]

    except ImportError as exc:
        logger.warning("RAG skipped — missing package: %s", exc)
        return []
    except Exception as exc:
        logger.warning("RAG retrieve_relevant_entries failed user=%s: %s", user_id, exc)
        return []


def _rag_mood_notes(user_id, query, top_k, openai_client, q_vec, rag_dir) -> list[str]:
    """In-memory FAISS over the user's mood entry notes (no persisted index)."""
    import faiss, numpy as np

    from apps.mood.models import MoodEntry

    notes = list(
        MoodEntry.objects.filter(user_id=user_id)
        .exclude(note="")
        .order_by("-logged_date")
        .values("note", "logged_date")[:60]
    )
    if not notes:
        return []

    texts = [f"[{n['logged_date']}] {n['note']}" for n in notes]
    resp = openai_client.embeddings.create(model="text-embedding-3-small", input=texts)
    vecs = np.array([d.embedding for d in resp.data], dtype="float32")
    faiss.normalize_L2(vecs)

    index = faiss.IndexFlatIP(vecs.shape[1])
    index.add(vecs)

    k = min(top_k, len(texts))
    scores, ids = index.search(q_vec, k)

    results = []
    for score, idx in zip(scores[0], ids[0]):
        if idx >= 0 and score > 0.25:
            snippet = texts[idx][:180] + ("..." if len(texts[idx]) > 180 else "")
            results.append(snippet)
    return results


def _get_openai_key() -> str:
    from django.conf import settings as s

    key = getattr(s, "OPENAI_API_KEY", "")
    if not key:
        raise ValueError("OPENAI_API_KEY not set")
    return key
