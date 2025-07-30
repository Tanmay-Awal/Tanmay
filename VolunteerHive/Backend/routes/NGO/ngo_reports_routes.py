from flask import Blueprint, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import NGO, Opportunity, Application, Task

ngo_reports_routes = Blueprint('ngo_reports_routes', __name__)

@ngo_reports_routes.route('/ngo/reports', methods=['GET'])
@jwt_required()
@cross_origin(origins="http://localhost:3000")
def get_ngo_reports():
    identity = get_jwt_identity()
    ngo = NGO.objects(userId=identity['id']).first()

    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    ngo_id = ngo.id

    total_opportunities = Opportunity.objects(organization=ngo_id).count()

    ngo_opportunity_ids = [str(opp.id) for opp in Opportunity.objects(organization=ngo_id)]
    total_applications = Application.objects(opportunityId__in=ngo_opportunity_ids).count()

    
    active_tasks = Task.objects(ngo_id=ngo_id, verified__ne='Rejected')
    unique_volunteer_emails = set()
    for task in active_tasks:
        unique_volunteer_emails.add(task.user_email)
    total_volunteers = len(unique_volunteer_emails)

    total_tasks_completed = Task.objects(ngo_id=ngo_id, verified="Approved").count()

    return jsonify({
        'success': True,
        'data': {
            'stats': {
                'totalOpportunities': total_opportunities,
                'totalApplications': total_applications,
                'totalVolunteers': total_volunteers,
                'totalTasksCompleted': total_tasks_completed
            },
            'achievements': []
        }
    }), 200
