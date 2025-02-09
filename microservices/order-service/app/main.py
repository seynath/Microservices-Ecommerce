# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routes import order_routes

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust based on your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Register the order routes
app.include_router(order_routes.router, prefix="/order")

# Test route
# @app.get("/")
# def read_root():
#     return {"message": "Order service is running!"}
