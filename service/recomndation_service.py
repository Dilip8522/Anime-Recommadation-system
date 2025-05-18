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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import service.anime_count_service as acs
import random
# Initialize loaded_cosine_sim as None
loaded_cosine_sim = None

# Check if the file exists and load cosine similarity
file_path = 'cosine_similarity.pkl'
if os.path.exists(file_path):
    with open(file_path, 'rb') as f:
        loaded_cosine_sim = pickle.load(f)
    print("Loaded cosine similarity from 'cosine_similarity.pkl'")
else:
    loaded_cosine_sim = ut.compute_tfidf_and_cosine(dp.new_df)
    with open(file_path, 'wb') as f:
        pickle.dump(loaded_cosine_sim, f)
    print("Cosine similarity saved to 'cosine_similarity.pkl'")

def get_content_based_recommendations(id, age, email, cosine_sim=loaded_cosine_sim, top_n=20):
    acs.put_anime(email=email, anime_id=id)

    # Determine eligible animes based on age
    if age > 18:
        eligible_animes = dp.new_df[dp.new_df["Age_Category"].isin([1, 2, 3])]
    else:
        eligible_animes = dp.new_df[dp.new_df["Age_Category"].isin([1, 3])]

    # If ID is out of range, return random animes
    if id >= len(cosine_sim):
        sampled = eligible_animes.sample(n=min(top_n, len(eligible_animes)), replace=False)
        return [row.to_dict() for _, row in sampled.iterrows()]

    # Get similarity scores
    sim_scores = list(enumerate(cosine_sim[id]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Collect recommendations using similarity, filtered by age
    recommended = []
    for i in range(1, len(sim_scores)):
        row = dp.new_df.iloc[sim_scores[i][0]]
        if row["Age_Category"] in eligible_animes["Age_Category"].values:
            recommended.append(row.to_dict())
            if len(recommended) == top_n:
                break

    # If not enough age-appropriate recommendations, fill with randoms
    if len(recommended) < top_n:
        needed = top_n - len(recommended)
        already_ids = [r["anime_id"] for r in recommended]
        filler_candidates = eligible_animes[~eligible_animes["anime_id"].isin(already_ids)]
        filler = filler_candidates.sample(n=min(needed, len(filler_candidates)), replace=False)
        recommended += [row.to_dict() for _, row in filler.iterrows()]

    return recommended

# def get_id_of_anime(name, en):
#     if en:
#         ind=dp.new_df[(dp.new_df["English name"]==name)].index[0]
#     else:
#         ind=dp.new_df[(dp.new_df["Name"]==name)].index[0]
#     return ind

# def get_anime_id_orginal(name, en=True):
#     if en:
#         ind = int(dp.new_df[(dp.new_df["English name"]==name)]["anime_id"].iloc[0])
#     else:
#         ind = int(dp.new_df[(dp.new_df["Name"]==name)]["anime_id"].iloc[0])
#     print("------------------------------------- ind -- "+str(ind)+"-----------------------")
#     return ind

def get_personalized_recommendations(user_email, age=19, cosine_sim=loaded_cosine_sim, top_n=12):
    user_profile = us.create_user_profile(user_email)
    
    if not user_profile:
        return []  # No recommendations if the user profile is empty

    weighted_profile = np.zeros(cosine_sim.shape[1])
    
    for anime_name, count in user_profile.items():
        index = dp.new_df[dp.new_df['English name'] == anime_name].index
        if not index.empty:
            weighted_profile += count * cosine_sim[index[0]]

    similarity_scores = weighted_profile / np.linalg.norm(weighted_profile)

    recommendations = dp.new_df.copy()
    recommendations['Similarity'] = similarity_scores

    if age > 18:
        recommendations = recommendations[recommendations["Age_Category"].isin([1, 2, 3])]
    else:
        recommendations = recommendations[recommendations["Age_Category"].isin([1, 3])]

    # ✅ Convert to list of dictionaries before returning
    return recommendations.sort_values(by='Similarity', ascending=False).head(top_n).to_dict(orient='records')



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