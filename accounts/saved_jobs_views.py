from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .saved_jobs import SavedJob
from .jobs import JobPost
from .job_serializers import JobPostSerializer

class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return only jobs saved by the current user
        return JobPost.objects.filter(saved_by__job_seeker=self.request.user)
    
    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        job = get_object_or_404(JobPost, id=pk)
        
        # Check if job is already saved
        if SavedJob.objects.filter(job_seeker=request.user, job=job).exists():
            return Response(
                {'detail': 'Job already saved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        SavedJob.objects.create(job_seeker=request.user, job=job)
        return Response(self.get_serializer(job).data)
    
    @action(detail=True, methods=['delete'])
    def unsave(self, request, pk=None):
        job = get_object_or_404(JobPost, id=pk)
        saved_job = SavedJob.objects.filter(job_seeker=request.user, job=job).first()
        
        if not saved_job:
            return Response(
                {'detail': 'Job not found in saved jobs'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        saved_job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)