"""
Service layer for MedGemma (google/medgemma-4b-it) via HuggingFace Transformers.

Setup:
    pip install transformers torch accelerate sentencepiece

Download model (one-time, requires HF token for gated model):
    from huggingface_hub import login
    login(token="hf_...")

    from transformers import AutoTokenizer, AutoModelForCausalLM
    # Downloads to ~/.cache/huggingface/
"""
import logging
import threading
from django.conf import settings

logger = logging.getLogger('apps.chat')

_model = None
_tokenizer = None
_lock = threading.Lock()


SYSTEM_PROMPT = """You are Serene, a compassionate AI mental health companion.
You provide empathetic, evidence-based emotional support using CBT principles,
mindfulness techniques, and active listening. You are NOT a licensed therapist
or medical professional, and you make this clear when appropriate.

Guidelines:
- Always validate feelings before offering advice
- Use the user's preferred name when known
- If the user expresses self-harm ideation, immediately provide crisis resources:
  National Crisis Hotline: 988 (US) | iCall: 9152987821 (India)
- Never diagnose medical conditions
- Keep responses warm, concise, and actionable
- Adapt tone based on user's preferred style: {chat_style}
"""


def _load_model():
    """Lazy-load MedGemma model (thread-safe)."""
    global _model, _tokenizer
    if _model is not None:
        return _model, _tokenizer

    with _lock:
        if _model is not None:
            return _model, _tokenizer

        try:
            from transformers import AutoTokenizer, AutoModelForCausalLM
            import torch

            model_id = settings.MEDGEMMA_MODEL_ID
            hf_token = settings.HUGGINGFACE_TOKEN or None

            logger.info("Loading MedGemma model: %s", model_id)

            _tokenizer = AutoTokenizer.from_pretrained(
                model_id, token=hf_token
            )
            _model = AutoModelForCausalLM.from_pretrained(
                model_id,
                token=hf_token,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map='auto',
            )
            _model.eval()
            logger.info("MedGemma loaded successfully.")
        except Exception as exc:
            logger.error("Failed to load MedGemma: %s", exc)
            raise

    return _model, _tokenizer


def generate_response(
    conversation_history: list[dict],
    user_profile: dict,
) -> str:
    """
    Generate a response from MedGemma.

    Args:
        conversation_history: List of {"role": "user"|"assistant", "content": str}
        user_profile: Dict with keys like display_name, chat_style, etc.

    Returns:
        Generated text string.
    """
    try:
        model, tokenizer = _load_model()
        import torch

        system = SYSTEM_PROMPT.format(
            chat_style=user_profile.get('chat_style', 'supportive')
        )

        # Build chat template messages
        messages = [{"role": "system", "content": system}]
        messages.extend(conversation_history)

        # Use tokenizer chat template if available (MedGemma-it supports it)
        if hasattr(tokenizer, 'apply_chat_template'):
            input_ids = tokenizer.apply_chat_template(
                messages,
                add_generation_prompt=True,
                return_tensors='pt',
            )
        else:
            # Fallback: simple concatenation
            prompt = f"{system}\n\n"
            for msg in conversation_history:
                role = "User" if msg['role'] == 'user' else "Serene"
                prompt += f"{role}: {msg['content']}\n"
            prompt += "Serene:"
            input_ids = tokenizer(prompt, return_tensors='pt').input_ids

        device = next(model.parameters()).device
        input_ids = input_ids.to(device)

        with torch.no_grad():
            outputs = model.generate(
                input_ids,
                max_new_tokens=settings.MEDGEMMA_MAX_NEW_TOKENS,
                temperature=settings.MEDGEMMA_TEMPERATURE,
                do_sample=True,
                top_p=0.9,
                repetition_penalty=1.1,
                pad_token_id=tokenizer.eos_token_id,
            )

        # Decode only newly generated tokens
        new_tokens = outputs[0][input_ids.shape[-1]:]
        response = tokenizer.decode(new_tokens, skip_special_tokens=True).strip()
        return response

    except Exception as exc:
        logger.error("MedGemma generation error: %s", exc)
        return (
            "I'm having a moment of difficulty. Please try again, "
            "or if you're in crisis, call 988 (US) or 9152987821 (India)."
        )
