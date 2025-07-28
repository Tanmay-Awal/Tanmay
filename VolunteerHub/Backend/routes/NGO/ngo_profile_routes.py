

print("✅ ngo_profile_routes.py LOADED!")

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import NGO, User   # ✅ Import User too

ngo_profile_routes = Blueprint('ngo_profile_routes', __name__)


@ngo_profile_routes.route('/ngo/profile', methods=['GET'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def get_ngo_profile():
    identity = get_jwt_identity()


    user_id = identity['id']


    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO profile not found'}), 404

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


@ngo_profile_routes.route('/ngo/profile', methods=['PUT'])
@jwt_required()
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def update_ngo_profile():
    identity = get_jwt_identity()
    email = identity['email']


    user = User.objects(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404


    ngo = NGO.objects(userId=str(user.id)).first()
    if not ngo:
        return jsonify({'message': 'NGO profile not found'}), 404

    data = request.get_json()


    for field in [
        'organizationName', 'contactPersonName', 'contactEmail',
        'contactPhone', 'headOfficeAddress', 'operatingRegions',
        'googleMapsLink', 'missionStatement', 'website',
        'facebook', 'instagram', 'linkedin'
    ]:
        if field in data:
            setattr(ngo, field, data[field])

    ngo.save()

    return jsonify({'success': True, 'message': 'NGO profile updated successfully!'}), 200
