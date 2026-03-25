from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (
    RegisterView, ProfileView,
    OnboardingStep1View, OnboardingStep2View,
    OnboardingStep3View, OnboardingStep4View,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('onboarding/1/', OnboardingStep1View.as_view(), name='onboarding_1'),
    path('onboarding/2/', OnboardingStep2View.as_view(), name='onboarding_2'),
    path('onboarding/3/', OnboardingStep3View.as_view(), name='onboarding_3'),
    path('onboarding/4/', OnboardingStep4View.as_view(), name='onboarding_4'),
]
