from mongoengine import EmailField, Document, IntField

class AnimeWishlist(Document):
    anime_id = IntField(required=True)
    email = EmailField(required=True) 