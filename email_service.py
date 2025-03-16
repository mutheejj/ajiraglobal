import resend
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Resend with API key from settings
resend.api_key = settings.RESEND_API_KEY

def send_email(to, subject, html_content):
    try:
        # In development, redirect all emails to the verified email address
        if settings.DEBUG:
            logger.info(f"Debug mode: Redirecting email from {to} to {settings.VERIFIED_EMAIL}")
            to = settings.VERIFIED_EMAIL
            subject = f"[Original recipient: {to}] {subject}"

        response = resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": to,
            "subject": subject,
            "html": html_content
        })
        logger.info(f"Successfully sent email to {to}")
        return True, None
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to send email: {error_msg}")
        return False, error_msg