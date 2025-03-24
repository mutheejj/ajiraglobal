from rest_framework import serializers
from .job_applications import JobApplication
from .job_serializers import JobPostSerializer
from .serializers import UserRegistrationSerializer

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobPostSerializer(read_only=True)
    job_seeker = UserRegistrationSerializer(read_only=True)
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'job_seeker', 'cover_letter', 'resume', 'status',
                 'status_display', 'current_step', 'steps', 'applied_date', 'last_updated']
        read_only_fields = ['id', 'job_seeker', 'status', 'current_step', 'steps',
                           'applied_date', 'last_updated']
    
    def get_status_display(self, obj):
        return dict(JobApplication.STATUS_CHOICES)[obj.status]
    
    def validate_resume(self, value):
        if value and value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Resume file size must be less than 5MB')
        return value
    
    def create(self, validated_data):
        # Set the job seeker from the current user
        validated_data['job_seeker'] = self.context['request'].user
        return super().create(validated_data)