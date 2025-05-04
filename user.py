from mongoengine import StringField, Document, IntField, EmailField

class User(Document):
    name=StringField(required=True)
    email=EmailField(required=True)
    password=StringField(required=True)
    age=IntField(required=True)
