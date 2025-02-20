from mongoengine import EmailField, Document, IntField

class AnimeClick(Document):
    anime_id=IntField(required=True)
    email=EmailField(required=True)
    count=IntField(required=True)
    rating=IntField(min_value=0, max_value=10)
    rating_inc_dec=IntField(min_value=-1, max_value=1) 
    