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

        # ── Imports (lazy to avoid circular imports) ───────────────────────────
        from apps.chat.models import Conversation, Message
        from apps.mood.models import MoodEntry
        from apps.tests_app.models import TestResult
        from apps.tests_app.serializers import TestResultSerializer

        # Recent conversations (5)
        conversations = (
            Conversation.objects.filter(user=user, is_active=True)
            .prefetch_related("messages")
            .order_by("-updated_at")[:5]
        )

        conv_data = []
        for c in conversations:
            last = c.messages.last()
            conv_data.append(
                {
                    "id": c.id,
                    "title": c.title,
                    "updated_at": c.updated_at,
                    "last_message": last.content[:80] if last else "",
                }
            )

        # Weekly mood summary
        mood_entries = MoodEntry.objects.filter(user=user, logged_date__gte=week_ago)
        mood_avg = mood_entries.aggregate(avg=Avg("mood_score"))["avg"]

        # Latest test results
        latest_tests = {}
        for t in TestResult.TestType:
            r = TestResult.objects.filter(user=user, test_type=t).first()
            latest_tests[t.value] = TestResultSerializer(r).data if r else None

        # Weekly stats
        weekly_sessions = Conversation.objects.filter(
            user=user, created_at__date__gte=week_ago
        ).count()

        # Streak calculation (consecutive days with mood entries)
        all_dates = set(
            MoodEntry.objects.filter(user=user).values_list("logged_date", flat=True)
        )
        streak = 0
        check = today
        while check in all_dates:
            streak += 1
            check -= datetime.timedelta(days=1)

        return Response(
            {
                "user": {
                    "display_name": user.display_name or user.username,
                    "chat_style": user.chat_style,
                    "track_daily_mood": user.track_daily_mood,
                    "streak_days": streak,
                },
                "weekly_stats": {
                    "sessions": weekly_sessions,
                    "mood_entries": mood_entries.count(),
                    "avg_mood_score": round(mood_avg, 1) if mood_avg else None,
                },
                "recent_conversations": conv_data,
                "latest_tests": latest_tests,
                "recent_moods": list(
                    MoodEntry.objects.filter(user=user)
                    .order_by("-logged_date")[:7]
                    .values("logged_date", "mood_score", "mood_label")
                ),
            }
        )


# ── urls.py ────────────────────────────────────────────────────────────────────
from django.urls import path

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
]
