"""
This is a debugging script to test the registration endpoint.
Run this script to diagnose and troubleshoot registration issues.
"""

import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_registration():
    # The URL for the registration endpoint
    url = "http://127.0.0.1:8000/api/accounts/auth/register/"
    
    # The exact payload that was failing
    payload = {
        'email': 'magerian148@gmail.com',
        'password': 'Newjj123#',
        'confirm_password': 'Newjj123#',
        'user_type': 'job-seeker',
        'first_name': 'John',
        'last_name': 'maina',
        'profession': 'developer',
        'experience': '0-1',
        'skills': 'new',
        'bio': 'new'
    }
    
    # Make the request
    logger.info(f"Sending POST request to {url} with payload: {payload}")
    response = requests.post(url, json=payload)
    
    # Log the response
    logger.info(f"Status code: {response.status_code}")
    
    try:
        response_json = response.json()
        logger.info(f"Response: {json.dumps(response_json, indent=2)}")
    except:
        logger.error(f"Failed to parse response as JSON: {response.text}")
    
    return response

if __name__ == "__main__":
    test_registration()