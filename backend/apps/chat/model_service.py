import logging
from huggingface_hub import InferenceClient
from django.conf import settings

logger = logging.getLogger("apps.chat")

SYSTEM_PROMPT = """You are Serene, a compassionate AI mental health companion.
You provide empathetic, evidence-based emotional support using CBT principles,
mindfulness techniques, and active listening.

You are NOT a licensed therapist or medical professional.

Guidelines:
- Always validate feelings before offering advice
- Use the user's preferred name when known
- If the user expresses self-harm ideation, provide crisis resources:
  National Crisis Hotline: 988 (US)
  iCall India: 9152987821
- Never diagnose medical conditions
- Keep responses warm, concise, and actionable
- Adapt tone based on user's preferred style: {chat_style}
"""


def generate_response(
    conversation_history: list[dict],
    user_profile: dict,
) -> str:
    """
    .env:
        HF_MODEL_ID=meta-llama/Llama-3.1-8B-Instruct:novita
        HUGGINGFACE_TOKEN=hf_xxxxx

    Provider is embedded in the model ID with :provider suffix.
    Change just HF_MODEL_ID in .env to swap models — no code changes needed.
    Other working options:
        deepseek-ai/DeepSeek-V4-Flash:novita
        Qwen/Qwen3-8B:novita
        meta-llama/Llama-3.1-8B-Instruct:novita
    """
    try:
        system = SYSTEM_PROMPT.format(
            chat_style=user_profile.get("chat_style", "supportive")
        )

        messages = [{"role": "system", "content": system}]
        for msg in conversation_history:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Token passed directly — provider is in the model ID string
        client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)

        completion = client.chat.completions.create(
            model=settings.HF_MODEL_ID,  # e.g. "meta-llama/Llama-3.1-8B-Instruct:novita"
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )

        generated_text = completion.choices[0].message.content.strip()

        if generated_text:
            logger.info("HF response ok | model=%s", settings.HF_MODEL_ID)
            return generated_text

        return "I'm here with you. Could you tell me a little more about what you're feeling?"

    except Exception as exc:
        logger.error("HF API generation error: %s", exc)
        return (
            "I'm having a moment of difficulty. Please try again later.\n\n"
            "If you're in crisis:\nUS: 988\nIndia: 9152987821"
        )
