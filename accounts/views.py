from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserRegistrationSerializer, EmailVerificationSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            verification = user.emailverification_set.first()
            
            # Send verification email
            send_mail(
                'Verify your email address',
                f'Your verification code is: {verification.code}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            return Response({
                'message': 'Registration successful. Please check your email for verification code.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)