from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from datetime import datetime, timedelta
import pymysql
pymysql.install_as_MySQLdb()


app = Flask(__name__)

# CORS configuration (more specific to allow only localhost:5173)
CORS(app, origins=["http://localhost:5173"])

# ======= CONFIG ========
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:UiQJfsgLknaQgEsIteLjUMItzCKlflMb@shuttle.proxy.rlwy.net:54848/railway'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'
app.config['JWT_IDENTITY_CLAIM'] = 'sub'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Explicitly set expiration time

# ======= EXTENSIONS ========
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ======= MODELS ========
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    tasks = db.relationship('Task', backref='user', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.String(20), default='Medium')
    deadline = db.Column(db.Date)
    category = db.Column(db.String(50))
    done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "deadline": self.deadline.strftime('%Y-%m-%d') if self.deadline else None,
            "category": self.category,
            "done": self.done
        }


# Create DB tables
with app.app_context():
    db.create_all()

# ======= ROUTES ========

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Validate required fields
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "Email already exists"}), 409

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], email=data['email'], password=hashed_pw)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error registering user", "error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.check_password_hash(user.password, data['password']):
        # Properly include additional_claims as a parameter
        token = create_access_token(
            identity=str(user.id),
            additional_claims={"sub": str(user.id)},
            expires_delta=timedelta(hours=1)
        )
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        print(f"Retrieved identity: {user_id}, type: {type(user_id)}")
        
        user = User.query.get(int(user_id))  # Cast user_id to int
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        tasks_completed = Task.query.filter_by(user_id=int(user_id), done=True).count()
        tasks_in_progress = Task.query.filter_by(user_id=int(user_id), done=False).count()
        streak = tasks_completed // 3

        return jsonify({
            "username": user.name,
            "email": user.email,
            "tasksCompleted": tasks_completed,
            "tasksInProgress": tasks_in_progress,
            "streak": streak
        }), 200
    except Exception as e:
        print(f"Error in profile route: {str(e)}")
        return jsonify({"message": str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))

        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        new_email = data.get('email')
        if new_email and new_email != user.email:
            # Check if the new email already exists for another user
            existing_user = User.query.filter_by(email=new_email).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Email already exists'}), 400

        # Update the fields
        user.name = data.get('username', user.name)
        user.email = new_email or user.email

        db.session.commit()
        return jsonify({
            'username': user.name,
            'email': user.email,
            'tasksCompleted': Task.query.filter_by(user_id=user.id, done=True).count(),
            'tasksInProgress': Task.query.filter_by(user_id=user.id, done=False).count(),
            'streak': 5  # Replace with actual logic if implemented
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating profile', 'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required field
        if not data.get('title'):
            return jsonify({'message': 'Title is required'}), 400

        new_task = Task(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'Medium'),
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d') if data.get('deadline') else None,
            category=data.get('category', ''),
            done=data.get('done', False),
            user_id=int(user_id)
        )

        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating task', 'error': str(e)}), 500
    
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found or unauthorized'}), 404

    data = request.json
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.priority = data.get('priority', task.priority)
    task.category = data.get('category', task.category)
    task.done = data.get('done', task.done)

    if 'deadline' in data:
        try:
            task.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    try:
        db.session.commit()
        return jsonify({'message': 'Task updated successfully', 'task': task.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    
@app.route('/api/tasks/<int:task_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_task_status(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found or unauthorized'}), 404
    
    # Toggle the done status
    task.done = not task.done
    
    # If task is marked as done, update completed_at timestamp
    if task.done:
        task.completed_at = datetime.datetime.utcnow()
    else:
        task.completed_at = None
    
    # Save changes to database
    try:
        db.session.commit()
        return jsonify({'message': 'Task status updated', 'task': task.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route to delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found or unauthorized'}), 404
    
    # Delete the task
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        user_id = get_jwt_identity()  # Get user ID from the JWT
        tasks = Task.query.filter_by(user_id=user_id).all()  # Fetch tasks for the current user
        
        if not tasks:
            return jsonify({"message": "No tasks found"}), 404

        # Convert tasks to a list of dictionaries for JSON serialization
        tasks_list = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "deadline": task.deadline.strftime('%Y-%m-%d') if task.deadline else None,
                "category": task.category,
                "done": task.done
            } for task in tasks
        ]

        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        print(f"Error fetching tasks: {str(e)}")
        return jsonify({"message": "Error fetching tasks", "error": str(e)}), 500
    


@app.route('/api/tasks/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_tasks():
    try:
        user_id = get_jwt_identity()
        # Query tasks, filter by user, order by deadline (ascending), and limit to tasks with non-null deadlines
        tasks = Task.query.filter_by(user_id=user_id).filter(Task.deadline != None).order_by(Task.deadline).all()
        
        # Convert tasks to a list of dictionaries for JSON serialization
        tasks_list = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "deadline": task.deadline.strftime('%Y-%m-%d') if task.deadline else None,
                "category": task.category,
                "done": task.done
            } for task in tasks
        ]

        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        print(f"Error fetching upcoming tasks: {str(e)}")
        return jsonify({"message": "Error fetching upcoming tasks", "error": str(e)}), 500


@app.route('/api/user/reset', methods=['POST'])
@jwt_required()
def reset_user_progress():
    user_id = get_jwt_identity()
    
    # Delete all tasks of the user
    Task.query.filter_by(user_id=user_id).delete()
    
    # Reset user-specific stats (if stored in User table, update accordingly)
    user = User.query.get(user_id)
    user.tasks_completed = 0
    user.tasks_in_progress = 0
    user.streak = 0
    
    db.session.commit()
    
    return jsonify({'msg': 'Progress reset successfully'}), 200


@app.route('/api/user/delete', methods=['DELETE'])
@jwt_required()
def delete_user():
    # Get the current user's ID from the JWT
    current_user_id = get_jwt_identity()

    # Find the user
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Delete all tasks associated with the user
    Task.query.filter_by(user_id=current_user_id).delete()

    # Delete the user record
    db.session.delete(user)
    db.session.commit()

    # Return a success response
    return jsonify({'message': 'Account deleted successfully'}), 200


# ======= MAIN ========
if __name__ == '__main__':
    app.run(debug=True, port=8080)
