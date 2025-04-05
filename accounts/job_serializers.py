from rest_framework import serializers
from .jobs import JobPost
from .models import User
from django.utils import timezone
from datetime import timedelta

class JobPostSerializer(serializers.ModelSerializer):
    client_company = serializers.CharField(source='client.company_name', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    def get_time_ago(self, obj):
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return 'just now'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'{minutes} minute{"s" if minutes != 1 else ""} ago'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'{hours} hour{"s" if hours != 1 else ""} ago'
        elif diff < timedelta(days=30):
            days = diff.days
            return f'{days} day{"s" if days != 1 else ""} ago'
        elif diff < timedelta(days=365):
            months = int(diff.days / 30)
            return f'{months} month{"s" if months != 1 else ""} ago'
        else:
            years = int(diff.days / 365)
            return f'{years} year{"s" if years != 1 else ""} ago'
    
    class Meta:
        model = JobPost
        fields = [
            'id',
            'client',
            'client_company',
            'time_ago',
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