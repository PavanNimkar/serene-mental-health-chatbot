from rest_framework import serializers
from .models import *


class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = [
            "id",
            "test_type",
            "score",
            "max_score",
            "severity",
            "interpretation",
            "answers",
            "taken_at",
        ]
        read_only_fields = ["id", "max_score", "severity", "interpretation", "taken_at"]


class SubmitTestSerializer(serializers.Serializer):
    test_type = serializers.ChoiceField(choices=TestResult.TestType.choices)
    answers = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=3),
        min_length=7,
        max_length=9,
    )
