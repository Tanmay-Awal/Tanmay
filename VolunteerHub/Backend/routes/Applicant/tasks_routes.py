from flask import Blueprint, request, jsonify
from models import Task, User, Notification
from bson import ObjectId
from mongoengine.errors import DoesNotExist
from flask_jwt_extended import jwt_required

tasks_routes = Blueprint('tasks_routes', __name__)


@tasks_routes.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_email = request.args.get('email')
    tasks = Task.objects(user_email=user_email, isDeletedByVolunteer__ne=True)


    result = []
    for task in tasks:
        print("✅ TASK:", task.to_json())  

        result.append({
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "start_date": task.start_date.isoformat() if task.start_date else None,
            "location": task.location,
            "duration": task.duration,
            "verified": task.verified,
            "verify_message": task.verify_message,
            "tags": task.tags,
            "image": task.image,
        })

    print("✅ FINAL TASKS RESULT:", result)  

    return jsonify({"data": result}), 200



@tasks_routes.route('/tasks/<task_id>/start', methods=['PUT'])
@jwt_required()
def start_task(task_id):
    try:
        task = Task.objects.get(id=ObjectId(task_id))
        task.status = "In Progress"
        task.save()
        return jsonify({"success": True, "message": "Task marked In Progress"}), 200
    except DoesNotExist:
        return jsonify({"error": "Task not found"}), 404



@tasks_routes.route('/tasks/<task_id>/complete', methods=['PUT'])
@jwt_required()
def complete_task(task_id):
    try:
        task = Task.objects.get(id=ObjectId(task_id))
        task.status = "Completed"
        task.save()
        return jsonify({"success": True, "message": "Task marked Completed"}), 200
    except DoesNotExist:
        return jsonify({"error": "Task not found"}), 404


@tasks_routes.route('/tasks/<task_id>/verify', methods=['PUT'])
@jwt_required()
def verify_task(task_id):
    data = request.get_json()
    new_verification = data.get("verified")
    message = data.get("message")

    if new_verification not in ["Approved", "Rejected"]:
        return jsonify({"error": "Invalid verification status"}), 400

    task = Task.objects.get(id=ObjectId(task_id))
    task.verified = new_verification
    task.admin_verification_message = message
    task.save()

    # Notify volunteer
    user = User.objects(email=task.user_email).first()
    notif = Notification(
        user_id=user,
        title=f"Task {new_verification}",
        message=f"Your task was {new_verification}: {message}",
        type="task"
    )
    notif.save()

    return jsonify({"success": True}), 200


@tasks_routes.route('/tasks/<task_id>', methods=['GET'])
@jwt_required()
def get_single_task(task_id):
    try:
        task = Task.objects.get(id=ObjectId(task_id))

        print("✅ TASK OBJECT:", task.to_json())  

        result = {
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "start_date": task.start_date.isoformat() if task.start_date else None,
            "location": task.location,
            "duration": task.duration,
            "verified": task.verified,
            "verify_message": task.verify_message,
            "tags": task.tags,
            "image": task.image,
        }


        if task.ngo_id:
            ngo = task.ngo_id
            print("✅ LINKED NGO:", ngo.to_json())  

            result.update({
                "organizationName": ngo.organizationName,
                "contactPersonName": ngo.contactPersonName,
                "contactEmail": ngo.contactEmail,
                "contactPhone": ngo.contactPhone,
                "headOfficeAddress": ngo.headOfficeAddress,
                "operatingRegions": ngo.operatingRegions,
                "missionStatement": ngo.missionStatement,
            })
        else:
            result.update({
                "organizationName": None,
                "contactPersonName": None,
                "contactEmail": None,
                "contactPhone": None,
                "headOfficeAddress": None,
                "operatingRegions": None,
                "missionStatement": None,
            })

        print("✅ FINAL SINGLE TASK RESULT:", result)  

        return jsonify(result), 200

    except DoesNotExist:
        print("❌ TASK NOT FOUND:", task_id)  
        return jsonify({"error": "Task not found"}), 404


@tasks_routes.route('/tasks/<task_id>', methods=['DELETE'])
@jwt_required()
def soft_delete_task(task_id):
    try:
        task = Task.objects.get(id=ObjectId(task_id))
        task.isDeletedByVolunteer = True
        task.save()
        return jsonify({"success": True, "message": "Task soft-deleted."}), 200
    except DoesNotExist:
        return jsonify({"error": "Task not found"}), 404
