from models import Task, User, UserSettings
from extensions import db
from datetime import datetime

def sync_user_settings(user_id):
    """
    Sync user settings with the database.
    """
    try:
        # Fetch user settings from the database
        user_settings = UserSettings.query.filter_by(user_id=user_id).first()
        
        if not user_settings:
            return {"error": "User settings not found"}, 404

        # Update user settings
        user_settings.last_synced = datetime.utcnow()
        db.session.commit()

        return {"message": "User settings synced successfully"}, 200

    except Exception as e:
        print("Error during syncing user settings:", e)
        return {"error": "Internal server error"}, 500\
        
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
    

