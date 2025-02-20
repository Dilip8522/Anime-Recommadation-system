
import pickle
import utils as ut
import data_preprocess as dp
import service.user_service as us
import numpy as np
import os
import time
import streamlit as st
import threading
import service.anime_count_service as acs
# Save the cosine similarity matrix to a file

file_path = 'cosine_similarity.pkl'

# Check if the file exists
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


file_path = 'cosine_similarity.pkl'



if os.path.exists(file_path):
    with open(file_path, 'rb') as f:
        loaded_cosine_sim = pickle.load(f)
    print("Loaded cosine similarity from 'cosine_similarity.pkl'")
else:
    cosine_sim = ut.compute_tfidf_and_cosine(dp.new_df)
    with open(file_path, 'wb') as f:
        pickle.dump(cosine_sim, f)
    print("Cosine similarity saved to 'cosine_similarity.pkl'")



def get_content_based_recommendations(id, age, cosine_sim=loaded_cosine_sim, top_n=10):
    if id >= len(cosine_sim):
        return None
    
    sim_scores = list(enumerate(cosine_sim[id]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    recommended_animes = []
    for i in range(1, top_n + 1):
        anime_name = dp.new_df.iloc[sim_scores[i][0]]
        
        # Check age category for filtering recommendations
        if age > 18 and anime_name["Age_Category"] in [1, 2, 3]:
            recommended_animes.append(anime_name)
        elif age <= 18 and anime_name["Age_Category"] in [1, 3]:
            recommended_animes.append(anime_name)

    return recommended_animes

def get_id_of_anime(name, en):
    if en:
        ind=dp.new_df[(dp.new_df["English name"]==name)].index[0]
    else:
        ind=dp.new_df[(dp.new_df["Name"]==name)].index[0]
    return ind

def get_anime_id_orginal(name, en=True):
    if en:
        ind=dp.new_df[(dp.new_df["English name"]==name)]["anime_id"]
    else:
        ind=dp.new_df[(dp.new_df["Name"]==name)]["anime_id"]
    print("------------------------------------- ind -- "+str(ind)+"-----------------------")
    return ind



def get_personalized_recommendations(user_email, age, cosine_sim=loaded_cosine_sim, top_n=12):
    user_profile = us.create_user_profile(user_email)
    
    if not user_profile:
        return []  # No recommendations if the user profile is empty

    # Create a weighted profile based on user interactions
    weighted_profile = np.zeros(cosine_sim.shape[1])
    
    for anime_name, count in user_profile.items():
        # Get the index of the anime in new_df
        index = dp.new_df[dp.new_df['English name'] == anime_name].index
        if not index.empty:
            weighted_profile += count * cosine_sim[index[0]]  # Weight the similarity by count

    # Calculate similarity scores
    similarity_scores = weighted_profile / np.linalg.norm(weighted_profile)  # Normalize if needed

    # Create a DataFrame for recommendations
    recommendations = dp.new_df.copy()
    recommendations['Similarity'] = similarity_scores
    
    # Filter recommendations based on age
    if age > 18:
        recommendations = recommendations[recommendations["Age_Category"].isin([1, 2, 3])]
    else:
        recommendations = recommendations[recommendations["Age_Category"].isin([1, 3])]

    # Sort by similarity and return the top N recommendations
    return recommendations.sort_values(by='Similarity', ascending=False).head(top_n)


#  track user method is here

# Set to track clicked anime IDs

clicked_animes = set()

# Function to clear the set every minute
def clear_clicked_animes():
    while True:
        time.sleep(60)  # Wait for 1 minute
        clicked_animes.clear()  # Clear the set

# Start the clearing thread
threading.Thread(target=clear_clicked_animes, daemon=True).start()

def track_click(user_email, anime):

    print("---------------------------------"+str(anime)+"----------------------------------------")
    # print("---------------------------------"+str(anime_id[0])+"----------------------------------------")
    if anime in clicked_animes:
        # print(f"Ignoring click for {anime_id} by {user_email} (already clicked recently)")
        return  # Ignore the click
    else:
        clicked_animes.add(anime)  # Add to the set
        # print(f"Tracking click for {anime_id} by {user_email}")
        acs.put_anime(email=user_email, anime_id=get_anime_id_orginal(anime))  # Count the click