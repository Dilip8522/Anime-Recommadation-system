import pandas as pd

new_df=pd.read_csv("new_df.csv")

# df=pd.read_csv("anime-dataset-2023.csv")

# # df = df[(df["Popularity"] != 0) & 
# #                 # (rank_df["score"] != 0) & 
# #                 # (rank_df["members"] != 0) & 
# #                 (df["Favorites"] != 0)
# #                ]


# new_df=df[['anime_id', 'Name', 'English name','Genres','Synopsis', 'Type','Status',"Popularity",
#        'Producers', 'Licensors', 'Studios', 'Source', 'Rating','Image URL']]

# rank_df=df[['anime_id', 'Name', 'Popularity', 'Favorites', 'Image URL']]

# # rank_df = rank_df[(rank_df["Popularity"] != 0) & 
# #                 # (rank_df["score"] != 0) & 
# #                 # (rank_df["members"] != 0) & 
# #                 (rank_df["Favorites"] != 0)
# #                ]

# new_df=new_df.replace("UNKNOWN","")

# new_df.loc[new_df['English name'] == "", 'English name'] = new_df['Name']

# name_count = {}

# # Function to append a number to duplicates
# def rename_duplicates(name):
#     if name in name_count:
#         name_count[name] += 1
#         return f"{name} {name_count[name]}"
#     else:
#         name_count[name] = 1
#         return name

# # Apply the function to the 'English name' column
# new_df['English name'] = new_df['English name'].apply(rename_duplicates)

# # rank_df["English name"]=new_df['English name']

# new_df["tags"] = new_df["Name"]+" "+new_df["English name"]+" "+new_df["Genres"]+" "+new_df["Synopsis"]+" "+new_df["Type"]+" "+new_df["Producers"]+" "+new_df["Licensors"]+" "+new_df["Studios"]+" "+new_df["Rating"]+" "+new_df["Source"]

# removing stop words using nltk

# import nltk
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize

# nltk.download('punkt', force=True)
# nltk.download('stopwords')

# stop_words=set(stopwords.words('english'))

# def apply_for_removing_stop_words(text):
#     words=word_tokenize(text)
#     words=[word.lower() for word in words if word.isalpha()]
#     words=[word for word in words if word not in stop_words]
#     return ' '.join(words)

# new_df["tags"]=new_df["tags"].apply(apply_for_removing_stop_words)



# import spacy
# nlp = spacy.load('en_core_web_sm')
# def apply_for_removing_stop_words(text):
#     doc=nlp(text)
#     filtered_words = [token.text for token in doc if not token.is_stop and not token.is_punct]
#     return ' '.join(filtered_words)

# new_df["tags"]=new_df["tags"].apply(apply_for_removing_stop_words)

# age classification

def age_convert(row):
    if row["Rating"] == "R - 17+ (violence & profanity)" or \
       row["Rating"] == "Rx - Hentai" or \
       row["Rating"] == "R+ - Mild Nudity":
        return 2

    if row["Rating"] == "PG - Children" or \
       row["Rating"] == "PG-13 - Teens 13 or older":
        return 1
    
    if row["Rating"] == "G - All Ages" or \
       row["Rating"] == "":
        return 3

# Apply the function to the DataFrame
new_df['Age_Category'] = new_df.apply(age_convert, axis=1)



li_animes=new_df["English name"]
li_animes_names=new_df["Name"]
li_animes_unknown_index=0

for it,i in enumerate(li_animes):
    if i=="":
        li_animes[it]="search"
        li_animes_unknown_index=it
        break



import pickle
