from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .jobs import JobPost
from .job_serializers import JobPostSerializer
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class JobPostViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return JobPost.objects.filter(client=user)
        return JobPost.objects.filter(status='active')
    
    def perform_create(self, serializer):
        if self.request.user.user_type != 'client':
            raise serializers.ValidationError('Only clients can post jobs')
        serializer.save()
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        job = self.get_object()
        if job.client != request.user:
            return Response(
                {'detail': 'You do not have permission to modify this job post'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status not in dict(JobPost.STATUS_CHOICES):
            return Response(
                {'detail': 'Invalid status value'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job.status = new_status
        job.save()
        serializer = self.get_serializer(job)
        return Response(serializer.data)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Apply filters
        category = request.query_params.get('category')
        experience_level = request.query_params.get('experience_level')
        project_type = request.query_params.get('project_type')
        remote_work = request.query_params.get('remote_work')
        
        if category:
            queryset = queryset.filter(category=category)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        if project_type:
            queryset = queryset.filter(project_type=project_type)
        if remote_work:
            queryset = queryset.filter(remote_work=remote_work)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)