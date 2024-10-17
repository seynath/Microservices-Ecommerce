const product_service_url = "http://localhost:6003/product"
import axios from "axios";


export const removeImage = async (public_id: string): Promise<void> => {
  try {
    console.log("Removing image:", public_id);
    await axios.delete(`${product_service_url}/delete-image`, {
      data: { public_id }, // Sending the public_id in the request body
    });
    console.log(`Image with public_id ${public_id} successfully deleted`);
  } catch (error) {
    console.error("Error removing image:", error);
    throw error;
  }
};

export const createProduct = async (product: object): Promise<object> => {
  try {
    console.log("Creating product:", product);
    const response = await axios.post(`${product_service_url}/`, product);
    console.log("Product created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export const getProducts = async (): Promise<object> => {
  try {
    const response = await axios.get(`${product_service_url}/`);
    console.log("Products fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export const updateProduct = async(id: string, product: object): Promise<object> => {
  try {
    console.log("Updating product:", product);
    const response = await axios.put(`${product_service_url}/${id}`, product);
    console.log("Product updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export const getProductById = async(id: string): Promise<object> => {
  try {
    const response = await axios.get(`${product_service_url}/${id}`);
    console.log("Product fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}