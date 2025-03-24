from django.db import models
from django.core.validators import FileExtensionValidator
from .models import User
from .jobs import JobPost

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('interviewed', 'Interviewed'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted')
    ]
    
    job_seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(null=True, blank=True)
    resume = models.FileField(
        upload_to='applications/resumes/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        null=True,
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    current_step = models.IntegerField(default=0)
    steps = models.JSONField(default=list)  # Store application process steps
    applied_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_date']
        unique_together = ['job_seeker', 'job']  # Prevent duplicate applications
    
    def __str__(self):
        return f"{self.job_seeker.email} - {self.job.title}"
    
    def update_status(self, new_status):
        self.status = new_status
        self.save()
    
    def advance_step(self):
        if self.current_step < len(self.steps) - 1:
            self.current_step += 1
            self.save()
    
    def set_steps(self, steps_list):
        self.steps = steps_list
        self.save()