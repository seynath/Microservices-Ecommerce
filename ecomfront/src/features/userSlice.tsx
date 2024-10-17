import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { user_service_url } from '@/api/UserAPI';

const getUserfromLocalStorage = (): object | null => {
  const userString = localStorage.getItem("user");
  if (userString !== null) {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }
  return null;
};

const getAccessTokenfromLocalStorage = (): string | null => {
  const accessToken = JSON.stringify(localStorage.getItem("accessToken"));
  if (accessToken !== null) {
    try {
      const test = JSON.parse(accessToken);
      console.log(test)
      console.log(accessToken)
      return test
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }
  console.log("eliye")
  return null;
};



export const loginUser = createAsyncThunk(
  'auth/login', 
  async (values: {email:string, password: string}, { rejectWithValue }) => {
    try {
      console.log("aaaaawa")

      const response = await axios.post(`${user_service_url}/login`, values, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      console.log(response)
      return response.data ;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue((error as Error & { response?: { data: unknown } }).response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Thunk to refresh access token
export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${user_service_url}/token`,{}, { withCredentials: true }); // Refresh token from cookie
    return response.data.accessToken; // Assuming the response contains a new access token
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Error refreshing token');
  }
});


export const getUser = createAsyncThunk('auth/getUser', async (_, { dispatch, rejectWithValue, getState }) => {
  const state = getState() as { user: { accessToken: string } };
  console.log(state)
  let accessToken = state.user.accessToken;
  
  // console.log("aaaaawayakow")
  // console.log(accessToken)
  // If there's no access token, attempt to refresh it
  if (!accessToken) {
    const refreshResult = await dispatch(refreshAccessToken());
    // console.log(refreshResult)
    if (refreshResult.payload && refreshResult.meta.requestStatus === 'fulfilled') {
      accessToken = refreshResult.payload;
    } else {
      return rejectWithValue('Access token could not be refreshed');
    }
  }
  
  console.log("aaaaawayakow")
  console.log(accessToken)
  try {
    const response = await axios.get(`${user_service_url}/abc`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    console.log(response)
    return response.data;
  } catch (error: any) {
    // If the error is related to token expiration, attempt to refresh it
    console.log(error)
    if (error.response && error.response.status === 403) {
      const refreshResult = await dispatch(refreshAccessToken());
      console.log({"Refreshing access token...": refreshResult});
      if (refreshResult.payload && refreshResult.meta.requestStatus === 'fulfilled') {
        accessToken = refreshResult.payload;

        // Retry the original request with the new access token

        const retryResponse = await axios.get(`${user_service_url}/abc`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        console.log({"aaaye genaaawa hureee": retryResponse})
        return retryResponse.data;
      }
    }
    return rejectWithValue(error.response?.data || 'Error fetching user data');
  }
});






const initialState = {
  user: getUserfromLocalStorage() ,
  accessToken: getAccessTokenfromLocalStorage(),
  isError  : false,
  isSuccess : false,
  isLoading: false,
  message : ""
};

export const userSlice = createSlice(
  {
    name:'user',
    initialState,
    reducers: {
      logout: (state) => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        state.user = null;
        state.accessToken = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "Login Success";
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("accessToken", action.payload.accessToken);
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
            ? (action.payload as { message: string }).message
            : 'An Server error occurred';
        })
         .addCase(refreshAccessToken.pending, (state) => {
            state.isLoading = true;
          })
         .addCase(refreshAccessToken.fulfilled, (state, action) => {
            state.accessToken = action.payload;
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = "Refresh Token Success";
            localStorage.setItem('accessToken', action.payload);
          })
         .addCase(refreshAccessToken.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.accessToken = null; // Remove access token if refreshing failed
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
             ? (action.payload as { message: string }).message
              : 'An Server error occurred while refreshing token';
          })
    
  
        ;
    }
  }

)
export const {logout} = userSlice.actions;
export default userSlice.reducer;









// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axios from 'axios';
// import { user_service_url } from '@/api/UserAPI';

// const getUserfromLocalStorage = (): object | null => {
//   const userString = localStorage.getItem("user");
//   if (userString !== null) {
//     try {
//       return JSON.parse(userString);
//     } catch (error) {
//       console.error("Error parsing user data from localStorage:", error);
//     }
//   }
//   return null;
// };

// const getAccessTokenfromLocalStorage = (): string | null => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken !== null) {
//     try {
//       return JSON.parse(accessToken);
//     } catch (error) {
//       console.error("Error parsing user data from localStorage:", error);
//     }
//   }
//   return null;
// };



// export const loginUser = createAsyncThunk(
//   'auth/login', 
//   async (values: {email:string, password: string}, { rejectWithValue }) => {
//     try {
//       console.log("aaaaawa")

//       const response = await axios.post(`${user_service_url}/login`, values, {
//         withCredentials: true, // Ensures cookies are sent with the request
//       });
//       console.log(response)
//       return response.data ;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue((error as Error & { response?: { data: unknown } }).response?.data || error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // Thunk to refresh access token
// export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.post('/token', {}, { withCredentials: true }); // Send cookie for refresh token
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// export const getUser = createAsyncThunk('auth/getUser', async (id, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${user_service_url}/`, { withCredentials: true });
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });
// const initialState = {
//   user: getUserfromLocalStorage() ,
//   accessToken: getAccessTokenfromLocalStorage(),
//   isError  : false,
//   isSuccess : false,
//   isLoading: false,
//   message : ""
// };

// export const userSlice = createSlice(
//   {
//     name:'user',
//     initialState,
//     reducers: {
//       logout: (state) => {
//         localStorage.removeItem("user");
//         localStorage.removeItem("accessToken");

//         state.user = null;
//         state.accessToken = null;
//       }
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(loginUser.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(loginUser.fulfilled, (state, action) => {
//           state.user = action.payload.user;
//           state.accessToken = action.payload.accessToken;
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.message = "Login Success";
//           localStorage.setItem("user", JSON.stringify(action.payload.user));
//           localStorage.setItem("accessToken", action.payload.accessToken);
//         })
//         .addCase(loginUser.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
//             ? (action.payload as { message: string }).message
//             : 'An Server error occurred';
//         })
//          .addCase(refreshAccessToken.pending, (state) => {
//             state.isLoading = true;
//           })
//          .addCase(refreshAccessToken.fulfilled, (state, action) => {
//             state.accessToken = action.payload;
//             state.isLoading = false;
//             state.isSuccess = true;
//             state.isError = false;
//             state.message = "Refresh Token Success";
//           })
//          .addCase(refreshAccessToken.rejected, (state, action) => {
//             state.isLoading = false;
//             state.isError = true;
//             state.isSuccess = false;
//             state.message = action.payload && typeof action.payload === 'object' && 'message' in action.payload
//              ? (action.payload as { message: string }).message
//               : 'An Server error occurred while refreshing token';
//           })
//         ;
//     }
//   }

// )
// export const {logout} = userSlice.actions;
// export default userSlice.reducer;
