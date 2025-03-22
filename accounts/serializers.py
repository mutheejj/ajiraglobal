from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
from .models import EmailVerification

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)
    
    # Client fields
    company_name = serializers.CharField(required=False, allow_null=True)
    industry = serializers.CharField(required=False, allow_null=True)
    company_size = serializers.CharField(required=False, allow_null=True)
    website = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    # Job seeker fields
    first_name = serializers.CharField(required=False, allow_null=True)
    last_name = serializers.CharField(required=False, allow_null=True)
    profession = serializers.CharField(required=False, allow_null=True)
    experience = serializers.CharField(required=False, allow_null=True)
    skills = serializers.CharField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password', 'user_type',
                 'company_name', 'industry', 'company_size', 'website', 'description',
                 'first_name', 'last_name', 'profession', 'experience', 'skills', 'bio')

    def validate(self, data):
        errors = {'detail': {}}

        # Validate required base fields
        required_base_fields = ['email', 'password', 'confirm_password', 'user_type']
        for field in required_base_fields:
            if not data.get(field):
                errors['detail'].setdefault(field, []).append(f"{field.replace('_', ' ').title()} is required")

        # Validate email format
        email = data.get('email')
        if email:
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError
            try:
                validate_email(email)
            except ValidationError:
                errors['detail'].setdefault('email', []).append("Please enter a valid email address")
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                errors['detail'].setdefault('email', []).append("This email is already registered")

        # Validate password strength and match
        password = data.get('password')
        if password:
            if len(password) < 8:
                errors['detail'].setdefault('password', []).append("Password must be at least 8 characters long")
            if not any(char.isdigit() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one number")
            if not any(char.isupper() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one uppercase letter")
            if not any(char.islower() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one lowercase letter")
            if not any(char in '!@#$%^&*()' for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one special character (!@#$%^&*())")

        if data.get('password') and data.get('confirm_password') and data.get('password') != data.get('confirm_password'):
            errors['detail'].setdefault('confirm_password', []).append("Passwords do not match")

        # Convert camelCase to snake_case for frontend compatibility
        field_mapping = {
            'userType': 'user_type',
            'confirmPassword': 'confirm_password',
            'companyName': 'company_name',
            'industry': 'industry',
            'companySize': 'company_size',
            'website': 'website',
            'description': 'description',
            'firstName': 'first_name',
            'lastName': 'last_name',
            'profession': 'profession',
            'experience': 'experience',
            'skills': 'skills',
            'bio': 'bio'
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
                    field_label = field.replace('_', ' ').title()
                    errors['detail'].setdefault(field, []).append(
                        f"{field_label} is required for client registration"
                    )
        elif user_type == 'job-seeker':
            required_fields = ['first_name', 'last_name', 'profession', 'experience', 'skills']
            for field in required_fields:
                if not data.get(field):
                    field_label = field.replace('_', ' ').title()
                    errors['detail'].setdefault(field, []).append(
                        f"{field_label} is required for job seeker registration"
                    )
        elif user_type:
            errors['detail'].setdefault('user_type', []).append(
                f"Invalid user type: {user_type}. Must be either 'client' or 'job-seeker'"
            )
        
        if errors['detail']:
            raise serializers.ValidationError(errors)
                
        return data

        # Validate password strength and match
        password = data.get('password')
        if password:
            if len(password) < 8:
                errors['detail'].setdefault('password', []).append("Password must be at least 8 characters long")
            if not any(char.isdigit() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one number")
            if not any(char.isupper() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one uppercase letter")
            if not any(char.islower() for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one lowercase letter")
            if not any(char in '!@#$%^&*()' for char in password):
                errors['detail'].setdefault('password', []).append("Password must contain at least one special character (!@#$%^&*())")

        if data.get('password') and data.get('confirm_password') and data.get('password') != data.get('confirm_password'):
            errors['detail'].setdefault('confirm_password', []).append("Passwords do not match")

        # Convert camelCase to snake_case for frontend compatibility
        field_mapping = {
            'userType': 'user_type',
            'confirmPassword': 'confirm_password',
            'companyName': 'company_name',
            'industry': 'industry',
            'companySize': 'company_size',
            'website': 'website',
            'description': 'description',
            'firstName': 'first_name',
            'lastName': 'last_name',
            'profession': 'profession',
            'experience': 'experience',
            'skills': 'skills',
            'bio': 'bio'
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
                    field_label = field.replace('_', ' ').title()
                    errors['detail'].setdefault(field, []).append(
                        f"{field_label} is required for client registration"
                    )
        elif user_type == 'job-seeker':
            required_fields = ['first_name', 'last_name', 'profession', 'experience', 'skills']
            for field in required_fields:
                if not data.get(field):
                    field_label = field.replace('_', ' ').title()
                    errors['detail'].setdefault(field, []).append(
                        f"{field_label} is required for job seeker registration"
                    )
        elif user_type:
            errors['detail'].setdefault('user_type', []).append(
                f"Invalid user type: {user_type}. Must be either 'client' or 'job-seeker'"
            )
        
        if errors['detail']:
            raise serializers.ValidationError(errors)
                
        return data

    def create(self, validated_data):
        # Remove confirm_password as it's not needed for user creation
        validated_data.pop('confirm_password')
        
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
            EmailVerification.objects.create(user=user, expires_at=expiry)
            
            return user
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message_dict})

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