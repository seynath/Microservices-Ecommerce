import { getCart, removeFromCart, updateCartItem } from "@/features/cartSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());

    // setInterval(() => dispatch(getCart()), 4000);
  }, []);

  const cart = useSelector((state) => state?.cart?.cart) || { items: [] }; // Defaulting to empty items array

  const handleRemoveItemFromCart = (productId, variantId) => {
    console.log("Removing item from cart", productId, variantId);
    dispatch(removeFromCart({ productId:productId, variantId: variantId }));
  };

  // const handleUpdateItemFromCart = (productId, variantId, quantity, price) => {
  //   console.log(
  //     "Updating item in cart",
  //     productId,
  //     variantId,
  //     quantity,
  //     price
  //   );
  //   // dispatch(
  //   //   updateCartItem({
  //   //     productId: productId,
  //   //     variantId: variantId,
  //   //     quantity,
  //   //     price,
  //   //   })
  //   // );
  // };
  const handleUpdateItemFromCart = (productId, variantId, quantity, price) => {
    console.log(
      "Updating item in cart",
      productId,
      variantId,
      quantity,
      price
    )
    dispatch(updateCartItem({ productId, variantId, quantity: Number(quantity), price }));
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="mb-6 sm:mb-10 lg:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Your Cart
          </h2>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:gap-6">
          {/* Product list */}
          {cart && cart.items && cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex flex-wrap gap-x-4 overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6">
                <a href="#" className="group relative block h-48 w-32 overflow-hidden bg-gray-100 sm:h-56 sm:w-40">
                  <img
                    src={item.image}
                    loading="lazy"
                    alt="Product"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div className="flex flex-1 flex-col justify-between py-4">
                  <div>
                    <a href="#" className="mb-1 inline-block text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">
                      {item.name}
                    </a>
                    <span className="block text-gray-500">Size: {item.size}</span>
                    <span className="block text-gray-500">Color: {item.color}</span>
                  </div>

                  <div>
                    <span className="mb-1 block font-bold text-gray-800 md:text-lg">${item.price}</span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      In stock
                    </span>
                  </div>
                </div>

                <div className="flex w-full justify-between border-t p-4 sm:w-auto sm:border-none sm:pl-0 lg:p-6 lg:pl-0">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex h-12 w-20 overflow-hidden rounded border">
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemFromCart(item.productId, item.variantId, e.target.value, item.price)}
                        className="w-full px-2 py-2 outline-none ring-inset ring-indigo-300 transition duration-100 focus:ring"
                      />

                      <div className="flex flex-col divide-y border-l">
                      <button
                          onClick={() =>
                            handleUpdateItemFromCart(item.productId, item.variantId, item.quantity + 1, item.price)
                          }
                          className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateItemFromCart(item.productId, item.variantId, Math.max(1, item.quantity - 1), item.price)
                          }
                          className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                        >
                          -
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItemFromCart(item.productId, item.variantId)}
                      className="select-none text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="ml-4 pt-3 md:ml-8 md:pt-2 lg:ml-16">
                    <span className="block font-bold text-gray-800 md:text-lg">${item.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-96">No items in cart</div>
          )}
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end gap-4">
          <div className="w-full rounded-lg bg-gray-100 p-4 sm:max-w-xs">
            <div className="space-y-1">
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Subtotal</span>
                <span>${cart.total || 0}</span>
              </div>

              <div className="flex justify-between gap-4 text-gray-500">
                <span>Shipping</span>
                <span>$4.99</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex items-start justify-between gap-4 text-gray-800">
                <span className="text-lg font-bold">Total</span>

                <span className="flex flex-col items-end">
                  <span className="text-lg font-bold">${(cart.total || 0) + 4.99} USD</span>
                  <span className="text-sm text-gray-500">including VAT</span>
                </span>
              </div>
            </div>
          </div>

          <button className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
