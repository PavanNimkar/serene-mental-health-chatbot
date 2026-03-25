from django.urls import path
from .all_in_one import (
    TestQuestionsView, SubmitTestView,
    TestResultListView, LatestTestResultsView,
)

urlpatterns = [
    path('questions/', TestQuestionsView.as_view(), name='test_questions'),
    path('submit/', SubmitTestView.as_view(), name='submit_test'),
    path('results/', TestResultListView.as_view(), name='test_results'),
    path('latest/', LatestTestResultsView.as_view(), name='latest_results'),
]
