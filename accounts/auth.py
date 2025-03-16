from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            errors = {'detail': {}}
            if not email:
                errors['detail'].setdefault('email', []).append('Email is required')
            if not password:
                errors['detail'].setdefault('password', []).append('Password is required')
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'user': {
                    'email': user.email,
                    'user_type': user.user_type,
                    'email_verified': user.email_verified
                }
            })
        else:
            return Response({
                'detail': {
                    'non_field_errors': ['Invalid credentials']
                }
            }, status=status.HTTP_401_UNAUTHORIZED)