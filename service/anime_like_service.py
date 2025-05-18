import db.crud.anime_like_crud as alc

def toggle_like(email, anime_id):
    like = alc.get_like(anime_id, email)
    if like:
        alc.remove_like(anime_id, email)
        return False
    else:
        alc.save_like(anime_id, email)
        return True

def is_anime_liked(email, anime_id):
    like = alc.get_like(anime_id, email)
    return like is not None

def get_user_likes(email):
    return alc.get_all_likes_by_user(email) 