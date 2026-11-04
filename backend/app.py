from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db
from router import register_routes
from dotenv import load_dotenv

migrate = Migrate()  # Initialize globally so CLI works

def create_app():
    app = Flask(__name__)
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    # Load environment variables from .env file
    load_dotenv()

    # PostgreSQL config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/pomofocus'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)  # Initialize Flask-Migrate with the app and db

    # Register routes
    register_routes(app)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
