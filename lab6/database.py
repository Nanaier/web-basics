from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

# MongoDB settings
MONGO_DETAILS = "mongodb+srv://nanaier:02042004@maincluster.5nhdxbl.mongodb.net/newsletterSubscribers?retryWrites=true&w=majority"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.newsletterSubscribers

# Collections
subscribers_collection = database.subscribers
newsletters_collection = database.newsletters

