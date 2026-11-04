
from models import User, UserSettings
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(name, email, password):
    if User.query.filter_by(email=email).first():
        return None  # User already exists

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return new_user

def login_user(email, password):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            print("No user found with that email.")
            return None

        if check_password_hash(user.password_hash, password):
            return user
        else:
            print("Incorrect password.")
            return None

    except Exception as e:
        print(f"Error during login: {e}")
        return None

def get_user_by_id(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            print("User not found.")
            return None
        return user
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None

def get_user_settings(user_id):
    try:
        user_settings = UserSettings.query.filter_by(user_id=user_id).first()
        if not user_settings:
            print("User settings not found.")
            return None
        return user_settings
    except Exception as e:
        print(f"Error fetching user settings: {e}")
        return None
    
def update_user_settings(user_id, settings_data):
    try:
        user_settings = UserSettings.query.filter_by(user_id=user_id).first()
        if not user_settings:
            return None

        # Mapping input keys to model fields
        mapping = {
            "workMinutes": "pomodoro_duration",
            "shortBreakMinutes": "short_break_duration",
            "longBreakMinutes": "long_break_duration",
            "longBreakInterval": "long_break_interval",
            "autoStartNext": "auto_start_breaks",
            "autoStartPomodoro": "auto_start_pomodoros",
            "showNotifications": "notifications_enabled",
        }

        for input_key, model_attr in mapping.items():
            if input_key in settings_data:
                setattr(user_settings, model_attr, settings_data[input_key])

        db.session.commit()
        return user_settings.to_dict()

    except Exception as e:
        print(f"Error updating user settings: {e}")
        return None




