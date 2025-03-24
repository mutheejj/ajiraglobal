from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import UserRegistrationSerializer

class JobSeekerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return only the current user's profile
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'put'])
    def profile(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def resume(self, request):
        if 'resume' not in request.FILES:
            return Response(
                {'detail': 'No resume file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        resume_file = request.FILES['resume']
        if resume_file.size > 5 * 1024 * 1024:  # 5MB limit
            return Response(
                {'detail': 'Resume file size must be less than 5MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.resume = resume_file
        request.user.save()
        
        return Response({
            'resume': request.user.resume.url if request.user.resume else None
        })