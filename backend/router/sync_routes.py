from flask import Blueprint, request, jsonify
from services.auth_services import decode_jwt_token
import jwt
import os

from services.sync_services import (
    sync_tasks,
    sync_user_data,
    sync_user_settings,
)

sync_bp = Blueprint('sync', __name__)
            
@sync_bp.route('/settings', methods=['POST'])
def sync_settings():
    """
    Endpoint to sync user settings.
    Expects a valid JWT token in the Authorization header.
    """
    token = request.cookies.get('token')
    if not token:
        return jsonify({"error": "Missing token"}), 401
    
    user_id = decode_jwt_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or missing token"}), 401

    data = request.get_json()
    print(f"Syncing data for user: {user_id}")
    print(f"Data received: {data}")
    sync_user_settings(user_id, data)

    # TODO: save data to DB here

    return jsonify({"message": "Data synced successfully."})