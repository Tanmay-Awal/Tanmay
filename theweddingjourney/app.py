from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
import MySQLdb
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from sqlalchemy import text
from flask_mail import Mail, Message
import json

with open('config.json', 'r') as c:
    params = json.load(c)["params"]

# My Database connection
local_server = True
app = Flask(__name__)
app.secret_key = 'tanmay'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/theweddingjourney'
db = SQLAlchemy(app)

# SMTP MAIL SERVER SETTINGS
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME=params['gmail-user'],
    MAIL_PASSWORD=params['gmail-password']
)

mail = Mail(app)

login_manager = LoginManager(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Tanmay.query.get(int(user_id))

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100))
    Email = db.Column(db.String(100))

class Tanmay(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    Email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(1000))

class Booking(UserMixin, db.Model):
    bid = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50))
    lastname = db.Column(db.String(50))
    number = db.Column(db.String(15))
    Email = db.Column(db.String(50))
    date = db.Column(db.String(50), nullable=False)
    pwd = db.Column(db.String(1000))
    city = db.Column(db.String(1000))
    person = db.Column(db.String(1000))

@app.route('/')
def index():
    return render_template('index.html', username=current_user.username if current_user.is_authenticated else None)

@app.route('/creations')
@login_required
def creations():
    em = current_user.Email
    query = db.session.execute(text("SELECT * FROM booking WHERE Email = :email"), {"email": em}).fetchall() if em else None
    return render_template('creations.html', query=query)

@app.route('/edit/<string:bid>', methods=['POST', 'GET'])
@login_required
def edit(bid):
    post = Booking.query.filter_by(bid=bid).first()
    if not post:
        flash("Booking not found!", "danger")
        return redirect(url_for('creations'))
    if request.method == "POST":
        post.firstname = request.form.get('firstname')
        post.lastname = request.form.get('lastname')
        post.number = request.form.get('number')
        post.Email = request.form.get('Email')
        post.date = request.form.get('date')
        post.pwd = request.form.get('pwd')
        post.city = request.form.get('city')
        post.person = request.form.get('person')
        db.session.commit()
        flash("Booking is Updated", "success")
        return redirect('/creations')  
    return render_template('edit.html', post=post)

@app.route('/delete/<string:bid>', methods=['POST', 'GET'])
@login_required
def delete_booking(bid):
    db.session.execute(text("DELETE FROM booking WHERE bid = :bid"), {"bid": bid})
    db.session.commit()
    flash("Booking Deleted Successfully", "success")
    return redirect(url_for('creations'))

@app.route('/booking', methods=['POST', 'GET'])
@login_required
def booking():
    if request.method == "POST":
        new_booking = Booking(
            firstname=request.form.get('firstname'),
            lastname=request.form.get('lastname'),
            number=request.form.get('number'),
            Email=request.form.get('Email'),
            date=request.form.get('date'),
            pwd=request.form.get('pwd'),
            city=request.form.get('city'),
            person=request.form.get('person')
        )
        db.session.add(new_booking)
        db.session.commit()
        mail.send_message(
            "THE WEDDING JOURNEY BOOKING CONFIRMATION",
            sender=params['gmail-user'],
            recipients=[new_booking.Email],
            body=f"YOUR BOOKING IS CONFIRMED. THANKS FOR CHOOSING US {new_booking.firstname}"
        )
        flash("Booking Confirmed", "info")
        return redirect(url_for('booking'))
    return render_template('booking.html')

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == "POST":
        if Tanmay.query.filter_by(Email=request.form.get('Email')).first():
            flash("Email Already Exists", "warning")
            return render_template('/signup.html', error="Email already exists")
        newtanmay = Tanmay(
            username=request.form.get('username'),
            Email=request.form.get('Email'),
            password=generate_password_hash(request.form.get('password'))
        )
        db.session.add(newtanmay)
        db.session.commit()
        flash("Signup Success , Please Login", "success")
        return render_template('login.html')
    return render_template('signup.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        tanmay = Tanmay.query.filter_by(Email=request.form.get('Email')).first()
        if tanmay and check_password_hash(tanmay.password, request.form.get('password')):
            login_user(tanmay)
            flash("Login Successful", "success")
            return redirect(url_for('index'))
        flash("Invalid Credentials", "danger")
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logout Successful ,Visit Us Again", "warning")
    return redirect(url_for('login'))

@app.route('/test')
def test():
    try:
        Test.query.all()
        return 'My database is Connected'
    except:
        return 'My db is not connected'

@app.route('/send_test_mail')
def send_test_mail():
    try:
        mail.send_message(
            "Flask-Mail Test",
            sender=params['gmail-user'],
            recipients=["chandrakantaawal371@gmail.com"],
            body="This is a test email from Flask."
        )
        return "Email sent successfully!"
    except Exception as e:
        return f"Error: {e}"

app.run(debug=True)
