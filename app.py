import streamlit as st
from db.config import init_db
import data_preprocess as dp
import service.anime_count_service as acs 
from db.config import init_db
import fronted.auth_frontend.auth as afa
import fronted.user_profile as up 
import fronted.wishlist_page as wp
import fronted.category_page as cp
import service.recomndation_service as srs
import sys
import service.user_service as us
import os
import utils as ut
import service.anime_like_service as als
import service.anime_wishlist_service as aws


import constants as const


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

st.title("Anime Recommendation")

if "action" not in st.session_state:
    st.session_state.action=True

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "token" not in st.session_state:
    st.session_state.token = None

if "anime_page" not in st.session_state:
    st.session_state.anime_page = None

if st.session_state.token:
    verfied_email=ut.verify_jwt(st.session_state.token)
    if verfied_email=="Token has expired." or verfied_email=="Invalid token.":
        st.session_state.action=False
        st.rerun()
    USER_EMAIL=verfied_email.get("email")
    print("---------------------------------"+str(USER_EMAIL)+"--------------------------------")
    age=us.get_user_age(USER_EMAIL)

# if USER_EMAIL:
#     st.title(USER_EMAIL)
# if st.session_state.token:
#     USER_EMAIL=st.session_state.token

def anime():
    name = st.session_state.anime_page
    print("name --------------------            "+str(name))

    list_of_animes_df = srs.get_content_based_recommendations(id=srs.get_id_of_anime(name, en=True), age=age)
    
    col1, col2 = st.columns(2)
    var_anime=dp.new_df[(dp.new_df["English name"]==name)].iloc[0]
    col1.image(var_anime["Image URL"], use_container_width=True)
    name = var_anime["English name"]
    type_ = var_anime["Type"]
    genres = var_anime["Genres"]
    plot = var_anime["Synopsis"]
    
    col2.write("Name: " + str(name))
    col2.write("Type: " + str(type_))
    col2.write("Genres: " + str(genres))
    col2.write("Plot: " + str(plot))
    
    # Rating and Like buttons in the same row
    rating_col, like_col = col1.columns(2)
    
    # Rating functionality
    rating_val = rating_col.selectbox("Rating", range(0, 11), label_visibility="visible")
    if rating_col.button("Submit Rating", key="submit key rating"):
        acs.submit_rating(email=USER_EMAIL, anime_id=dp.new_df[(dp.new_df["English name"]==name)]["anime_id"], rating=rating_val)
    
    # Like functionality
    anime_id = int(dp.new_df[(dp.new_df["English name"]==name)]["anime_id"].iloc[0])
    is_liked = als.is_anime_liked(USER_EMAIL, anime_id)
    like_text = "❤️ Liked" if is_liked else "🤍 Like"
    if like_col.button(like_text, key="like_button"):
        als.toggle_like(USER_EMAIL, anime_id)
        st.rerun()

    if list_of_animes_df is None:
        st.write("Sorry No recommendation is there")
        return

    with st.container():
        for start in range(1, len(list_of_animes_df), 3):
                img_cols = st.columns(3)
                for it, i in enumerate(list_of_animes_df[start:start + 3]):
                    if it < len(img_cols): 
                        with img_cols[it]:
                            st.image(i["Image URL"], use_container_width=True)
                            st.write("Name: " + str(i["Name"]))
                            
                            # Create columns for buttons
                            button_col1, button_col2 = st.columns(2)
                            
                            # Know More button
                            if button_col1.button("Know More", key="know_more_"+str(i["English name"])+"_"+str(it)):
                                st.session_state.anime_page = i["English name"] 
                                print(i["English name"])
                                st.rerun()
                            
                            # Wishlist button
                            anime_id = int(dp.new_df[(dp.new_df["English name"]==i["English name"])]["anime_id"].iloc[0])
                            is_in_wishlist = aws.is_anime_in_wishlist(USER_EMAIL, anime_id)
                            wishlist_text = "🗑️ Remove" if is_in_wishlist else "📝 Add"
                            if button_col2.button(wishlist_text, key="wishlist_"+str(i["English name"])+"_"+str(it)):
                                aws.toggle_wishlist(USER_EMAIL, anime_id)
                                st.rerun()
    
    if st.button("Back"):
        st.session_state.anime_page = None
        st.rerun()  


def show_animes(animes_df):
    if len(animes_df) < 12:
        st.warning("Not enough anime recommendations available.")
        return
    
    with st.container():
        for start in range(0, len(animes_df), 3):
            img_cols = st.columns(3)
            for it in range(start, min(start + 3, len(animes_df))):
                i = animes_df.iloc[it]
                
                with img_cols[it - start]:
                    st.image(i["Image URL"], use_container_width=True)
                    st.write("Name: " + str(i["Name"]))
                    
                    # Create columns for buttons
                    button_col1, button_col2 = st.columns(2)
                    
                    # Know More button
                    if button_col1.button("Know More", key=f"know_more_{i['English name']}_{it}"):
                        st.session_state.anime_page = i["English name"]
                        print(i["English name"])
                        st.rerun()
                    
                    # Wishlist button
                    anime_id = int(dp.new_df[(dp.new_df["English name"]==i["English name"])]["anime_id"].iloc[0])
                    is_in_wishlist = aws.is_anime_in_wishlist(USER_EMAIL, anime_id)
                    wishlist_text = "🗑️ Remove" if is_in_wishlist else "📝 Add"
                    if button_col2.button(wishlist_text, key=f"wishlist_{i['English name']}_{it}"):
                        aws.toggle_wishlist(USER_EMAIL, anime_id)
                        st.rerun()


def show_popular_animes():
    animes_df=dp.new_df.sort_values(by="Popularity", ascending=True)
    animes_df=animes_df[(animes_df["Popularity"]!=0)].head(12)
    with st.container():
        for start in range(0, len(animes_df), 3):
            img_cols = st.columns(3)
            for it in range(start, min(start + 3, len(animes_df))):
                i = animes_df.iloc[it]
                
                with img_cols[it - start]:
                    st.image(i["Image URL"], use_container_width=True)
                    st.write("Name: " + str(i["Name"]))
                    
                    # Create columns for buttons
                    button_col1, button_col2 = st.columns(2)
                    
                    # Know More button
                    if button_col1.button("Know More", key=f"know_more_{i['Name']}_{it}"):
                        st.session_state.anime_page = i["English name"]
                        if st.session_state.token==None:
                            st.session_state.action=False
                            st.rerun()
                        print(i["English name"])
                        st.rerun()
                    
                    # Wishlist button
                    if st.session_state.token:
                        anime_id = int(dp.new_df[(dp.new_df["English name"]==i["English name"])]["anime_id"].iloc[0])
                        is_in_wishlist = aws.is_anime_in_wishlist(USER_EMAIL, anime_id)
                        wishlist_text = "🗑️ Remove" if is_in_wishlist else "📝 Add"
                        if button_col2.button(wishlist_text, key=f"wishlist_{i['Name']}_{it}"):
                            aws.toggle_wishlist(USER_EMAIL, anime_id)
                            st.rerun()

def show_home():
    if st.session_state.token!=None:
        animes_df = srs.get_personalized_recommendations(user_email=USER_EMAIL, age=age)  # Fetch personalized recommendations
    else :
        animes_df=[]
    if len(animes_df)!=0:
        show_animes(animes_df)
    else:
        show_popular_animes()

    

def home():
    if st.session_state.action==False:
        afa.auth()
    else:
        var = st.sidebar.radio("Navigation", [const.PAGE_HOME, const.PAGE_PROFILE, const.PAGE_WISHLIST, const.PAGE_CATEGORY, const.PAGE_LOGOUT])
        if var == const.PAGE_HOME:
            li_anime = [""]
            li_anime.extend(dp.new_df["English name"].tolist())
            search_bar, search_btn = st.columns(2)
            search_var = search_bar.selectbox("Search Anime", li_anime, index=0, label_visibility="visible")
            search_or_not = search_btn.button("Search")

            if search_or_not:
                if st.session_state.token==None:
                    st.session_state.action=False
                    st.rerun()
                st.session_state.anime_page = search_var
                if st.session_state.token:
                    srs.track_click(user_email=USER_EMAIL, anime=st.session_state.anime_page)
                    search_or_not=False
                    anime()
                else:
                    st.session_state.action=False
                    st.rerun() 
            else :
                if st.session_state.anime_page:
                    if st.session_state.token:
                        srs.track_click(user_email=USER_EMAIL, anime=st.session_state.anime_page)
                        anime()
                    else:
                       st.session_state.action=False
                       st.rerun() 
                else:
                    show_home()
        elif var == const.PAGE_LOGOUT:
            if st.session_state.token==None:
                    st.session_state.action=False
                    st.rerun()
            st.title("Are you sure?")
            yes, no = st.columns(2)
            if yes.button("Yes"):
                st.session_state.logged_in = False
                st.session_state.anime_page = None
                st.session_state.token = None
            if no.button("No"):
                st.rerun()
        elif var == const.PAGE_PROFILE:
            if st.session_state.token==None:
                    st.session_state.action=False
                    st.rerun()
            up.profile(USER_EMAIL)
        elif var == const.PAGE_WISHLIST:
            if st.session_state.token==None:
                    st.session_state.action=False
                    st.rerun()
            wp.show_wishlist(USER_EMAIL)
        elif var == const.PAGE_CATEGORY:
            if st.session_state.token==None:
                    st.session_state.action=False
                    st.rerun()
            cp.show_categories(USER_EMAIL)




@st.cache_resource
def initialize_db():
    init_db()
    print("MongoDB connected")



def main():
    # if not st.session_state.logged_in:
    #     afa.auth()
    # else:

    home()

if __name__ == "__main__":
    initialize_db()
    main()