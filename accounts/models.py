from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string

class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('job-seeker', 'Job Seeker'),
    ]
    
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    
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