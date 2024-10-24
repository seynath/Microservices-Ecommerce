# app/routes/order_routes.py
from fastapi import APIRouter, HTTPException, status
from app.models import Order, UpdateOrderStatus
from app.services.order_service import create_order, retrieve_orders, retrieve_order, update_order_status

router = APIRouter()

# Create a new order
@router.post("/orders", status_code=status.HTTP_201_CREATED)
async def create_new_order(order: Order):
    new_order = await create_order(order)
    return new_order

# Get all orders
@router.get("/orders", status_code=status.HTTP_200_OK)
async def get_all_orders():
    orders = await retrieve_orders()
    return orders

# Get a single order by ID
@router.get("/orders/{id}", status_code=status.HTTP_200_OK)
async def get_order(id: str):
    order = await retrieve_order(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Update order status
@router.put("/orders/{id}/status", status_code=status.HTTP_200_OK)
async def update_order(id: str, status_update: UpdateOrderStatus):
    updated_order = await update_order_status(id, status_update.status)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found or status update failed")
    return updated_order
