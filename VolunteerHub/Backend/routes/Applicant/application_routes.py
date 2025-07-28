
from flask import Blueprint, request, jsonify
from models import Application, Opportunity, User,Notification  
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity 
from mongoengine import DoesNotExist


def is_profile_complete(user):
    """
    Check if all volunteer profile fields are filled
    Returns: (is_complete, missing_fields)
    """
    required_fields = {
        'name': user.name,
        'phone': user.phone,
        'bio': user.bio,
        'skills': user.skills,
        'pastExperience': user.pastExperience,
        'address': user.address
    }
    
    missing_fields = []
    for field_name, field_value in required_fields.items():
        if not field_value:
            missing_fields.append(field_name)
        elif isinstance(field_value, list) and len(field_value) == 0:
            missing_fields.append(field_name)
    
    is_complete = len(missing_fields) == 0
    return is_complete, missing_fields

application_routes = Blueprint('application_routes', __name__)


@application_routes.route('/applications', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"])
@jwt_required()
def create_application():
    from models import Notification, NGO  
    data = request.get_json()

    opportunity_id = data.get('opportunityId')
    volunteer_email = data.get('volunteerEmail')
    message = data.get('message', '')

    if not all([opportunity_id, volunteer_email]):
        return jsonify({'message': 'Missing required fields'}), 400

    opp = Opportunity.objects.get(id=opportunity_id)


    identity = get_jwt_identity()
    user_id = identity.get('id')

    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404


    is_complete, missing_fields = is_profile_complete(user)
    if not is_complete:
        missing_fields_str = ", ".join(missing_fields)
        return jsonify({
            'message': f'Profile incomplete. Please complete your profile before applying. Missing: {missing_fields_str}',
            'missing_fields': missing_fields
        }), 400

    volunteer_name = user.name or ""


    app = Application(
        opportunityId=opp,
        opportunityTitle=opp.title,
        volunteerEmail=volunteer_email,
        volunteerName=volunteer_name,
        message=message,
        status='Pending',
        volunteerId=user,
        volunteerPhone=user.phone,
        volunteerBio=user.bio,
        volunteerSkills=user.skills,
        volunteerExperience=user.pastExperience,
        volunteerAddress=user.address
    )
    app.save()


    ngo = opp.organization  
    print("🔍 identity id:", identity['id'])
    print("🔍 Notification ngo_id:", ngo.id) 
    print("🔍 DEBUG: opp.organization =", ngo)

    notif = Notification(
        ngo_id=ngo.userId,
        title="New Volunteer Application",
        message=f"{volunteer_name} has applied for your '{opp.title}' opportunity.",
        type="application"
    )
    notif.save()

    print("✅ Notification created:", notif.id)


    return jsonify({'message': 'Application submitted successfully'}), 201


@application_routes.route('/applications', methods=['GET'])
@cross_origin()
@jwt_required()
def get_applications():
    volunteer_email = request.args.get('email')
    if not volunteer_email:
        return jsonify({'message': 'Missing email'}), 400


    apps = Application.objects(volunteerEmail=volunteer_email, isDeleted=False)

    apps_data = []
    for app in apps:
        try:
            opportunity = app.opportunityId
            ngo = opportunity.organization if opportunity else None

            opp_data = {
                "id": str(opportunity.id),
                "title": opportunity.title,
                "image": opportunity.image,
                "organization": ngo.organizationName if ngo else "Unknown NGO",
                "startDate": str(opportunity.startDate) if opportunity.startDate else "",
                "location": opportunity.location or ""
            }
        except DoesNotExist:
            opp_data = {
                "id": None,
                "title": "Deleted Opportunity",
                "image": "",
                "organization": "Unknown NGO",
                "startDate": "",
                "location": ""
            }

        apps_data.append({
            "id": str(app.id),
            "status": app.status,
            "message": app.message,
            "appliedDate": app.created_at.isoformat() if app.created_at else None,
            "opportunity": opp_data
        })

    return jsonify({'success': True, 'applications': apps_data}), 200



@application_routes.route('/applications/<string:application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(application_id):
    identity = get_jwt_identity()
    user_id = identity.get('id')


    app = Application.objects(id=application_id, volunteerId=user_id).first()
    if not app:
        return jsonify({'message': 'Application not found'}), 404


    app.isDeleted = True
    app.save()
    
    return jsonify({'message': 'Application deleted successfully'}), 200



@application_routes.route('/profile/check-complete', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"])
@jwt_required()
def check_profile_complete():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    is_complete, missing_fields = is_profile_complete(user)
    
    return jsonify({
        'is_complete': is_complete,
        'missing_fields': missing_fields,
        'message': 'Profile complete' if is_complete else f'Profile incomplete. Missing: {", ".join(missing_fields)}'
    }), 200

