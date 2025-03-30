from django.conf import settings

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = settings.EMAIL_HOST
EMAIL_PORT = settings.EMAIL_PORT
EMAIL_HOST_USER = settings.EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = settings.EMAIL_HOST_PASSWORD
EMAIL_USE_TLS = settings.EMAIL_USE_TLS
DEFAULT_FROM_EMAIL = settings.DEFAULT_FROM_EMAIL

# Debug Email Settings
DEBUG = settings.DEBUG
VERIFIED_EMAIL = getattr(settings, 'VERIFIED_EMAIL', None)
REDIRECT_EMAILS_IN_DEBUG = getattr(settings, 'REDIRECT_EMAILS_IN_DEBUG', False)