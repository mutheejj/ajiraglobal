from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import EmailVerification

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)
    
    # Client fields
    company_name = serializers.CharField(required=False)
    industry = serializers.CharField(required=False)
    company_size = serializers.CharField(required=False)
    website = serializers.URLField(required=False, allow_blank=True)
    description = serializers.CharField(required=False)
    
    # Job seeker fields
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    profession = serializers.CharField(required=False)
    experience = serializers.CharField(required=False)
    skills = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'confirm_password', 'user_type',
                 'company_name', 'industry', 'company_size', 'website', 'description',
                 'first_name', 'last_name', 'profession', 'experience', 'skills', 'bio')

    def validate(self, data):
        errors = {}

        # Validate required base fields
        required_base_fields = ['email', 'username', 'password', 'confirm_password', 'user_type']
        for field in required_base_fields:
            if not data.get(field):
                errors[field] = [f"{field.replace('_', ' ').title()} is required"]

        # Validate password match
        if data.get('password') and data.get('confirm_password') and data.get('password') != data.get('confirm_password'):
            errors['password'] = ["Passwords do not match"]

        # Convert camelCase to snake_case for frontend compatibility
        field_mapping = {
            'companyName': 'company_name',
            'companySize': 'company_size',
            'firstName': 'first_name',
            'lastName': 'last_name'
        }

        for camel_case, snake_case in field_mapping.items():
            if camel_case in data:
                data[snake_case] = data.pop(camel_case)

        # Validate user type specific fields
        user_type = data.get('user_type')
        if user_type == 'client':
            required_fields = ['company_name', 'industry', 'company_size']
            for field in required_fields:
                if not data.get(field):
                    errors[field] = [f"{field.replace('_', ' ').title()} is required for client registration"]
        elif user_type == 'job-seeker':
            required_fields = ['first_name', 'last_name', 'profession', 'experience', 'skills']
            for field in required_fields:
                if not data.get(field):
                    errors[field] = [f"{field.replace('_', ' ').title()} is required for job seeker registration"]
        elif user_type:
            errors['user_type'] = [f"Invalid user type: {user_type}. Must be either 'client' or 'job-seeker'"]
        
        if errors:
            raise serializers.ValidationError({"detail": errors})
                
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user_type = validated_data.pop('user_type')
        
        # Extract user type specific fields
        profile_fields = {}
        if user_type == 'client':
            for field in ['company_name', 'industry', 'company_size', 'website', 'description']:
                if field in validated_data:
                    profile_fields[field] = validated_data.pop(field)
        else:
            for field in ['first_name', 'last_name', 'profession', 'experience', 'skills', 'bio']:
                if field in validated_data:
                    profile_fields[field] = validated_data.pop(field)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            password=validated_data['password'],
            user_type=user_type,
            **profile_fields
        )
        
        # Create verification code
        expiry = timezone.now() + timedelta(hours=24)
        EmailVerification.objects.create(user=user, expires_at=expiry)
        return user

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            verification = EmailVerification.objects.filter(
                user=user,
                code=data['code'],
                expires_at__gt=timezone.now()
            ).first()
            
            if not verification:
                raise serializers.ValidationError("Invalid or expired verification code")
            
            data['user'] = user
            data['verification'] = verification
            return data
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")