import logging
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    ConversationListSerializer,
    SendMessageSerializer,
)
from .model_service import generate_response

logger = logging.getLogger("apps.chat")


class ConversationListView(generics.ListAPIView):
    """GET /api/v1/chat/conversations/"""

    permission_classes = [IsAuthenticated]
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        return (
            Conversation.objects.filter(user=self.request.user, is_active=True)
            .prefetch_related("messages")
            .order_by("-updated_at")
        )


class ConversationDetailView(generics.RetrieveDestroyAPIView):
    """GET/DELETE /api/v1/chat/conversations/<id>/"""

    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


class SendMessageView(APIView):
    """
    POST /api/v1/chat/send/
    Body: { "content": "...", "conversation_id": null | <int> }
    Creates conversation if conversation_id is null.
    Calls MedGemma and returns assistant reply.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        content = serializer.validated_data["content"]
        conv_id = serializer.validated_data.get("conversation_id")

        # Get or create conversation
        if conv_id:
            conversation = get_object_or_404(Conversation, id=conv_id, user=user)
        else:
            title = content[:60] + ("…" if len(content) > 60 else "")
            conversation = Conversation.objects.create(user=user, title=title)

        # Persist user message
        Message.objects.create(
            conversation=conversation,
            role=Message.Role.USER,
            content=content,
        )

        # Build history for LLM (last 20 messages for context window)
        history = list(
            conversation.messages.order_by("created_at").values("role", "content")
        )[-20:]

        user_profile = {
            "display_name": user.display_name or user.username,
            "chat_style": user.chat_style,
        }

        # Generate AI response
        ai_text = generate_response(history, user_profile)

        # Persist assistant message
        ai_msg = Message.objects.create(
            conversation=conversation,
            role=Message.Role.ASSISTANT,
            content=ai_text,
        )

        # Update conversation timestamp
        conversation.save(update_fields=["updated_at"])

        return Response(
            {
                "conversation_id": conversation.id,
                "message": {
                    "id": ai_msg.id,
                    "role": ai_msg.role,
                    "content": ai_msg.content,
                    "created_at": ai_msg.created_at,
                },
            },
            status=status.HTTP_200_OK,
        )
