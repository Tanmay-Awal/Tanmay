from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Task, NGO, User, Notification

ngo_tasks_routes = Blueprint('ngo_tasks_routes', __name__)

@ngo_tasks_routes.route('/ngo/tasks', methods=['GET'])
@jwt_required()
def get_ngo_tasks():
    identity = get_jwt_identity()
    ngo = NGO.objects(userId=identity['id']).first()
    if not ngo:
        return jsonify({"error": "NGO not found"}), 404


    tasks = Task.objects(ngo_id=ngo.id, isDeletedByNGO=False)
    
    print("✅ NGO ID:", ngo.id)
    print("✅ Found tasks count:", len(tasks))
    for t in tasks:
        print("👉 TASK:", t.title, "| ngo_id:", t.ngo_id, "| volunteer:", t.user_email)

    data = []
    for task in tasks:

        volunteer = User.objects(email=task.user_email).first()
        volunteer_name = volunteer.name if volunteer else task.user_email
        
        data.append({
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "startDate": task.start_date.isoformat() if task.start_date else None,
            "location": task.location,
            "status": task.status.lower(),
            "volunteerName": volunteer_name,  
            "image": task.image,
            "verified": task.verified,
            "verify_message": task.verify_message,
        })

    print("✅ FINAL DATA:", data)
    return jsonify({"data": data}), 200


@ngo_tasks_routes.route('/ngo/tasks/<string:task_id>', methods=['GET'])
@jwt_required()
def get_task_for_verification(task_id):

    identity = get_jwt_identity()
    ngo = NGO.objects(userId=identity['id']).first()
    if not ngo:
        return jsonify({"error": "NGO not found"}), 404

    task = Task.objects(id=task_id, ngo_id=ngo.id).first() 
    if not task:
        return jsonify({"error": "Task not found"}), 404

    volunteer = User.objects(email=task.user_email).first()

    task_data = {
        "id": str(task.id),
        "title": task.title,
        "description": task.description,
        "startDate": task.start_date.isoformat() if task.start_date else None,
        "location": task.location,
        "status": task.status.lower(),
        "volunteer": {
            "name": volunteer.name if volunteer else None,
            "email": volunteer.email if volunteer else task.user_email,
            "phone": volunteer.phone if volunteer else None
        },
        "image": task.image,
        "duration": task.duration,
        "verified": task.verified,
        "verify_message": task.verify_message,
        "tags": task.tags if task.tags else []
    }

    return jsonify({"data": task_data}), 200


@ngo_tasks_routes.route('/ngo/tasks/<string:task_id>/verify', methods=['PUT'])
@jwt_required()
def verify_task(task_id):
    identity = get_jwt_identity()
    ngo = NGO.objects(userId=identity['id']).first()
    if not ngo:
        return jsonify({"error": "NGO not found"}), 404

    data = request.get_json()
    action = data.get('action')
    message = data.get('message')
    impact_score = int(data.get('impactScore', 0))

    task = Task.objects(id=task_id, ngo_id=ngo.id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    if action == 'approve':
        task.status = 'verified'
        task.verified = 'Approved'
        task.impact_score = impact_score 
        notif_title = "Task Approved"
    elif action == 'reject':
        task.status = 'rejected'
        task.verified = 'Rejected'
        task.impact_score = 0  
        notif_title = "Task Rejected"
    else:
        return jsonify({"error": "Invalid action"}), 400

    task.verify_message = message
    task.save()

    volunteer = User.objects(email=task.user_email).first()
    if volunteer:
        if action == 'approve':
            current_score = int(volunteer.impactScore or 0)
            volunteer.impactScore = str(current_score + impact_score)
            volunteer.save()

        Notification(
            user_id=volunteer,
            title=notif_title,
            message=f"Your task '{task.title}' has been {action}d. {message or ''}",
            type='success' if action == 'approve' else 'warning'
        ).save()

    return jsonify({"message": f"Task {action}d successfully."}), 200


@ngo_tasks_routes.route('/ngo/tasks/<string:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    print(f"🗑️ DELETE route called with task_id: {task_id}") 
    identity = get_jwt_identity()
    ngo = NGO.objects(userId=identity['id']).first()
    if not ngo:
        return jsonify({"error": "NGO not found"}), 404

    task = Task.objects(id=task_id, ngo_id=ngo.id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    task.isDeletedByNGO = True
    task.save()

    return jsonify({"message": "Task soft-deleted successfully."}), 200