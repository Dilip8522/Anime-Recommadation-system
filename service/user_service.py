import user
import utils as ut
import db.crud.user_crud  as uc
import  db.crud.user_crud  as uc
import  db.crud.user_crud  as uc
import service.anime_count_service as acs
import data_preprocess as dp

def save_user(name, email, password, age):
    uc.save_data(
        name=name, email=email, password=ut.encrpt(password), age=age
    )


def check_credentials(email, password):
    user_var = uc.get_user_email(email)
    if user_var:
        stored_password = user_var.password
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')
        return ut.dcrypt(password, stored_password)
    return False

# def check_credentials(email, password):
#     user_var = uc.get_user_email(email)
#     if user_var:
#         stored_password = user_var.password
#         if isinstance(stored_password, bytes):  # Check if it's bytes
#             stored_password = stored_password.decode('utf-8')  # Decode if necessary

#         # Check if the password matches the stored hash
#         return ut.dcrypt(password, stored_password)
#     return False

def check_email_exist(email):
    user_var = uc.get_user_email(email)
    if user_var:
        return True
    return False



def create_user_profile(user_email):
    # Get all anime clicks for the user
    user_anime_clicks = acs.get_animesby_user(user_email)  # Assuming this returns a List<AnimeClick>
    
    # Create a dictionary to hold the count of each anime
    user_profile = {}
    
    for click in user_anime_clicks:
        anime_id = click.anime_id
        count = click.count
        # rating=click.rating
        # rating_inc_dic=click.rating_inc_dic
        # Get the anime details from new_df using anime_id
        anime_row = dp.new_df[dp.new_df['anime_id'] == anime_id]
        if not anime_row.empty:
            # Use the English name or any relevant feature for the profile
            anime_name = anime_row['English name'].values[0]
            user_profile[anime_name] = count  # Store the count of interactions
    
    return user_profile

def user_profile_dict_rating(user_email):
     # Get all anime clicks for the user
    user_anime_clicks = acs.get_animesby_user(user_email)  # Assuming this returns a List<AnimeClick>
    
    # Create a dictionary to hold the count of each anime
    user_profile = {}
    
    for click in user_anime_clicks:
        anime_id = click.anime_id
        count = click.rating
        # rating=click.rating
        # rating_inc_dic=click.rating_inc_dic
        # Get the anime details from new_df using anime_id
        anime_row = dp.new_df[dp.new_df['anime_id'] == anime_id]
        if not anime_row.empty:
            # Use the English name or any relevant feature for the profile
            anime_name = anime_row['English name'].values[0]
            user_profile[anime_name] = count  # Store the count of interactions
    
    return user_profile


def get_user_age(email):
    return uc.get_user_email(email=email).age