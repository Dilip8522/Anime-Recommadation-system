from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import service.user_service as us
import service.anime_count_service as acs
import service.anime_wishlist_service as aws
import service.recomndation_service as srs
import service.anime_like_service as als
import utils as ut
import data_preprocess as dp
from pydantic import BaseModel
from typing import Optional
import pandas as pd
from db.config import init_db
import db.crud.anime_click_crud as acc
import pandas as pd
import fronted.user_profile as up
import requests

init_db()

app = Flask(__name__)
# Enable CORS
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# ------------------ MODELS ------------------
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    age: int

class AnimeBase(BaseModel):
    anime_id: int
    Name: str
    English_name: Optional[str]
    Genres: Optional[str]
    Image_URL: Optional[str]

class UserProfile(BaseModel):
    email: str
    name: Optional[str]
    age: Optional[int]

class AnimeInteraction(BaseModel):
    email: str
    anime_id: int

class AnimeRating(BaseModel):
    email: str
    anime_id: int
    rating: float

# ------------------ DATA LOADING ------------------
try:
    df = pd.read_csv('new_df.csv')
except Exception as e:
    print(f"Error loading CSV: {e}")
    df = pd.DataFrame()

# ------------------ HELPERS ------------------
def get_token_from_header():
    auth = request.headers.get('Authorization', None)
    if not auth:
        abort(401, description="Authorization header missing")
    parts = auth.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        abort(401, description="Invalid authorization header")
    return parts[1]

# ------------------ ROOT ------------------
@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "Anime Recommendation API"})

# ------------------ AUTH ------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user = UserRegister(**data)
    try:
        if us.check_email_exist(user.email):
            return jsonify({"detail": "Email already exists"}), 400
        us.save_user(user.name, user.email, user.password, user.age)
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = UserLogin(**data)
    try:
        if us.check_credentials(user.email, user.password):
            token = ut.create_jwt(user.email)
            return jsonify({"token": token, "email": user.email})
        return jsonify({"detail": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/verify-token', methods=['GET'])
def verify_token():
    token = get_token_from_header()
    try:
        payload = ut.verify_jwt(token)
        return jsonify({"valid": True, "email": payload.get("email")})
    except Exception:
        abort(401, description="Invalid token")

# ------------------ ANIMES ------------------
@app.route('/animes', methods=['GET'])
def get_all_animes():
    try:
        skip = int(request.args.get('skip', 0))
        limit = int(request.args.get('limit', 21))
        animes = df.iloc[skip:skip+limit].to_dict('records')
        return jsonify({"total": len(df), "animes": animes})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/search', methods=['GET'])
def search_animes():
    query = request.args.get('query', None)
    if query is None or query=="":
        return jsonify({"detail": "No query provided"}), 400
    try:
        token = request.headers.get('Authorization')
        if  ut.verify_jwt(token)==False:
            return jsonify({"detail": "Invalid token"}), 401
        if token:
            email = ut.extract_email_from_jwt(token)
        else:
            return jsonify({"detail": "No token provided"}), 401
        if not query:
            return jsonify({"animes": []})
        filtered_df = df[
            df['Name'].str.contains(query, case=False, na=False) |
            df['English name'].str.contains(query, case=False, na=False)
        ]
        anime_id = int(filtered_df.iloc[0,0])
        acs.put_anime(anime_id=anime_id,email=email)
        results = filtered_df.head(20).to_dict('records')
        return jsonify({"animes": results})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/anime/details', methods=['GET'])
def get_anime_details():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"detail": "No token provided"}), 401
    if not ut.verify_jwt(token):
        return jsonify({"detail": "Invalid token"}), 401

    email = ut.extract_email_from_jwt(token)
    anime_id = request.args.get('anime_id', type=int)
    if anime_id is None:
        return jsonify({"detail": "Missing anime_id parameter"}), 400

    try:
        details = df[df['anime_id'] == anime_id].to_dict('records')
        if not details:
            return jsonify({"detail": "Anime not found"}), 404
        return jsonify({"details": details[0]})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/anime/content-based-recommendations', methods=['GET'])
def content_based():
    try:
        token = request.headers.get('Authorization')
        if  ut.verify_jwt(token)==False:
            return jsonify({"detail": "Invalid token"}), 401
        if token:
            email = ut.extract_email_from_jwt(token)
        else:
            return jsonify({"detail": "No token provided"}), 401
        anime_id = int(request.args.get('anime_id'))
        # anime_id_str = request.args.get('anime_id', '').strip()
        # anime_id_clean = ''.join(filter(str.isdigit, anime_id_str))
        # anime_id = int(anime_id_clean)
        age = request.args.get('age', None)
        age = int(age) if age is not None else None

        recs = srs.get_content_based_recommendations(anime_id, age, email)  # list of Series
        # convert each pandas Series -> dict
        # recs_list = [series.to_dict() for series in recs]
        print(type(recs))


        return jsonify({"recommendations": recs})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

    
@app.route('/anime/personalized-recommendations', methods=['GET'])
def personalized():
    # email = request.args.get('email')
    try:
        token = request.headers.get('Authorization')
        if  ut.verify_jwt(token)==False:
            return jsonify({"detail": "Invalid token"}), 401
        if token:
            email = ut.extract_email_from_jwt(token)
        else:
            return jsonify({"detail": "No token provided"}), 401
        recs = srs.get_personalized_recommendations(email)
        return jsonify({"recommendations": recs})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

# @app.route('/anime/popular', methods=['GET'])
# def popular_anime():
#     try:
#         token = request.headers.get('Authorization')
#         if  ut.verify_jwt(token)==False:
#             return jsonify({"detail": "Invalid token"}), 401
#         if token:
#             email = ut.extract_email_from_jwt(token)
#         else:
#             return jsonify({"detail": "No token provided"}), 401
#         pop = dp.get_most_popular()
#         return jsonify({"popular": pop})
#     except Exception as e:
#         return jsonify({"detail": str(e)}), 500

# ------------------ PROFILE ------------------
@app.route('/get-user-profile', methods=['GET'])
def get_user_profile():
    email = request.args.get('email')
    try:
        token = request.headers.get('Authorization')
        if  ut.verify_jwt(token)==False:
            return jsonify({"detail": "Invalid token"}), 401
        if token:
            email = ut.extract_email_from_jwt(token)
        else:
            return jsonify({"detail": "No token provided"}), 401
        profile = up.profile(email)
        return jsonify({"profile": profile})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/update-user-profile', methods=['POST'])
def update_profile():
    token = request.headers.get('Authorization')
    if  ut.verify_jwt(token)==False:
        return jsonify({"detail": "Invalid token"}), 401
    if token:
        email = ut.extract_email_from_jwt(token)
    else:
        return jsonify({"detail": "No token provided"}), 401
    data = request.get_json()
    profile = UserProfile(**data)
    try:
        us.update_profile(profile.email, profile.name, profile.age)
        return jsonify({"message": "Profile updated"})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

# ------------------ LIKE ------------------

@app.route('/is-anime-liked', methods=['GET'])
def is_liked():
    token = request.headers.get('Authorization')
    if not token or not ut.verify_jwt(token):
        return jsonify({"detail": "Invalid token"}), 401

    email = ut.extract_email_from_jwt(token)
    anime_id = request.args.get('anime_id')

    if not anime_id:
        return jsonify({"detail": "anime_id is required"}), 400

    try:
        anime_id = int(anime_id)
        liked = als.is_anime_liked(email, anime_id)
        return jsonify({"liked": liked})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/toggle-like', methods=['POST'])
def toggle_like_api():
    token = request.headers.get('Authorization')
    if not token or not ut.verify_jwt(token):
        return jsonify({"detail": "Invalid token"}), 401

    email = ut.extract_email_from_jwt(token)

    data = request.get_json()
    anime_id = data.get("anime_id")

    if not anime_id:
        return jsonify({"detail": "anime_id is required"}), 400

    try:
        anime_id = int(anime_id)
        liked = als.toggle_like(email, anime_id)
        return jsonify({"liked": liked})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500



# ------------------ RATING ------------------
@app.route('/submit-rating', methods=['POST'])
def submit_rating():
    token = request.headers.get('Authorization')
    if not token or not ut.verify_jwt(token):
        return jsonify({"detail": "Invalid token"}), 401

    email = ut.extract_email_from_jwt(token)

    try:
        data = request.get_json()
        anime_id = data.get("anime_id")
        rating = data.get("rating")

        if anime_id is None or rating is None:
            return jsonify({"detail": "anime_id and rating are required"}), 400

        anime_id = int(anime_id)
        rating = float(rating)

        acc.update_rating(email, anime_id, rating)
        return jsonify({"message": "Rating submitted"})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

# ------------------ WISHLIST ------------------

@app.route('/is-in-wishlist', methods=['GET'])
def is_in_wishlist():
    try:
        token = request.headers.get('Authorization')
        if not token or not ut.verify_jwt(token):
            return jsonify({"detail": "Invalid or missing token"}), 401

        email = ut.extract_email_from_jwt(token)
        anime_id = int(request.args.get('anime_id'))

        return jsonify({"in_wishlist": aws.is_anime_in_wishlist(email, anime_id)})

    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/toggle-wishlist', methods=['POST'])
def toggle_wishlist():
    try:
        token = request.headers.get('Authorization')
        if not token or not ut.verify_jwt(token):
            return jsonify({"detail": "Invalid or missing token"}), 401

        email = ut.extract_email_from_jwt(token)
        data = request.get_json()
        anime_id = int(data.get("anime_id"))

        in_wishlist = aws.toggle_wishlist(email, anime_id)
        return jsonify({"in_wishlist": in_wishlist})

    except Exception as e:
        return jsonify({"detail": str(e)}), 500


@app.route('/get-wishlist', methods=['GET'])
def get_wishlist():
    try:
        token = request.headers.get('Authorization')
        if not token or not ut.verify_jwt(token):
            return jsonify({"detail": "Invalid or missing token"}), 401

        email = ut.extract_email_from_jwt(token)
        wishlist_query = aws.get_user_wishlist(email)

        # Convert each document to a dict
        wishlist = [
            {
                "anime_id": item.anime_id,
                "email": item.email
            }
            for item in wishlist_query
        ]

        return jsonify({"wishlist": wishlist})

    except Exception as e:
        return jsonify({"detail": str(e)}), 500


df = pd.read_csv("new_df.csv")
# ------------------ CATEGORIES ------------------
@app.route('/get-categories', methods=['GET'])
def get_categories():
    try:
        token = request.headers.get('Authorization')
        if not token or not ut.verify_jwt(token):
            return jsonify({"detail": "Invalid or missing token"}), 401

        # Optional: email = ut.extract_email_from_jwt(token)

        # Get all unique genre/category strings
        raw_types = df['Genres'].dropna().unique()

        # Split by comma and flatten
        all_categories = set()
        for type_str in raw_types:
            parts = [x.strip() for x in type_str.split(",")]
            all_categories.update(parts)

        return jsonify({"categories": sorted(all_categories)})

    except Exception as e:
        return jsonify({"detail": str(e)}), 500



@app.route('/get-anime-by-category', methods=['GET'])
def get_anime_by_category():
    try:
        token = request.headers.get('Authorization')
        if not token or not ut.verify_jwt(token):
            return jsonify({"detail": "Invalid or missing token"}), 401

        category = request.args.get('category')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))

        filtered_df = df[df['Genres'].str.contains(rf'\b{category}\b', na=False, case=False)]
        filtered_df = filtered_df.iloc[offset:offset+limit]

        anime_list = filtered_df.to_dict(orient="records")
        return jsonify({"animes": anime_list})

    except Exception as e:
        return jsonify({"detail": str(e)}), 500

#-----user profile charts-------
@app.route('/api/user/genre-data', methods=['POST'])
def get_genre_data():
    token = request.headers.get('Authorization')
    if  ut.verify_jwt(token)==False:
        return jsonify({"detail": "Invalid token"}), 401
    if token:
        email = ut.extract_email_from_jwt(token)
    else:
        return jsonify({"detail": "No token provided"}), 401
    # data = request.json
    # email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Fetch data
    user_profile_dict_count = us.create_user_profile(email)
    user_profile_dict_rating = us.user_profile_dict_rating(email)

    genres_count = {}
    genres_avg_rating = {}

    for anime_id, count in user_profile_dict_count.items():
        anime_row = dp.new_df[dp.new_df["English name"] == anime_id]
        if not anime_row.empty:
            genres = anime_row["Genres"].iloc[0].split(',')
            for genre in genres:
                genre = genre.strip()

                genres_count[genre] = genres_count.get(genre, 0) + count

                if user_profile_dict_rating.get(anime_id):
                    if genre not in genres_avg_rating:
                        genres_avg_rating[genre] = {'total_rating': 0, 'count': 0}
                    genres_avg_rating[genre]['total_rating'] += user_profile_dict_rating[anime_id]
                    genres_avg_rating[genre]['count'] += 1

    # Prepare data for response
    bar_data = [{'genre': genre, 'count': count} for genre, count in genres_count.items()]
    line_data = [
        {
            'genre': genre,
            'average_rating': round(data['total_rating'] / data['count'], 2)
        }
        for genre, data in genres_avg_rating.items() if data['count'] > 0
    ]

    return jsonify({'bar_chart': bar_data, 'line_chart': line_data})

CLIENT_ID = 'b7a04831f4e823107ea5e6f6cf79881d'

def simplify_title(title):
    import re
    if not title:
        return ''
    title = title.lower()
    title = re.sub(r'[:\-–—]', ' ', title)
    title = re.sub(r'[^\w\s]', '', title)
    title = re.sub(r'\s+', ' ', title)
    return title.strip()

@app.route('/search-anime', methods=['GET'])
def search_anime():
    query = request.args.get('q', '')
    simplified_query = simplify_title(query)
    url = f'https://api.myanimelist.net/v2/anime?q={simplified_query}&limit=3&fields=id,title,main_picture'

    try:
        headers = {'X-MAL-CLIENT-ID': CLIENT_ID}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        if 'data' in data and len(data['data']) > 0:
            return jsonify(data['data'][0]['node'])
        else:
            return jsonify({'error': 'No anime found'}), 404
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# ------------------ TRACKING ------------------
# @app.route('/track-click', methods=['POST'])
# def track_click():
#     data = request.get_json()
#     interaction = AnimeInteraction(**data)
#     try:
#         token = request.headers.get('Authorization')
#         if  ut.verify_jwt(token)==False:
#             return jsonify({"detail": "Invalid token"}), 401
#         if token:
#             email = ut.extract_email_from_jwt(token)
#         else:
#             return jsonify({"detail": "No token provided"}), 401
#         acs.put_anime(interaction.email, interaction.anime_id)
#         return jsonify({"message": "Click tracked"})
#     except Exception as e:
#         return jsonify({"detail": str(e)}), 500

# ----------------groq Api -------------------------------
# from langchain_groq.chat_models import ChatGroq
# from langchain.schema import HumanMessage

# # Initialize the Groq chat model
# groq_model = ChatGroq(
#     model="llama-3.1-8b-instant",  # replace with your target Groq model
#     temperature=0.7,              # adjust for more or less randomness
#     max_tokens=512                # optional: cap generation length
# )
# # Send a single user message
# response = groq_model([HumanMessage(content="Hello, how are you?")])
# print(response.content)

# @app.route('/anime/chatBot', methods=['GET'])
# def content_based():
#     try:
#         token = request.headers.get('Authorization')
#         if  ut.verify_jwt(token)==False:
#             return jsonify({"detail": "Invalid token"}), 401
#         if token:
#             email = ut.extract_email_from_jwt(token)
#         else:
#             return jsonify({"detail": "No token provided"}), 401
#         query = int(request.args.get('query'))
#         age = request.args.get('age', None)
#         age = int(age) if age is not None else None

#         recs = srs.get_content_based_recommendations(anime_id, age, email)  # list of Series
#         # convert each pandas Series -> dict
#         # recs_list = [series.to_dict() for series in recs]
#         print(type(recs))


#         return jsonify({"recommendations": recs})
#     except Exception as e:
#         return jsonify({"detail": str(e)}), 500
# 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   Groq key
# ------------------ MAIN ------------------
# if __name__ == "__main__":
print("running")
app.run(host="0.0.0.0", port=8000)