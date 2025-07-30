
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import Notification
from bson import ObjectId

ngo_notifications_routes = Blueprint('ngo_notifications_routes', __name__)


@ngo_notifications_routes.route('/ngo/notifications', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def get_ngo_notifications():
    identity = get_jwt_identity()
    ngo_id = identity['id']

    notifications = Notification.objects(ngo_id=ngo_id).order_by('-time')
    result = []
    for n in notifications:
        time_iso = n.time.isoformat() + 'Z' if n.time else None
        print(f"🔍 NGO Notification {n.id} - Original time: {n.time}")
        print(f"🔍 NGO Notification {n.id} - ISO format with Z: {time_iso}")
        
        result.append({
            'id': str(n.id),
            'title': n.title,
            'message': n.message,
            'type': n.type,
            'read': n.read,
            'time': time_iso
        })

    return jsonify({'data': result}), 200



@ngo_notifications_routes.route('/ngo/notifications/<notif_id>/read', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def mark_ngo_notification_read(notif_id):
    notif = Notification.objects(id=ObjectId(notif_id)).first()
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404

    notif.read = True
    notif.save()
    return jsonify({'message': 'Notification marked as read'}), 200



@ngo_notifications_routes.route('/ngo/notifications/mark_all_read', methods=['PUT'])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def mark_all_ngo_notifications_read():
    identity = get_jwt_identity()
    ngo_id = identity['id']

    Notification.objects(ngo_id=ngo_id, read=False).update(read=True)
    return jsonify({'message': 'All NGO notifications marked as read'}), 200


@ngo_notifications_routes.route('/ngo/notifications/<notif_id>', methods=['DELETE'])
@jwt_required()
def delete_ngo_notification(notif_id):
    from bson import ObjectId
    notif = Notification.objects(id=ObjectId(notif_id)).first()
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404

    notif.delete()
    return jsonify({'success': True, 'message': 'Deleted'}), 200

