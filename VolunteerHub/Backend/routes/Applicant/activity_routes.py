from flask import Blueprint, jsonify
from flask_cors import cross_origin
from models import User, Application, Opportunity, Task
from flask_jwt_extended import jwt_required, get_jwt_identity

activity_routes = Blueprint('activity_routes', __name__)

@activity_routes.route('/activity/my-activity', methods=['GET'])
@cross_origin()
@jwt_required()
def get_my_activity():
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401

    email = current_user['email']

    user = User.objects(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    
    verified_tasks = Task.objects(user_email=email, verified='Approved')
    tasks_completed = verified_tasks.count()
    events_attended = tasks_completed

    ngo_ids = set()
    for task in verified_tasks:
        if task.ngo_id:
            ngo_ids.add(str(task.ngo_id.id))

    ngos_helped = len(ngo_ids)

    report = {
        'tasksCompleted': tasks_completed,
        'eventsAttended': events_attended,
        'ngosHelped': ngos_helped,
        'impactScore': int(user.impactScore) if user.impactScore else 0
    }

    return jsonify({'success': True, 'data': report}), 200
