# app/main.py
import os
from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust based on your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# item based recommendation system
# get PRoduct Data
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL")
def get_product_data():
  print("PRODUCT_SERVICE_URL:", PRODUCT_SERVICE_URL)
  url = f"{PRODUCT_SERVICE_URL}/"
  response = requests.get(url)
  if response.status_code != 200:
    raise HTTPException(status_code=400, detail="Error checking product availability")
        # return False
    
  all_products = response.json()
  # print("Availability response:", all_products)
  return all_products

def get_order_data():
  url = f"{ORDER_SERVICE_URL}/"
  response = requests.get(url)
  if response.status_code != 200:
    raise HTTPException(status_code=400, detail="Error checking product availability")
        # return False
    
  all_orders = response.json()
  return all_orders

def item_based_recommendation():
  try:
    # get datafrom product service
    all_products =  get_product_data()
    # get all orders
    all_orders = get_order_data()
    
    return all_products
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  

# product based recommendation system



# Test route
@app.get("/")
def read_root():
    return {"message": "Product Recommendation service is running!"}

@app.get("/content-recommend")
def recommend_content():
    items = item_based_recommendation()
    return {"recommendations": items}
