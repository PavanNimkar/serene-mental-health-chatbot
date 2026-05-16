"""apps/goals/services.py"""

import logging
from django.conf import settings

logger = logging.getLogger("apps.goals")


def generate_goal_nudge(goal) -> str:
    """
    Asks HuggingFace to write a single motivational sentence for this goal.
    Stored in goal.ai_nudge and shown on the goals page.
    """
    try:
        from huggingface_hub import InferenceClient

        prompt = (
            f'The user has set this personal goal: "{goal.title}".\n'
            f"Category: {goal.category}.\n"
            f"Description: {goal.description or 'Not provided'}.\n\n"
            "Write ONE short, warm, specific motivational sentence (max 25 words) "
            "encouraging them to take the first step. "
            "Do not start with 'I' or use generic phrases like 'You can do it'. "
            "Return only the sentence."
        )
        client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)
        completion = client.chat.completions.create(
            model=settings.HF_MODEL_ID,
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive life coach. Respond with a single sentence only.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=50,
            temperature=0.7,
        )
        return completion.choices[0].message.content.strip().split("\n")[0]
    except Exception as exc:
        logger.warning("generate_goal_nudge failed: %s", exc)
        return ""


def recalculate_progress(goal) -> None:
    """
    Recalculates goal.progress_pct from completed milestones.
    If no milestones, leaves progress unchanged (manual mode).
    """
    total = goal.milestones.count()
    if total == 0:
        return
    done = goal.milestones.filter(is_complete=True).count()
    goal.progress_pct = round((done / total) * 100)
    goal.save(update_fields=["progress_pct"])
