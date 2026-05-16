"""
apps/journal/serializers.py
"""

from rest_framework import serializers
from .models import JournalEntry, JournalPrompt


class JournalPromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalPrompt
        fields = ["id", "text", "category"]


class JournalEntrySerializer(serializers.ModelSerializer):
    prompt_text = serializers.CharField(source="prompt.text", read_only=True)
    mood_score = serializers.IntegerField(
        source="mood_entry.mood_score", read_only=True
    )

    class Meta:
        model = JournalEntry
        fields = [
            "id",
            "title",
            "content",
            "tags",
            "prompt",
            "prompt_text",
            "mood_entry",
            "mood_score",
            "ai_reflection",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "ai_reflection", "created_at", "updated_at"]

    def validate_content(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Entry must be at least 10 characters.")
        return value


class JournalEntryListSerializer(serializers.ModelSerializer):
    """Lightweight — list view only."""

    prompt_text = serializers.CharField(source="prompt.text", read_only=True)

    class Meta:
        model = JournalEntry
        fields = [
            "id",
            "title",
            "content",
            "tags",
            "prompt_text",
            "ai_reflection",
            "created_at",
        ]
