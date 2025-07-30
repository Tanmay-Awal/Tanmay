

from flask import Blueprint, request, jsonify
from models import Opportunity, NGO, Application
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from bson import ObjectId
from datetime import datetime
import os

ngo_opportunity_routes = Blueprint('ngo_opportunity_routes', __name__)

UPLOAD_FOLDER = "uploads"  



@ngo_opportunity_routes.route('/ngo/opportunities', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def create_opportunity():

    UPLOAD_FOLDER = "uploads"


    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    identity = get_jwt_identity()
    user_id = identity['id'] 


    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    title = request.form.get('title')
    description = request.form.get('description')
    start_date = request.form.get('startDate')
    location = request.form.get('location')
    tags = request.form.getlist('tags[]')  
    status = request.form.get('status', 'Open')


    image = None
    if 'image' in request.files:
        image_file = request.files['image']
        if image_file.filename != "":
            filename = image_file.filename
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(save_path)
            image = filename


    opportunity = Opportunity(
        title=title,
        description=description,
        organization=ngo,  
        startDate=datetime.strptime(start_date, "%Y-%m-%d") if start_date else None,
        location=location,
        tags=tags,
        image=image,
        status=status
    )
    opportunity.save()

    return jsonify({'success': True, 'message': 'Opportunity created!', 'id': str(opportunity.id)}), 201


@ngo_opportunity_routes.route('/ngo/opportunities', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def list_opportunities():
    identity = get_jwt_identity()
    user_id = identity['id']


    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404


    opps = Opportunity.objects(organization=ngo.id, isDeleted=False)


    result = []
    for opp in opps:
        result.append({
            'id': str(opp.id),
            'title': opp.title,
            'description': opp.description,
            'startDate': opp.startDate.strftime('%Y-%m-%d') if opp.startDate else "",
            'location': opp.location,
            'tags': opp.tags,
            'image': opp.image,
            'status': opp.status
        })

    return jsonify({'success': True, 'data': result}), 200




@ngo_opportunity_routes.route('/ngo/opportunities/<opp_id>', methods=['PUT'])
@jwt_required()
def update_opportunity(opp_id):
    identity = get_jwt_identity()
    user_id = identity['id']

    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    opp = Opportunity.objects(id=ObjectId(opp_id), organization=ngo).first()
    if not opp:
        return jsonify({'message': 'Opportunity not found'}), 404

    data = request.form
    opp.title = data.get('title', opp.title)
    opp.description = data.get('description', opp.description)
    start_date = data.get('startDate')
    if start_date:
        opp.startDate = datetime.strptime(start_date, "%Y-%m-%d")
    opp.location = data.get('location', opp.location)
    opp.tags = request.form.getlist('tags[]')
    opp.status = data.get('status', opp.status)

    if 'image' in request.files:
        image_file = request.files['image']
        if image_file.filename != "":
            filename = image_file.filename
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(save_path)
            opp.image = filename

    opp.save()
    return jsonify({'success': True, 'message': 'Opportunity updated!'}), 200



@ngo_opportunity_routes.route('/ngo/opportunities/<opp_id>', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_single_opportunity(opp_id):
    identity = get_jwt_identity()
    user_id = identity['id']

    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    opp = Opportunity.objects(id=ObjectId(opp_id), organization=ngo.id).first()
    if not opp:
        return jsonify({'message': 'Opportunity not found'}), 404

    result = {
        'id': str(opp.id),
        'title': opp.title,
        'description': opp.description,
        'startDate': opp.startDate.strftime('%Y-%m-%d') if opp.startDate else "",
        'location': opp.location,
        'tags': opp.tags,
        'image': opp.image,
        'status': opp.status,
        'createdDate': opp.created_at.strftime('%Y-%m-%d') if opp.created_at else "",
        'postedBy': ngo.contactPersonName,
        'organizationName': ngo.organizationName,
        'contactPersonName': ngo.contactPersonName,
        'contactEmail': ngo.contactEmail,
        'contactPhone': ngo.contactPhone,
        'headOfficeAddress': ngo.headOfficeAddress,
        'operatingRegions': ngo.operatingRegions,
        'missionStatement': ngo.missionStatement
    }

    return jsonify({'success': True, 'data': result}), 200





@ngo_opportunity_routes.route('/ngo/opportunities/<opp_id>', methods=['DELETE'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def delete_opportunity(opp_id):
    identity = get_jwt_identity()
    user_id = identity['id']

    ngo = NGO.objects(userId=user_id).first()
    if not ngo:
        return jsonify({'message': 'NGO not found'}), 404

    opp = Opportunity.objects(id=ObjectId(opp_id), organization=ngo.id).first()
    if not opp:
        return jsonify({'message': 'Opportunity not found'}), 404
    

    opp.isDeleted = True
    opp.save()

    return jsonify({'success': True, 'message': 'Opportunity soft deleted!'}), 200


