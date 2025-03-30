import os
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_email(to, subject, html_content):
    """
    Send an email using SMTP configuration from environment variables.
    Returns a tuple (success, error_message)
    """
    try:
        # Use Django's send_mail function which will use the SMTP backend
        send_mail(
            subject=subject,
            message='',  # Empty string for plain text (we're using HTML)
            html_message=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to],
            fail_silently=False,
        )
        logger.info(f"Successfully sent email to {to}")
        return True, None

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to send email: {error_msg}")
        return False, error_msg