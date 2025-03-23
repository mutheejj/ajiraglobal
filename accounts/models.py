
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
    company_name = models.CharField(max_length=255, null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    company_size = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    
    # Additional fields for Job Seeker registration
    # Note: first_name and last_name are already provided by AbstractUser
    profession = models.CharField(max_length=255, null=True, blank=True)
    experience = models.CharField(max_length=255, null=True, blank=True)
    skills = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    
    # Profile picture and document uploads
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    portfolio = models.FileField(upload_to='portfolios/', null=True, blank=True)
    
    # Social and professional links
    github_link = models.URLField(null=True, blank=True)
    linkedin_link = models.URLField(null=True, blank=True)
    personal_website = models.URLField(null=True, blank=True)
    
    # Currency preference
    currency = models.CharField(max_length=3, default='KSH')
    
    # Portfolio description
    portfolio_description = models.TextField(null=True, blank=True)
    
    # Override clean method to skip validation for superusers
    def clean(self):
        if not self.is_superuser:  # Skip validation for superusers
            if self.user_type:
                errors = {}
                if self.user_type == 'client':
                    # Validate required client fields
                    required_client_fields = {
                        'company_name': 'Company Name',
                        'industry': 'Industry',
                        'company_size': 'Company Size'
                    }
                    for field, display_name in required_client_fields.items():
                        if not getattr(self, field):
                            errors[field] = [f'{display_name} is required for client accounts.']
                    
                    # Set job seeker fields to None
                    job_seeker_fields = ['profession', 'experience', 'skills', 'bio']
                    for field in job_seeker_fields:
                        setattr(self, field, None)
                        
                elif self.user_type == 'job-seeker':
                    # Validate required job seeker fields
                    required_seeker_fields = {
                        'first_name': 'First Name',
                        'last_name': 'Last Name',
                        'profession': 'Profession',
                        'experience': 'Experience',
                        'skills': 'Skills',
                        'github_link': 'GitHub Profile',
                        'linkedin_link': 'LinkedIn Profile'
                    }
                    for field, display_name in required_seeker_fields.items():
                        if not getattr(self, field):
                            errors[field] = [f'{display_name} is required for job seeker accounts.']
                    
                    # Set client fields to None
                    client_fields = ['company_name', 'industry', 'company_size', 'website', 'description']
                    for field in client_fields:
                        setattr(self, field, None)
                
                if errors:
                    raise ValidationError(errors)
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
