import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { cart_service_url } from "@/api/CartAPI";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (values: object, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, throw an error
      if (!userId) {
        throw new Error("User not logged in");
      }
      console.log(values);
      const response = await axios.post(
        `${cart_service_url}/${userId}`,
        values
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & { response?: { data: unknown } }).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (values: object, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      let userId = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, try to get it from localStorage
      if (!userId) {
        const user = localStorage.getItem("user");
        if (user) {
          userId = JSON.parse(user).id;
        } else {
          throw new Error("User not logged in");
        }
      }
      console.log(values);
      const response = await axios.get(`${cart_service_url}/${userId}`, values);
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & { response?: { data: unknown } }).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (values: object, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, throw an error
      if (!userId) {
        throw new Error("User not logged in");
      }
      console.log(values);
      const response = await axios.post(`${cart_service_url}/delete/${userId}`, values);
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & { response?: { data: unknown } }).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const emptyCart = createAsyncThunk(
  "cart/emptyCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, throw an error
      if (!userId) {
        throw new Error("User not logged in");
      }
      console.log(values);
      const response = await axios.delete(`${cart_service_url}/empty/${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & { response?: { data: unknown } }).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (values: object, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, throw an error
      if (!userId) {
        throw new Error("User not logged in");
      }
      console.log(values);
      const response = await axios.put(`${cart_service_url}/${userId}`, values);
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & { response?: { data: unknown } }).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const initialState = {
  cart: [],
  // user: getUserFromState(state), // Assuming user is stored in the state
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;

        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Product Loading Success";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
            ? (action.payload as { message: string }).message
            : "An Server error occurred";
      })
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.cart = action.payload;

        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Product Loading Success";
      })

      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
            ? (action.payload as { message: string }).message
            : "An Server error occurred";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // state.cart = state.cart.cart.items.filter((item) => item.id!== action.payload.id);
        state.cart = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Product removed from cart";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
            ? (action.payload as { message: string }).message
            : "An Server error occurred";
      })
      .addCase(updateCartItem.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Product updated in cart";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
            ? (action.payload as { message: string }).message
            : "An Server error occurred";
      })
      .addCase(emptyCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emptyCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Cart emptied";
      })
      .addCase(emptyCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
            ? (action.payload as { message: string }).message
            : "An Server error occurred";
      })
      
      ;
  },
});

export default cartSlice.reducer;
