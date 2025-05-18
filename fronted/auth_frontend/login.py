import service.user_service  as us
import streamlit as st 
import utils as ut

def login():
    with st.form("login"):
        st.title("Login")
        email = st.text_input("email")
        password = st.text_input("Password", type="password")
        submit_form = st.form_submit_button("Submit")
    if submit_form:
        if us.check_credentials(email, password):
            st.success("Login successful")
            st.session_state.logged_in = True
            jwt_token=ut.create_jwt(email)
            st.session_state.token = jwt_token
            st.session_state.action=True
            st.rerun()
        else:
            st.session_state.logged_in = False
            st.warning("Enter correct details")
            # st.rerun()