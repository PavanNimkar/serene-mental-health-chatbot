from django.db import models
from django.conf import settings


class TestResult(models.Model):
    class TestType(models.TextChoices):
        PHQ9 = "PHQ-9", "PHQ-9 (Depression)"
        GAD7 = "GAD-7", "GAD-7 (Anxiety)"
        PSS = "PSS", "PSS (Stress)"

    class Severity(models.TextChoices):
        MINIMAL = "minimal", "Minimal"
        MILD = "mild", "Mild"
        MODERATE = "moderate", "Moderate"
        SEVERE = "severe", "Severe"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="test_results",
    )
    test_type = models.CharField(max_length=10, choices=TestType.choices)
    score = models.PositiveSmallIntegerField()
    max_score = models.PositiveSmallIntegerField()
    severity = models.CharField(max_length=10, choices=Severity.choices)
    interpretation = models.TextField()
    answers = models.JSONField(default=list)  # store raw answers
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "test_results"
        ordering = ["-taken_at"]
        indexes = [models.Index(fields=["user", "test_type", "-taken_at"])]

    def __str__(self):
        return f"{self.user} – {self.test_type} – {self.score}/{self.max_score}"
