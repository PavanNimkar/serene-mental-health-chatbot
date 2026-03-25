from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'display_name',
            'agreed_not_medical', 'age_range', 'gender',
            'initial_mood', 'initial_mood_score', 'track_daily_mood',
            'primary_concerns', 'low_frequency', 'anxious_frequency',
            'chat_style', 'safety_status', 'onboarding_complete',
            'created_at',
        ]
        read_only_fields = ['id', 'username', 'email', 'created_at', 'safety_alert_sent']


class OnboardingStep1Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'agreed_not_medical', 'age_range', 'gender']

    def validate_agreed_not_medical(self, value):
        if not value:
            raise serializers.ValidationError(
                "You must acknowledge this is not a medical service to continue."
            )
        return value


class OnboardingStep2Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['initial_mood', 'initial_mood_score', 'track_daily_mood']

    def validate_initial_mood_score(self, value):
        if value is not None and not (1 <= value <= 10):
            raise serializers.ValidationError("Mood score must be between 1 and 10.")
        return value


class OnboardingStep3Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['primary_concerns', 'low_frequency', 'anxious_frequency']


class OnboardingStep4Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['chat_style', 'safety_status']

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.onboarding_complete = True
        instance.save(update_fields=['onboarding_complete', 'safety_status', 'chat_style'])
        return instance
