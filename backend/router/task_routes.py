from flask import Blueprint, request, jsonify
from services.task_services import (
    create_task,
    mark_task_by_id,
    update_task,
    delete_task,
    get_all_tasks,
)
from services.auth_services import decode_jwt_token

def get_user_id_from_request():
    """
    Get user ID from the request headers.
    """
    token = request.cookies.get('token')  
    if not token:
        return None

    return decode_jwt_token(token)



task_bp = Blueprint('task', __name__)
@task_bp.route('/add_task', methods=['POST'])
def add_task():
    """
    Endpoint to create a new task.
    Expects JSON data with user_id, title, description, estimated_pomodoro, due_date, and priority.
    """
    user_id = get_user_id_from_request()
    print("User ID from request:", user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    create_task(
        user_id=user_id,
        title=request.json['name'],
        description=request.json['description'],
        estimated_pomodoro=request.json['estimated_pomodoro'],
        due_date=request.json['due_date'],
        priority=request.json['priority']
    )

    return jsonify({"message": "Task created successfully"}), 201

@task_bp.route('/get_tasks', methods=['GET'])
def get_tasks():
    """
    Endpoint to get all tasks for the authenticated user.
    Expects a valid JWT token in the Authorization header.
    """
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    # Assuming get_all_tasks returns a list of tasks for the user

    tasks = get_all_tasks(user_id)
    return jsonify([task.to_dict() for task in tasks]), 200


@task_bp.route('/toggle_completion/<int:task_id>', methods=['PUT'])
def toggle_completion(task_id):
    mark_task_by_id(task_id)
    return jsonify({"message": "Task marked as completed"}), 200
    
@task_bp.route('/update_task/<int:task_id>', methods=['PUT'])
def update_task_route(task_id):
    data = request.json
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    task = update_task(
        task_id,
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        estimated_pomodoro=data.get('estimated_pomodoro'),
        due_date=data.get('due_date'),
        priority=data.get('priority')
    )
    if task:
        return jsonify({"message": "Task updated successfully"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404
    
    
@task_bp.route('/delete_task/<int:task_id>', methods=['DELETE'])
def delete_task_route(task_id):
    task = delete_task(task_id)
    if task:
        return jsonify({"message": "Task deleted successfully"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404
