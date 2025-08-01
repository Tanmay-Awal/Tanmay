from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_cors import cross_origin
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import json
import requests as http_requests
from models import User, NGO
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta
from email_service import send_email
import textwrap
import threading
import time

google_auth_routes = Blueprint('google_auth_routes', __name__)


GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI = "http://localhost:5000/api/auth/google/callback"


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

def get_google_user_info(access_token):
    """Get user info from Google using access token"""
    try:
        response = http_requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error getting Google user info: {e}")
        return None

def send_welcome_email_async(email):
    """Send welcome email in background thread"""
    try:
        body = """Thank you for registering with Volunteer Hive , your trusted platform for connecting passionate individuals and impactful organizations. We are excited to have you as part of our growing community.

Whether you are here to contribute your time and skills or to create opportunities that make a difference, we are committed to supporting you every step of the way.

If you have any questions or need help getting started, our team is always ready to assist.

Together, we can build stronger communities and drive meaningful change.

Thank you for being with us.

Warm regards,
The Volunteer Hive Team
"""
        send_email(
            to_email=email,
            subject="Thank you for registering at Volunteer Hub!",
            body=textwrap.dedent(body)
        )
        print(f"✅ Welcome email sent to {email}")
    except Exception as e:
        print(f"⚠️ Email sending failed: {str(e)}")

@google_auth_routes.route('/auth/google/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000")
def google_login():
    if request.method == 'OPTIONS':
        return '', 200
    """
    Handle Google login from frontend - only for existing users
    """
    try:
        data = request.get_json()
        access_token = data.get('accessToken') 
        
        if not access_token:
            return jsonify({'message': 'Google access token is required'}), 400
        

        user_info = get_google_user_info(access_token)
        if not user_info:
            return jsonify({'message': 'Failed to get user info from Google'}), 400
        

        print(f"🔍 Google user info: {user_info}")
        

        google_user_id = user_info['id']
        email = user_info['email']
        
        print(f"🔍 Extracted - Google ID: {google_user_id}, Email: {email}")
        

        user = User.objects(email=email).first()
        
        if not user:
            return jsonify({'message': 'Account not found. Please sign up first.'}), 404
        

        user.google_id = google_user_id
        user.save()
        print(f"✅ Logged in existing user via Google: {email}")
        

        needs_ngo_setup = False
        if user.role == 'admin':
            ngo_exists = NGO.objects(userId=str(user.id)).first()
            needs_ngo_setup = not ngo_exists
            print(f"🔍 NGO setup needed: {needs_ngo_setup}")
        

        access_token_jwt = create_access_token(
            identity={'email': user.email, 'role': user.role, 'id': str(user.id)},
            expires_delta=timedelta(minutes=15)
        )
        refresh_token = create_refresh_token(identity=user.email)
        
        return jsonify({
            'success': True,
            'message': 'Google login successful!',
            'access_token': access_token_jwt,
            'refresh_token': refresh_token,
            'data': {
                'id': str(user.id),
                'email': user.email,
                'role': user.role,
                'needsNGOSetup': needs_ngo_setup
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Google login error: {str(e)}")
        return jsonify({'message': 'Google authentication failed'}), 400

@google_auth_routes.route('/auth/google/signup', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000")
def google_signup():
    if request.method == 'OPTIONS':
        return '', 200
    """
    Handle Google signup with role selection
    """
    try:
        data = request.get_json()
        access_token = data.get('accessToken')  
        role = data.get('role', 'volunteer')
        
        if not access_token:
            return jsonify({'message': 'Google access token is required'}), 400
        
        
        user_info = get_google_user_info(access_token)
        if not user_info:
            return jsonify({'message': 'Failed to get user info from Google'}), 400
        
        print(f"🔍 Google user info: {user_info}")
        
        
        google_user_id = user_info['id']
        email = user_info['email']
        name = user_info.get('name', '')  
        
        print(f"🔍 Extracted - Google ID: {google_user_id}, Email: {email}")
        
        
        if User.objects(email=email).first():
            return jsonify({'message': 'User already exists with this email'}), 400
        
        
        user = User(
            email=email,
            google_id=google_user_id,
            role=role
        )
        user.save()

        
        email_thread = threading.Thread(target=send_welcome_email_async, args=(email,))
        email_thread.daemon = True
        email_thread.start()
        
        print(f"✅ Created new user via Google signup: {email} as {role}")
        

        needs_ngo_setup = False
        if role == 'admin':
            ngo_exists = NGO.objects(userId=str(user.id)).first()
            needs_ngo_setup = not ngo_exists
            print(f"🔍 NGO setup needed: {needs_ngo_setup}")
        

        access_token_jwt = create_access_token(
            identity={'email': user.email, 'role': user.role, 'id': str(user.id)},
            expires_delta=timedelta(minutes=15)
        )
        refresh_token = create_refresh_token(identity=user.email)
        
        return jsonify({
            'success': True,
            'message': 'Google signup successful!',
            'access_token': access_token_jwt,
            'refresh_token': refresh_token,
            'data': {
                'id': str(user.id),
                'email': user.email,
                'role': user.role,
                'needsNGOSetup': needs_ngo_setup
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Google signup error: {str(e)}")
        return jsonify({'message': 'Google signup failed'}), 400 
