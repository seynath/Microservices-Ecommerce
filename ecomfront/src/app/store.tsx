import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/features/userSlice";
import {productSlice} from "@/features/productSlice";
import { cartSlice } from "@/features/cartSlice";


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    product: productSlice.reducer,
    cart: cartSlice.reducer
    
  },
});

export default store;