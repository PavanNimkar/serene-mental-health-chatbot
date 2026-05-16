"""
apps/journal/models.py
──────────────────────
New app. Handles guided journal entries with optional AI-generated prompts,
mood linkage, and tags. These entries feed directly into RAG retrieval in memory.py.
"""

from django.db import models
from django.conf import settings


class JournalPrompt(models.Model):
    """
    Reusable guided prompts shown to the user before they write.
    Pre-seeded via a data migration (see migrations/0002_seed_prompts.py).
    """

    class Category(models.TextChoices):
        GRATITUDE = "gratitude", "Gratitude"
        REFLECTION = "reflection", "Reflection"
        ANXIETY = "anxiety", "Anxiety"
        GOALS = "goals", "Goals"
        SELF_CARE = "self_care", "Self-care"
        RELATIONSHIPS = "relationships", "Relationships"
        GENERAL = "general", "General"

    text = models.TextField()
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.GENERAL
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "journal_prompts"

    def __str__(self):
        return f"[{self.category}] {self.text[:60]}"


class JournalEntry(models.Model):
    """
    A single journal entry written by the user.
    - prompt: optional guided prompt they responded to
    - mood_entry: optional link to today's MoodEntry (same-day correlation)
    - tags: user-defined tags stored as JSON list e.g. ["anxiety", "work"]
    - ai_reflection: AI-generated 1-sentence reflection injected after save
    - embedding_updated: flag so background indexing knows what to re-embed
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="journal_entries",
    )
    prompt = models.ForeignKey(
        JournalPrompt,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="entries",
    )
    mood_entry = models.ForeignKey(
        "mood.MoodEntry",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="journal_entries",
    )

    title = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    tags = models.JSONField(default=list, blank=True)  # ["anxiety","work"]
    ai_reflection = models.TextField(blank=True)  # 1-sentence AI insight
    is_private = models.BooleanField(default=True)  # always True for now
    embedding_updated = models.BooleanField(default=False)  # set True after indexing

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "journal_entries"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "-created_at"])]

    def __str__(self):
        return f"{self.user} – {self.created_at.date()} – {self.title or self.content[:40]}"
