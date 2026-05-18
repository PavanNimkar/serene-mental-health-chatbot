"""
apps/chat/ai_engine.py  — FINAL STABLE VERSION
────────────────────────────────────────────────
Architecture change: direct Groq call instead of LangGraph for normal messages.

Why: LangGraph + Groq kept looping (Groq re-calls tools after seeing results).
     Direct call is simpler, faster, and memory works perfectly.

Tool routing still happens — but via keyword detection before the LLM call,
not via agentic loop. Emergency and therapist tools still fire correctly.

Flow:
  1. Build memory (mood, assessments, goals, last session) from DB
  2. Check if message needs emergency or therapist tool (keyword detection)
  3. If yes  → call the specific tool directly
  4. If no   → call Groq directly with full memory in system prompt
  5. Return response — always within 1 LLM call, no loops
"""

import logging
import re
from django.conf import settings

logger = logging.getLogger("apps.chat")


# ── System prompt for Groq (direct call) ─────────────────────────────────────

_SYSTEM_PROMPT = """You are Serene, a warm and empathetic AI mental health companion.
You respond like a compassionate therapist who has been talking to this person for a while.

Communication style: {chat_style}

── What you know about this person ───────────────────────────────────────────
{memory_block}
──────────────────────────────────────────────────────────────────────────────

CRITICAL RULES — follow every single one:
- ALWAYS address the user by their name (it is in the context above)
- If "Last session summary" is present above — you HAVE had previous conversations.
  Reference it. Say things like "Last time we spoke..." or "I remember you mentioned..."
  NEVER say "this is our first conversation" if a last session summary exists above.
- If mood entries exist — reference them specifically ("I can see your mood has been...")
- If no mood entries — say "I'd love to start tracking your mood together" NOT "I have no data"
- Never say "I don't have access to your history"
- Never say "this is our first conversation" if a last session exists above
- Validate feelings first, then offer one practical CBT or mindfulness suggestion
- Keep response warm, personal, conversational, under 180 words
- Never diagnose or label disorders"""


# ── Crisis & therapist keyword patterns ──────────────────────────────────────

_CRISIS_PATTERNS = re.compile(
    r"(suicid\w*|commit suicide|kill (my)?self|end my life|want to die|"
    r"self[.\-]?harm|hurt myself|don.{0,5}t want to live|no reason to live|"
    r"better off dead|overdose|take my (own )?life|not want to (be here|live)|"
    r"want to (commit|end it)|feeling suicidal)",
    re.IGNORECASE,
)

_THERAPIST_PATTERNS = re.compile(
    r"\b(find (a |me a )?therapist|therapist near|psychologist near|"
    r"counsellor near|mental health professional|in.person (help|support|therapy))\b",
    re.IGNORECASE,
)


# ── Public entry point ────────────────────────────────────────────────────────

def generate_response(
    conversation_history: list[dict],
    user_profile: dict,
    user=None,
) -> str:
    try:
        current_message = _last_user_message(conversation_history)
        chat_style      = user_profile.get("chat_style", "supportive")

        # 1. Build memory
        memory_block = _build_memory_safe(user, current_message)
        has_memory   = memory_block != "No prior context available."
        logger.info("Memory ready | user=%s | has_data=%s | preview: %s",
                    getattr(user, "id", "anon"), has_memory,
                    memory_block[:100].replace("\n", " "))

        # 2. Check for emergency
        if _CRISIS_PATTERNS.search(current_message):
            logger.critical(
                "CRISIS DETECTED | user=%s | message=%s",
                getattr(user, "id", "anon"),
                current_message[:80],
            )
            from .agent_tools import emergency_call_tool
            tool_response = emergency_call_tool.invoke({})
            logger.info("Agent response | tool=emergency_call_tool | memory=%s",
                        "yes" if has_memory else "no")
            return tool_response

        # 3. Check for therapist request
        therapist_match = _THERAPIST_PATTERNS.search(current_message)
        if therapist_match:
            logger.info("Therapist request detected")
            from .agent_tools import find_nearby_therapists_by_location
            # Extract location from message or use a generic response
            location = _extract_location(current_message) or "your area"
            tool_response = find_nearby_therapists_by_location.invoke(
                {"location": location}
            )
            logger.info("Agent response | tool=find_nearby_therapists | memory=%s",
                        "yes" if has_memory else "no")
            return tool_response

        # 4. Normal message → direct Groq call with full memory
        response = _call_groq_direct(
            conversation_history=conversation_history,
            current_message=current_message,
            memory_block=memory_block,
            chat_style=chat_style,
        )
        logger.info("Agent response | tool=direct_groq | user=%s | chars=%d | memory=%s",
                    user_profile.get("display_name", "unknown"),
                    len(response),
                    "yes" if has_memory else "no")
        return response

    except Exception as exc:
        logger.error("generate_response error: %s", exc)
        return _crisis_fallback()


# ── Direct Groq call ──────────────────────────────────────────────────────────

def _call_groq_direct(
    conversation_history: list[dict],
    current_message: str,
    memory_block: str,
    chat_style: str,
) -> str:
    """
    Calls Groq directly with the full memory in the system prompt.
    Includes last 6 conversation turns for context continuity.
    """
    try:
        from groq import Groq

        system = _SYSTEM_PROMPT.format(
            chat_style=chat_style,
            memory_block=memory_block,
        )

        # Build messages: system + last 6 turns + current message
        messages = [{"role": "system", "content": system}]
        for msg in conversation_history[-12:]:
            messages.append({"role": msg["role"], "content": msg["content"]})

        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model=getattr(settings, "GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=messages,
            max_tokens=400,
            temperature=0.7,
        )
        result = response.choices[0].message.content.strip()
        return result if result else "I'm here with you. What's on your mind?"

    except Exception as exc:
        logger.error("Groq direct call failed: %s", exc)
        return _hf_fallback_direct(conversation_history, memory_block, chat_style)


def _hf_fallback_direct(
    conversation_history: list[dict],
    memory_block: str,
    chat_style: str,
) -> str:
    """Falls back to HuggingFace if Groq fails."""
    try:
        from huggingface_hub import InferenceClient

        system = _SYSTEM_PROMPT.format(
            chat_style=chat_style,
            memory_block=memory_block,
        )
        messages = [{"role": "system", "content": system}]
        messages += [{"role": m["role"], "content": m["content"]}
                     for m in conversation_history]

        client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)
        completion = client.chat.completions.create(
            model=settings.HF_MODEL_ID,
            messages=messages,
            max_tokens=400,
            temperature=0.7,
        )
        return completion.choices[0].message.content.strip()
    except Exception as exc:
        logger.error("HF fallback failed: %s", exc)
        return _crisis_fallback()


# ── Memory builder ────────────────────────────────────────────────────────────

def _build_memory_safe(user, current_message: str) -> str:
    """
    Builds memory block from Django DB.
    Each source in its own try/except — one failure never kills others.
    """
    if user is None:
        return "No prior context available."

    from datetime import timedelta
    from django.utils import timezone

    lines = []

    # 1. Profile
    try:
        name     = user.display_name or user.username
        concerns = ", ".join(user.primary_concerns) if user.primary_concerns else None
        age      = f" ({user.age_range})" if getattr(user, "age_range", "") else ""
        lines.append(f"Name: {name}{age}")
        if concerns:
            lines.append(f"Primary concerns: {concerns}")
        if getattr(user, "safety_status", "") == "yes":
            lines.append("⚠ Safety flag: User has indicated self-harm thoughts — be especially gentle.")
    except Exception as e:
        logger.warning("Memory profile error: %s", e)

    # 2. Mood — last 7 days
    try:
        from apps.mood.models import MoodEntry
        since   = timezone.now().date() - timedelta(days=7)
        entries = list(
            MoodEntry.objects.filter(user=user, logged_date__gte=since)
            .order_by("logged_date")
            .values("mood_score", "mood_label")
        )
        if entries:
            scores = [e["mood_score"] for e in entries]
            avg    = round(sum(scores) / len(scores), 1)
            labels = list(dict.fromkeys(e["mood_label"] for e in entries))
            trend  = ("improving" if scores[-1] > scores[0]
                      else "declining" if scores[-1] < scores[0] else "stable")
            lines.append(
                f"Mood this week: average {avg}/10 ({', '.join(labels[:3])}), "
                f"trend is {trend}"
            )
        else:
            lines.append("Mood: no entries logged yet (encourage them to log mood)")
    except Exception as e:
        logger.warning("Memory mood error: %s", e)

    # 3. Assessments
    try:
        from apps.tests_app.models import TestResult
        parts = []
        for test_type in ["PHQ-9", "GAD-7"]:
            r = (TestResult.objects.filter(user=user, test_type=test_type)
                 .order_by("-taken_at").first())
            if r:
                days_ago = (timezone.now() - r.taken_at).days
                when     = f"{days_ago} days ago" if days_ago > 0 else "today"
                parts.append(
                    f"{r.test_type}: score {r.score}/{r.max_score} "
                    f"({r.severity} severity, taken {when})"
                )
        if parts:
            lines.append("Mental health assessments: " + "; ".join(parts))
    except Exception as e:
        logger.warning("Memory assessments error: %s", e)

    # 4. Active goals
    try:
        from apps.goals.models import Goal
        goals = Goal.objects.filter(user=user, status="active").order_by("-created_at")[:3]
        if goals:
            goal_strs = [f"{g.title} ({g.progress_pct}% complete)" for g in goals]
            lines.append("Active goals: " + "; ".join(goal_strs))
    except Exception:
        pass  # goals app not installed yet — skip silently

    # 5. Last session
    try:
        from apps.chat.models import Conversation, Message
        prev = (
            Conversation.objects.filter(user=user, is_active=True)
            .order_by("-updated_at")[1:2]
            .first()
        )
        if prev:
            last_reply = (
                Message.objects.filter(conversation=prev, role=Message.Role.ASSISTANT)
                .order_by("-created_at")
                .values_list("content", flat=True)
                .first()
            )
            if last_reply:
                snippet = last_reply[:200] + ("..." if len(last_reply) > 200 else "")
                lines.append(f"Last session summary: {snippet}")
    except Exception as e:
        logger.warning("Memory last session error: %s", e)

    # 6. RAG — local embeddings, no OpenAI
    try:
        snippets = _rag_local(user.id, current_message, top_k=2)
        if snippets:
            joined = "\n  • ".join(snippets)
            lines.append(f"Relevant past journal/mood notes:\n  • {joined}")
    except Exception as e:
        logger.warning("Memory RAG skipped (%s)", type(e).__name__)

    if not lines:
        return "No prior context — this may be the user's first session."

    return "\n".join(lines)


# ── RAG with local sentence-transformers ──────────────────────────────────────

_embedder_cache: dict = {}

def _get_embedder(model_name: str):
    if model_name not in _embedder_cache:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model: %s (first load only)", model_name)
        _embedder_cache[model_name] = SentenceTransformer(model_name)
    return _embedder_cache[model_name]


def _rag_local(user_id: int, query: str, top_k: int = 2) -> list[str]:
    import os, pickle
    import numpy as np
    import faiss

    model_name = getattr(settings, "EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
    embedder   = _get_embedder(model_name)
    q_vec      = embedder.encode([query], normalize_embeddings=True).astype("float32")
    results    = []
    RAG_DIR    = getattr(settings, "RAG_INDEX_DIR", "./rag_indexes")

    # Journal FAISS index
    index_path = os.path.join(RAG_DIR, f"user_{user_id}.faiss")
    meta_path  = os.path.join(RAG_DIR, f"user_{user_id}_meta.pkl")
    if os.path.exists(index_path) and os.path.exists(meta_path):
        index = faiss.read_index(index_path)
        with open(meta_path, "rb") as f:
            metadata = pickle.load(f)
        if index.ntotal > 0:
            k = min(top_k, index.ntotal)
            scores, ids = index.search(q_vec, k)
            for score, fid in zip(scores[0], ids[0]):
                if fid >= 0 and fid in metadata and score > 0.3:
                    text = metadata[fid].get("text", "")
                    date = metadata[fid].get("date", "")
                    snippet = text[:180] + ("..." if len(text) > 180 else "")
                    results.append(f"[{date}] {snippet}" if date else snippet)

    # Mood notes fallback
    if len(results) < top_k:
        from apps.mood.models import MoodEntry
        notes = list(
            MoodEntry.objects.filter(user_id=user_id)
            .exclude(note="")
            .order_by("-logged_date")
            .values("note", "logged_date")[:40]
        )
        if notes:
            texts = [f"[{n['logged_date']}] {n['note']}" for n in notes]
            vecs  = embedder.encode(texts, normalize_embeddings=True).astype("float32")
            idx   = faiss.IndexFlatIP(vecs.shape[1])
            idx.add(vecs)
            k     = min(top_k - len(results), len(texts))
            sc, ii = idx.search(q_vec, k)
            for score, i in zip(sc[0], ii[0]):
                if i >= 0 and score > 0.25:
                    results.append(texts[i][:180])

    return results[:top_k]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _extract_location(message: str) -> str:
    """Extracts city name from therapist request messages."""
    patterns = [
        r"near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"(?:therapist|psychologist|counsellor)\s+(?:in|near)\s+([A-Za-z\s]+?)(?:\?|$|\.)",
    ]
    for pat in patterns:
        m = re.search(pat, message, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return ""


def _last_user_message(history: list[dict]) -> str:
    for msg in reversed(history):
        if msg.get("role") == "user":
            return msg.get("content", "")
    return ""


def _crisis_fallback() -> str:
    return (
        "I'm having a moment of difficulty. Please try again.\n\n"
        "If you're in crisis right now:\n"
        "• India iCall: 9152987821\n"
        "• India Vandrevala: 1860-2662-345 (24/7)\n"
        "• US: 988 Suicide & Crisis Lifeline"
    )