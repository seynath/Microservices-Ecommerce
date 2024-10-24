const {client} = require('../config/redis');
const { getProductDetails } = require('../services/productService');

// Utility function to get the Redis key for a user's cart
const getCartKey = (userId) => `CART:${userId}`;

// Get the current cart for a user
// Get the current cart for a user
const getCart = async (req, res) => {
  const userId = req.params.userId;

  try {
    const cart = await client.get(getCartKey(userId));
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }

    return res.status(200).json(JSON.parse(cart));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ error: 'Failed to fetch cart' });
  }
};
// Add an item to the cart
const addToCart = async (req, res) => {
  const userId = req.params.userId;
  const { productId,variantId, quantity , price, basePrice} = req.body;
  // console.log({
  //   productId,
  //   variantId,
  //   quantity,
  //   price,
  //   basePrice,
  //   userId,
  // });


  try {
    // Fetch product details from Product Service
    const product = await getProductDetails(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // check the product variant availability
// const variant= product.variants.filter(variant => variant._id === variantId)
// const availableVariantStock = variant[0].stock_quantity
// console.log(product)
const variant = product.variants.find(variant => variant._id === variantId);
// console.log(variant)
const availableVariantStock = variant ? variant.stock_quantity : 0;
// console.log(availableVariantStock);

    // Fetch the current cart from Redis
    let cart = await client.get(getCartKey(userId));
    cart = cart ? JSON.parse(cart) : { items: [], total: 0 };
    
    // Check if product is already in the cart
    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId && item.variantId === variantId);
    if (existingItemIndex > -1) {
      // check avalaility of the product
      if (cart.items[existingItemIndex].quantity + quantity > availableVariantStock) {
        return res.status(400).json({ error: 'Not enough stock' });
      }
      // Update the quantity and total price of the existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * price;
    } else {
      // Add new item to the cart
      const newItem = {
        image: product.images[0],
        color: variant.color,
        size: variant.size,
        productId,
        variantId,
        name: product.name,
        price: price,
        quantity,
        totalPrice: quantity * price,
      };
   
      cart.items.push(newItem);
    }
    
    // Recalculate the total cart price
    cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated cart to Redis
    await client.set(getCartKey(userId), JSON.stringify(cart));

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ error: 'Failed to add item to cart' });
  }
};
// Update the quantity of a cart item


const updateCartItem = async (req, res) => {
  const userId = req.params.userId;
  const { productId, variantId, quantity, price } = req.body;

  try {
    // Fetch the product details from the Product Service
    const product = await getProductDetails(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the specific variant
    const variant = product.variants.find(v => v._id === variantId);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    // Check if the requested quantity is available in stock
    if (variant.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
    }

    // Fetch the current cart from Redis
    let cart = await client.get(getCartKey(userId));
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart = JSON.parse(cart);

    // Find the cart item with matching product and variant
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Update the quantity and total price
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = quantity * price;

    // Recalculate the total cart price
    cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated cart to Redis
    await client.set(getCartKey(userId), JSON.stringify(cart));

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// const updateCartItem = async (req, res) => {
//   const userId = req.params.userId;
//   const { productId, variantId, quantity, price } = req.body;

//   try {
//     // Fetch the current cart from Redis
//     let cart = await client.get(getCartKey(userId));
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
//     cart = JSON.parse(cart);

//     // Find the cart item with matching product and variant
//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId === productId && item.variantId === variantId
//     );
//     if (itemIndex === -1) {
//       return res.status(404).json({ error: 'Item not found in cart' });
//     }

//     // Update the quantity and total price
//     cart.items[itemIndex].quantity = quantity;
//     cart.items[itemIndex].totalPrice = quantity * price;

//     // Recalculate the total cart price
//     cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

//     // Save the updated cart to Redis
//     await client.set(getCartKey(userId), JSON.stringify(cart));

//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error updating cart item:', error);
//     return res.status(500).json({ error: 'Failed to update cart item' });
//   }
// };



// upadate uda eke wada
// Update the quantity of a cart item
// const updateCartItem = async (req, res) => {
//   const userId = req.params.userId;
//   const { productId, quantity } = req.body;

//   try {
//     // Fetch the current cart from Redis
//     let cart = await client.get(getCartKey(userId));
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
//     cart = JSON.parse(cart);

//     // Find the cart item
//     const itemIndex = cart.items.findIndex((item) => item.productId === productId);
//     if (itemIndex === -1) {
//       return res.status(404).json({ error: 'Item not found in cart' });
//     }

//     // Update quantity and total price
//     cart.items[itemIndex].quantity = quantity;
//     cart.items[itemIndex].totalPrice = quantity * cart.items[itemIndex].price;

//     // Recalculate total cart price
//     cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

//     // Save updated cart to Redis
//     await redisClient.set(getCartKey(userId), JSON.stringify(cart));

//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error updating cart item:', error);
//     return res.status(500).json({ error: 'Failed to update cart item' });
//   }
// };
// Remove an item from the cart
// const removeFromCart = async (req, res) => {
//   const userId = req.params.userId;
//   const { productId, variantId } = req.body;

//   // Ensure productId and variantId are strings for comparison
//   const productIdStr = String(productId);
//   const variantIdStr = String(variantId);

//   console.log('Remove from cart - productId:', productIdStr, 'variantId:', variantIdStr);
  
//   try {
//     // Fetch the current cart from Redis
//     let cart = await client.get(getCartKey(userId));
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
//     cart = JSON.parse(cart);
    
//     console.log('Cart before removal:', cart);

//     // Remove the item with the matching productId and variantId
//     const originalLength = cart.items.length;
//     cart.items = cart.items.filter(
//       (item) => !(String(item.productId) === productIdStr && String(item.variantId) === variantIdStr)
//     );
    
//     // Check if an item was actually removed
//     if (cart.items.length === originalLength) {
//       return res.status(404).json({ error: 'Item not found in cart' });
//     }

//     console.log('Cart after removal:', cart.items.length);

//     // Recalculate the total cart price
//     cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

//     // Save the updated cart to Redis
//     await client.set(getCartKey(userId), JSON.stringify(cart));

//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     return res.status(500).json({ error: 'Failed to remove item from cart' });
//   }
// };

// // Remove an item from the cart
const removeFromCart = async (req, res) => {
  const userId = req.params.userId;
  // const productId = req.params.productId;
  // const variantId = req.params.variantId;
  console.log("============================pff====================")
  const { productId, variantId } = req.body;
  console.log(productId, variantId);
  
  try {
    // Fetch the current cart from Redis
    let cart = await client.get(getCartKey(userId));
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart = JSON.parse(cart);
    
    // Remove the item with the matching product and variant from the cart
    // console.log(cart)
    cart.items = cart.items.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );
    console.log(cart.items.length)

    // Recalculate the total cart price
    cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated cart to Redis
    await client.set(getCartKey(userId), JSON.stringify(cart));

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
