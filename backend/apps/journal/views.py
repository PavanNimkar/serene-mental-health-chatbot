"""
apps/journal/views.py
──────────────────────
Endpoints:
  GET  /api/v1/journal/entries/          list + filter by tag/date
  POST /api/v1/journal/entries/          create (triggers AI reflection)
  GET  /api/v1/journal/entries/<id>/     detail
  PATCH/PUT /api/v1/journal/entries/<id>/ update
  DELETE    /api/v1/journal/entries/<id>/ delete

  GET  /api/v1/journal/prompts/          list prompts (optional ?category=anxiety)
  GET  /api/v1/journal/prompts/random/   get one random prompt for today
  GET  /api/v1/journal/stats/            entry count, streak, tag frequency
"""

import logging
import random
from datetime import date, timedelta

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import JournalEntry, JournalPrompt
from .serializers import (
    JournalEntrySerializer,
    JournalEntryListSerializer,
    JournalPromptSerializer,
)
from .services import generate_ai_reflection, index_entry_for_rag

logger = logging.getLogger("apps.journal")


class JournalEntryListCreateView(generics.ListCreateAPIView):
    """GET /api/v1/journal/entries/   POST /api/v1/journal/entries/"""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return JournalEntryListSerializer
        return JournalEntrySerializer

    def get_queryset(self):
        qs = JournalEntry.objects.filter(user=self.request.user)
        tag = self.request.query_params.get("tag")
        since = self.request.query_params.get("since")  # YYYY-MM-DD
        until = self.request.query_params.get("until")
        search = self.request.query_params.get("q")

        if tag:
            # JSONField contains lookup
            qs = qs.filter(tags__contains=tag)
        if since:
            qs = qs.filter(created_at__date__gte=since)
        if until:
            qs = qs.filter(created_at__date__lte=until)
        if search:
            qs = qs.filter(content__icontains=search)
        return qs

    def perform_create(self, serializer):
        entry = serializer.save(user=self.request.user)

        # Generate AI reflection asynchronously (non-blocking best-effort)
        try:
            reflection = generate_ai_reflection(entry)
            if reflection:
                entry.ai_reflection = reflection
                entry.save(update_fields=["ai_reflection"])
        except Exception as exc:
            logger.warning("AI reflection failed for entry %s: %s", entry.id, exc)

        # Index into FAISS/vector store for RAG
        try:
            index_entry_for_rag(entry)
        except Exception as exc:
            logger.warning("RAG index failed for entry %s: %s", entry.id, exc)


class JournalEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/journal/entries/<id>/"""

    permission_classes = [IsAuthenticated]
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        entry = serializer.save()
        # Re-index when content changes
        try:
            index_entry_for_rag(entry)
        except Exception as exc:
            logger.warning("RAG re-index failed for entry %s: %s", entry.id, exc)


class JournalPromptListView(generics.ListAPIView):
    """GET /api/v1/journal/prompts/?category=anxiety"""

    permission_classes = [IsAuthenticated]
    serializer_class = JournalPromptSerializer

    def get_queryset(self):
        qs = JournalPrompt.objects.filter(is_active=True)
        cat = self.request.query_params.get("category")
        if cat:
            qs = qs.filter(category=cat)
        return qs


class RandomPromptView(APIView):
    """GET /api/v1/journal/prompts/random/"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Prefer a prompt category matching the user's primary concerns
        user = request.user
        concerns = user.primary_concerns or []
        category_map = {
            "anxiety": "anxiety",
            "depression": "reflection",
            "stress": "self_care",
            "relationships": "relationships",
            "goals": "goals",
        }
        preferred_categories = [category_map[c] for c in concerns if c in category_map]

        prompt = None
        if preferred_categories:
            prompt = (
                JournalPrompt.objects.filter(
                    is_active=True, category__in=preferred_categories
                )
                .order_by("?")
                .first()
            )

        if not prompt:
            prompt = JournalPrompt.objects.filter(is_active=True).order_by("?").first()

        if not prompt:
            return Response({"prompt": None, "message": "No prompts available."})

        return Response(JournalPromptSerializer(prompt).data)


class JournalStatsView(APIView):
    """GET /api/v1/journal/stats/"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        entries = JournalEntry.objects.filter(user=user)
        today = date.today()

        # Writing streak (consecutive days with an entry)
        all_dates = set(entries.values_list("created_at__date", flat=True))
        streak = 0
        check = today
        while check in all_dates:
            streak += 1
            check -= timedelta(days=1)

        # Tag frequency
        tag_freq: dict[str, int] = {}
        for tags in entries.values_list("tags", flat=True):
            for t in tags or []:
                tag_freq[t] = tag_freq.get(t, 0) + 1
        top_tags = sorted(tag_freq.items(), key=lambda x: x[1], reverse=True)[:10]

        # Entries this week
        week_count = entries.filter(
            created_at__date__gte=today - timedelta(days=7)
        ).count()

        return Response(
            {
                "total_entries": entries.count(),
                "streak_days": streak,
                "entries_this_week": week_count,
                "top_tags": [{"tag": t, "count": c} for t, c in top_tags],
            }
        )
