import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { product_service_url } from '@/api/ProductAPI';

interface Product {
  _id: string;
  name: string;
  variants: Variant[];
  images: string[];
  basePrice: number;
}

interface Variant {
  _id: string;
  attributes: Attribute[];
  price: number;
  stock_quantity: number;
}

interface Attribute {
  key: string;
  value: string;
}

export const getAllProducts = createAsyncThunk(
  'product/getAllProducts', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${product_service_url}/`);

      return response.data ;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue((error as Error & { response?: { data: unknown } }).response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getProduct = createAsyncThunk<Product[]>(
  'product/getProduct', 
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${product_service_url}/${id}`);
      console.log("Product fetched:", response.data);
      return response.data ;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue((error as Error & { response?: { data: unknown } }).response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


const initialState = {
  products: [],
  isError  : false,
  isSuccess : false,
  isLoading: false,
  message : "",
  singleProduct: null
};

export const productSlice = createSlice(
  {
    name:'product',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllProducts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
          state.products = action.payload;
        
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "Product Loading Success";
        })
        .addCase(getAllProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'An Server error occurred';
        })
        .addCase(getProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          state.singleProduct = action.payload;
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "Product Loading Success";
        })
        .addCase(getProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'An Server error occurred';
        })
    
    
  
        ;
    }
  }

)

export default productSlice.reducer;





