from flask import Blueprint, request, jsonify, make_response
from services.user_services import register_user, login_user, get_user_by_id
from services.auth_services import create_jwt_token, decode_jwt_token


user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def create_user():
    try:
        data = request.json
        if not data or not all(key in data for key in ('name', 'email', 'password')):
            return jsonify({"error": "Missing required fields"}), 400

        result = register_user(data['name'], data['email'], data['password'])

        token = create_jwt_token(result.id)

        response = make_response(jsonify({
            "message": "User registered successfully",
            "user": {
                "id": result.id,
                "name": result.name,
                "email": result.email
            }
        }))

        response.set_cookie(
            'token',
            token,
            httponly=True,
            samesite='Lax',
            secure=False  # True in production
        )

        return response

    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route('/login', methods=['POST'])
def get_user():
    data = request.json
    user = login_user(data['email'], data['password'])

    if user:
        token = create_jwt_token(user.id)

        response = make_response(jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }))

        response.set_cookie(
            'token',
            token,
            httponly=True,
            samesite='Lax',
            secure=False  # set True in production with HTTPS
        )

        return response

    return jsonify({"error": "Invalid credentials"}), 401

@user_bp.route('/profile', methods=['GET'])
def get_current_user():
    token = request.cookies.get('token')
    if not token:
        return jsonify({"error": "Token is missing"}), 401

    user_id = decode_jwt_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 401

    # Assuming you have a function to get user by ID
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })

@user_bp.route('/logout', methods=['POST'])
def logout_user():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie('token', '', expires=0)
    return response