import service.user_service as us
import streamlit as st 
import utils as ut

def signup():
    with st.form(key="signup"):
        st.title("Signup")
        name = st.text_input("Name")
        age=st.text_input("Age")
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        done = st.form_submit_button("Submit")
        if done:
            if us.check_email_exist(email):
                st.session_state.logged_in = False
                st.warning("Email already exists")
            else:
                st.session_state.logged_in = True
                jwt_token=ut.create_jwt(email)
                st.session_state.token = jwt_token
                st.session_state.action=True
                us.save_user(name, email, password, age)
                st.rerun()