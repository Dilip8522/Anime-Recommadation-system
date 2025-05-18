import anime_like as al

def save_like(anime_id, email):
    var = al.AnimeLike(anime_id=anime_id, email=email)
    var.save()

def get_like(anime_id, email):
    return al.AnimeLike.objects(anime_id=anime_id, email=email).first()

def remove_like(anime_id, email):
    var = get_like(anime_id, email)
    if var:
        var.delete()

def get_all_likes_by_user(email):
    return al.AnimeLike.objects(email=email) 