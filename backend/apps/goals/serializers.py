"""apps/goals/serializers.py"""

from rest_framework import serializers
from django.utils import timezone
from .models import Goal, GoalMilestone


class GoalMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalMilestone
        fields = ["id", "title", "is_complete", "completed_at", "created_at"]
        read_only_fields = ["id", "completed_at", "created_at"]


class GoalSerializer(serializers.ModelSerializer):
    milestones = GoalMilestoneSerializer(many=True, read_only=True)
    milestones_total = serializers.SerializerMethodField()
    milestones_done = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "title",
            "description",
            "category",
            "status",
            "target_date",
            "progress_pct",
            "ai_nudge",
            "milestones",
            "milestones_total",
            "milestones_done",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "ai_nudge", "created_at", "updated_at"]

    def get_milestones_total(self, obj):
        return obj.milestones.count()

    def get_milestones_done(self, obj):
        return obj.milestones.filter(is_complete=True).count()


class GoalListSerializer(serializers.ModelSerializer):
    milestones_done = serializers.SerializerMethodField()
    milestones_total = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "title",
            "category",
            "status",
            "progress_pct",
            "target_date",
            "milestones_done",
            "milestones_total",
            "ai_nudge",
        ]

    def get_milestones_total(self, obj):
        return obj.milestones.count()

    def get_milestones_done(self, obj):
        return obj.milestones.filter(is_complete=True).count()
