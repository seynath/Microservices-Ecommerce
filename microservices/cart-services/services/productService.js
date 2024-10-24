const axios = require('axios');

const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product details for ${productId}:`, error.message);
    return null;
  }
};

module.exports = { getProductDetails };
