from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from rest_framework.routers import DefaultRouter
from .views import RegisterView, VerifyEmailView
from .auth import LoginView
from .job_views import JobPostViewSet
from .job_seeker_views import JobSeekerProfileViewSet
from .saved_jobs_views import SavedJobViewSet
from .client_views import ClientProfileViewSet

router = DefaultRouter()
router.register(r'jobs', JobPostViewSet, basename='jobs')
router.register(r'profile/job-seeker', JobSeekerProfileViewSet, basename='job-seeker-profile')
router.register(r'profile/client', ClientProfileViewSet, basename='client-profile')
router.register(r'jobs/saved', SavedJobViewSet, basename='saved-jobs')

class GetCSRFToken(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return JsonResponse({'success': 'CSRF cookie set'})

urlpatterns = [
    path('accounts/auth/register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/csrf/', GetCSRFToken.as_view(), name='csrf'),
    path('', include(router.urls)),
]