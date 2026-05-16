"""
apps/journal/services.py
─────────────────────────
Two services:

1. generate_ai_reflection(entry)
   Called after a journal entry is saved. Asks HuggingFace to write
   a single empathetic sentence acknowledging what the user wrote.
   Stored in entry.ai_reflection and shown back to the user in the UI.

2. index_entry_for_rag(entry)
   Builds an OpenAI embedding for the entry and stores it in a
   per-user FAISS index on disk (./rag_indexes/user_<id>.faiss).
   The memory.py RAG retriever loads this index at chat time.
"""

import json
import logging
import os
import pickle

from django.conf import settings

logger = logging.getLogger("apps.journal")

# Where FAISS index files are stored on disk
RAG_INDEX_DIR = getattr(settings, "RAG_INDEX_DIR", "./rag_indexes")


# ── AI reflection ─────────────────────────────────────────────────────────────


def generate_ai_reflection(entry) -> str:
    """
    Sends the journal entry content to HuggingFace and returns a
    1-sentence empathetic reflection. Uses the SAME model already
    configured in .env (HF_MODEL_ID / HUGGINGFACE_TOKEN).
    """
    try:
        from huggingface_hub import InferenceClient

        prompt = (
            f"The user wrote this journal entry:\n\n"
            f'"{entry.content[:800]}"\n\n'
            "Write exactly ONE warm, empathetic sentence (max 30 words) that:\n"
            "- Acknowledges what they shared\n"
            "- Validates their feelings\n"
            "- Does NOT give advice or ask questions\n"
            "Return only the sentence, nothing else."
        )

        client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)
        completion = client.chat.completions.create(
            model=settings.HF_MODEL_ID,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a compassionate journaling companion. "
                        "You respond with a single warm sentence only."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=60,
            temperature=0.6,
        )
        reflection = completion.choices[0].message.content.strip()
        # Ensure it's a single sentence
        reflection = reflection.split("\n")[0].strip('"').strip("'")
        return reflection

    except Exception as exc:
        logger.warning("generate_ai_reflection failed: %s", exc)
        return ""


# ── RAG indexing ──────────────────────────────────────────────────────────────


def index_entry_for_rag(entry) -> None:
    """
    Embeds the journal entry and upserts it into the user's FAISS index.
    Index is stored at {RAG_INDEX_DIR}/user_{user_id}.faiss
    Metadata (entry id → text) at {RAG_INDEX_DIR}/user_{user_id}_meta.pkl

    Called on create and update.
    Requires: pip install faiss-cpu openai
    """
    try:
        import faiss
        import numpy as np
        from openai import OpenAI

        os.makedirs(RAG_INDEX_DIR, exist_ok=True)

        user_id = entry.user_id
        index_path = os.path.join(RAG_INDEX_DIR, f"user_{user_id}.faiss")
        meta_path = os.path.join(RAG_INDEX_DIR, f"user_{user_id}_meta.pkl")

        # Build text to embed: title + content + tags
        text_parts = []
        if entry.title:
            text_parts.append(entry.title)
        text_parts.append(entry.content)
        if entry.tags:
            text_parts.append("Tags: " + ", ".join(entry.tags))
        text = " | ".join(text_parts)[:1500]  # stay within embedding token limit

        # Get embedding
        openai_client = OpenAI(api_key=_get_openai_key())
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=[text],
        )
        embedding = response.data[0].embedding
        dim = len(embedding)
        vec = np.array([embedding], dtype="float32")
        faiss.normalize_L2(vec)

        # Load or create index
        if os.path.exists(index_path) and os.path.exists(meta_path):
            index = faiss.read_index(index_path)
            with open(meta_path, "rb") as f:
                metadata: dict = pickle.load(f)
        else:
            index = faiss.IndexIDMap(faiss.IndexFlatIP(dim))
            metadata = {}  # faiss_id (int) → {"entry_id": int, "text": str}

        # Use entry.id as the FAISS vector ID (stable, unique per user)
        faiss_id = entry.id
        if faiss_id in metadata:
            # Remove existing vector before re-adding (update case)
            index.remove_ids(np.array([faiss_id], dtype="int64"))

        index.add_with_ids(vec, np.array([faiss_id], dtype="int64"))
        metadata[faiss_id] = {
            "entry_id": entry.id,
            "text": text,
            "date": str(entry.created_at.date()),
        }

        # Persist
        faiss.write_index(index, index_path)
        with open(meta_path, "wb") as f:
            pickle.dump(metadata, f)

        # Mark entry as indexed
        entry.embedding_updated = True
        entry.save(update_fields=["embedding_updated"])

        logger.info("RAG indexed entry %s for user %s", entry.id, user_id)

    except ImportError as exc:
        logger.warning("RAG indexing skipped — missing package: %s", exc)
    except Exception as exc:
        logger.error("RAG index_entry_for_rag failed for entry %s: %s", entry.id, exc)


def _get_openai_key() -> str:
    key = getattr(settings, "OPENAI_API_KEY", "")
    if not key:
        raise ValueError("OPENAI_API_KEY not set — RAG indexing requires it")
    return key
