// src/api/orderAPI.js

import api from './api';

// Function to get orders (GET /order)
export const getOrders = async () => {
  try {
    const response = await api.get('/order');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};