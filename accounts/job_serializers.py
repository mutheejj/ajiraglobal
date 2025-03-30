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
            'currency',
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
        from decimal import Decimal
        try:
            value = Decimal(str(value))
            min_value = Decimal('0')
            if value <= min_value:
                raise serializers.ValidationError('Budget must be greater than 0')
            return value
        except (TypeError, ValueError):
            raise serializers.ValidationError('Budget must be a valid decimal number')
    
    def validate(self, data):
        # Get the client's currency preference
        client = self.context['request'].user
        if not client.is_authenticated:
            raise serializers.ValidationError('Authentication required')
        
        if client.user_type != 'client':
            raise serializers.ValidationError('Only clients can post jobs')
        
        # Ensure the client has a valid currency setting
        if client.currency not in ['KSH', 'USD']:
            raise serializers.ValidationError({'currency': 'Currency must be either KSH or USD'})
        
        return data
    
    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError('Duration must be greater than 0')
        return value