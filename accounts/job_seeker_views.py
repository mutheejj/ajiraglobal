from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import UserRegistrationSerializer, JobSeekerPublicSerializer, JobSeekerProfileUpdateSerializer

class JobSeekerProfileViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return JobSeekerPublicSerializer
        elif self.action == 'profile' and self.request.method in ['PATCH', 'PUT']:
            return JobSeekerProfileUpdateSerializer
        return UserRegistrationSerializer
    
    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return User.objects.filter(user_type='job-seeker')
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        print(f"Profile request method: {request.method}")
        print(f"Profile request data: {request.data}")
        print(f"Profile request FILES: {request.FILES}")
        
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        # Handle file uploads in multipart/form-data requests
        if 'profile_picture' in request.FILES:
            try:
                print(f"Processing profile picture: {request.FILES['profile_picture']}")
                request.user.profile_picture = request.FILES['profile_picture']
                # Save immediately to avoid errors when serializer tries to access URL
                request.user.save()
                print("Profile picture saved successfully")
            except Exception as e:
                print(f"Error saving profile picture: {str(e)}")
                return Response(
                    {'profile_picture': [f'Error uploading profile picture: {str(e)}']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Use the appropriate serializer based on HTTP method
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            print(f"Serializer is valid. Validated data: {serializer.validated_data}")
            serializer.save()
            return Response(serializer.data)
        else:
            print(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def resume(self, request):
        print(f"Resume upload request received: {request.FILES}")
        if 'resume' not in request.FILES:
            return Response(
                {'detail': 'No resume file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        resume_file = request.FILES['resume']
        print(f"Resume file: {resume_file.name}, size: {resume_file.size}")
        if resume_file.size > 5 * 1024 * 1024:  # 5MB limit
            return Response(
                {'detail': 'Resume file size must be less than 5MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Delete old file if exists
            if request.user.resume:
                request.user.resume.delete(save=False)
                
            request.user.resume = resume_file
            request.user.save()
            
            print(f"Resume saved successfully for user {request.user.email}")
            return Response({
                'resume': request.user.resume.url if request.user.resume else None
            })
        except Exception as e:
            print(f"Error saving resume: {str(e)}")
            return Response(
                {'detail': f'Error saving resume: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False, methods=['post'])
    def portfolio(self, request):
        print(f"Portfolio upload request received: {request.FILES}")
        if 'portfolio' not in request.FILES:
            return Response(
                {'detail': 'No portfolio file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        portfolio_file = request.FILES['portfolio']
        print(f"Portfolio file: {portfolio_file.name}, size: {portfolio_file.size}")
        if portfolio_file.size > 10 * 1024 * 1024:  # 10MB limit
            return Response(
                {'detail': 'Portfolio file size must be less than 10MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Delete old file if exists
            if request.user.portfolio:
                request.user.portfolio.delete(save=False)
                
            request.user.portfolio = portfolio_file
            request.user.save()
            
            print(f"Portfolio saved successfully for user {request.user.email}")
            return Response({
                'portfolio': request.user.portfolio.url if request.user.portfolio else None
            })
        except Exception as e:
            print(f"Error saving portfolio: {str(e)}")
            return Response(
                {'detail': f'Error saving portfolio: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )