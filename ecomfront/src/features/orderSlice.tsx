import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { order_service_url } from "@/api/OrderAPI";

export const createOrder = createAsyncThunk(
  "order/createOrder",
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
      const response = await axios.post(
        `${order_service_url}/`,
        values
      );

      console.log(response);
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
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get user from the state
      const state = getState() as { user: { user: { id: string } } };
      let user_id = state.user?.user?.id; // Assuming the user ID is stored in the state

      // If no user is found, try to get it from localStorage
      if (!user_id) {
        const user = localStorage.getItem("user");
        if (user) {
          user_id = JSON.parse(user).id;
        } else {
          throw new Error("User not logged in");
        }
      }

      const response = await axios.get(`${order_service_url}/${user_id}` );
      // console.log(response);
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



// export const removeFromCart = createAsyncThunk(
//   "cart/removeFromCart",
//   async (values: object, { rejectWithValue, getState }) => {
//     try {
//       // Get user from the state
//       const state = getState() as { user: { user: { id: string } } };
//       const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

//       // If no user is found, throw an error
//       if (!userId) {
//         throw new Error("User not logged in");
//       }
//       console.log(values);
//       const response = await axios.post(`${cart_service_url}/delete/${userId}`, values);
//       console.log(response.data);
//       return response.data;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(
//           (error as Error & { response?: { data: unknown } }).response?.data ||
//             error.message
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const updateCartItem = createAsyncThunk(
//   "cart/updateCartItem",
//   async (values: object, { rejectWithValue, getState }) => {
//     try {
//       // Get user from the state
//       const state = getState() as { user: { user: { id: string } } };
//       const userId = state.user?.user?.id; // Assuming the user ID is stored in the state

//       // If no user is found, throw an error
//       if (!userId) {
//         throw new Error("User not logged in");
//       }
//       console.log(values);
//       const response = await axios.put(`${cart_service_url}/${userId}`, values);
//       console.log(response.data);
//       return response.data;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(
//           (error as Error & { response?: { data: unknown } }).response?.data ||
//             error.message
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

const initialState = {
  order: [],
  singleOrder: null,
  // user: getUserFromState(state), // Assuming user is stored in the state
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        // state.order = action.payload;
        state.singleOrder = action.payload;

        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Order Loading Success";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.singleOrder = {};
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
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Order Loading Success";
      })
      .addCase(getAllOrders.rejected, (state, action) => {
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

export default orderSlice.reducer;
