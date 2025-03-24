import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { category_service_url } from "@/api/CategoryAPI";


// export const getCart = createAsyncThunk(
//   "cart/getCart",
//   async (values: object, { rejectWithValue, getState }) => {
//     try {
//       // Get user from the state
//       const state = getState() as { user: { user: { id: string } } };
//       let userId = state.user?.user?.id; // Assuming the user ID is stored in the state

//       // If no user is found, try to get it from localStorage
//       if (!userId) {
//         const user = localStorage.getItem("user");
//         if (user) {
//           userId = JSON.parse(user).id;
//         } else {
//           throw new Error("User not logged in");
//         }
//       }
//       console.log(values);
//       const response = await axios.get(`${cart_service_url}/${userId}`, values);
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




export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_ , { rejectWithValue }) => {
    try {
      const response = await axios.get(`${category_service_url}/`);
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
  category: [],
  // user: getUserFromState(state), // Assuming user is stored in the state
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.category = action.payload;

        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Category Loading Success";
      })

      .addCase(getAllCategories.rejected, (state, action) => {
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

export default categorySlice.reducer;
