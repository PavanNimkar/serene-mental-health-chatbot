from django.urls import path
from .views_and_urls import MoodEntryListCreateView, MoodEntryDetailView, MoodGraphView

urlpatterns = [
    path('entries/', MoodEntryListCreateView.as_view(), name='mood_list_create'),
    path('entries/<int:pk>/', MoodEntryDetailView.as_view(), name='mood_detail'),
    path('graph/', MoodGraphView.as_view(), name='mood_graph'),
]
