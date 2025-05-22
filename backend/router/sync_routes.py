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
            
@sync_bp.route('/api/sync', methods=['POST'])
def sync():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")

    user_id = decode_jwt_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or missing token"}), 401

    data = request.get_json()
    print(f"Syncing data for user: {user_id}")
    print(data)

    # TODO: save data to DB here

    return jsonify({"message": "Data synced successfully."})