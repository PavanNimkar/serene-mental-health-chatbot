from django.urls import path
from .views import ConversationListView, ConversationDetailView, SendMessageView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation_list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation_detail'),
    path('send/', SendMessageView.as_view(), name='send_message'),
]
