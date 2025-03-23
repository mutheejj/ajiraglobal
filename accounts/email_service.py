import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_email(to, subject, html_content):
    try:
        # Only redirect emails in DEBUG mode if explicitly configured to do so
        original_recipient = to
        if settings.DEBUG and hasattr(settings, 'VERIFIED_EMAIL') and getattr(settings, 'REDIRECT_EMAILS_IN_DEBUG', False):
            logger.info(f"Debug mode: Redirecting email from {to} to {settings.VERIFIED_EMAIL}")
            to = settings.VERIFIED_EMAIL
            subject = f"[Original recipient: {original_recipient}] {subject}"
        else:
            logger.info(f"Sending email directly to {to}")

        # Use Django's send_mail function
        send_mail(
            subject=subject,
            message='',  # Plain text version
            html_message=html_content,  # HTML version
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