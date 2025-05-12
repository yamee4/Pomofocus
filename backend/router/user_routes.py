from flask import Blueprint, request, jsonify
from services.user_services import register_user, login_user

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def create_user():
    data = request.json
    if not data or not all(key in data for key in ('name', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    return jsonify(register_user(data['name'], data['email'], data['password'])), 201

@user_bp.route('/login', methods=['POST'])
def get_user():
    data = request.json
    user = login_user(data['email'], data['password'])
    if user:
        return jsonify(user), 200
    return jsonify({"error": "Invalid credentials"}), 401