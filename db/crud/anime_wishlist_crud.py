import anime_wishlist as aw

def add_to_wishlist(anime_id, email):
    var = aw.AnimeWishlist(anime_id=anime_id, email=email)
    var.save()

def remove_from_wishlist(anime_id, email):
    var = aw.AnimeWishlist.objects(anime_id=anime_id, email=email).first()
    if var:
        var.delete()

def is_in_wishlist(anime_id, email):
    return aw.AnimeWishlist.objects(anime_id=anime_id, email=email).first() is not None

def get_user_wishlist(email):
    return aw.AnimeWishlist.objects(email=email)