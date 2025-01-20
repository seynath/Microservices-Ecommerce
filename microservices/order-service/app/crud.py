# crud.py
from sqlalchemy.orm import Session
from . import models, schemas
import requests
from fastapi import HTTPException
import os
import pika
import json

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL")

def publish_to_rabbitmq(queue_name: str, message: dict):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    
    # Declare the queue
    channel.queue_declare(queue=queue_name, durable=True)
    
    # Publish the message
    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2  # Make message persistent
        )
    )
    connection.close()

def create_order(db: Session, order_data: schemas.OrderCreate):
#    print("aaaawa")
    not_available_products = []
    available_not_sufficient_products = []

    for item in order_data.order_items:
        availability = check_product_availability(item.product_id, item.variant_id, item.quantity, not_available_products,available_not_sufficient_products, order_data.user_id, item)
        if (availability == False):
                order_data.order_items.remove(item)
                continue
        #    deduct the quantity from the product
        # updateStatus = deduct_product_quantity(item.product_id, item.variant_id, item.quantity)
        # if (updateStatus == False):
        #     #    remove the item from the order and continue to the next item
        #         order_data.order_items.remove(item)
        #         continue
    # if len(not_available_products) > 0:
         # return False
    if len(not_available_products ) > 0:
        raise HTTPException(status_code=400, detail={"message": "Some Products not available", "product_ids": not_available_products})
    
    if len(available_not_sufficient_products) > 0:
        raise HTTPException(status_code=400, detail={"message": "Products not available for sufficient quantity", "product_ids": available_not_sufficient_products})
    if(len(order_data.order_items) == 0):
            raise HTTPException(status_code=400, detail={"message": "All products not available", "product_ids": not_available_products})
    

    # Create the main order entry.
    order = models.Order(

            user_id=order_data.user_id,
            first_name=order_data.first_name,
            last_name=order_data.last_name,
            email=order_data.email,
            total_price=sum(item.total_price for item in order_data.order_items),
            payment_method=order_data.payment_method,
            status="Pending"
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)

    # Add each order item to the database.
    for item in order_data.order_items:
            order_item = models.OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                product_name=item.product_name,
                image=item.image,
                total_price=item.total_price,
                variant_id=item.variant_id,
                quantity=item.quantity,
                price=item.price,
                attributes=item.attributes  # Store dynamic attributes for each item
            )
            db.add(order_item)

    db.commit()

    # Save shipping address (if needed).
    shipping_address = models.ShippingAddress(
            order_id=order.id,
            address=order_data.shipping_address.address,
            city=order_data.shipping_address.city,
            state=order_data.shipping_address.state,
            country=order_data.shipping_address.country,
            zip=order_data.shipping_address.zip,
            phone=order_data.shipping_address.phone,
    )
    
    db.add(shipping_address)

    # Save billing address (if needed).
    billing_address = models.BillingAddress(
        order_id=order.id,
        first_name=order_data.billing_address.first_name,
        last_name=order_data.billing_address.last_name,
        address=order_data.billing_address.address,
        city=order_data.billing_address.city,
        state=order_data.billing_address.state,
        country=order_data.billing_address.country,
        zip=order_data.billing_address.zip,
        phone=order_data.billing_address.phone,
    )
   
    db.add(billing_address)
    db.commit()

#    deduct product quantity
    for item in order_data.order_items:
        message = {
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "quantity": item.quantity
        }
        publish_to_rabbitmq("deduct_quantity", message)

   
    return order

def check_product_availability(product_id: str, variant_id: str, quantity: int, not_available_products: list,available_not_sufficient_products: list, user_id: str, item: dict):
    url = f"{PRODUCT_SERVICE_URL}/check-availability/{product_id}?quantity={quantity}&variant_id={variant_id}"
    response = requests.get(url)
    # print(response)
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Error checking product availability")
        # return False
    
    availability = response.json()
    print("Availability response:", availability)  # Verify response structure
    
    if not availability.get("available", False):  # Use .get to avoid key errors
        # raise HTTPException(status_code=200, detail={"message": "Product not available", "product_id": product_id, })
        print(availability)
        requestedQuantity  = availability.get("requestedQuantity",quantity)
        availabileQuantity = availability.get("availableQuantity",0)
        price = availability.get("price",0)
        userId = user_id  # userId send as params, others should send body as request payload
        print(userId)
        cart_url = f"{CART_SERVICE_URL}/{userId}" 

        if int(requestedQuantity) > int(availabileQuantity) and int(availabileQuantity) > 0:
            print("==============================================================")
            print("==============================================================")
            print("==============================================================")
            available_not_sufficient_products.append(
                {"product_id": product_id, 
                "variant_id": variant_id, 
                "requestedQuantity": requestedQuantity, 
                "availableQuantity": availabileQuantity,
                "product_name": item.product_name, 
                "image": item.image, 
                "attributes": item.attributes,
                "price": item.price,
                "message": "Product not available"
                })
            # update cart , userId send as params, others should send body as request payload
            body_data = {
                "productId": product_id,
                "variantId": variant_id,
                "quantity": availabileQuantity,
                "price": price

            }
            response = requests.put(cart_url, json=body_data)
            print(response.json())
       

        


            return False
        
        
        if availabileQuantity == 0:
            not_available_products.append(
                {"product_id": product_id, 
                "variant_id": variant_id, 
                "availableQuantity": availabileQuantity, 
                "product_name": item.product_name, 
                "image": item.image, 
                "attributes": item.attributes,
                "price": item.price,  # price of the product
                "requestedQuantity": requestedQuantity, 
                "message": "Product not available"
                })
            body_data = {
                 "productId": product_id,
                 "variantId": variant_id,
                 "quantity": availabileQuantity,
                 "price": price
            }
            response = requests.put(cart_url, json=body_data)
            print(response.json())

            return False

        if requestedQuantity <= availabileQuantity:
            return True
        return False
    
    return True


def deduct_product_quantity(product_id: str, variant_id: str, quantity: int) -> bool:
    url = f"{PRODUCT_SERVICE_URL}/deduct-quantity"  # Fixed f-string
    response = requests.post(url, json={"product_id": product_id, "variant_id": variant_id, "quantity": quantity})
    
    # Check for response success and handle any issues gracefully
    if response.status_code != 200:
        try:
            error_detail = response.json().get("detail", "Error deducting product quantity")
        except ValueError:
            error_detail = "Error deducting product quantity"
        raise HTTPException(status_code=400, detail=error_detail)
    
    print("Deduction response:", response.json())  # Optional: For debugging
    return True


def get_orders(db: Session):
   return db.query(models.Order).all()

def get_order_by_id(db: Session, order_id: int):
   return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders_by_user_id(user_id: int, db: Session):
    # print(user_id)
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    print([orders])
    for order in orders:
        order.shipping_address = db.query(models.ShippingAddress).filter(models.ShippingAddress.order_id == order.id).first()
    return orders
# from sqlalchemy.orm import Session
# from . import models, schemas

# def create_order(db: Session, order_data: schemas.OrderCreate):
#     order = models.Order(
#         user_id=order_data.user_id,
#         total_price=order_data.total_price,
#         payment_method=order_data.payment_method,
#         shipping_address=order_data.shipping_address,
#         # default order status is "Pending"
#         order_status=order_data.status if order_data.status else "Pending"


#     )
#     db.add(order)
#     db.commit()
#     db.refresh(order)

#     for item in order_data.order_items:
#         order_item = models.OrderItem(
#             order_id=order.id,
#             product_id=item.product_id,
#             quantity=item.quantity,
#             price=item.price
#         )
#         db.add(order_item)

#     db.commit()

#   # shipping details in shipping table
#     shipping = models.Shipping(
#         order_id=order.id,
#         address=order_data.shipping_address,
#         city=order_data.city,
#         postal_code=order_data.postal_code,
#         country=order_data.country,
#         mobile=order_data.mobile
#     )

#     return order

# def get_orders(db: Session):
#     return db.query(models.Order).all()

# def get_order_by_id(db: Session, order_id: int):
#     return db.query(models.Order).filter(models.Order.id == order_id).first()

# def update_order_status(db: Session, order_id: int, status: str):
#     order = db.query(models.Order).filter(models.Order.id == order_id).first()
#     if order:
#         order.status = status
#         db.commit()
#         db.refresh(order)
#     return order
