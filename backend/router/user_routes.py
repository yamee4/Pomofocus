from flask import Blueprint, request, jsonify
from services.user_services import register_user, login_user

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def create_user():
    try:
        data = request.json
        if not data or not all(key in data for key in ('name', 'email', 'password')):
            return jsonify({"error": "Missing required fields"}), 400

        result = register_user(data['name'], data['email'], data['password'])
        return {
            "message": "User registered successfully",
            "user": {
                "id": result.id,
                "name": result.name,
                "email": result.email
            }
        }

    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route('/login', methods=['POST'])
def get_user():
    data = request.json
    user = login_user(data['email'], data['password'])
    if user:
        return {
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    return jsonify({"error": "Invalid credentials"}), 401