

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import NGO, User

ngo_settings_routes = Blueprint('ngo_settings_routes', __name__)


@ngo_settings_routes.route('/ngo/settings/profile', methods=['GET'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def get_settings_profile():
    identity = get_jwt_identity()
    user_id = identity['id']

    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'success': True, 'data': {}}), 200


    return jsonify({
        'success': True,
        'data': {
            'organizationName': ngo.organizationName,
            'contactPersonName': ngo.contactPersonName,
            'contactEmail': ngo.contactEmail,
            'contactPhone': ngo.contactPhone,
            'headOfficeAddress': ngo.headOfficeAddress,
            'operatingRegions': ngo.operatingRegions,
            'googleMapsLink': ngo.googleMapsLink,
            'missionStatement': ngo.missionStatement,
            'website': ngo.website,
            'facebook': ngo.facebook,
            'instagram': ngo.instagram,
            'linkedin': ngo.linkedin
        }
    }), 200



@ngo_settings_routes.route('/ngo/settings/email', methods=['PUT'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def update_email():
    identity = get_jwt_identity()
    user_id = identity['id']

    data = request.get_json()
    new_email = data.get('newEmail')

    if not new_email:
        return jsonify({'message': 'New email is required'}), 400

    user = User.objects(id=user_id).first()
    if user:
        user.email = new_email
        user.save()

    return jsonify({'success': True, 'message': 'Email updated successfully'}), 200




@ngo_settings_routes.route('/ngo/settings/password', methods=['PUT'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def update_password():
    identity = get_jwt_identity()
    user_id = identity['id']

    data = request.get_json()
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not old_password or not new_password:
        return jsonify({'success': False, 'message': 'Both old and new passwords are required'}), 400

    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    print("DEBUG — password stored in DB:", user.password)


    from routes.auth_routes import verify_password, hash_password

    print("DEBUG — password stored in DB:", user.password)
    print("DEBUG — old password entered:", old_password)
    print("DEBUG — does it match:", verify_password(old_password, user.password))


    if not verify_password(old_password, user.password):
        return jsonify({'success': False, 'message': 'Current password is incorrect'}), 401


    user.password = hash_password(new_password)
    user.save()

    return jsonify({'success': True, 'message': 'Password updated successfully'}), 200



@ngo_settings_routes.route('/ngo/settings/delete-account', methods=['DELETE'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def delete_ngo_account():
    identity = get_jwt_identity()
    email = identity['email']

    data = request.get_json()
    confirmation = data.get('confirmation', '')

    if confirmation != "DELETE":
        return jsonify({'message': 'You must confirm deletion by typing DELETE.'}), 400

    ngo = NGO.objects(contactEmail=email).first()
    user = User.objects(email=email).first()

    if ngo:
        ngo.delete()
    if user:
        user.delete()

    return jsonify({'success': True, 'message': 'Account deleted successfully'}), 200


