# # app/database.py
# import motor.motor_asyncio
# import os
# from dotenv import load_dotenv
# import ssl

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")

# client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI, ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
# database = client['order']  # Use the 'order' database as per your URI
# order_collection = database.get_collection("orders")
 
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
database = client['order']
order_collection = database.get_collection("orders")