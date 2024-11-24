

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ShippingAddress(BaseModel):
    address: str
    city: str
    state: str
    country: str
    zip: str
    phone: str

class BillingAddress(BaseModel):
    first_name: str
    last_name: str
    address: str
    city: str
    state: str
    country: str
    zip: str
    phone: str

class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    image: Optional[str] = None
    total_price: float
    variant_id: str
    quantity: int
    price: float
    attributes: Optional[List[Dict[str, Any]]] = None  # Store attributes as list of key-value pairs

class OrderCreate(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email: str
    shipping_address: ShippingAddress
    billing_address: BillingAddress
    payment_method: Optional[str]
    order_items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    email: str
    total_price: float
    payment_method: Optional[str]
    status: str
    created_at: datetime
    shipping_address: ShippingAddress
    order_items: List[OrderItemCreate]

    class Config:
        orm_mode = True





# # schemas.py
# from pydantic import BaseModel
# from typing import List, Optional
# from datetime import datetime
# from pydantic import validator


# class ShippingAddress(BaseModel):
#     address: str
#     city: str
#     state: str
#     country: str
#     zip: str
#     phone: str

# class BillingAddress(BaseModel):
#     first_name: str
#     last_name: str
#     address: str
#     city: str
#     state: str
#     country: str
#     zip: str
#     phone: str

# class OrderItemCreate(BaseModel):
#     product_id: str
#     product_name: str
#     color: Optional[str] = None
#     size: Optional[str] = None
#     image: Optional[str] = None
#     total_price: float
#     variant_id: str
#     quantity: int
#     price: float
#     @validator('color', 'size', pre=True, always=True)
#     def handle_empty_string(cls, v):
#         return v if v != "" else None

# class OrderCreate(BaseModel):
#     user_id: int
#     first_name: str
#     last_name: str
#     email: str
#     shipping_address: ShippingAddress
#     billing_address: BillingAddress
#     payment_method: Optional[str]
#     order_items: List[OrderItemCreate]

# class OrderResponse(BaseModel):
#     id: int
#     user_id: int
#     first_name: str
#     last_name: str
#     email: str
#     total_price: float
#     payment_method: Optional[str]
#     status: str
#     created_at: datetime
#     shipping_address: ShippingAddress
#     order_items: List[OrderItemCreate]
    

#     class Config:
#         orm_mode = True




# # app/schemas.py
# from pydantic import BaseModel
# from typing import List, Optional
# from datetime import datetime

# class OrderItemCreate(BaseModel):
#     product_id: int
#     image_url: Optional[str]
#     product_name: str
#     variant_id: Optional[str]
#     quantity: int
#     price: float

# class OrderCreate(BaseModel):
#     user_id: str
#     cart_id: str
#     total_price: float
#     payment_method: str
#     shipping_address: str
#     order_items: List[OrderItemCreate]

# class OrderResponse(BaseModel):
#     id: int
#     user_id: str
#     total_price: float
#     payment_method: str
#     shipping_address: str
#     status: str
#     created_at: datetime
#     order_items: List[OrderItemCreate]

#     class Config:
#         orm_mode = True
