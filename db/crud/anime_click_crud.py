# import anime_click_crud as acc 
from mongoengine import connect
import anime_clicked as ac 

def save_data(anime_id, email, count):
    var=ac.AnimeClick(anime_id=anime_id, email=email, count=count)
    var.save()

def get_anime_by_user(anime_id, email):
    var=ac.AnimeClick.objects(anime_id=anime_id, email=email).first()
    return var

def update_anime_count(var):
    var.count+=1
    var.save()

def get_all_animes_by_users(email):
    return ac.AnimeClick.objects(email=email)

def update_rating(email, anime_id, rating):
    var=get_anime_by_user(anime_id=anime_id, email=email)
    if var.rating_inc_dec==None:
        var.rating=rating
        var.rating_inc_dec=1
        var.save()
        return
    if var.rating>rating:
        var.rating_inc_dec=-1
    else :
        var.rating_inc_dec=1
    var.rating=rating
    var.save()