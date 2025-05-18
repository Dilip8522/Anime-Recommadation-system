import streamlit as st
import service.anime_wishlist_service as aws
import data_preprocess as dp

def show_wishlist(email):
    # Get user's wishlist
    wishlist_items = aws.get_user_wishlist(email)
    
    if not wishlist_items:
        st.write("Your wishlist is empty!")
        return
    
    # Create a container for the wishlist items
    with st.container():
        for start in range(0, len(wishlist_items), 3):
            img_cols = st.columns(3)
            for it in range(start, min(start + 3, len(wishlist_items))):
                wishlist_item = wishlist_items[it]
                # Get anime details from new_df
                anime_row = dp.new_df[dp.new_df['anime_id'] == wishlist_item.anime_id]
                if not anime_row.empty:
                    i = anime_row.iloc[0]
                    
                    with img_cols[it - start]:
                        st.image(i["Image URL"], use_container_width=True)
                        st.write("Name: " + str(i["Name"]))
                        
                        # Create columns for buttons
                        button_col1, button_col2 = st.columns(2)
                        
                        # Know More button
                        if button_col1.button("Know More", key=f"wishlist_know_more_{i['English name']}_{it}"):
                            st.session_state.anime_page = i["English name"]
                            print(i["English name"])
                            st.rerun()
                        
                        # Remove from wishlist button
                        if button_col2.button("🗑️ Remove", key=f"wishlist_remove_{i['English name']}_{it}"):
                            aws.toggle_wishlist(email, wishlist_item.anime_id)
                            st.rerun() 