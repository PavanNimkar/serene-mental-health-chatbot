from django.contrib.auth.models import AbstractUser
from django.db import models


class AgeRange(models.TextChoices):
    TEEN = '13-18', '13–18'
    YOUNG_ADULT = '18-25', '18–25'
    ADULT = '25-40', '25–40'
    MATURE = '40+', '40+'


class GenderChoice(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    NON_BINARY = 'non_binary', 'Non-binary'
    PREFER_NOT = 'prefer_not', 'Prefer not to say'


class ChatStyle(models.TextChoices):
    SUPPORTIVE = 'supportive', 'Supportive'
    ADVICE = 'advice', 'Advice-based'
    MOTIVATIONAL = 'motivational', 'Motivational'
    JUST_LISTEN = 'just_listen', 'Just listen'


class SafetyStatus(models.TextChoices):
    NO = 'no', 'No'
    SOMETIMES = 'sometimes', 'Sometimes'
    YES = 'yes', 'Yes'


class User(AbstractUser):
    """Extended user with onboarding profile fields."""

    # Step 1
    display_name = models.CharField(max_length=80, blank=True)
    agreed_not_medical = models.BooleanField(default=False)
    age_range = models.CharField(max_length=10, choices=AgeRange.choices, blank=True)
    gender = models.CharField(max_length=20, choices=GenderChoice.choices, blank=True)

    # Step 2
    initial_mood = models.CharField(max_length=20, blank=True)
    initial_mood_score = models.PositiveSmallIntegerField(null=True, blank=True)
    track_daily_mood = models.BooleanField(default=True)

    # Step 3 – stored as comma-separated concern keys
    primary_concerns = models.JSONField(default=list, blank=True)
    low_frequency = models.CharField(max_length=30, blank=True)
    anxious_frequency = models.CharField(max_length=30, blank=True)

    # Step 4
    chat_style = models.CharField(
        max_length=20, choices=ChatStyle.choices, default=ChatStyle.SUPPORTIVE
    )
    safety_status = models.CharField(
        max_length=15, choices=SafetyStatus.choices, default=SafetyStatus.NO
    )
    safety_alert_sent = models.BooleanField(default=False)

    onboarding_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        indexes = [models.Index(fields=['username']), models.Index(fields=['email'])]

    def __str__(self):
        return self.display_name or self.username
