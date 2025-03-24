import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/features/userSlice";
import {productSlice} from "@/features/productSlice";
import { cartSlice } from "@/features/cartSlice";
import { orderSlice } from "@/features/orderSlice";
import { reviewSlice } from "@/features/reviewSlice";
import { categorySlice } from "@/features/categorySlice";


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    product: productSlice.reducer,
    cart: cartSlice.reducer,
    order: orderSlice.reducer,
    review: reviewSlice.reducer,
    category: categorySlice.reducer,
    
  },
});

export default store;