import resend
import logging

def send_email(to, subject, html_content):
    try:
        response = resend.Emails.send({
            'from': 'onboarding@resend.dev',
            'to': to,
            'subject': subject,
            'html': html_content
        })
        return True
    except Exception as e:
        logging.error(f'Failed to send email: {str(e)}')
        return False