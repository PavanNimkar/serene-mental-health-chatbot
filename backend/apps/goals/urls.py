"""apps/goals/urls.py"""

from django.urls import path
from .views import (
    GoalListCreateView,
    GoalDetailView,
    MilestoneCreateView,
    MilestoneCompleteView,
)

urlpatterns = [
    path("", GoalListCreateView.as_view(), name="goal_list_create"),
    path("<int:pk>/", GoalDetailView.as_view(), name="goal_detail"),
    path(
        "<int:goal_id>/milestones/",
        MilestoneCreateView.as_view(),
        name="milestone_create",
    ),
    path(
        "<int:goal_id>/milestones/<int:mid>/complete/",
        MilestoneCompleteView.as_view(),
        name="milestone_complete",
    ),
]
