export const user_service_url = "http://localhost:6001/user"
import axios from "axios";


export const login = async (user: object): Promise<object> => {
  try {
    console.log("Logging in user:", user);
    const response = await axios.post(`${user_service_url}/login`, user, {
      withCredentials: true, // Ensures cookies are sent with the request
    });
    console.log("User logged in:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};


export const signup = async (user: object): Promise<object> => {
  try {
    console.log("Registering user:", user);
    const response = await axios.post(`${user_service_url}/register`, user);
    console.log("User registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

