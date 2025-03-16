from email_service import send_email
from django.conf import settings
from django.utils import timezone
import datetime

def send_verification_email(email_verification):
    subject = "Your Verification Code"
    message = f"Your verification code is: {email_verification.code}\n\nThis code will expire in 10 minutes."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email_verification.user.email]
    
    return send_email(
        to=recipient_list[0],
        subject=subject,
        html_content=message
    )
