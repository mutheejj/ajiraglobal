from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        errors = {'detail': {}}
        
        # Validate required fields
        if not email:
            errors['detail'].setdefault('email', []).append('Email is required')
        if not password:
            errors['detail'].setdefault('password', []).append('Password is required')
            
        if errors['detail']:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            if not user.email_verified:
                return Response({
                    'detail': {
                        'non_field_errors': ['Please verify your email before logging in']
                    }
                }, status=status.HTTP_403_FORBIDDEN)
                
            login(request, user)
            
            # Prepare user data based on user type
            user_data = {
                'email': user.email,
                'userType': user.user_type,
                'email_verified': user.email_verified
            }
            
            if user.user_type == 'client':
                user_data.update({
                    'company_name': user.company_name,
                    'industry': user.industry,
                    'company_size': user.company_size,
                    'website': user.website,
                    'description': user.description
                })
            else:  # job-seeker
                user_data.update({
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profession': user.profession,
                    'experience': user.experience,
                    'skills': user.skills,
                    'bio': user.bio
                })
            
            return Response({'user': user_data})
        else:
            return Response({
                'detail': {
                    'non_field_errors': ['Invalid email or password']
                }
            }, status=status.HTTP_401_UNAUTHORIZED)