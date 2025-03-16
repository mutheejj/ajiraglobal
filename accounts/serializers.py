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

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'confirm_password', 'user_type')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data['user_type']
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