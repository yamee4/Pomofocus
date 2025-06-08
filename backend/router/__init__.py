from .user_routes import user_bp
from .task_routes import task_bp
from .sync_routes import sync_bp

def register_routes(app):
    """
    Register all the routes for the application.
    """
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(task_bp, url_prefix='/api/task')
    app.register_blueprint(sync_bp, url_prefix='/api/sync')