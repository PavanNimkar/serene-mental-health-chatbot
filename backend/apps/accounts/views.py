import logging
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer, UserProfileSerializer,
    OnboardingStep1Serializer, OnboardingStep2Serializer,
    OnboardingStep3Serializer, OnboardingStep4Serializer,
)
from .services import handle_safety_alert

logger = logging.getLogger('apps.accounts')
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/"""
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/auth/profile/"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


# ── Onboarding step endpoints ──────────────────────────────────────────────────

class _OnboardingStepView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None

    def patch(self, request):
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class OnboardingStep1View(_OnboardingStepView):
    """PATCH /api/v1/auth/onboarding/1/"""
    serializer_class = OnboardingStep1Serializer


class OnboardingStep2View(_OnboardingStepView):
    """PATCH /api/v1/auth/onboarding/2/"""
    serializer_class = OnboardingStep2Serializer


class OnboardingStep3View(_OnboardingStepView):
    """PATCH /api/v1/auth/onboarding/3/"""
    serializer_class = OnboardingStep3Serializer


class OnboardingStep4View(APIView):
    """PATCH /api/v1/auth/onboarding/4/ — includes safety check."""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = OnboardingStep4Serializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.safety_status == 'yes' and not user.safety_alert_sent:
            handle_safety_alert(user)
            user.safety_alert_sent = True
            user.save(update_fields=['safety_alert_sent'])
            logger.warning('Safety alert triggered for user %s', user.id)

        return Response({
            **serializer.data,
            'safety_alert': user.safety_status == 'yes',
            'message': "You're all set. I'm here whenever you need to talk.",
        })
