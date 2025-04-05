from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
from .models import EmailVerification
import logging

class JobSeekerPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'first_name', 'last_name', 'profession', 'experience', 'skills', 'bio',
                  'github_link', 'linkedin_link', 'personal_website', 'portfolio_description']
        read_only_fields = fields  # Make all fields read-only for public access

logger = logging.getLogger(__name__)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_type', 'company_name', 'industry', 'company_size',
                 'website', 'description', 'first_name', 'last_name', 'profession',
                 'experience', 'skills', 'bio', 'github_link', 'linkedin_link',
                 'personal_website', 'portfolio_description']
        read_only_fields = ['id', 'email', 'user_type']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)
    
    # Client fields
    company_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    industry = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    company_size = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    website = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    # Job seeker fields
    first_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    profession = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    experience = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    skills = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password', 'user_type',
                 'company_name', 'industry', 'company_size', 'website', 'description',
                 'first_name', 'last_name', 'profession', 'experience', 'skills', 'bio')

    def validate(self, attrs):
        logger.info(f"Starting validation with initial data: {self.initial_data}")
        
        # Handle update vs create scenario differently
        # Skip password validation for updates (when instance exists)
        is_update = self.instance is not None
        
        # Since the data is already in snake_case format from the frontend,
        # we can simply validate it directly
        data = {}
        for key, value in self.initial_data.items():
            # Skip empty values but keep empty strings and other falsy values
            if value is None or value == 'null':
                continue
            # Strip whitespace for string values
            if isinstance(value, str):
                data[key] = value.strip()
            else:
                data[key] = value
        
        logger.info(f"Processed data for validation: {data}")
        
        # Set username to email for authentication (only for new users)
        if 'email' in data and not is_update:
            data['username'] = data['email']
        
        errors = {}
        
        # Only validate these fields for new user registration, not updates
        if not is_update:
            # Validate required base fields
            required_base_fields = ['email', 'password', 'confirm_password', 'user_type']
            for field in required_base_fields:
                if field not in data or not data.get(field):
                    errors[field] = [f"{field.replace('_', ' ').title()} is required"]
            
            # Validate email
            email = data.get('email')
            if email:
                from django.core.validators import validate_email
                try:
                    validate_email(email)
                    # Check if email already exists (only for new users)
                    if User.objects.filter(email=email).exists():
                        errors['email'] = ["This email is already registered"]
                except ValidationError:
                    errors['email'] = ["Please enter a valid email address"]
            
            # Validate password strength and match (only for new users)
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            
            if password:
                password_errors = []
                if len(password) < 8:
                    password_errors.append("Password must be at least 8 characters long")
                if not any(char.isdigit() for char in password):
                    password_errors.append("Password must contain at least one number")
                if not any(char.isupper() for char in password):
                    password_errors.append("Password must contain at least one uppercase letter")
                if not any(char.islower() for char in password):
                    password_errors.append("Password must contain at least one lowercase letter")
                if not any(char in '!@#$%^&*()' for char in password):
                    password_errors.append("Password must contain at least one special character (!@#$%^&*())")
                
                if password_errors:
                    errors['password'] = password_errors
            
            if password and confirm_password and password != confirm_password:
                errors['confirm_password'] = ["Passwords do not match"]
            
            # Validate user type specific fields (only for new users)
            user_type = data.get('user_type')
            if user_type:
                if user_type not in ['client', 'job-seeker']:
                    errors['user_type'] = ["User type must be either 'client' or 'job-seeker'"]
                else:
                    if user_type == 'client':
                        required_fields = {
                            'company_name': 'Company Name',
                            'industry': 'Industry',
                            'company_size': 'Company Size'
                        }
                        # Validate website format if provided
                        website = data.get('website')
                        if website and not website.startswith(('http://', 'https://')):
                            errors['website'] = ["Website must start with http:// or https://"]
                    else:  # job-seeker
                        required_fields = {
                            'first_name': 'First Name',
                            'last_name': 'Last Name',
                            'profession': 'Profession',
                            'experience': 'Experience',
                            'skills': 'Skills'
                        }
                    
                    for field, display_name in required_fields.items():
                        field_value = data.get(field)
                        if not field_value:
                            errors[field] = [f"{display_name} is required for {user_type} registration"]
                        elif isinstance(field_value, str) and len(field_value.strip()) < 2:
                            errors[field] = [f"{display_name} must be at least 2 characters long"]
        
        if errors:
            logger.error(f"Validation errors: {errors}")
            raise serializers.ValidationError(errors)
        
        logger.info("Validation successful")
        
        # Update attrs with validated data
        attrs.update(data)
        
        return attrs

    def create(self, validated_data):
        logger.info(f"Creating user with data: {validated_data}")
        
        # Remove confirm_password as it's not needed for user creation
        validated_data.pop('confirm_password', None)
        
        # Get the password for later use
        password = validated_data.pop('password')
        
        # Create user instance but don't save yet
        user = User(**validated_data)
        
        # Set the password properly
        user.set_password(password)
        
        # Save the user
        try:
            user.full_clean()
            user.save()
            
            # Create verification code
            expiry = timezone.now() + timedelta(hours=24)
            verification = EmailVerification.objects.create(user=user, expires_at=expiry)
            logger.info(f"Created verification code for user {user.email}: {verification.code}")
            
            return user
        except ValidationError as e:
            logger.error(f"Error saving user: {e.message_dict}")
            raise serializers.ValidationError(e.message_dict)

    def update(self, instance, validated_data):
        logger.info(f"Updating user with data: {validated_data}")
        
        # Remove password and confirm_password as they require special handling
        validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        validated_data.pop('user_type', None)  # Don't allow changing user type
        
        # Update instance fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
            
        try:
            instance.full_clean()
            instance.save()
            return instance
        except ValidationError as e:
            logger.error(f"Error updating user: {e.message_dict}")
            raise serializers.ValidationError(e.message_dict)

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

class JobSeekerProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating job seeker profiles without password validation."""
    
    # Define all fields that can be updated
    first_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    profession = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    experience = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    skills = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    github_link = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    linkedin_link = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    personal_website = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    portfolio_description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    hourly_rate = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    currency = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'profession', 'experience', 'skills', 
            'bio', 'github_link', 'linkedin_link', 'personal_website', 
            'portfolio_description', 'hourly_rate', 'currency', 'profile_picture'
        ]
    
    def validate_github_link(self, value):
        """Ensure github_link is a valid URL if provided"""
        if value and not value.startswith(('http://', 'https://')):
            # Try to fix it by prepending https://
            if not value.startswith('http'):
                value = 'https://' + value
        return value
        
    def validate_linkedin_link(self, value):
        """Ensure linkedin_link is a valid URL if provided"""
        if value and not value.startswith(('http://', 'https://')):
            # Try to fix it by prepending https://
            if not value.startswith('http'):
                value = 'https://' + value
        return value
        
    def validate_personal_website(self, value):
        """Ensure personal_website is a valid URL if provided"""
        if value and not value.startswith(('http://', 'https://')):
            # Try to fix it by prepending https://
            if not value.startswith('http'):
                value = 'https://' + value
        return value
    
    def update(self, instance, validated_data):
        logger.info(f"Updating job seeker profile: {validated_data}")
        
        # File handling is done in the view, so we don't need to handle profile_picture here
        if 'profile_picture' in validated_data:
            del validated_data['profile_picture']
            
        # Handle skills conversion if needed
        if 'skills' in validated_data and validated_data['skills']:
            # If already a string, leave it as is
            if not isinstance(validated_data['skills'], str):
                validated_data['skills'] = ','.join(validated_data['skills'])
        
        # Update fields on the instance
        for field, value in validated_data.items():
            setattr(instance, field, value)
            
        try:
            instance.save()
            logger.info(f"Job seeker profile updated successfully for {instance.email}")
            return instance
        except Exception as e:
            logger.error(f"Error updating job seeker profile: {str(e)}")
            raise serializers.ValidationError(f"Error updating profile: {str(e)}")
