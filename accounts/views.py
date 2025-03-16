from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from email_service import send_email
from django.conf import settings
from .serializers import UserRegistrationSerializer, EmailVerificationSerializer
import logging

logger = logging.getLogger(__name__)

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

@method_decorator(ensure_csrf_cookie, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            verification = user.emailverification_set.first()
            
            # Send verification email
            try:
                logger.info(f"Attempting to send verification email to {user.email}")
                logger.debug(f"Email configuration: Backend={settings.EMAIL_BACKEND}, Host={settings.EMAIL_HOST}, Port={settings.EMAIL_PORT}, TLS={settings.EMAIL_USE_TLS}")
                logger.debug(f"From email: {settings.DEFAULT_FROM_EMAIL}, Host User: {settings.EMAIL_HOST_USER}")
                logger.debug(f"Verification code: {verification.code}")
                
                success = send_email(
                    to=user.email,
                    subject='Verify your email address',
                    html_content=f'<h1>Your verification code: {verification.code}</h1>'
                )
                if not success:
                    raise Exception('Failed to send verification email')
                logger.info(f"Successfully sent verification email to {user.email}")
            except Exception as e:
                logger.error(f"Failed to send verification email to {user.email}")
                logger.error(f"Error details: {str(e)}")
                logger.error(f"Error type: {type(e).__name__}")
                return Response({
                    'message': 'Failed to send verification email. Please try again later.',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'message': 'Registration successful. Please check your email for verification code.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        # Format validation errors
        if 'detail' in serializer.errors:
            error_response = serializer.errors
        else:
            error_response = {
                'detail': {
                    field: messages for field, messages in serializer.errors.items()
                }
            }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            verification = serializer.validated_data['verification']
            
            user.email_verified = True
            user.save()
            verification.delete()
            
            return Response({
                'message': 'Email verified successfully'
            }, status=status.HTTP_200_OK)
        # Format validation errors
        if 'detail' in serializer.errors:
            error_response = serializer.errors
        else:
            error_response = {
                'detail': {
                    field: messages for field, messages in serializer.errors.items()
                }
            }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)