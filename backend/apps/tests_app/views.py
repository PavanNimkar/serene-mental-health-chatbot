from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .data import ALL_QUESTIONS, ANSWER_OPTIONS, SCORING_FUNCTIONS, MAX_SCORES
from .serializers import SubmitTestSerializer, TestResultSerializer
from .models import TestResult


class TestQuestionsView(APIView):
    """GET /api/v1/tests/questions/?type=PHQ-9"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        test_type = request.query_params.get("type", "PHQ-9")
        if test_type not in ALL_QUESTIONS:
            return Response({"error": "Invalid test type."}, status=400)
        return Response(
            {
                "test_type": test_type,
                "questions": ALL_QUESTIONS[test_type],
                "answer_options": ANSWER_OPTIONS,
            }
        )


class SubmitTestView(APIView):
    """POST /api/v1/tests/submit/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test_type = serializer.validated_data["test_type"]
        answers = serializer.validated_data["answers"]
        score = sum(answers)
        severity, interpretation = SCORING_FUNCTIONS[test_type](score)

        result = TestResult.objects.create(
            user=request.user,
            test_type=test_type,
            score=score,
            max_score=MAX_SCORES[test_type],
            severity=severity,
            interpretation=interpretation,
            answers=answers,
        )
        # Return total_score so frontend (Tests.jsx + Dashboard.jsx) can read it
        return Response(_serialize_result(result), status=status.HTTP_201_CREATED)


class TestResultListView(generics.ListAPIView):
    """GET /api/v1/tests/results/"""

    permission_classes = [IsAuthenticated]
    serializer_class = TestResultSerializer

    def get_queryset(self):
        qs = TestResult.objects.filter(user=self.request.user).order_by("-taken_at")
        test_type = self.request.query_params.get("type")
        if test_type:
            qs = qs.filter(test_type=test_type)
        return qs


class LatestTestResultsView(APIView):
    """GET /api/v1/tests/latest/ — returns latest of each test type."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = {}
        for t in TestResult.TestType:
            result = (
                TestResult.objects.filter(user=request.user, test_type=t)
                .order_by("-taken_at")  # fixed: was -created_at
                .first()
            )
            results[t.value] = _serialize_result(result) if result else None
        return Response(results)


def _serialize_result(r):
    """Consistent shape used by Tests.jsx and Dashboard.jsx — key is total_score."""
    if r is None:
        return None
    return {
        "total_score": r.score,  # frontend always reads .total_score
        "interpretation": r.interpretation,
        "severity": r.severity,
        "test_type": r.test_type,
        "taken_at": r.taken_at,
    }
