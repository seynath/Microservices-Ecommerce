from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    total_price = Column(Float, nullable=False)
    payment_method = Column(String, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    order_items = relationship("OrderItem", back_populates="order")
    shipping_address = relationship("ShippingAddress", back_populates="order", uselist=False)
    billing_address = relationship("BillingAddress", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    product_id = Column(String, nullable=False)
    product_name = Column(String, nullable=False)
    image = Column(String, nullable=True)
    total_price = Column(Float, nullable=False)
    variant_id = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    attributes = Column(JSON, nullable=True)  # Store dynamic attributes as JSON

    order = relationship("Order", back_populates="order_items")

class ShippingAddress(Base):
    __tablename__ = "shipping_addresses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    order_id = Column(Integer, ForeignKey('orders.id'))
    order = relationship("Order", back_populates="shipping_address")

class BillingAddress(Base):
    __tablename__ = "billing_addresses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    order_id = Column(Integer, ForeignKey('orders.id'))
    order = relationship("Order", back_populates="billing_address")


# # models.py
# from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
# from sqlalchemy.orm import relationship
# from .database import Base
# from datetime import datetime

# class Order(Base):
#     __tablename__ = "orders"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     user_id = Column(Integer, nullable=False)
#     first_name = Column(String, nullable=False)
#     last_name = Column(String, nullable=False)
#     email = Column(String, nullable=False)
#     total_price = Column(Float, nullable=False)
#     payment_method = Column(String, nullable=True)
#     status = Column(String, default="Pending")
#     created_at = Column(DateTime, default=datetime.utcnow)

#     # Relationships
#     order_items = relationship("OrderItem", back_populates="order")
#     shipping_address = relationship("ShippingAddress", back_populates="order", uselist=False)
#     billing_address = relationship("BillingAddress", back_populates="order", uselist=False)
    
# class OrderItem(Base):
#     __tablename__ = "order_items"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     order_id = Column(Integer, ForeignKey('orders.id'))
#     product_id = Column(String, nullable=False)
#     product_name = Column(String, nullable=False)
#     color = Column(String, nullable=True)
#     size = Column(String, nullable=True)
#     image = Column(String, nullable=True)
#     total_price = Column(Float, nullable=False)
#     variant_id = Column(String, nullable=False)
#     quantity = Column(Integer, nullable=False)
#     price = Column(Float, nullable=False)
    
#     order = relationship("Order", back_populates="order_items")

# class ShippingAddress(Base):
#     __tablename__ = "shipping_addresses"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     address = Column(String, nullable=False)
#     city = Column(String, nullable=False)
#     state = Column(String, nullable=False)
#     country = Column(String, nullable=False)
#     zip = Column(String, nullable=False)
#     phone = Column(String, nullable=False)

#     order_id = Column(Integer, ForeignKey('orders.id'))
#     order = relationship("Order", back_populates="shipping_address")
    
# class BillingAddress(Base):
#    __tablename__ = "billing_addresses"

#    id = Column(Integer, primary_key=True, index=True)
#    address = Column(String, nullable=False)
#    city = Column(String, nullable=False)
#    state = Column(String, nullable=False)
#    country = Column(String, nullable=False)
#    zip = Column(String, nullable=False)
#    phone = Column(String, nullable=False)
#    first_name = Column(String, nullable=False)
#    last_name = Column(String, nullable=False)
        
#    order_id = Column(Integer, ForeignKey('orders.id'))
#    order = relationship("Order", back_populates="billing_address")


# # app/models.py
# from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
# from sqlalchemy.orm import relationship
# from .database import Base
# from datetime import datetime

# class Order(Base):
#     __tablename__ = "orders"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, nullable=False)
#     total_price = Column(Float, nullable=False)
#     payment_method = Column(String, nullable=False)
#     shipping_address = Column(String, nullable=False)
#     status = Column(String, default="Pending")
#     created_at = Column(DateTime, default=datetime.utcnow)
#     order_status = Column(String, default="Pending")

#     # Relationships
#     order_items = relationship("OrderItem", back_populates="order")

# class OrderItem(Base):
#     __tablename__ = "order_items"

#     id = Column(Integer, primary_key=True, index=True)
#     order_id = Column(Integer, ForeignKey('orders.id'))
#     product_id = Column(Integer, nullable=False)
#     quantity = Column(Integer, nullable=False)
#     price = Column(Float, nullable=False)

#     order = relationship("Order", back_populates="order_items")

# class Shipping(Base):
#     __tablename__ = "shipping"

#     id = Column(Integer, primary_key=True, index=True)
#     order_id = Column(Integer, ForeignKey('orders.id'))
#     address = Column(String, nullable=False)
#     city = Column(String, nullable=False)
#     postal_code = Column(String, nullable=False)
#     country = Column(String, nullable=False)
#     mobile = Column(Integer, nullable=False)
#     order = relationship("Order", back_populates="shipping")
