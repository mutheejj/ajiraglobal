from rest_framework import serializers
from .jobs import JobPost
from .models import User

class JobPostSerializer(serializers.ModelSerializer):
    client_company = serializers.CharField(source='client.company_name', read_only=True)
    
    class Meta:
        model = JobPost
        fields = [
            'id',
            'client',
            'client_company',
            'title',
            'category',
            'description',
            'requirements',
            'skills',
            'experience_level',
            'project_type',
            'budget',
            'duration',
            'location',
            'remote_work',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['client', 'client_company', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set the client from the current user
        user = self.context['request'].user
        if not user.is_authenticated or user.user_type != 'client':
            raise serializers.ValidationError('Only authenticated clients can post jobs')
        
        validated_data['client'] = user
        return super().create(validated_data)
    
    def validate_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Skills must be provided as a list')
        if not value:
            raise serializers.ValidationError('At least one skill is required')
        return value
    
    def validate_budget(self, value):
        if value <= 0:
            raise serializers.ValidationError('Budget must be greater than 0')
        return value
    
    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError('Duration must be greater than 0')
        return value