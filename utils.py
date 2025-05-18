import uuid
import bcrypt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import data_preprocess as dp
import streamlit as st
import datetime
# Generate a random UUID
def get_id():
    return str(uuid.uuid4())

def encrpt(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def dcrypt(password, db_password):
    return bcrypt.checkpw(password.encode('utf-8'), db_password)

@st.cache_resource
def compute_tfidf_and_cosine(df):
    print("starting....")
    import time
    start_time = time.time()
    print("starting_vectors....")
    tfidf_vec = TfidfVectorizer(stop_words="english")
    print("TfidfVectorizer.... complted")
    tfidf_mat = tfidf_vec.fit_transform(df["tags"])
    print("fit transfer completed...")
    cosine_sim = cosine_similarity(tfidf_mat, tfidf_mat)
    print("cosine similarity ....")
    end_time = time.time()
    duration = end_time - start_time
    print(f"took {duration:.2f} seconds to execute.")
    return cosine_sim

import jwt
import datetime
import secrets
# Generates a random 32-character hex string
# Secret key for encoding and decoding the JWT
SECRET_KEY = secrets.token_hex(16)

def create_jwt(email):
    payload = {
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=100)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def extract_email_from_jwt(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return decoded.get('email')
    except jwt.ExpiredSignatureError:
        return 'Token has expired'
    except jwt.InvalidTokenError:
        return 'Invalid token'

def verify_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

# Example usage
# if __name__ == "__main__":
#     user_id = 123
#     username = "john_doe"
#     token = create_jwt(user_id)
#     print("Generated JWT:", token)

#     decoded_payload = verify_jwt(token)
#     if isinstance(decoded_payload, dict):
#         username = decoded_payload.get('email')  # Retrieve the username
#         print("Decoded Username:", username)
#     else:
#         print(decoded_payload)  # Handle error message
