# app/services/order_service.py
from app.database import order_collection
from app.models import Order
from bson.objectid import ObjectId
import pymongo

# Create a new order
async def create_order(order_data: Order):
    order_dict = order_data.dict()
    order = await order_collection.insert_one(order_dict)
    new_order = await order_collection.find_one({"_id": order.inserted_id})
    return new_order

# Retrieve all orders
async def retrieve_orders():
    orders = await order_collection.find().to_list(length=100)
    return orders

# Retrieve a specific order by ID
async def retrieve_order(id: str):
    order = await order_collection.find_one({"_id": ObjectId(id)})
    if order:
        return order
    return None

# Update the status of an order
async def update_order_status(id: str, status: str):
    update_result = await order_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )
    if update_result.modified_count > 0:
        updated_order = await order_collection.find_one({"_id": ObjectId(id)})
        return updated_order
    return None
