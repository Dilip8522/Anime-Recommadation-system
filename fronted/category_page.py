import streamlit as st
import data_preprocess as dp
import service.anime_wishlist_service as aws

def show_categories(email):
    # Get unique categories from the dataset
    categories = dp.new_df['Type'].unique()
    
    # Create a selectbox for category selection
    selected_category = st.selectbox(
        "Select Category",
        categories,
        index=0,
        help="Choose a category to see anime recommendations"
    )
    
    # Filter animes by selected category
    category_animes = dp.new_df[dp.new_df['Type'] == selected_category]
    
    if len(category_animes) == 0:
        st.write(f"No animes found in category: {selected_category}")
        return
    
    # Display animes in the selected category
    with st.container():
        for start in range(0, len(category_animes), 3):
            img_cols = st.columns(3)
            for it in range(start, min(start + 3, len(category_animes))):
                i = category_animes.iloc[it]
                
                with img_cols[it - start]:
                    st.image(i["Image URL"], use_container_width=True)
                    st.write("Name: " + str(i["Name"]))
                    
                    # Create columns for buttons
                    button_col1, button_col2 = st.columns(2)
                    
                    # Know More button
                    if button_col1.button("Know More", key=f"category_know_more_{i['English name']}_{it}"):
                        st.session_state.anime_page = i["English name"]
                        print(i["English name"])
                        st.rerun()
                    
                    # Wishlist button
                    anime_id = int(dp.new_df[(dp.new_df["English name"]==i["English name"])]["anime_id"].iloc[0])
                    is_in_wishlist = aws.is_anime_in_wishlist(email, anime_id)
                    wishlist_text = "🗑️ Remove" if is_in_wishlist else "📝 Add"
                    if button_col2.button(wishlist_text, key=f"category_wishlist_{i['English name']}_{it}"):
                        aws.toggle_wishlist(email, anime_id)
                        st.rerun() 