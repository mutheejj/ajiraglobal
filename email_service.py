import os
import resend

resend.api_key = os.getenv('RESEND_API_KEY')

def send_email(to, subject, html_content):
    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": to,
            "subject": subject,
            "html": html_content
        })
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False