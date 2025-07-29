from mongoengine import (
    Document, StringField, EmailField, ReferenceField,
    BooleanField, DateTimeField, ListField, EmbeddedDocument, EmbeddedDocumentField, DictField,IntField
)
from datetime import datetime


class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField()  
    role = StringField(required=True)
    
    meta = {
        'indexes': [
            'email', 
            'role',
            'google_id'
        ]
    }
    name = StringField()
    phone = StringField()  
    bio = StringField()
    skills = ListField(StringField())
    pastExperience = ListField(DictField())
    totalHours = StringField()
    completedTasks = StringField()
    badges = StringField()
    impactScore = StringField()
    address = StringField()
    google_id = StringField()


class NGO(Document):
    organizationName = StringField(required=True)
    contactPersonName = StringField(required=True)
    contactEmail = EmailField(required=True)
    contactPhone = StringField(required=True)
    headOfficeAddress = StringField(required=True)
    operatingRegions = StringField(required=True)
    googleMapsLink = StringField()
    missionStatement = StringField(required=True)
    website = StringField()
    facebook = StringField()
    instagram = StringField()
    linkedin = StringField()
    userId = StringField(required=True)  


class Task(Document):
    user_email = StringField(required=True)
    title = StringField(required=True)
    description = StringField()
    start_date = DateTimeField()
    location = StringField()
    duration = StringField()
    status = StringField(default="Pending")  
    verified = StringField(default="Pending")  
    verify_message = StringField() 
    ngo_id = ReferenceField(NGO)
    tags = ListField(StringField())   
    image = StringField() 
    impact_score = IntField(default=0)
    isDeletedByVolunteer= BooleanField(default=False)
    isDeletedByNGO= BooleanField(default=False)



class Application(Document):
    opportunityId = ReferenceField('Opportunity', required=True)
    opportunityTitle = StringField(required=True)  
    volunteerEmail = StringField(required=True)
    volunteerName = StringField(required=True)     
    message = StringField()
    status = StringField(default='Pending')
    created_at = DateTimeField(default=datetime.utcnow)
    volunteerId = ReferenceField(User)
    volunteerPhone = StringField()
    volunteerBio = StringField()
    volunteerAddress = StringField()
    volunteerSkills = ListField(StringField())
    volunteerExperience = ListField(DictField())
    isDeleted = BooleanField(default=False) 
    isDeletedByVolunteer = BooleanField(default=False)  
    finalStatus = StringField() 



    def to_json(self): 
        return {
            "id": str(self.id),
            "opportunityId": self.opportunityId,
            "volunteerEmail": self.volunteerEmail,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Notification(Document):
    user_id = ReferenceField(User)  
    ngo_id = ReferenceField(NGO)     
    title = StringField(required=True)
    message = StringField(required=True)
    type = StringField(required=True)
    read = BooleanField(default=False)
    time = DateTimeField(default=datetime.utcnow)

class Opportunity(Document):
    title = StringField(required=True)
    description = StringField()
    organization = ReferenceField(NGO, required=True)
    startDate = DateTimeField()
    location = StringField()
    tags = ListField(StringField())
    image = StringField()
    status = StringField(default="Open")  
    created_at = DateTimeField(default=datetime.utcnow)
    isDeleted = BooleanField(default=False)  


class OTP(Document):
    email = EmailField(required=True)
    code = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    expires_at = DateTimeField(required=True)
    verified = BooleanField(default=False)

