from pymongo import MongoClient

# Local MongoDB (default)
MONGO_URI = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URI)

db = client["smart_ems"]
alerts_collection = db["alerts"]
