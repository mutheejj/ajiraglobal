from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from email_service import send_email
from django.conf import settings
from .serializers import UserRegistrationSerializer, EmailVerificationSerializer
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    http_method_names = ['post', 'options']
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            verification = user.emailverification_set.first()
            
            # Send verification email
            try:
                logger.info(f"Attempting to send verification email to {user.email}")
                success, error = send_email(
                    to=user.email,
                    subject='Verify your email address',
                    html_content=f'<h1>Your verification code: {verification.code}</h1>'
                )
                if not success:
                    logger.error(f"Failed to send verification email to {user.email}: {error}")
                    # Delete the user if email verification fails
                    user.delete()
                    return Response({
                        'message': 'Failed to send verification email. Please try again later.',
                        'error': error
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                logger.info(f"Successfully sent verification email to {user.email}")
                return Response({
                    'message': 'Registration successful. Please check your email for verification code.',
                    'email': user.email
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Unexpected error during registration for {user.email}: {str(e)}")
                if user.id:
                    user.delete()
                return Response({
                    'message': 'An unexpected error occurred. Please try again later.',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Format validation errors
        error_response = {
            'detail': {
                field: messages if isinstance(messages, list) else [str(messages)]
                for field, messages in serializer.errors.items()
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
        error_response = {
            'detail': {
                field: messages if isinstance(messages, list) else [str(messages)]
                for field, messages in serializer.errors.items()
            }
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)