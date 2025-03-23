from email_service import send_email
from django.conf import settings
from django.utils import timezone
import datetime

def send_verification_email(email_verification):
    subject = "Your Verification Code"
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .code {{ font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background-color: #eee; margin: 20px 0; letter-spacing: 5px; }}
            .footer {{ text-align: center; font-size: 12px; color: #777; padding-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Email Verification</h2>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for registering with Ajira Global. Please use the verification code below to complete your registration:</p>
                <div class="code">{email_verification.code}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this verification code, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; {timezone.now().year} Ajira Global. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(
        to=email_verification.user.email,
        subject=subject,
        html_content=html_content
    )
