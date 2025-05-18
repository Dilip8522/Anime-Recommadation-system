from mongoengine import connect

def init_db():
    try:
        connect(
            db="animeRec",
            username="dilip",
            password="Dilip8522",
            host="mongodb+srv://dilip:Dilip8522@animerec.rczsx.mongodb.net/animeRec?retryWrites=true&w=majority",
            alias="default",
            tls=True
        )
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

init_db()