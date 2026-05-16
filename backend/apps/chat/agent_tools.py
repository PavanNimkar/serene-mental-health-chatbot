"""
apps/chat/agent_tools.py  — FREE STACK VERSION
────────────────────────────────────────────────
Changes from previous version:
  - ask_mental_health_specialist now uses Groq (llama-3.3-70b-versatile)
    instead of HuggingFace InferenceClient
  - Groq is free, fast (~300 tokens/sec), no quota issues for dev
  - Memory context still injected via thread-local (same mechanism)
  - emergency_call_tool and find_nearby_therapists unchanged
"""

import logging
import threading
from django.conf import settings

logger = logging.getLogger("apps.chat")

# Thread-local: ai_engine writes memory here before agent runs
# ask_mental_health_specialist reads it so Groq sees full user context
_thread_local = threading.local()


def set_memory_context(memory_block: str, chat_style: str = "supportive") -> None:
    """Called by ai_engine.py before invoking the agent."""
    _thread_local.memory_block = memory_block
    _thread_local.chat_style = chat_style


def _get_memory_context() -> tuple[str, str]:
    memory_block = getattr(_thread_local, "memory_block", "")
    chat_style = getattr(_thread_local, "chat_style", "supportive")
    return memory_block, chat_style


# LangChain >= 0.2 moved tool to langchain_core
try:
    from langchain_core.tools import tool
except ImportError:
    from langchain.agents import tool


# ── Therapist persona ─────────────────────────────────────────────────────────

_THERAPIST_SYSTEM = """You are Dr. Emily Hartman, a warm and experienced clinical psychologist
specialising in CBT, mindfulness, and trauma-informed care.

Respond with:
1. Emotional attunement — acknowledge what the user is feeling first
2. Gentle normalisation — help them feel less alone
3. Practical guidance — offer one concrete CBT or mindfulness technique
4. Strengths focus — notice what they are doing right
5. Open question — keep the conversation going

Rules:
- Use the user's name if provided in context
- Reference their mood history, assessments, or goals if mentioned in context
- Never say "I don't have access to your history" — if context is provided, USE IT
- Never diagnose. Never say "you have X disorder"
- If crisis signals appear, always include: iCall India 9152987821 | US 988
- Keep response warm, under 200 words, conversational

{memory_section}"""


def _call_groq(prompt: str) -> str:
    """
    Calls Groq API with llama-3.3-70b-versatile.
    Injects memory context from thread-local into the system prompt
    so the model knows who it's talking to.
    """
    try:
        from groq import Groq

        memory_block, chat_style = _get_memory_context()

        if memory_block and memory_block != "No prior context available.":
            memory_section = (
                f"── What you know about this user (use this to personalise) ──\n"
                f"{memory_block}\n"
                f"── Communication style requested: {chat_style} ──"
            )
        else:
            memory_section = f"Communication style: {chat_style}"

        system = _THERAPIST_SYSTEM.format(memory_section=memory_section)

        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            max_tokens=350,
            temperature=0.7,
        )
        result = response.choices[0].message.content.strip()
        # Safety: if Groq returns empty, give a warm default
        return result if result else "I'm here with you. What's on your mind?"

    except Exception as exc:
        logger.error("Groq specialist call failed: %s", exc)
        # Fallback to HuggingFace if Groq fails
        return _call_hf_fallback(prompt)


def _call_hf_fallback(prompt: str) -> str:
    """Backup: HuggingFace InferenceClient if Groq is unavailable."""
    try:
        from huggingface_hub import InferenceClient

        memory_block, chat_style = _get_memory_context()
        memory_section = (
            f"\n── User context ──\n{memory_block}\n──────────────────"
            if memory_block and memory_block != "No prior context available."
            else ""
        )
        system = (
            "You are Serene, a compassionate AI mental health companion. "
            f"Communication style: {chat_style}.{memory_section}"
        )
        client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)
        completion = client.chat.completions.create(
            model=settings.HF_MODEL_ID,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            max_tokens=400,
            temperature=0.7,
        )
        return completion.choices[0].message.content.strip()
    except Exception as exc:
        logger.error("HF fallback also failed: %s", exc)
        return (
            "I'm having technical difficulties. Your feelings matter. "
            "Please try again shortly.\n\n"
            "If in crisis: iCall India 9152987821 | US 988"
        )


# ── Tool 1: Mental health specialist (Groq) ───────────────────────────────────


@tool
def ask_mental_health_specialist(query: str) -> str:
    """
    Generate a therapeutic, personalised response using the mental health AI model.
    Use this for ALL emotional, psychological, or therapeutic queries.
    The model has access to the user's mood history, assessment scores, and goals.
    """
    logger.info("Tool: ask_mental_health_specialist called")
    return _call_groq(query)


# ── Tool 2: Emergency call ────────────────────────────────────────────────────


@tool
def emergency_call_tool() -> str:
    """
    Place an emergency voice call to the user's emergency contact via Twilio.
    Use ONLY if the user expresses suicidal ideation, intent to self-harm,
    or describes an immediate mental health crisis.
    """
    logger.warning("Tool: emergency_call_tool triggered")

    if settings.DEBUG:
        logger.warning(
            "DEBUG=True: call suppressed (would have called %s)",
            getattr(settings, "EMERGENCY_CONTACT", "not set"),
        )
        return (
            "I've reached out to your emergency contact on your behalf.\n"
            "(Running in development mode — call suppressed.)\n\n"
            "Please reach out right now:\n"
            "• India iCall: 9152987821\n"
            "• India Vandrevala: 1860-2662-345 (24/7)\n"
            "• US: 988 Suicide & Crisis Lifeline\n"
            "• International: https://www.befrienders.org"
        )

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        call = client.calls.create(
            to=settings.EMERGENCY_CONTACT,
            from_=settings.TWILIO_FROM_NUMBER,
            url="http://demo.twilio.com/docs/voice.xml",
        )
        logger.critical(
            "Emergency call placed SID=%s to=%s", call.sid, settings.EMERGENCY_CONTACT
        )
        return (
            "I've placed an emergency call to your designated contact. "
            "Please stay safe.\n\n"
            "• India iCall: 9152987821\n"
            "• US: 988"
        )
    except ImportError:
        return "Emergency call service not configured. Call iCall: 9152987821 | US 988 immediately."
    except Exception as exc:
        logger.error("Twilio call failed: %s", exc)
        return "Call failed. Please call iCall: 9152987821 | US 988 immediately."


# ── Tool 3: Therapist finder ──────────────────────────────────────────────────


@tool
def find_nearby_therapists_by_location(location: str) -> str:
    """
    Find licensed therapists near the specified location.
    Use when the user asks about local professional support or in-person therapy.

    Args:
        location: City or area where the user wants to find a therapist.
    """
    logger.info("Tool: find_nearby_therapists_by_location | location=%s", location)

    google_key = getattr(settings, "GOOGLE_PLACES_API_KEY", "")
    if google_key:
        return _google_places_search(location, google_key)

    return (
        f"Here are ways to find therapists near {location}:\n\n"
        "**India directories:**\n"
        "• https://www.practo.com — search by city\n"
        "• https://www.vandrevalafoundation.com\n"
        "• iCall: 9152987821\n"
        "• Vandrevala Foundation: 1860-2662-345 (24/7)\n\n"
        "**International:**\n"
        "• https://www.psychologytoday.com/us/therapists\n"
        "• US: 988\n\n"
        "Would you like help preparing questions for your first session?"
    )


def _google_places_search(location: str, api_key: str) -> str:
    try:
        import requests

        resp = requests.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            params={"query": f"mental health therapist {location}", "key": api_key},
            timeout=8,
        )
        places = resp.json().get("results", [])[:5]
        if not places:
            return f"No results for {location}. Try https://www.practo.com"
        lines = [f"Therapists near {location}:\n"]
        for p in places:
            rating = f" ⭐{p['rating']}" if p.get("rating") else ""
            lines.append(
                f"• {p.get('name','')}{rating} — {p.get('formatted_address','')}"
            )
        return "\n".join(lines)
    except Exception as exc:
        logger.error("Google Places failed: %s", exc)
        return f"Couldn't search {location}. Try https://www.practo.com"
