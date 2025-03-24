from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .job_applications import JobApplication
from .job_application_serializers import JobApplicationSerializer
from .jobs import JobPost

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return only applications for the current user
        return JobApplication.objects.filter(job_seeker=self.request.user)
    
    def perform_create(self, serializer):
        job_id = self.request.data.get('job_id')
        job = get_object_or_404(JobPost, id=job_id)
        
        # Check if user has already applied
        if JobApplication.objects.filter(job_seeker=self.request.user, job=job).exists():
            return Response(
                {'detail': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save(job_seeker=self.request.user, job=job)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        application = self.get_object()
        if application.status == 'pending':
            application.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(
            {'detail': 'Cannot withdraw application at current stage'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'detail': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.update_status(new_status)
        serializer = self.get_serializer(application)
        return Response(serializer.data)