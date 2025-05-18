import streamlit as st 
import fronted.auth_frontend.signup as afs 
import fronted.auth_frontend.login as afl
def auth():
    var = st.sidebar.radio("", ["Login Page", "SignUp Page"])
    if var == "SignUp Page":
        afs.signup()
    else:
        afl.login()