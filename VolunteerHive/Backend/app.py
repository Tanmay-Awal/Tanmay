from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect
from config import Config
from flask import send_from_directory
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


from routes.auth_routes import auth_routes
from routes.Applicant.tasks_routes import tasks_routes
from routes.Applicant.application_routes import application_routes
from routes.Applicant.activity_routes import activity_routes
from routes.Applicant.opportunity_routes import opportunity_routes
from routes.Applicant.notifications_routes import notifications_routes
from routes.NGO.ngo_applications_routes import ngo_applications_routes



from routes.NGO.ngo_profile_routes import ngo_profile_routes
from routes.NGO.ngo_opportunity_routes import ngo_opportunity_routes
from routes.NGO.ngo_notifications_routes import ngo_notifications_routes
from routes.NGO.ngo_settings_routes import ngo_settings_routes
from routes.NGO.ngo_reports_routes import ngo_reports_routes
from routes.NGO.ngo_tasks_routes import ngo_tasks_routes
from routes.google_auth_routes import google_auth_routes


from datetime import timedelta

from dotenv import load_dotenv
load_dotenv()


import os


app = Flask(__name__)
CORS(
    app,
    origins="http://localhost:3000",
    expose_headers=["Authorization"],
    allow_headers=["Authorization", "Content-Type"],
)


limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]
)

connect(host=os.getenv("MONGODB_HOST"))



app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_COOKIE_SECURE'] = False  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30) 
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

jwt = JWTManager(app) 


app.register_blueprint(auth_routes, url_prefix='/api')
app.register_blueprint(tasks_routes, url_prefix='/api')
app.register_blueprint(application_routes, url_prefix='/api')
app.register_blueprint(activity_routes, url_prefix='/api')
app.register_blueprint(opportunity_routes, url_prefix='/api')
app.register_blueprint(notifications_routes, url_prefix='/api')
app.register_blueprint(google_auth_routes, url_prefix='/api')

app.register_blueprint(ngo_profile_routes, url_prefix='/api')
app.register_blueprint(ngo_opportunity_routes, url_prefix='/api')
app.register_blueprint(ngo_applications_routes, url_prefix='/api')
app.register_blueprint(ngo_notifications_routes, url_prefix='/api')
app.register_blueprint(ngo_settings_routes, url_prefix='/api')
app.register_blueprint(ngo_reports_routes, url_prefix='/api')
app.register_blueprint(ngo_tasks_routes, url_prefix='/api')


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    uploads_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(uploads_dir, filename)

print("=== REGISTERED ROUTES ===")
for rule in app.url_map.iter_rules():
    print(f"{rule.rule} -> {rule.endpoint}")
print("========================")


if __name__ == '__main__':
    app.run(debug=True)
    