from models import Task
from extensions import db

def create_task(user_id, title, description, estimated_pomodoro, due_date, priority):
    """
    Create a new task for the user.
    """

    new_task = Task(
        title=title,
        description=description,
        estimated_pomodoro=estimated_pomodoro,
        due_date=due_date,
        priority=priority,
        user_id=user_id
    )
    db.session.add(new_task)
    db.session.commit()
    return new_task

def get_all_tasks(user_id):
    """
    Get all tasks for a user.
    """
    tasks = Task.query.filter_by(user_id=user_id).all()
    return tasks

def mark_task_by_id(task_id):
    """
    Mark a task as completed by its ID.
    """
    task = Task.query.get(task_id)
    if task:
        task.is_completed = True
        db.session.commit()
    return None

def update_task(task_id, user_id, title=None, description=None, estimated_pomodoro=None, due_date=None, priority=None):
    """
    Update a task's details.
    """
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return None

    if title:
        task.title = title
    if description:
        task.description = description
    if estimated_pomodoro:
        task.estimated_pomodoro = estimated_pomodoro
    if due_date:
        task.due_date = due_date
    if priority:
        task.priority = priority

    db.session.commit()
    return task

def delete_task(task_id):
    """
    Delete a task by its ID.
    """
    task = Task.query.get(task_id)
    if not task:
        return None

    db.session.delete(task)
    db.session.commit()
    return task