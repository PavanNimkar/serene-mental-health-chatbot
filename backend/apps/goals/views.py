"""
apps/goals/views.py
────────────────────
GET  /api/v1/goals/                     list active + paused goals
POST /api/v1/goals/                     create goal
GET/PATCH/DELETE /api/v1/goals/<id>/    goal detail
POST /api/v1/goals/<id>/milestones/     add milestone
PATCH /api/v1/goals/<id>/milestones/<mid>/complete/  mark milestone done
"""

import logging
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Goal, GoalMilestone
from .serializers import GoalSerializer, GoalListSerializer, GoalMilestoneSerializer
from .services import generate_goal_nudge, recalculate_progress

logger = logging.getLogger("apps.goals")


class GoalListCreateView(generics.ListCreateAPIView):
    """GET /api/v1/goals/   POST /api/v1/goals/"""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return GoalListSerializer if self.request.method == "GET" else GoalSerializer

    def get_queryset(self):
        qs = Goal.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get("status")
        cat = self.request.query_params.get("category")
        if status_param:
            qs = qs.filter(status=status_param)
        if cat:
            qs = qs.filter(category=cat)
        return qs

    def perform_create(self, serializer):
        goal = serializer.save(user=self.request.user)
        # Generate an initial AI nudge
        try:
            nudge = generate_goal_nudge(goal)
            if nudge:
                goal.ai_nudge = nudge
                goal.save(update_fields=["ai_nudge"])
        except Exception as exc:
            logger.warning("Goal nudge generation failed: %s", exc)


class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/goals/<id>/"""

    permission_classes = [IsAuthenticated]
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)


class MilestoneCreateView(APIView):
    """POST /api/v1/goals/<goal_id>/milestones/"""

    permission_classes = [IsAuthenticated]

    def post(self, request, goal_id):
        goal = get_object_or_404(Goal, id=goal_id, user=request.user)
        serializer = GoalMilestoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        milestone = serializer.save(goal=goal)
        recalculate_progress(goal)
        return Response(
            GoalMilestoneSerializer(milestone).data, status=status.HTTP_201_CREATED
        )


class MilestoneCompleteView(APIView):
    """PATCH /api/v1/goals/<goal_id>/milestones/<mid>/complete/"""

    permission_classes = [IsAuthenticated]

    def patch(self, request, goal_id, mid):
        goal = get_object_or_404(Goal, id=goal_id, user=request.user)
        milestone = get_object_or_404(GoalMilestone, id=mid, goal=goal)
        milestone.is_complete = True
        milestone.completed_at = timezone.now()
        milestone.save(update_fields=["is_complete", "completed_at"])
        recalculate_progress(goal)
        return Response(GoalMilestoneSerializer(milestone).data)
