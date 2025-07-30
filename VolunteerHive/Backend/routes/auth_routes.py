from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models import User, NGO, OTP
import re
import bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from datetime import datetime, timedelta
from email_service import send_email 
import textwrap
import random
import threading
import time

auth_routes = Blueprint('auth_routes', __name__)

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def send_welcome_email_async(email):
    """Send welcome email in background thread"""
    try:
        body = """Thank you for registering with Volunteer Hub , your trusted platform for connecting passionate individuals and impactful organizations. We are excited to have you as part of our growing community.

Whether you are here to contribute your time and skills or to create opportunities that make a difference, we are committed to supporting you every step of the way.

If you have any questions or need help getting started, our team is always ready to assist.

Together, we can build stronger communities and drive meaningful change.

Thank you for being with us.

Warm regards,
The Volunteer Hub Team
"""
        send_email(
            to_email=email,
            subject="Thank you for registering at Volunteer Hub!",
            body=textwrap.dedent(body)
        )
        print(f"✅ Welcome email sent to {email}")
    except Exception as e:
        print(f"⚠️ Email sending failed: {str(e)}")

@auth_routes.route('/auth/register', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([email, role]):
        return jsonify({'message': 'Email and role are required'}), 400
    
    if not password:
        return jsonify({'message': 'Password is required for email registration'}), 400

    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, email):
        return jsonify({'message': 'Invalid email format'}), 400

    existing_user = User.objects(email=email).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = hash_password(password)
    user = User(
        email=email, 
        password=hashed_password, 
        role=role,
        name="",  
        phone="",
        bio="",
        skills=[],
        pastExperience=[],
        totalHours="0",
        completedTasks="0",
        badges="",
        impactScore="0",
        address=""
    )
    user.save()

    print("✅ Registered user ID:", str(user.id))

    email_thread = threading.Thread(target=send_welcome_email_async, args=(email,))
    email_thread.daemon = True
    email_thread.start()

    return jsonify({
        'success': True,
        'data': {
            'id': str(user.id),  
            'email': email,
            'role': role,
            'needsNGOSetup': True if role == 'admin' else False
        }
    }), 200



@auth_routes.route('/auth/login', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([email, password, role]):
        return jsonify({'message': 'All fields are required'}), 400

    user = User.objects(email=email, role=role).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not verify_password(password, user.password):
        return jsonify({'message': 'Incorrect password'}), 401

    access_token = create_access_token(
        identity={'email': user.email, 'role': user.role, 'id': str(user.id)},
        expires_delta=timedelta(minutes=15)
    )
    refresh_token = create_refresh_token(identity=user.email)

    return jsonify({
        'success': True,
        'message': 'Login successful!',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'data': {
            'id': str(user.id),
            'email': user.email,
            'role': user.role
        }
    }), 200


@auth_routes.route('/auth/refresh', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = User.objects(email=identity).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    new_access_token = create_access_token(
        identity={'email': user.email, 'role': user.role, 'id': str(user.id)},
        expires_delta=timedelta(minutes=15)
    )

    return jsonify({'success': True, 'access_token': new_access_token}), 200


@auth_routes.route('/auth/logout', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def logout():
    return jsonify({'success': True, 'message': 'Logged out'}), 200




@auth_routes.route('/user/profile', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'success': True,
        'data': {
            'email': user.email,
            'name': user.name or "",
            'phone': user.phone or "",
            'address': user.address or "",
            'skills': user.skills,
            'bio': user.bio,
            'pastExperience': user.pastExperience
        }
    }), 200



@auth_routes.route('/user/profile', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def update_basic_profile():
    data = request.get_json()
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    user.address = data.get('address', user.address)
    user.save()

    return jsonify({'success': True, 'message': 'Profile updated'}), 200




@auth_routes.route('/user/profile/details', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def update_profile_details():
    data = request.get_json()
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.skills = data.get('skills', user.skills)
    user.bio = data.get('bio', user.bio)
    user.pastExperience = data.get('pastExperience', user.pastExperience)
    user.save()

    return jsonify({'success': True, 'message': 'Profile details updated'}), 200




@auth_routes.route('/admin/volunteer-profile/<volunteer_id>', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_volunteer_profile(volunteer_id):
    user = User.objects(id=volunteer_id).first()
    if not user:
        return jsonify({'message': 'Volunteer not found'}), 404

    return jsonify({
        'success': True,
        'data': {
            'email': user.email,
            'name': user.name or "",
            'phone': user.phone or "",
            'address': user.address or "",
            'skills': user.skills,
            'bio': user.bio,
            'pastExperience': user.pastExperience
        }
    }), 200





@auth_routes.route('/settings/delete-account', methods=['DELETE'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def delete_account():
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    user.delete()
    return jsonify({'success': True, 'message': 'Account deleted successfully'}), 200




@auth_routes.route('/ngo/details', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def save_ngo_details():
    data = request.get_json()

    if not data.get('userId'):
        return jsonify({'message': 'userId is required'}), 400

    required_fields = [
        'organizationName', 'contactPersonName', 'contactEmail',
        'contactPhone', 'headOfficeAddress', 'operatingRegions',
        'missionStatement'
    ]
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    ngo = NGO(
        organizationName=data.get('organizationName'),
        contactPersonName=data.get('contactPersonName'),
        contactEmail=data.get('contactEmail'),
        contactPhone=data.get('contactPhone'),
        headOfficeAddress=data.get('headOfficeAddress'),
        operatingRegions=data.get('operatingRegions'),
        googleMapsLink=data.get('googleMapsLink', ''),
        missionStatement=data.get('missionStatement'),
        website=data.get('website', ''),
        facebook=data.get('facebook', ''),
        instagram=data.get('instagram', ''),
        linkedin=data.get('linkedin', ''),
        userId=data.get('userId')  
    )
    ngo.save()

    return jsonify({'success': True, 'message': 'NGO details saved!'}), 200



@auth_routes.route('/user/update-email', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def update_email():
    data = request.get_json()
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    new_email = data.get('newEmail')
    if not new_email:
        return jsonify({'success': False, 'message': 'New email is required'}), 400

    if User.objects(email=new_email).first():
        return jsonify({'success': False, 'message': 'Email already in use'}), 400

    user.email = new_email
    user.save()

    return jsonify({'success': True, 'message': 'Email updated successfully'}), 200


@auth_routes.route('/user/update-password', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def update_password():
    data = request.get_json()
    identity = get_jwt_identity()
    email = identity['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not old_password or not new_password:
        return jsonify({'success': False, 'message': 'Both old and new passwords are required'}), 400

    if not verify_password(old_password, user.password):
        return jsonify({'success': False, 'message': 'Current password is incorrect'}), 401

    user.password = hash_password(new_password)
    user.save()

    return jsonify({'success': True, 'message': 'Password updated successfully'}), 200




@auth_routes.route('/auth/forgot-password', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'Email not registered'}), 404

    if not user.password:
        return jsonify({'success': False, 'message': 'This account was created with Google. Please use Google Sign-In.'}), 400

    code = str(random.randint(1000, 9999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    OTP.objects(email=email).delete()
    otp = OTP(email=email, code=code, expires_at=expires_at)
    otp.save()

    send_email(
        to_email=email,
        subject="Your Password Reset Code",
        body=f"Your password reset code is: {code}\nThis code will expire in 10 minutes."
    )
    return jsonify({'success': True, 'message': 'OTP sent to registered email'}), 200



@auth_routes.route('/auth/verify-otp', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if not email or not code:
        return jsonify({'success': False, 'message': 'Email and code are required'}), 400
    otp = OTP.objects(email=email, code=code, verified=False).first()
    if not otp:
        return jsonify({'success': False, 'message': 'Invalid code'}), 400
    if otp.expires_at < datetime.utcnow():
        return jsonify({'success': False, 'message': 'Code expired'}), 400
    otp.verified = True
    otp.save()
    return jsonify({'success': True, 'message': 'Code verified'}), 200



@auth_routes.route('/auth/resend-otp', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def resend_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'Email not registered'}), 404

    code = str(random.randint(1000, 9999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    OTP.objects(email=email).delete()
    otp = OTP(email=email, code=code, expires_at=expires_at)
    otp.save()
    send_email(
        to_email=email,
        subject="Your Password Reset Code (Resent)",
        body=f"Your new password reset code is: {code}\nThis code will expire in 10 minutes."
    )
    return jsonify({'success': True, 'message': 'OTP resent to registered email'}), 200




@auth_routes.route('/auth/reset-password', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('newPassword')
    if not email or not code or not new_password:
        return jsonify({'success': False, 'message': 'Email, code, and new password are required'}), 400
    otp = OTP.objects(email=email, code=code, verified=True).first()
    if not otp:
        return jsonify({'success': False, 'message': 'Invalid or unverified code'}), 400
    if otp.expires_at < datetime.utcnow():
        return jsonify({'success': False, 'message': 'Code expired'}), 400
    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    user.password = hash_password(new_password)
    user.save()
    otp.delete()
    return jsonify({'success': True, 'message': 'Password reset successful'}), 200



@auth_routes.route('/auth/check-email-type', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def check_email_type():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    user = User.objects(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'Email not registered'}), 404
    if not user.password:
        return jsonify({'success': False, 'message': 'This account was created with Google. Please use Google Sign-In.'}), 400
    return jsonify({'success': True, 'message': 'Manual user'}), 200



