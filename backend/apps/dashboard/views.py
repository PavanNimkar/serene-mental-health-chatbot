from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
import datetime


class DashboardView(APIView):
    """
    GET /api/v1/dashboard/
    Returns aggregated data for the dashboard page.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = datetime.date.today()
        week_ago = today - datetime.timedelta(days=7)

        from apps.chat.models import Conversation
        from apps.mood.models import MoodEntry
        from apps.tests_app.models import TestResult

        # ── Recent conversations ───────────────────────────────────────────────
        conversations = (
            Conversation.objects.filter(user=user, is_active=True)
            .prefetch_related("messages")
            .order_by("-updated_at")[:5]
        )

        conv_data = []
        for c in conversations:
            last = c.messages.order_by("created_at").last()
            conv_data.append(
                {
                    "id": c.id,
                    "title": c.title,
                    "updated_at": c.updated_at,
                    "created_at": c.created_at,
                    "last_message": last.content[:80] if last else "",
                }
            )

        # ── Mood ───────────────────────────────────────────────────────────────
        mood_entries = MoodEntry.objects.filter(user=user, logged_date__gte=week_ago)
        all_mood = MoodEntry.objects.filter(user=user)
        mood_avg = all_mood.aggregate(avg=Avg("mood_score"))["avg"]

        # ── Streak (consecutive days with a mood entry ending today) ──────────
        all_dates = set(all_mood.values_list("logged_date", flat=True))
        streak = 0
        check = today
        while check in all_dates:
            streak += 1
            check -= datetime.timedelta(days=1)

        # ── Total sessions ────────────────────────────────────────────────────
        total_conversations = Conversation.objects.filter(user=user).count()

        # ── Latest test results — shaped for Dashboard.jsx ────────────────────
        # Dashboard reads: latestTests["PHQ-9"].total_score / .interpretation
        # TestResult model stores: score / interpretation
        latest_tests = {}
        for t in TestResult.TestType:
            r = (
                TestResult.objects.filter(user=user, test_type=t)
                .order_by("-taken_at")
                .first()
            )
            if r:
                latest_tests[t.value] = {
                    "total_score": r.score,
                    "interpretation": r.interpretation,
                    "severity": r.severity,
                    "taken_at": r.taken_at,  # was r.created_at
                }
            else:
                latest_tests[t.value] = None

        return Response(
            {
                # Dashboard.jsx reads: data.stats.*
                "stats": {
                    "streak": streak,
                    "total_conversations": total_conversations,
                    "avg_mood": round(mood_avg, 1) if mood_avg else None,
                    "total_mood_entries": all_mood.count(),
                },
                # Dashboard.jsx reads: data.recent_conversations
                "recent_conversations": conv_data,
                # Dashboard.jsx reads: data.latest_tests["PHQ-9"] / ["GAD-7"]
                "latest_tests": latest_tests,
            }
        )
