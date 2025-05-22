from flask import Blueprint, request, jsonify
from services.task_services import (
    create_task,
    get_task_by_id,
    update_task,
    delete_task,
    get_all_tasks,
)

task_bp = Blueprint('task', __name__)
@task_bp.route('/add_tasks', methods=['POST'])
def add_task():
    create_task(
        user_id=request.json['user_id'],
        title=request.json['title'],
        description=request.json['description'],
        estimated_pomodoro=request.json['estimated_pomodoro'],
        due_date=request.json['due_date'],
        priority=request.json['priority']
    )

    return jsonify({"message": "Task created successfully"}), 201

@task_bp.route('/get_tasks', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    tasks = get_all_tasks(user_id)
    return jsonify(tasks), 200

@task_bp.route('/get_task/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = get_task_by_id(task_id)
    if task:
        return jsonify(task), 200
    else:
        return jsonify({"error": "Task not found"}), 404
    
@task_bp.route('/update_task/<int:task_id>', methods=['PUT'])
def update_task_route(task_id):
    data = request.json
    task = update_task(
        task_id,
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
