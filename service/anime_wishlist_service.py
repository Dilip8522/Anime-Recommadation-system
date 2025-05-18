import db.crud.anime_wishlist_crud as awc

def toggle_wishlist(email, anime_id):
    if awc.is_in_wishlist(anime_id, email):
        awc.remove_from_wishlist(anime_id, email)
        return False
    else:
        awc.add_to_wishlist(anime_id, email)
        return True

def is_anime_in_wishlist(email, anime_id):
    return awc.is_in_wishlist(anime_id, email)

def get_user_wishlist(email):
    return awc.get_user_wishlist(email) 