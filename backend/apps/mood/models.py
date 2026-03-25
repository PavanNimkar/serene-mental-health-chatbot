# ── models.py ──────────────────────────────────────────────────────────────────
from django.db import models
from django.conf import settings


class MoodEntry(models.Model):
    class MoodLabel(models.TextChoices):
        GOOD = 'good', '😊 Good'
        OKAY = 'okay', '😐 Okay'
        LOW = 'low', '😔 Low'
        ANXIOUS = 'anxious', '😣 Anxious'
        STRESSED = 'stressed', '😡 Stressed'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mood_entries',
    )
    mood_label = models.CharField(max_length=10, choices=MoodLabel.choices)
    mood_score = models.PositiveSmallIntegerField()  # 1-10
    note = models.TextField(blank=True)
    logged_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mood_entries'
        unique_together = [['user', 'logged_date']]  # one entry per day
        ordering = ['-logged_date']
        indexes = [models.Index(fields=['user', '-logged_date'])]

    def __str__(self):
        return f"{self.user} – {self.logged_date} – {self.mood_label}({self.mood_score})"
