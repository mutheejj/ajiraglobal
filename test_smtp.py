import smtplib
from email.mime.text import MIMEText
from django.conf import settings
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ajiraglobal.settings')

def test_smtp_connection():
    try:
        # Create a test email message
        msg = MIMEText('This is a test email from Ajira Global')
        msg['Subject'] = 'Test Email'
        msg['From'] = settings.DEFAULT_FROM_EMAIL
        msg['To'] = settings.DEFAULT_FROM_EMAIL

        # Connect to SMTP server
        print(f"Connecting to {settings.EMAIL_HOST}:{settings.EMAIL_PORT}...")
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.set_debuglevel(1)  # Enable debug output

        # Start TLS if required
        if settings.EMAIL_USE_TLS:
            print("Starting TLS...")
            server.starttls()

        # Login
        print("Attempting login...")
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)

        # Send test email
        print("Sending test email...")
        server.send_message(msg)

        print("Test email sent successfully!")
        server.quit()

    except Exception as e:
        print(f"Error: {str(e)}")
        print(f"Error type: {type(e).__name__}")

if __name__ == '__main__':
    import django
    django.setup()
    test_smtp_connection()