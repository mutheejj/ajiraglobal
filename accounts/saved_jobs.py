from django.db import models
from .models import User
from .jobs import JobPost

class SavedJob(models.Model):
    job_seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='saved_by')
    saved_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-saved_date']
        unique_together = ['job_seeker', 'job']  # Prevent duplicate saves
    
    def __str__(self):
        return f"{self.job_seeker.email} - {self.job.title}"