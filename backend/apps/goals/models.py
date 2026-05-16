"""
apps/goals/models.py
─────────────────────
User goals with milestones and progress tracking.
Goals feed into memory.py (injected into system prompt).
"""

from django.db import models
from django.conf import settings


class Goal(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        COMPLETED = "completed", "Completed"
        ABANDONED = "abandoned", "Abandoned"

    class Category(models.TextChoices):
        MENTAL_HEALTH = "mental_health", "Mental health"
        RELATIONSHIPS = "relationships", "Relationships"
        WORK = "work", "Work / career"
        PHYSICAL = "physical", "Physical health"
        HABITS = "habits", "Habits"
        PERSONAL = "personal", "Personal growth"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.PERSONAL
    )
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.ACTIVE
    )
    target_date = models.DateField(null=True, blank=True)

    # 0–100 progress, updated manually or via milestones
    progress_pct = models.PositiveSmallIntegerField(default=0)

    # AI-generated weekly check-in nudge (updated by background task)
    ai_nudge = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "goals"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "status"])]

    def __str__(self):
        return f"{self.user} – {self.title} ({self.status})"


class GoalMilestone(models.Model):
    """Optional sub-steps for a goal."""

    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=200)
    is_complete = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "goal_milestones"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.goal.title} → {self.title}"
