# app/models.py
from pydantic import BaseModel, Field
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int
    price: float

class ShippingAddress(BaseModel):
    address: str
    city: str
    postal_code: str
    country: str

class Order(BaseModel):
    user_id: str
    order_items: List[OrderItem]
    shipping_address: ShippingAddress
    payment_method: str
    total_price: float
    status: Optional[str] = "Pending"

class UpdateOrderStatus(BaseModel):
    status: str
