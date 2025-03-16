import unittest
from unittest.mock import patch, MagicMock
from email_service import send_email
from django.test import TestCase
import resend

class EmailServiceTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        resend.api_key = 're_bajX2GpT_Br8KbYWNax42vXgnxCpkZH4q'

    @patch('resend.Emails.send')
    def test_send_email_success(self, mock_post):
        mock_response = {'id': 'test_id'}
        mock_post.return_value = mock_response

        result = send_email(
            to='johnmuthee547@gmail.com',
            subject='Test Subject',
            html_content='<h1>Test Content</h1>'
        )
        
        self.assertTrue(result)
        mock_post.assert_called_once_with({
                'from': 'onboarding@resend.dev',
                'to': 'johnmuthee547@gmail.com',
                'subject': 'Test Subject',
                'html': '<h1>Test Content</h1>'
            })

    @patch('resend.Emails.send')
    def test_send_email_failure(self, mock_post):
        mock_post.side_effect = Exception('API Error')

        result = send_email(
            to='john',
            subject='Test Subject',
            html_content='<h1>Test Content</h1>'
        )
        
        self.assertFalse(result)
        mock_post.assert_called_once()

    @patch('resend.Emails.send')
    def test_email_content_validation(self, mock_post):
        mock_response = {'id': 'test_id'}
        mock_post.return_value = mock_response

        test_html = '<h1>Verification Code: 123456</h1>'
        send_email(
            to='user@domain.com',
            subject='Verification',
            html_content=test_html
        )
        
        mock_post.assert_called_with({
            'from': 'onboarding@resend.dev',
            'to': 'user@domain.com',
            'subject': 'Verification',
            'html': test_html
        })

    @patch('resend.Emails.send')
    def test_multiple_recipients(self, mock_post):
        mock_response = {'id': 'test_id'}
        mock_post.return_value = mock_response

        recipients = ['user1@domain.com', 'user2@domain.com']
        for recipient in recipients:
            result = send_email(
                to=recipient,
                subject='Multiple Recipients Test',
                html_content='<p>Test content</p>'
            )
            self.assertTrue(result)
            mock_post.assert_called_with({
                'from': 'onboarding@resend.dev',
                'to': recipient,
                'subject': 'Multiple Recipients Test',
                'html': '<p>Test content</p>'
            })

    @patch('resend.Emails.send')
    def test_invalid_email_format(self, mock_post):
        mock_post.side_effect = Exception('Invalid email format')

        result = send_email(
            to='invalid-email',
            subject='Test Subject',
            html_content='<p>Test content</p>'
        )
        
        self.assertFalse(result)
        mock_post.assert_called_once()

    def test_api_key_configuration(self):
        self.assertIsNotNone(resend.api_key)
        self.assertTrue(isinstance(resend.api_key, str))
        self.assertTrue(len(resend.api_key) > 0)

if __name__ == '__main__':
    unittest.main()