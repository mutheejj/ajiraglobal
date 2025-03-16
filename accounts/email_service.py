import resend
import logging
from django.conf import settings

def send_email(to, subject, html_content):
    try:
        # Use configured sender email from settings
        sender_email = getattr(settings, 'EMAIL_SENDER', 'onboarding@resend.dev')
        response = resend.Emails.send({
            'from': sender_email,
            'to': to,
            'subject': subject,
            'html': html_content
        })
        return True, None
    except Exception as e:
        error_msg = str(e)
        logging.error(f'Failed to send email: {error_msg}')
        return False, error_msg