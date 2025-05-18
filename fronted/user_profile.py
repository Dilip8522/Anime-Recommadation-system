import streamlit as st
import service.user_service as us 
import pandas as pd
import streamlit as st
import data_preprocess as dp

def profile(email):
    # Retrieve user profile data
    user_profile_dict_count = us.create_user_profile(email)  # {anime_id: count}
    # st.write(user_profile_dict_count)
    user_profile_dict_rating = us.user_profile_dict_rating(email)  # {anime_id: rating}
    # st.write(user_profile_dict_rating)

    # Initialize dictionaries for genres
    genres_count = {}
    genres_avg_rating = {}

    # Iterate through user profile clicks to populate genres_count
    for anime_id, count in user_profile_dict_count.items():
        # Find the corresponding row in new_df
        anime_row = dp.new_df[dp.new_df["English name"] == anime_id]
        if not anime_row.empty:
            genres = anime_row["Genres"].iloc[0].split(',')  # Split genres by commas
            for genre in genres:
                genre = genre.strip()  # Remove any leading/trailing whitespace
                # Update count
                if genre in genres_count:
                    genres_count[genre] += count
                else:
                    genres_count[genre] = count

                # Update average rating
                if genre in genres_avg_rating:
                    # Update the total rating and count for averaging
                    if user_profile_dict_rating[anime_id]:
                        genres_avg_rating[genre]['total_rating'] += user_profile_dict_rating[anime_id]
                        genres_avg_rating[genre]['count'] += 1
                else:
                    if user_profile_dict_rating[anime_id]:
                        genres_avg_rating[genre] = {
                            'total_rating': user_profile_dict_rating[anime_id],
                            'count': 1
                        }
                    
    

    # st.write(genres_count)

    # st.write(genres_avg_rating)

    # Create DataFrame for genres and counts
    df1 = pd.DataFrame(list(genres_count.items()), columns=['Genre', 'Count'])

    # Create DataFrame for genres and average ratings
    genres_avg_data = {
        genre: (data['total_rating'] / data['count']) for genre, data in genres_avg_rating.items()
    }
    df2 = pd.DataFrame(list(genres_avg_data.items()), columns=['Genre', 'Average Rating'])

    # Display DataFrames
    # st.write("Genre Counts:")
    # st.dataframe(df1)

    # st.write("Average Ratings by Genre:")
    # st.dataframe(df2)

    # Visualization
    st.title("User Likes this types of Genre")
    st.bar_chart(df1.set_index('Genre'))  # Bar chart for genre counts
    st.title("User Avg rating of Genre")
    st.line_chart(df2.set_index('Genre'))  # Line chart for average ratings