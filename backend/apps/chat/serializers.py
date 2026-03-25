# ── serializers.py ─────────────────────────────────────────────────────────────
from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'tokens_used', 'created_at']
        read_only_fields = ['id', 'role', 'tokens_used', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'created_at', 'updated_at', 'messages', 'last_message']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        return MessageSerializer(msg).data if msg else None


class ConversationListSerializer(serializers.ModelSerializer):
    """Lightweight – no messages – for list view."""
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'updated_at', 'last_message']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        return {'content': msg.content[:80], 'role': msg.role} if msg else None


class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=4000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
