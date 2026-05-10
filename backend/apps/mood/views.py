from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import datetime


class MoodEntryListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/mood/entries/"""

    permission_classes = [IsAuthenticated]
    serializer_class = MoodEntrySerializer

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MoodEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/mood/entries/<id>/"""

    permission_classes = [IsAuthenticated]
    serializer_class = MoodEntrySerializer

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)


class MoodGraphView(APIView):
    """
    GET /api/v1/mood/graph/?days=30
    Returns mood data for chart rendering.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("days", 30))
        days = min(days, 365)
        since = datetime.date.today() - datetime.timedelta(days=days)
        entries = MoodEntry.objects.filter(
            user=request.user,
            logged_date__gte=since,
        ).order_by("logged_date")
        serializer = MoodGraphSerializer(entries, many=True)
        return Response(
            {
                "days": days,
                "data": serializer.data,
                "average_score": (
                    round(
                        sum(e["mood_score"] for e in serializer.data)
                        / len(serializer.data),
                        1,
                    )
                    if serializer.data
                    else None
                ),
            }
        )
