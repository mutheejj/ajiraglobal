
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError

class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('job-seeker', 'Job Seeker'),
    ]
    
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, null=True)
    
    # Additional fields for Client registration
    company_name = models.CharField(max_length=255, null=True)
    industry = models.CharField(max_length=255, null=True)
    company_size = models.CharField(max_length=100, null=True)
    website = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    
    # Additional fields for Job Seeker registration
    # Note: first_name and last_name are already provided by AbstractUser
    profession = models.CharField(max_length=255, null=True)
    experience = models.CharField(max_length=255, null=True)
    skills = models.CharField(max_length=255, null=True)
    bio = models.TextField(null=True, blank=True)
    
    # Override clean method to skip validation for superusers
    def clean(self):
        if not self.is_superuser:  # Skip validation for superusers
            if self.user_type:
                if self.user_type == 'client':
                    if not all([self.company_name, self.industry, self.company_size]):
                        raise ValidationError('Company name, industry, and company size are required for client accounts.')
                elif self.user_type == 'job-seeker':
                    if not all([self.first_name, self.last_name, self.profession, self.experience, self.skills]):
                        raise ValidationError('First name, last name, profession, experience, and skills are required for job seeker accounts.')
        super().clean()

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = get_random_string(6, allowed_chars='0123456789')
        super().save(*args, **kwargs)
