import os
import sys
import django
from django.core.mail import send_mail
from django.conf import settings
import logging

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ajiraglobal.settings')
django.setup()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('django_email_test')

def test_email_config():
    logger.info('Testing Django email configuration...')
    logger.debug(f'Email Backend: {settings.EMAIL_BACKEND}')
    logger.debug(f'Email Host: {settings.EMAIL_HOST}')
    logger.debug(f'Email Port: {settings.EMAIL_PORT}')
    logger.debug(f'Email Host User: {settings.EMAIL_HOST_USER}')
    logger.debug(f'TLS Enabled: {settings.EMAIL_USE_TLS}')
    logger.debug(f'Default From Email: {settings.DEFAULT_FROM_EMAIL}')
    logger.debug(f'Redirect Emails in Debug: {getattr(settings, "REDIRECT_EMAILS_IN_DEBUG", False)}')

def send_test_email(to_email):
    try:
        logger.info(f'Attempting to send test email to {to_email}')
        
        # Check if emails are being redirected
        if settings.DEBUG and getattr(settings, 'REDIRECT_EMAILS_IN_DEBUG', False):
            logger.info(f'Debug mode with redirection: Email will be sent to {settings.VERIFIED_EMAIL} instead of {to_email}')
        else:
            logger.info(f'Email will be sent directly to {to_email}')
            
        send_mail(
            subject='Ajiraglobal Test Email',
            message='This is a test email to verify Django email configuration.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        logger.info('Test email sent successfully!')
        return True
    except Exception as e:
        logger.error(f'Failed to send test email. Error: {str(e)}')
        return False

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python test_django_email.py <recipient_email>')
        sys.exit(1)
    
    recipient_email = sys.argv[1]
    test_email_config()
    success = send_test_email(recipient_email)
    
    if success:
        print(f'\nEmail sent successfully to {recipient_email}')
        if settings.DEBUG and getattr(settings, 'REDIRECT_EMAILS_IN_DEBUG', False):
            print(f'Note: In DEBUG mode with redirection enabled, the email was actually sent to {settings.VERIFIED_EMAIL}')
    else:
        print('\nFailed to send email. Check the logs for details.')