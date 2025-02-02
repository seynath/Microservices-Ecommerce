import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { review_service_url } from "@/api/ReviewAPI";
import { message } from 'antd';

export const createReview = createAsyncThunk(
  "review/createReview",
  async (values: object, {rejectWithValue, getState}) => {
    try {
      // Get user from the state
      const state = getState() as {user: {user: {id: string}}};
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
      const response = await axios.post(`${review_service_url}`, values);

      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          (error as Error & {response?: {data: unknown}}).response?.data ||
            error.message
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const initialState = {
  review: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ""

}

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // clearState: (state) => {
    //   state.isError = false;
    //   state.isSuccess = false;
    //   state.isLoading = false;
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(createReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createReview.fulfilled, (state, {payload}) => {
      state.review = payload;
      state.isSuccess = true;
      state.isLoading = false;
    });
    builder.addCase(createReview.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
  }
});

export default reviewSlice.reducer;