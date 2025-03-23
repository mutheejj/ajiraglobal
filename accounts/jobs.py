from django.db import models
from django.core.validators import MinValueValidator
from .models import User

class JobPost(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('draft', 'Draft')
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert')
    ]
    
    PROJECT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance')
    ]
    
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    skills = models.JSONField()  # Store skills as a list
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration = models.IntegerField(help_text='Duration in days', validators=[MinValueValidator(1)])
    location = models.CharField(max_length=255, null=True, blank=True)
    remote_work = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.client.company_name}"