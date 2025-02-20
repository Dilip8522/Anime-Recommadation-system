import db.crud.anime_click_crud as acc 

def put_anime(email, anime_id):
    var=acc.get_anime_by_user(anime_id=anime_id, email=email)
    if var:
        acc.update_anime_count(var)
    else:
        acc.save_data(email=email, anime_id=anime_id, count=1)


def get_animesby_user(email):
    return acc.get_all_animes_by_users(email)

def submit_rating(email, anime_id, rating):
    acc.update_rating(email, anime_id, rating)