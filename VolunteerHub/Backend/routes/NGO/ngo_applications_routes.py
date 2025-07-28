

from flask import Blueprint, request, jsonify
from models import Application, Opportunity, NGO,Notification,User,Task
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from bson import ObjectId

ngo_applications_routes = Blueprint('ngo_applications_routes', __name__)


@ngo_applications_routes.route('/ngo/applications', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_applications():
    identity = get_jwt_identity()
    user_id = identity['id']


    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404


    opportunities = Opportunity.objects(organization=ngo)

    opp_ids = [opp.id for opp in opportunities]

    applications = Application.objects(
        opportunityId__in=opp_ids,
        isDeleted=False 
    )


    result = []
    for app in applications:
        result.append({
            'id': str(app.id),
            'opportunityId': str(app.opportunityId.id),
            'opportunityTitle': app.opportunityTitle,
            'volunteerEmail': app.volunteerEmail,
            'volunteerName': app.volunteerName,
            'status': app.status.lower(),
            'appliedDate': app.created_at.isoformat() if app.created_at else None,
            'volunteerId': str(app.volunteerId.id) if app.volunteerId else None 
        })

    return jsonify({'data': result}), 200


@ngo_applications_routes.route('/ngo/applications/<app_id>', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_single_application(app_id):
    identity = get_jwt_identity()
    user_id = identity['id']


    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    app = Application.objects(id=ObjectId(app_id)).first()
    if not app:
        return jsonify({'message': 'Application not found'}), 404


    opp = Opportunity.objects(id=app.opportunityId.id, organization=ngo).first()

    if not opp:
        return jsonify({'message': 'Unauthorized'}), 403

    return jsonify({
        'data': {
            'id': str(app.id),
            'volunteerId': str(app.volunteerId.id) if app.volunteerId else None,
            'opportunityId': str(app.opportunityId.id) if app.opportunityId else None,
            'status': app.status,
            'volunteerEmail': app.volunteerEmail,
            'volunteerName': app.volunteerName,
            'appliedDate': app.created_at.isoformat() if app.created_at else None
        }
    }), 200


@ngo_applications_routes.route('/ngo/applications/<app_id>/status', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def update_application_status(app_id):
    print(f"🚀 UPDATE STATUS CALLED with app_id: {app_id}")
    
    identity = get_jwt_identity()
    ngo_id = identity['id']
    print(f"🔍 NGO ID: {ngo_id}")

    app = Application.objects(id=ObjectId(app_id)).first()
    if not app:
        print("❌ Application not found")
        return jsonify({'message': 'Application not found'}), 404

    print(f"✅ Found application: {app.volunteerEmail}")

    ngo = NGO.objects(userId=ngo_id).first()
    opp = Opportunity.objects(id=app.opportunityId.id, organization=ngo).first()

    if not opp:
        print("❌ Unauthorized - opportunity not found for this NGO")
        return jsonify({'message': 'Unauthorized'}), 403

    print(f"✅ Found opportunity: {opp.title}")

    data = request.get_json()
    new_status = data.get('status')
    print(f"🔍 New status: {new_status}")
    
    if new_status not in ['Pending', 'Approved', 'Rejected']:
        print(f"❌ Invalid status: {new_status}")
        return jsonify({'message': 'Invalid status'}), 400

    app.status = new_status
    app.save()
    print(f"✅ Application status updated to: {new_status}")

    volunteer = User.objects(email=app.volunteerEmail).first()

    if volunteer:
        print(f"✅ Found volunteer: {volunteer.email}")
        
        if new_status.lower() == "approved":
            print(f"🔔 Creating approval notification for volunteer: {volunteer.email}")
            notif = Notification(
                user_id=volunteer,
                title="Application Approved!",
                message=f"Congratulations! You have been selected for '{opp.title}' Opportunity. We will contact you soon.",
                type="application"
            )
            notif.save()
            print(f"✅ Notification created with ID: {notif.id}")
            print("OPP IMAGE:", opp.image)

            try:
                task = Task(
                    title=opp.title,
                    description=opp.description or "",
                    user_email=volunteer.email,
                    start_date=opp.startDate,
                    location=opp.location,
                    verified="Pending",
                    status="Pending",
                    tags=opp.tags,       
                    image=opp.image
                )
                print("Serving task image:", task.image)
                task.ngo_id = opp.organization 
                task.save()
                print(f"✅ Task created for {volunteer.email} with opp ID {opp.id}")
            except Exception as e:
                print(f"❌ Failed to create task: {e}")


        elif new_status.lower() == "rejected":
            print(f"🔔 Creating rejection notification for volunteer: {volunteer.email}")
            notif = Notification(
                user_id=volunteer,
                title="Application Rejected",
                message=f"Unfortunately, you have not been selected for '{opp.title}' Opportunity. Better luck next time!",
                type="application"
            )
            notif.save()
            print(f"✅ Rejection notification created")

    else:
        print(f"❌ Volunteer not found for email: {app.volunteerEmail}")
        print(f"🔍 Available users with similar emails:")
        all_users = User.objects()
        for user in all_users:
            if app.volunteerEmail.lower() in user.email.lower() or user.email.lower() in app.volunteerEmail.lower():
                print(f"   - {user.email} (ID: {user.id})")
        

        if app.volunteerId:
            print(f"🔍 Trying to find by volunteerId: {app.volunteerId}")
            volunteer_by_id = app.volunteerId
            if volunteer_by_id:
                print(f"✅ Found volunteer by ID: {volunteer_by_id.email}")
                volunteer = volunteer_by_id
                

                if new_status.lower() == "approved":
                    print(f"🔔 Creating approval notification for volunteer: {volunteer.email}")
                    notif = Notification(
                        user_id=volunteer,
                        title="Application Approved!",
                        message=f"Congratulations! You have been selected for '{opp.title}' Opportunity. We will contact you soon.",
                        type="application"
                    )
                    notif.save()
                    print(f"✅ Notification created with ID: {notif.id}")

                    try:
                        task = Task(
                            title=opp.title,
                            description=opp.description or "",
                            user_email=volunteer.email,
                            start_date=opp.startDate,
                            location=opp.location,
                            verified="Pending",
                            status="Pending",
                            tags=opp.tags,
                            image=opp.image
                        )
                        task.ngo_id = opp.organization
                        task.save()
                        print(f"✅ Task created for {volunteer.email} with opp ID {opp.id}")
                    except Exception as e:
                        print(f"❌ Failed to create task: {e}")
            else:
                print(f"❌ Volunteer not found by ID either")

    print("✅ Returning success response")
    return jsonify({'message': 'Application status updated'}), 200

@ngo_applications_routes.route('/ngo/applications/<string:app_id>', methods=['DELETE'])
@jwt_required()
def delete_application(app_id):
    identity = get_jwt_identity()
    application = Application.objects(id=app_id).first()
    if not application:
        return jsonify({'success': False, 'message': 'Application not found'}), 404

    ngo = NGO.objects(userId=identity['id']).first()
    opp = Opportunity.objects(id=application.opportunityId.id, organization=ngo).first()
    if not opp:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403


    application.isDeleted = True
    application.save()

    return jsonify({'success': True, 'message': 'Application marked as deleted'}), 200
