from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from .models import User
from email_service import send_email

def send_job_notification(job):
    """
    Send email notifications about a new job posting to relevant users.
    """
    # Get all job seekers
    job_seekers = User.objects.filter(user_type='job_seeker')
    
    # Build the job URL
    job_url = f"{settings.FRONTEND_URL}/jobs/{job.id}"
    
    # Prepare the email template context
    context = {
        'job': job,
        'job_url': job_url
    }
    
    # Render the email template
    html_content = render_to_string('job_notification.html', context)
    
    # Send email to each job seeker
    for seeker in job_seekers:
        subject = f"New Job Opportunity: {job.title}"
        success, error = send_email(
            to=seeker.email,
            subject=subject,
            html_content=html_content
        )
        if not success:
            print(f"Failed to send job notification to {seeker.email}: {error}")