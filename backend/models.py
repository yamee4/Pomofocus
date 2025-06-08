from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    estimated_pomodoro = db.Column(db.Integer, nullable=False, default=1)
    completed_pomodoro = db.Column(db.Integer, nullable=False, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.DateTime, nullable=True)
    priority = db.Column(db.String(10), nullable=True)  # e.g., 'low', 'medium', 'high'
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('tasks', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'estimated_pomodoro': self.estimated_pomodoro,
            'completed_pomodoro': self.completed_pomodoro,
            'is_completed': self.is_completed,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

class PomodoroSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    end_time = db.Column(db.DateTime, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)  # Duration in seconds
    type = db.Column(db.String(10), nullable=False)  # e.g., 'work', 'break'
    is_completed = db.Column(db.Boolean, default=False)
    is_interrupted = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, nullable=True)

    task = db.relationship('Task', backref=db.backref('pomodoro_sessions', lazy=True))
    user = db.relationship('User', backref=db.backref('pomodoro_sessions', lazy=True))

class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pomodoro_duration = db.Column(db.Integer, nullable=False, default=25)  # in minutes
    short_break_duration = db.Column(db.Integer, nullable=False, default=5)  # in minutes
    long_break_duration = db.Column(db.Integer, nullable=False, default=15)  # in minutes
    long_break_interval = db.Column(db.Integer, nullable=False, default=4)  # after how many pomodoros to take a long break
    auto_start_breaks = db.Column(db.Boolean, default=True)  # whether to auto-start breaks after pomodoros
    auto_start_pomodoros = db.Column(db.Boolean, default=True)  # whether to auto-start pomodoros after breaks
    notifications_enabled = db.Column(db.Boolean, default=True)  # whether to enable notifications

    user = db.relationship('User', backref=db.backref('settings', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pomodoro_duration': self.pomodoro_duration,
            'short_break_duration': self.short_break_duration,
            'long_break_duration': self.long_break_duration,
            'long_break_interval': self.long_break_interval,
            'auto_start_breaks': self.auto_start_breaks,
            'auto_start_pomodoros': self.auto_start_pomodoros,
            'notifications_enabled': self.notifications_enabled
        }

class DailySummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_pomodoros = db.Column(db.Integer, nullable=False, default=0)
    completed_tasks = db.Column(db.Integer, nullable=False, default=0)
    total_time_spent = db.Column(db.Integer, nullable=False, default=0)  # in seconds
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('daily_summaries', lazy=True))