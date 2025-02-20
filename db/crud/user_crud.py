from mongoengine import connect
import user 

def save_data(name, email, password, age):
    var =user.User(name=name, email=email, password=password, age=age)
    var.save()

def get_user_name(name):
    return user.User.objects(name=name).first()

def get_user_email(email):
    return user.User.objects(email=email).first()

