from flask import Blueprint, Response
from models import Opportunity
from flask_cors import cross_origin
from bson.json_util import dumps

opportunity_routes = Blueprint('opportunity_routes', __name__)

@opportunity_routes.route('/opportunities', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
def get_opportunities():
    opportunities = Opportunity.objects(status="Open", isDeleted=False)
    output = []

    for opp in opportunities:
        opp_data = opp.to_mongo().to_dict()
        opp_data["_id"] = str(opp.id)

        if opp.startDate:
            opp_data["startDate"] = opp.startDate.isoformat()

        if opp.organization:
            opp_data["organization"] = opp.organization.organizationName
        else:
            opp_data["organization"] = "Unknown Organization"

        output.append(opp_data)

    return Response(dumps(output), mimetype='application/json'), 200


@opportunity_routes.route('/opportunities/<id>', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
def get_single_opportunity(id):
    try:
        opp = Opportunity.objects.get(id=id , isDeleted=False)
        opp_data = opp.to_mongo().to_dict()

        opp_data["_id"] = str(opp.id)

        if opp.startDate:
            opp_data["startDate"] = opp.startDate.isoformat()

        opp_data["title"] = opp.title
        opp_data["description"] = opp.description
        opp_data["location"] = opp.location
        opp_data["tags"] = opp.tags
        opp_data["image"] = opp.image
        opp_data["status"] = opp.status

        if opp.organization:
            ngo = opp.organization
            opp_data["organizationName"] = ngo.organizationName
            opp_data["contactPersonName"] = ngo.contactPersonName
            opp_data["contactEmail"] = ngo.contactEmail
            opp_data["contactPhone"] = ngo.contactPhone
            opp_data["headOfficeAddress"] = ngo.headOfficeAddress
            opp_data["missionStatement"] = ngo.missionStatement
            opp_data["operatingRegions"] = ngo.operatingRegions
        else:
            opp_data["organizationName"] = "Unknown Organization"

        return Response(dumps(opp_data), mimetype='application/json'), 200

    except Opportunity.DoesNotExist:
        return Response(dumps({"message": "Opportunity not found"}), mimetype='application/json'), 404
