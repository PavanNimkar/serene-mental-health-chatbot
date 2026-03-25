from rest_framework import serializers
from .models import MoodEntry
import datetime


class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ["id", "mood_label", "mood_score", "note", "logged_date", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_mood_score(self, value):
        if not (1 <= value <= 10):
            raise serializers.ValidationError("Mood score must be 1–10.")
        return value

    def validate_logged_date(self, value):
        if value > datetime.date.today():
            raise serializers.ValidationError("Cannot log mood for a future date.")
        return value


class MoodGraphSerializer(serializers.ModelSerializer):
    """Lightweight for graph endpoint."""

    class Meta:
        model = MoodEntry
        fields = ["logged_date", "mood_score", "mood_label"]
