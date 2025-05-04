from mongoengine import EmailField, Document, IntField, BooleanField

class AnimeLike(Document):
    anime_id = IntField(required=True)
    email = EmailField(required=True)
    is_liked = BooleanField(default=True) 