

from flask import Blueprint, request, jsonify
from models import Notification
from bson import ObjectId
from flask_jwt_extended import jwt_required

notifications_routes = Blueprint('notifications_routes', __name__)


@notifications_routes.route('/notifications/<user_id>', methods=['GET'])
@jwt_required()
def get_notifications(user_id):
    from models import User
    print(f"🔍 Fetching notifications for user_id: {user_id}")
    

    user = User.objects(id=user_id).first()
    if not user:
        print(f"❌ User not found with ID: {user_id}")
        return jsonify({'success': True, 'data': []}), 200
    
    print(f"✅ Found user: {user.email}")
    notifications = Notification.objects(user_id=user).order_by('-time')
    print(f"🔍 Found {notifications.count()} notifications")
    result = []
    for n in notifications:
        time_iso = n.time.isoformat() + 'Z' if n.time else None
        print(f"🔍 Notification {n.id} - Original time: {n.time}")
        print(f"🔍 Notification {n.id} - ISO format with Z: {time_iso}")
        
        result.append({
            'id': str(n.id),
            'title': n.title,
            'message': n.message,
            'type': n.type,
            'read': n.read,
            'time': time_iso
        })
    print(f"🔍 Returning {len(result)} notifications")
    return jsonify({'success': True, 'data': result}), 200


@notifications_routes.route('/notifications/<notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notif_id):
    notif = Notification.objects(id=notif_id).first()
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404
    notif.read = True
    notif.save()
    return jsonify({'success': True, 'message': 'Marked as read'}), 200


@notifications_routes.route('/notifications/mark_all_read/<user_id>', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read(user_id):
    Notification.objects(user_id=user_id, read=False).update(read=True)
    return jsonify({'success': True, 'message': 'All marked as read'}), 200


@notifications_routes.route('/notifications/<notif_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notif_id):
    from bson import ObjectId
    notif = Notification.objects(id=ObjectId(notif_id)).first()
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404

    notif.delete()
    return jsonify({'success': True, 'message': 'Deleted'}), 200

