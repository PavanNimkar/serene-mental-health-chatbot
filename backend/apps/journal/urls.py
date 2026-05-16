"""
apps/journal/urls.py
"""

from django.urls import path
from .views import (
    JournalEntryListCreateView,
    JournalEntryDetailView,
    JournalPromptListView,
    RandomPromptView,
    JournalStatsView,
)

urlpatterns = [
    path("entries/", JournalEntryListCreateView.as_view(), name="journal_list_create"),
    path("entries/<int:pk>/", JournalEntryDetailView.as_view(), name="journal_detail"),
    path("prompts/", JournalPromptListView.as_view(), name="journal_prompts"),
    path("prompts/random/", RandomPromptView.as_view(), name="journal_random_prompt"),
    path("stats/", JournalStatsView.as_view(), name="journal_stats"),
]
