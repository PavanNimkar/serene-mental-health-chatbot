"""apps/journal/admin.py"""

from django.contrib import admin
from .models import JournalEntry, JournalPrompt


@admin.register(JournalPrompt)
class JournalPromptAdmin(admin.ModelAdmin):
    list_display = ["category", "text", "is_active"]
    list_filter = ["category", "is_active"]


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at", "title", "tags"]
    list_filter = ["user"]
    search_fields = ["content", "title"]
    readonly_fields = ["ai_reflection", "embedding_updated", "created_at", "updated_at"]
