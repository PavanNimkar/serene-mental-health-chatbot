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
from .ai_engine import generate_response

logger = logging.getLogger("apps.chat")


class ConversationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        return (
            Conversation.objects.filter(user=self.request.user, is_active=True)
            .prefetch_related("messages")
            .order_by("-updated_at")
        )


class ConversationDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


class ConversationUpdateView(APIView):
    """PATCH /api/v1/chat/conversations/<id>/rename/  — rename
    DELETE /api/v1/chat/conversations/<id>/        — soft delete (is_active=False)
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk, user=request.user)
        title = request.data.get("title", "").strip()
        if not title:
            return Response({"error": "Title cannot be empty."}, status=400)
        conversation.title = title
        conversation.save(update_fields=["title"])
        return Response({"id": conversation.id, "title": conversation.title})

    def delete(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk, user=request.user)
        conversation.is_active = False
        conversation.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        content = serializer.validated_data["content"]
        conv_id = serializer.validated_data.get("conversation_id")

        if conv_id:
            conversation = get_object_or_404(Conversation, id=conv_id, user=user)
        else:
            title = content[:60] + ("…" if len(content) > 60 else "")
            conversation = Conversation.objects.create(user=user, title=title)

        Message.objects.create(
            conversation=conversation,
            role=Message.Role.USER,
            content=content,
        )

        history = list(
            conversation.messages.order_by("created_at").values("role", "content")
        )[-20:]

        user_profile = {
            "display_name": user.display_name or user.username,
            "chat_style": user.chat_style,
        }

        ai_text = generate_response(history, user_profile, user=user)

        ai_msg = Message.objects.create(
            conversation=conversation,
            role=Message.Role.ASSISTANT,
            content=ai_text,
        )

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
