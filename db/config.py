from mongoengine import connect
def init_db():
    connect(
        db="Dsp",
        username="devisriprasad948",
        password="123",
        host="mongodb+srv://devisriprasad948:123@cluster0.tz2oa.mongodb.net/"
    )
