from models import Task, User, UserSettings
from extensions import db
from datetime import datetime

from flask import request, jsonify

def sync_user_settings(user_id, data):
    """
    Create user settings only if they don't exist (one-time sync).
    """
    try:
        settings_data = data.get("setting")
        if not settings_data:
            return {"error": "No 'setting' object provided"}, 400

    
        # Check if user settings already exist
        existing_settings = UserSettings.query.filter_by(user_id=user_id).first()
        print("Existing settings:", existing_settings)
        if existing_settings:
            return {"message": "User settings already exist, skipping sync"}, 400

        # Create new settings
        user_settings = UserSettings(
            user_id=user_id,
            pomodoro_duration=settings_data.get("workMinutes", 25),
            short_break_duration=settings_data.get("shortBreakMinutes", 5),
            long_break_duration=settings_data.get("longBreakMinutes", 15),
            long_break_interval=settings_data.get("longBreakInterval", 4),
            auto_start_breaks=settings_data.get("autoStartNext", True),
            auto_start_pomodoros=settings_data.get("autoStartPomodoro", True),
            notifications_enabled=settings_data.get("showNotifications", True),
        )
        db.session.add(user_settings)
        db.session.commit()

        return {"message": "User settings synced (first-time)"}, 201

    except Exception as e:
        print("Error during syncing user settings:", e)
        return {"error": "Internal server error"}, 500


        
def sync_user_data(user_id):
    """
    Sync user data with the database.
    """
    try:
        # Fetch user data from the database
        user = User.query.filter_by(id=user_id).first()
        
        if not user:
            return {"error": "User not found"}, 404

        # Update user data
        user.last_synced = datetime.utcnow()
        db.session.commit()

        return {"message": "User data synced successfully"}, 200

    except Exception as e:
        print("Error during syncing user data:", e)
        return {"error": "Internal server error"}, 500
    

def sync_tasks(user_id):
    """
    Sync tasks with the database.
    """
    try:
        # Fetch tasks from the database
        tasks = Task.query.filter_by(user_id=user_id).all()
        
        if not tasks:
            return {"error": "No tasks found"}, 404

        # Update tasks
        for task in tasks:
            task.last_synced = datetime.utcnow()

        db.session.commit()

        return {"message": "Tasks synced successfully"}, 200

    except Exception as e:
        print("Error during syncing tasks:", e)
        return {"error": "Internal server error"}, 500
    

