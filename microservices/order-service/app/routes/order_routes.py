from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from typing import List

router = APIRouter()

@router.post("/", response_model=schemas.OrderResponse)
def create_order(response: Response, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Call the CRUD function to create the order
    order_instance = crud.create_order(db=db, order_data=order)
    
    # Set status code to 201 to indicate resource creation
    response.status_code = 201
    
    return order_instance
# @router.post("/", response_model=schemas.OrderResponse)
# def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
#    return crud.create_order(db=db, order_data=order)

@router.get("/", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
   return crud.get_orders(db=db)

# get_order_by_id function is added to the order_routes.py file.
@router.get("/{user_id}", response_model=List[schemas.OrderResponse])
def get_orders_by_user_id(user_id: int, db: Session = Depends(get_db)):
   orders = crud.get_orders_by_user_id(db=db, user_id=user_id)
   
   if not orders:
      raise HTTPException(status_code=404, detail="Orders not found")
   
   return orders

@router.get("/order_id/{order_id}", response_model=schemas.OrderResponse)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
   order = crud.get_order_by_id(db=db, order_id=order_id)
   
   if not order:
      raise HTTPException(status_code=404, detail="Order not found")
   
   return order

@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
   # Implement status update logic here (if needed).
   pass  # Placeholder for future implementation.

@router.put('/update_rating', response_model=schemas.OrderResponse)
def update_order_rating(payload: schemas.UpdateRating,db: Session = Depends(get_db)):
   order = crud.update_order_product_item_rating(db=db, order_id=payload.order_id,product_id=payload.product_id, rating=payload.rating, rating_text=payload.rating_text)
   
   if not order:
      raise HTTPException(status_code=404, detail="Order not found")
   
   return order




# # app/routes/order_routes.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app import schemas, crud, models
# from app.database import get_db
# from typing import List


# router = APIRouter()

# @router.post("/", response_model=schemas.OrderResponse)
# def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
#     return crud.create_order(db=db, order_data=order)

# @router.get("/", response_model=List[schemas.OrderResponse])
# def get_orders(db: Session = Depends(get_db)):
#     return crud.get_orders(db=db)

# @router.get("/{order_id}", response_model=schemas.OrderResponse)
# def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
#     order = crud.get_order_by_id(db=db, order_id=order_id)
#     if not order:
#         raise HTTPException(status_code=404, detail="Order not found")
#     return order

# @router.put("/{order_id}/status", response_model=schemas.OrderResponse)
# def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
#     order = crud.update_order_status(db=db, order_id=order_id, status=status)
#     if not order:
#         raise HTTPException(status_code=404, detail="Order not found")
#     return order
