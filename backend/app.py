from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db
from models import User

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

# PostgreSQL DB config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/pomofocus'

# Bind the app to the db instance
db.init_app(app)

@app.route('/api/users')
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name} for u in users])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(port=8000, debug=True)
