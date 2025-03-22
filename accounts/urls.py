from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from .views import RegisterView, VerifyEmailView
from .auth import LoginView

class GetCSRFToken(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return JsonResponse({'success': 'CSRF cookie set'})

urlpatterns = [
    path('accounts/auth/register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/csrf/', GetCSRFToken.as_view(), name='csrf'),
]