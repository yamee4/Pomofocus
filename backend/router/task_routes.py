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
