export const category_service_url = import.meta.env.VITE_CATEGORY_SERVICE_URL;
import axios from "axios";


export const removeImage = async (public_id: string): Promise<void> => {
  try {
    console.log("Removing image:", public_id);
    await axios.delete(`${category_service_url}/delete-image`, {
      data: { public_id }, // Sending the public_id in the request body
    });
    console.log(`Image with public_id ${public_id} successfully deleted`);
  } catch (error) {
    console.error("Error removing image:", error);
    throw error;
  }
};

export const createCategory = async (category: object): Promise<object> => {
  try {
    console.log("Creating category:", category);
    const response = await axios.post(`${category_service_url}/`, category);
    console.log("Category created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export const getCategories = async (): Promise<object> => {
  try {
    const response = await axios.get(`${category_service_url}/`);
    console.log("Categories fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}


export const updateCategory = async (id: string, category: object): Promise<object> => {
  try {
    console.log("Updating category:", category);
    const response = await axios.put(`${category_service_url}/${id}`, category);
    console.log("Category updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export const deleteCategory = async (id: string): Promise<object> => {
  try {
    console.log("Deleting category:", id);
    const response = await axios.delete(`${category_service_url}/${id}`);
    console.log("Category deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}