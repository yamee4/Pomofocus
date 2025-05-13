
from models import User
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




