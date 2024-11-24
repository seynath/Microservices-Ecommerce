import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "@/features/productSlice";
import { addToCart } from "@/features/cartSlice";

const SingleProduct: React.FC = () => {
  const param = useParams();
  const dispatch = useDispatch();

  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(getProduct(param.id));
  }, [param.id]);

  const product = useSelector((state: any) => state.product.singleProduct);

  // Update selected attributes and find the corresponding variant
  const handleSelectAttribute = (attributeName: string, value: string) => {
    const updatedAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(updatedAttributes);

    // Find the variant matching all selected attributes
    const variant = product?.variants.find((v: any) =>
      v.attributes.every(
        (attr: any) => updatedAttributes[attr.key] === attr.value
      )
    );
    setSelectedVariant(variant || null);
  };

  // Extract unique values for each attribute
  const uniqueAttributes: { [key: string]: string[] } = {};
  product?.variants.forEach((variant: any) => {
    variant.attributes.forEach((attr: any) => {
      if (!uniqueAttributes[attr.key]) uniqueAttributes[attr.key] = [];
      if (!uniqueAttributes[attr.key].includes(attr.value)) {
        uniqueAttributes[attr.key].push(attr.value);
      }
    });
  });

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addToCart({
          productId: product._id,
          variantId: selectedVariant._id,
          quantity,
          price: selectedVariant.price,
        })
      );
      alert("Added to cart!");
    } else {
      alert("Please select all required options.");
    }
  };

  return (
    <div>
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product?.images[0]}
                  loading="lazy"
                  alt={product?.name}
                  className="md:h-[500px] w-full object-cover object-center"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product?.images?.map((image: string, index: number) => (
                  <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
                    <img src={image} loading="lazy" alt={product?.name} className="h-full w-full md:h-[300px] object-cover object-center" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:py-8">
              <div className="mb-2 md:mb-3">
                <span className="mb-0.5 inline-block text-gray-500">Fancy Brand</span>
                <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{product?.name}</h2>
              </div>

              {/* Dynamic Attribute Selection */}
              {Object.keys(uniqueAttributes).map((attribute, index) => (
                <div key={index} className="mb-4 md:mb-6">
                  <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">
                    {attribute}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAttributes[attribute].map((value, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`h-8 w-20 rounded border ${
                          selectedAttributes[attribute] === value
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-800"
                        } transition duration-100 hover:bg-gray-100 active:bg-gray-200`}
                        onClick={() => handleSelectAttribute(attribute, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Price, Stock, and Quantity */}
              {selectedVariant ? (
                <div className="mb-4">
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
                      ${selectedVariant.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {selectedVariant.stock_quantity}
                    </span>
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-semibold text-gray-500">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedVariant.stock_quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">${product?.basePrice}</span>
                    <span className="text-sm text-red-500">Stock: 0</span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;















// All time greatest is below



// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getProduct } from "@/features/productSlice";
// import { addToCart } from "@/features/cartSlice"; // Assuming you have a cartSlice

// const SingleProduct: React.FC = () => {
//   const param = useParams();
//   const dispatch = useDispatch();

//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<any>(null);
//   const [quantity, setQuantity] = useState<number>(1); // Quantity state

//   useEffect(() => {
//     dispatch(getProduct(param.id));
//   }, [param.id]);

//   const product = useSelector((state: any) => state.product.singleProduct);

//   // Handle color selection
//   const handleSelectColor = (color: string) => {
//     setSelectedColor(color);
//     if (selectedSize) {
//       // Try to find the variant based on both size and color
//       const variant = product?.variants.find(
//         (v: any) => v.size === selectedSize && v.color === color
//       );
//       setSelectedVariant(variant);
//     }
//   };

//   // Handle size selection
//   const handleSelectSize = (size: string) => {
//     setSelectedSize(size);
//     if (selectedColor) {
//       // Try to find the variant based on both size and color
//       const variant = product?.variants.find(
//         (v: any) => v.size === size && v.color === selectedColor
//       );
//       setSelectedVariant(variant);
//     }
//   };

//   // Find variant based on selected color and size
//   useEffect(() => {
//     if (!selectedColor && selectedSize) {
//       // If only size is selected and no color is available
//       const variant = product?.variants.find(
//         (v: any) => v.size === selectedSize && !v.color
//       );
//       setSelectedVariant(variant);
//     }
//     if (!selectedSize && selectedColor) {
//       // If only color is selected and no size is available
//       const variant = product?.variants.find(
//         (v: any) => v.color === selectedColor && !v.size
//       );
//       setSelectedVariant(variant);
//     }
//   }, [product, selectedColor, selectedSize]);

//   // Check if the product has only one variant without color and size
//   const isSingleVariantWithoutOptions =
//     product?.variants?.length === 1 &&
//     !product.variants[0].color &&
//     !product.variants[0].size;

//   // If it's a single variant product without color and size, use that variant directly
//   useEffect(() => {
//     if (isSingleVariantWithoutOptions) {
//       setSelectedVariant(product?.variants[0]);
//     }
//   }, [isSingleVariantWithoutOptions, product]);

//   // Get unique colors and sizes from the variants
//   const uniqueColors = product?.variants
//     ? Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean))) // Filter out empty colors
//     : [];

//   const uniqueSizes = product?.variants
//     ? Array.from(new Set(product.variants.map((v: any) => v.size).filter(Boolean))) // Filter out empty sizes
//     : [];

//   // Handle quantity change
//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuantity(Number(e.target.value));
//   };

//   // Handle add to cart
//   const handleAddToCart = () => {
//     if (selectedVariant) {
//       dispatch(
//         addToCart({
//           productId: product._id,
//           variantId: selectedVariant._id,
//           quantity,
//           price: selectedVariant.price,
//         })
//       );
//       alert("Added to cart!");
//     } else {
//       alert("Please select a variant.");
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white py-6 sm:py-8 lg:py-12">
//         <div className="mx-auto max-w-screen-lg px-4 md:px-8">
//           <div className="grid gap-8 md:grid-cols-2">
//             {/* Images */}
//             <div className="space-y-4">
//               <div className="relative overflow-hidden rounded-lg bg-gray-100">
//                 <img
//                   src={product?.images[0]}
//                   loading="lazy"
//                   alt={product?.name}
//                   className="md:h-[500px] w-full object-cover object-center"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {product?.images?.map((image: string, index: number) => (
//                   <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
//                     <img src={image} loading="lazy" alt={product?.name} className="h-full w-full md:h-[300px] object-cover object-center" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Content */}
//             <div className="md:py-8">
//               <div className="mb-2 md:mb-3">
//                 <span className="mb-0.5 inline-block text-gray-500">Fancy Brand</span>
//                 <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{product?.name}</h2>
//               </div>

//               {/* Color and Size Selection */}
//               {!isSingleVariantWithoutOptions && (
//                 <>
//                   {/* Color Selection */}
//                   {uniqueColors.length > 0 && (
//                     <div className="mb-4 md:mb-6">
//                       <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Color</span>
//                       <div className="flex flex-wrap gap-2">
//                         {uniqueColors.map((color: string, index: number) => (
//                           <button
//                             key={index}
//                             type="button"
//                             className={`h-8 w-8 rounded-full border ${selectedColor === color ? 'bg-indigo-500 ring-2 ring-white ring-offset-1' : 'bg-gray-500 ring-2 ring-transparent ring-offset-1'} transition duration-100 hover:ring-gray-200`}
//                             onClick={() => handleSelectColor(color)}
//                           >
//                             {color}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Size Selection */}
//                   {uniqueSizes && uniqueSizes.length > 0 && (
//                     <div className="mb-8 md:mb-10">
//                       <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Size</span>
//                       <div className="flex flex-wrap gap-3">
//                         {uniqueSizes.map((size: string, index: number) => (
//                           <button
//                             key={index}
//                             type="button"
//                             className={`flex h-8 w-12 items-center justify-center rounded-md border ${
//                               selectedSize === size ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
//                             } transition duration-100 hover:bg-gray-100 active:bg-gray-200`}
//                             onClick={() => handleSelectSize(size)}
//                           >
//                             {size}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* Price, Stock, and Quantity */}
//               {selectedVariant || isSingleVariantWithoutOptions ? (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">
//                       ${selectedVariant ? selectedVariant.price : product?.variants[0]?.price}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       Stock: {selectedVariant ? selectedVariant.stock_quantity : product?.variants[0]?.stock_quantity}
//                     </span>
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-semibold text-gray-500">Quantity</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max={selectedVariant ? selectedVariant.stock_quantity : product?.variants[0]?.stock_quantity}
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       className="w-20 px-2 py-1 border rounded"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">${product?.basePrice}</span>
//                     <span className="text-sm text-red-500">Stock: {0}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Add to Cart Button */}
//               <div className="flex gap-2.5">
//                 <button
//                   type="button"
//                   onClick={handleAddToCart}
//                   className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base"
//                 >
//                   Add to cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;

















// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getProduct } from "@/features/productSlice";
// import { addToCart } from "@/features/cartSlice"; // Assuming you have a cartSlice

// const SingleProduct: React.FC = () => {
//   const param = useParams();
//   const dispatch = useDispatch();

//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<any>(null);
//   const [quantity, setQuantity] = useState<number>(1); // Quantity state

//   useEffect(() => {
//     dispatch(getProduct(param.id));
//   }, [param.id]);

//   const product = useSelector((state: any) => state.product.singleProduct);

//   // Handle color selection
//   const handleSelectColor = (color: string) => {
//     setSelectedColor(color);
//   };

//   // Handle size selection
//   const handleSelectSize = (size: string) => {
//     setSelectedSize(size);
//   };

//   // Find variant based on selected color and size
//   useEffect(() => {
//     if (product?.variants) {
//       const variant = product.variants.find(
//         (v: any) => 
//           (!selectedColor || v.color === selectedColor) &&
//           (!selectedSize || v.size === selectedSize)
//       );
//       setSelectedVariant(variant);
//     }
//   }, [product, selectedColor, selectedSize]);

//   // Get unique colors and sizes from the variants
//   const uniqueColors = product?.variants
//     ? Array.from(new Set(product.variants.map((v: any) => v.color)))
//     : [];

//   const uniqueSizes = product?.variants
//     ? Array.from(new Set(product.variants.map((v: any) => v.size)))
//     : [];

//   // Handle quantity change
//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuantity(Number(e.target.value));
//   };

//   // Handle add to cart
//   const handleAddToCart = () => {
//     if (selectedVariant) {
//       dispatch(
//         addToCart({
//           productId: product._id,
//           variantId: selectedVariant._id,
//           quantity,
//           basePrice: product.basePrice,
//           price: selectedVariant.price,
//         })
//       );
//       alert("Added to cart!");
//     } else {
//       alert("Please select a variant.");
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white py-6 sm:py-8 lg:py-12">
//         <div className="mx-auto max-w-screen-lg px-4 md:px-8">
//           <div className="grid gap-8 md:grid-cols-2">
//             {/* Images */}
//             <div className="space-y-4">
//               <div className="relative overflow-hidden rounded-lg bg-gray-100">
//                 <img
//                   src={product?.images[0]}
//                   loading="lazy"
//                   alt={product?.name}
//                   className="md:h-[500px] w-full object-cover object-center"
//                 />
//                 <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
//                   sale
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {product?.images?.map((image: string, index: number) => (
//                   <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
//                     <img src={image} loading="lazy" alt={product?.name} className="h-full w-full md:h-[300px] object-cover object-center" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Content */}
//             <div className="md:py-8">
//               <div className="mb-2 md:mb-3">
//                 <span className="mb-0.5 inline-block text-gray-500">Fancy Brand</span>
//                 <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{product?.name}</h2>
//               </div>

//               <div className="mb-6 flex items-center md:mb-10">
//                 {/* Ratings */}
//                 <div className="-ml-1 flex gap-0.5">
//                   {[...Array(4)].map((_, index) => (
//                     <svg
//                       key={index}
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 text-yellow-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <span className="ml-2 text-sm text-gray-500">4.2</span>
//                 <a href="#" className="ml-4 text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">view all 47 reviews</a>
//               </div>

//               {/* Color Selection */}
//               {uniqueColors.length > 0 && (
//                 <div className="mb-4 md:mb-6">
//                   <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Color</span>
//                   <div className="flex flex-wrap gap-2">
//                     {uniqueColors.map((color: string, index: number) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`h-8 w-8 rounded-full border ${selectedColor === color ? 'bg-indigo-500 ring-2 ring-white ring-offset-1' : 'bg-gray-500 ring-2 ring-transparent ring-offset-1'} transition duration-100 hover:ring-gray-200`}
//                         onClick={() => handleSelectColor(color)}
//                       >
//                         {color}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Size Selection */}
//               {uniqueSizes && uniqueSizes.length > 0 && (
//                 <div className="mb-8 md:mb-10">
//                   <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Size</span>
//                   <div className="flex flex-wrap gap-3">
//                     {uniqueSizes.map((size: string, index: number) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`flex h-8 w-12 items-center justify-center rounded-md border ${
//                           selectedSize === size ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
//                         } transition duration-100 hover:bg-gray-100 active:bg-gray-200`}
//                         onClick={() => handleSelectSize(size)}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Price, Stock, and Quantity */}
//               {selectedVariant ? (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">${selectedVariant.price}</span>
//                     <span className="text-sm text-gray-500">Stock: {selectedVariant.stock_quantity}</span>
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-semibold text-gray-500">Quantity</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max={selectedVariant.stock_quantity}
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       className="w-20 px-2 py-1 border rounded"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">${product?.basePrice}</span>
//                     <span className="text-sm text-red-500">Stock: {0}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Add to Cart Button */}
//               <div className="flex gap-2.5">
//                 <button
//                   type="button"
//                   onClick={handleAddToCart}
//                   className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base"
//                 >
//                   Add to cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;
























// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getProduct } from "@/features/productSlice";
// import { addToCart } from "@/features/cartSlice"; // Assuming you have a cartSlice

// const SingleProduct: React.FC = () => {
//   const param = useParams();
//   const dispatch = useDispatch();

//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<any>(null);
//   const [quantity, setQuantity] = useState<number>(1); // Quantity state

//   useEffect(() => {
//     dispatch(getProduct(param.id));

//   }, [param.id]);

//   const product = useSelector((state: any) => state.product.singleProduct);
  
//   // const user = useSelector((state: any) => state.user.user._id || null)

//   // Handle color selection
//   const handleSelectColor = (color: string) => {
//     setSelectedColor(color);
//   };

//   // Handle size selection
//   const handleSelectSize = (size: string) => {
//     setSelectedSize(size);
//   };

//   // Find variant based on selected color and size
//   useEffect(() => {
//     if (product?.variants) {
//       const variant = product.variants.find(
//         (v: any) =>
//           (!selectedColor || v.color === selectedColor) &&
//           (!selectedSize || v.size === selectedSize)
//       );
//       setSelectedVariant(variant);
//     }
//   }, [product, selectedColor, selectedSize]);

//   // Handle quantity change
//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuantity(Number(e.target.value));
//   };

//   // Handle add to cart
//   const handleAddToCart = () => {
//     if (selectedVariant) {
//       dispatch(
//         addToCart({
//           productId: product._id,
//           variantId: selectedVariant._id,
//           quantity,
//           basePrice: product.basePrice,
//           price: selectedVariant.price,

//         })
//       );
//       // alert("Added to cart!");
//     } else {
//       alert("Please select a variant.");
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white py-6 sm:py-8 lg:py-12">
//         <div className="mx-auto max-w-screen-lg px-4 md:px-8">
//           <div className="grid gap-8 md:grid-cols-2">
//             {/* Images */}
//             <div className="space-y-4">
//               <div className="relative overflow-hidden rounded-lg bg-gray-100">
//                 <img
//                   src={product?.images[0]}
//                   loading="lazy"
//                   alt={product?.name}
//                   className="md:h-[500px] w-full object-cover object-center"
//                 />
//                 <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
//                   sale
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {product?.images?.map((image: string, index: number) => (
//                   <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
//                     <img src={image} loading="lazy" alt={product?.name} className="h-full w-full md:h-[300px] object-cover object-center" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Content */}
//             <div className="md:py-8">
//               <div className="mb-2 md:mb-3">
//                 <span className="mb-0.5 inline-block text-gray-500">Fancy Brand</span>
//                 <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{product?.name}</h2>
//               </div>

//               <div className="mb-6 flex items-center md:mb-10">
//                 {/* Ratings */}
//                 <div className="-ml-1 flex gap-0.5">
//                   {[...Array(4)].map((_, index) => (
//                     <svg
//                       key={index}
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 text-yellow-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <span className="ml-2 text-sm text-gray-500">4.2</span>
//                 <a href="#" className="ml-4 text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">view all 47 reviews</a>
//               </div>

//               {/* Color Selection */}
//               {product?.variants?.some((v: any) => v.color) && (
//                 <div className="mb-4 md:mb-6">
//                   <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Color</span>
//                   <div className="flex flex-wrap gap-2">
//                     {product?.variants?.map((variant: any, index: number) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`h-8 w-8 rounded-full border ${selectedColor === variant.color ? 'bg-indigo-500 ring-2 ring-white ring-offset-1' : 'bg-gray-500 ring-2 ring-transparent ring-offset-1'} transition duration-100 hover:ring-gray-200`}
//                         onClick={() => handleSelectColor(variant.color)}
//                       >
//                         {variant.color}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Size Selection */}
//               {product?.variants?.some((v: any) => v.size) && (
//                 <div className="mb-8 md:mb-10">
//                   <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Size</span>
//                   <div className="flex flex-wrap gap-3">
//                     {product?.variants?.map((variant: any, index: number) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`flex h-8 w-12 items-center justify-center rounded-md border ${
//                           selectedSize === variant.size ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
//                         } transition duration-100 hover:bg-gray-100 active:bg-gray-200`}
//                         onClick={() => handleSelectSize(variant.size)}
//                       >
//                         {variant.size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Price, Stock, and Quantity */}
//               {selectedVariant ? (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">${selectedVariant.price}</span>
//                     <span className="text-sm text-gray-500">Stock: {selectedVariant.stock_quantity}</span>
//                   </div>
//                   <div className="mt-4">
//                     <label className="block mb-2 text-sm font-semibold text-gray-500">Quantity</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max={selectedVariant.stock_quantity}
//                       value={quantity}
//                       onChange={handleQuantityChange}
//                       className="w-20 px-2 py-1 border rounded"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-4">
//                   <div className="flex items-end gap-2">
//                     <span className="text-xl font-bold text-gray-800 md:text-2xl">${product?.basePrice}</span>
//                     <span className="text-sm text-red-500">Stock: {0}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Add to Cart Button */}
//               <div className="flex gap-2.5">
//                 <button
//                   type="button"
//                   onClick={handleAddToCart}
//                   className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base"
//                 >
//                   Add to cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;





















// // import React, { useState, useRef } from "react";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getProduct } from "@/features/productSlice";

// const SingleProduct: React.FC = () => {
//   const param = useParams();
//  const dispatch = useDispatch();
//  useEffect(() => {
//     dispatch(getProduct(param.id));
//     }, [param.id]);

//  const product = useSelector((state) => state.product.singleProduct);
//  console.log('====================================');
//  console.log(product);
//  console.log('====================================');

//  const handleSelectColor = (id: string) => {
//    // update selected color
//  }

//   return (
//     <div>
//       <div className="bg-white py-6 sm:py-8 lg:py-12">
//   <div className="mx-auto max-w-screen-lg px-4 md:px-8">
//     <div className="grid gap-8 md:grid-cols-2">
//       {/* <!-- images - start --> */}
//       <div className="space-y-4">
//         <div className="relative overflow-hidden rounded-lg bg-gray-100">
//           <img src={product.images[0]} loading="lazy" alt="Photo by Himanshu Dewangan" className="h-full w-full object-cover object-center" />

//           <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">sale</span>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           {
//             product && (product.images).length > 1 && product.images.map((image : string, index : number) => (
//               <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
//                 <img src={image} loading="lazy" alt="Photo by Himanshu Dewangan" className="h-full w-full object-cover object-center" />
//               </div>
//             ))
//           }
//           {/* <div className="overflow-hidden rounded-lg bg-gray-100">
//             <img src="https://images.unsplash.com/flagged/photo-1571366992791-2ad2078656cb?auto=format&q=75&fit=crop&w=250" loading="lazy" alt="Photo by Himanshu Dewangan" className="h-full w-full object-cover object-center" />
//           </div>

//           <div className="overflow-hidden rounded-lg bg-gray-100">
//             <img src="https://images.unsplash.com/flagged/photo-1571366992968-15b65708ee76?auto=format&q=75&fit=crop&w=250" loading="lazy" alt="Photo by Himanshu Dewangan" className="h-full w-full object-cover object-center" />
//           </div> */}
//         </div>
//       </div>
//       {/* <!-- images - end --> */}

//       {/* <!-- content - start --> */}
//       <div className="md:py-8">
//         {/* <!-- name - start --> */}
//         <div className="mb-2 md:mb-3">
//           <span className="mb-0.5 inline-block text-gray-500">Fancy Brand</span>
//           <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">Pullover with pattern</h2>
//         </div>
//         {/* <!-- name - end --> */}

//         {/* <!-- rating - start --> */}
//         <div className="mb-6 flex items-center md:mb-10">
//           <div className="-ml-1 flex gap-0.5">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>

//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>

//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>

//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>

//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//           </div>

//           <span className="ml-2 text-sm text-gray-500">4.2</span>

//           <a href="#" className="ml-4 text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">view all 47 reviews</a>
//         </div>
//         {/* <!-- rating - end --> */}

//         {/* <!-- color - start --> */}
//         <div className="mb-4 md:mb-6">
//           <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Color</span>

//           <div className="flex flex-wrap gap-2">
//             {
//               product && product.variants && product.variants.filter((variant: any) => variant.type === "color").map((variant: any, index: number) => (
//                 <button
//                   type="button"
//                   className={`h-8 w-8 rounded-full border ${variant.selected? 'bg-indigo-500 ring-2 ring-white ring-offset-1' : 'bg-gray-500 ring-2 ring-transparent ring-offset-1'} transition duration-100 hover:ring-gray-200`}
//                   onClick={() => handleSelectColor(variant.id)}
//                 >
//                   {variant.name}
//                 </button>
//               ))
//             }
//             <span className="h-8 w-8 rounded-full border bg-gray-800 ring-2 ring-gray-800 ring-offset-1 transition duration-100"></span>
//             <button type="button" className="h-8 w-8 rounded-full border bg-gray-500 ring-2 ring-transparent ring-offset-1 transition duration-100 hover:ring-gray-200"></button>
//             <button type="button" className="h-8 w-8 rounded-full border bg-gray-200 ring-2 ring-transparent ring-offset-1 transition duration-100 hover:ring-gray-200"></button>
//             <button type="button" className="h-8 w-8 rounded-full border bg-white ring-2 ring-transparent ring-offset-1 transition duration-100 hover:ring-gray-200"></button>
          
//           </div>
//         </div>
//         {/* <!-- color - end --> */}

//         {/* <!-- size - start --> */}
//         <div className="mb-8 md:mb-10">
//           <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">Size</span>

//           <div className="flex flex-wrap gap-3">
//             <button type="button" className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-800 transition duration-100 hover:bg-gray-100 active:bg-gray-200">XS</button>
//             <button type="button" className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-800 transition duration-100 hover:bg-gray-100 active:bg-gray-200">S</button>
//             <span className="flex h-8 w-12 cursor-default items-center justify-center rounded-md border border-indigo-500 bg-indigo-500 text-center text-sm font-semibold text-white">M</span>
//             <button type="button" className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-800 transition duration-100 hover:bg-gray-100 active:bg-gray-200">L</button>
//             <span className="flex h-8 w-12 cursor-not-allowed items-center justify-center rounded-md border border-transparent bg-white text-center text-sm font-semibold text-gray-400">XL</span>
//           </div>
//         </div>
//         {/* <!-- size - end --> */}

//         {/* <!-- price - start --> */}
//         <div className="mb-4">
//           <div className="flex items-end gap-2">
//             <span className="text-xl font-bold text-gray-800 md:text-2xl">$15.00</span>
//             <span className="mb-0.5 text-red-500 line-through">$30.00</span>
//           </div>

//           <span className="text-sm text-gray-500">incl. VAT plus shipping</span>
//         </div>
//         {/* <!-- price - end --> */}

//         {/* <!-- shipping notice - start --> */}
//         <div className="mb-6 flex items-center gap-2 text-gray-500">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
//           </svg>

//           <span className="text-sm">2-4 day shipping</span>
//         </div>
//         {/* <!-- shipping notice - end --> */}

//         {/* <!-- buttons - start --> */}
//         <div className="flex gap-2.5">
//           <a href="#" className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base">Add to cart</a>

//           <a href="#" className="inline-block rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//           </a>
//         </div>
//         {/* <!-- buttons - end --> */}

//         {/* <!-- description - start --> */}
//         <div className="mt-10 md:mt-16 lg:mt-20">
//           <div className="mb-3 text-lg font-semibold text-gray-800">Description</div>

//           <p className="text-gray-500">
//             This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated. It may be used to display a sample of fonts or generate text for testing.<br /><br />

//             This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.
//           </p>
//         </div>
//         {/* <!-- description - end --> */}
//       </div>
//       {/* <!-- content - end --> */}
//     </div>
//   </div>
// </div>
//     </div>
//   );
// };

// export default SingleProduct;


      // <section classNameName="pt-12 pb-24 bg-blueGray-100 rounded-b-10xl overflow-hidden">
      //   <div classNameName="container px-4 mx-auto">
      //     <div classNameName="flex flex-wrap -mx-4">
      //       <div classNameName="w-full px-4">
      //         <ul classNameName="flex flex-wrap items-center mb-16">
      //           <li classNameName="mr-6">
      //             <a
      //               classNameName="flex items-center text-sm font-medium text-gray-400 hover:text-gray-500"
      //               href="#"
      //             >
      //               <span>Home</span>
      //               <svg
      //                 classNameName="ml-6"
      //                 width={4}
      //                 height={7}
      //                 viewBox="0 0 4 7"
      //                 fill="none"
      //                 xmlns="http://www.w3.org/2000/svg"
      //               >
      //                 <path
      //                   d="M0.150291 0.898704C-0.0500975 0.692525 -0.0500975 0.359292 0.150291 0.154634C0.35068 -0.0507836 0.674443 -0.0523053 0.874831 0.154634L3.7386 3.12787C3.93899 3.33329 3.93899 3.66576 3.7386 3.8727L0.874832 6.84594C0.675191 7.05135 0.35068 7.05135 0.150292 6.84594C-0.0500972 6.63976 -0.0500972 6.30652 0.150292 6.10187L2.49888 3.49914L0.150291 0.898704Z"
      //                   fill="currentColor"
      //                 ></path>
      //               </svg>
      //             </a>
      //           </li>
      //           <li classNameName="mr-6">
      //             <a
      //               classNameName="flex items-center text-sm font-medium text-gray-400 hover:text-gray-500"
      //               href="#"
      //             >
      //               <span>Store</span>
      //               <svg
      //                 classNameName="ml-6"
      //                 width={4}
      //                 height={7}
      //                 viewBox="0 0 4 7"
      //                 fill="none"
      //                 xmlns="http://www.w3.org/2000/svg"
      //               >
      //                 <path
      //                   d="M0.150291 0.898704C-0.0500975 0.692525 -0.0500975 0.359292 0.150291 0.154634C0.35068 -0.0507836 0.674443 -0.0523053 0.874831 0.154634L3.7386 3.12787C3.93899 3.33329 3.93899 3.66576 3.7386 3.8727L0.874832 6.84594C0.675191 7.05135 0.35068 7.05135 0.150292 6.84594C-0.0500972 6.63976 -0.0500972 6.30652 0.150292 6.10187L2.49888 3.49914L0.150291 0.898704Z"
      //                   fill="currentColor"
      //                 ></path>
      //               </svg>
      //             </a>
      //           </li>
      //           <li>
      //             <a
      //               classNameName="text-sm font-medium text-indigo-500 hover:text-indigo-600"
      //               href="#"
      //             >
      //               Apple iPhone 12 PRO
      //             </a>
      //           </li>
      //         </ul>
      //       </div>
      //       <div classNameName="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
      //         <div classNameName="flex -mx-4 flex-wrap items-center justify-between lg:justify-start lg:items-start xl:items-center">
      //           <div classNameName="w-full sm:w-auto min-w-max px-4 text-center flex sm:flex-col items-center justify-center">
      //             <a
      //               classNameName="inline-block sm:mb-12 mr-4 sm:mr-0 transform -rotate-90 sm:transform-none hover:text-darkBlueGray-400"
      //               href="#"
      //             >
      //               <svg
      //                 width={12}
      //                 height={8}
      //                 viewBox="0 0 12 8"
      //                 fill="none"
      //                 xmlns="http://www.w3.org/2000/svg"
      //               >
      //                 <path
      //                   d="M1.54064 7.21015C1.18719 7.59662 0.615928 7.59662 0.265087 7.21015C-0.087058 6.82369 -0.0896663 6.19929 0.265087 5.81282L5.36206 0.289847C5.71421 -0.0966173 6.28416 -0.0966172 6.63892 0.289847L11.7359 5.81282C12.088 6.19785 12.088 6.82369 11.7359 7.21015C11.3824 7.59662 10.8112 7.59662 10.4603 7.21015L5.99853 2.68073L1.54064 7.21015Z"
      //                   fill="currentColor"
      //                 ></path>
      //               </svg>
      //             </a>
      //             <a
      //               classNameName="h-30 block mb-4 mr-2 sm:mr-0"
      //               href="#"
      //             >
      //               <img
      //                 classNameName="h-full w-full"
      //                 src="uinel-assets/images/ecommerce-product-info/placeholder1.png"
      //                 alt=""
      //               />
      //             </a>
      //             <a
      //               classNameName="hidden sm:block h-30 mb-4 mr-2 sm:mr-0"
      //               href="#"
      //             >
      //               <img
      //                 classNameName="h-full w-full"
      //                 src="uinel-assets/images/ecommerce-product-info/placeholder2.png"
      //                 alt=""
      //               />
      //             </a>
      //             <a
      //               classNameName="hidden sm:block h-30 mb-4 mr-2 sm:mr-0 rounded-xl border-2 border-blueGray-500"
      //               href="#"
      //             >
      //               <img
      //                 classNameName="h-full w-full"
      //                 src="uinel-assets/images/ecommerce-product-info/placeholder4.png"
      //                 alt=""
      //               />
      //             </a>
      //             <a
      //               classNameName="h-30 block mb-4 sm:mb-12 mr-4 sm:mr-0"
      //               href="#"
      //             >
      //               <img
      //                 classNameName="h-full w-full"
      //                 src="uinel-assets/images/ecommerce-product-info/placeholder3.png"
      //                 alt=""
      //               />
      //             </a>
      //             <a
      //               classNameName="inline-block transform -rotate-90 sm:transform-none hover:text-darkBlueGray-400"
      //               href="#"
      //             >
      //               <svg
      //                 width={12}
      //                 height={8}
      //                 viewBox="0 0 12 8"
      //                 fill="none"
      //                 xmlns="http://www.w3.org/2000/svg"
      //               >
      //                 <path
      //                   d="M10.4594 0.289849C10.8128 -0.0966154 11.3841 -0.0966154 11.7349 0.289849C12.0871 0.676313 12.0897 1.30071 11.7349 1.68718L6.63794 7.21015C6.28579 7.59662 5.71584 7.59662 5.36108 7.21015L0.264109 1.68718C-0.0880364 1.30215 -0.0880363 0.676312 0.264109 0.289848C0.617558 -0.096616 1.18882 -0.0966159 1.53966 0.289848L6.00147 4.81927L10.4594 0.289849Z"
      //                   fill="currentColor"
      //                 ></path>
      //               </svg>
      //             </a>
      //           </div>
      //           <div classNameName="w-full sm:w-9/12 px-4">
      //             <img
      //               classNameName="mb-5"
      //               src="uinel-assets/images/ecommerce-product-info/ph-photo1.png"
      //               alt=""
      //             />
      //             <p classNameName="text-sm text-gray-300">
      //               Roll over image to zoom in
      //             </p>
      //           </div>
      //         </div>
      //       </div>
      //       <div classNameName="w-full lg:w-1/2 px-4">
      //         <div classNameName="max-w-md mb-6">
      //           <span classNameName="text-xs text-gray-400 tracking-wider">
      //             APPLE #3299803
      //           </span>
      //           <h2 classNameName="mt-6 mb-4 text-5xl md:text-xl lg:text-4xl font-heading font-medium">
      //             Apple iPhone 12 Pro (128GB) - Silver
      //           </h2>
      //           <p classNameName="flex items-center mb-6">
      //             <span classNameName="mr-2 text-sm text-blue-500 font-medium">
      //               $
      //             </span>
      //             <span classNameName="text-3xl text-blue-500 font-medium">
      //               44.90
      //             </span>
      //           </p>
      //           <p classNameName="text-lg text-gray-400">
      //             The nulla commodo, commodo eros a lor, tristique lectus. Lorem
      //             sad 128 GB silver.
      //           </p>
      //         </div>
      //         <div classNameName="flex mb-6 items-center">
      //           <div classNameName="inline-flex mr-4">
      //             {[...Array(5)].map((_, index) => (
      //               <button key={index} classNameName="mr-1">
      //                 <svg
      //                   width={20}
      //                   height={20}
      //                   viewBox="0 0 20 20"
      //                   fill="none"
      //                   xmlns="http://www.w3.org/2000/svg"
      //                 >
      //                   <path
      //                     d="M20 7.91679H12.4167L10 0.416779L7.58333 7.91679H0L6.18335 12.3168L3.81668 19.5835L10 15.0835L16.1834 19.5835L13.8167 12.3168L20 7.91679Z"
      //                     fill="#C1C9D3"
      //                   ></path>
      //                 </svg>
      //               </button>
      //             ))}
      //           </div>
      //           <span classNameName="text-md text-gray-400">4.59</span>
      //         </div>
      //         <div classNameName="mb-6">
      //           <h4 classNameName="mb-3 font-heading font-medium">
      //             <span>Color:</span>
      //             <span classNameName="text-gray-400">Silver</span>
      //           </h4>
      //           {[...Array(4)].map((_, index) => (
      //             <button
      //               key={index}
      //               onClick={() => handleColorSelect(index + 1)}
      //               classNameName={`inline-flex items-center justify-center p-1 rounded-full border ${
      //                 selectedColor === index + 1
      //                   ? "border-gray-300"
      //                   : "border-transparent"
      //               }`}
      //             >
      //               <div
      //                 classNameName={`w-6 h-6 rounded-full ${
      //                   index === 0
      //                     ? "bg-white"
      //                     : index === 1
      //                     ? "bg-orange-800"
      //                     : index === 2
      //                     ? "bg-blue-900"
      //                     : "bg-yellow-500"
      //                 }`}
      //               ></div>
      //             </button>
      //           ))}
      //         </div>
      //         <div classNameName="mb-10">
      //           <h4 classNameName="mb-3 font-heading font-medium">Qty:</h4>
      //           <input
      //             classNameName="w-24 px-3 py-2 text-center bg-white border-2 border-blue-500 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
      //             type="text"
      //             placeholder="1"
      //           />
      //         </div>
      //         <div classNameName="flex flex-wrap -mx-2 mb-12">
      //           <div classNameName="w-full md:w-2/3 px-2 mb-2 md:mb-0">
      //             <a
      //               classNameName="block py-4 px-2 leading-8 font-heading font-medium tracking-tighter text-xl text-white text-center bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:bg-blue-600 rounded-xl"
      //               href="#"
      //             >
      //               Add to bag
      //             </a>
      //           </div>
      //           <div classNameName="w-full md:w-1/3 px-2">
      //             <a
      //               classNameName="flex w-full py-4 px-2 items-center justify-center leading-8 font-heading font-medium tracking-tighter text-xl text-center bg-white focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 hover:bg-opacity-60 rounded-xl"
      //               href="#"
      //             >
      //               <span classNameName="mr-2">Wishlist</span>
      //               <svg
      //                 width={23}
      //                 height={22}
      //                 viewBox="0 0 23 22"
      //                 fill="none"
      //                 xmlns="http://www.w3.org/2000/svg"
      //               >
      //                 <path
      //                   d="M11.3235 20.1324L2.52488 10.8515C1.75232 10.0706 1.24237 9.06367 1.06728 7.97339C0.8922 6.88311 1.06086 5.76477 1.54936 4.7768V4.7768C1.91837 4.03089 2.45739 3.3843 3.12201 2.89033C3.78663 2.39635 4.55781 2.06911 5.37203 1.93558C6.18626 1.80205 7.0202 1.86605 7.80517 2.1223C8.59013 2.37855 9.30364 2.81972 9.88691 3.40946L11.3235 4.86204L12.7601 3.40946C13.3434 2.81972 14.0569 2.37855 14.8419 2.1223C15.6269 1.86605 16.4608 1.80205 17.275 1.93558C18.0892 2.06911 18.8604 2.39635 19.525 2.89033C20.1897 3.3843 20.7287 4.03089 21.0977 4.7768V4.7768C21.5862 5.76477 21.7549 6.88311 21.5798 7.97339C21.4047 9.06367 20.8947 10.0706 20.1222 10.8515L11.3235 20.1324Z"
      //                   stroke="black"
      //                   strokeWidth="2"
      //                   strokeLinecap="round"
      //                   strokeLinejoin="round"
      //                 ></path>
      //               </svg>
      //             </a>
      //           </div>
      //         </div>
      //         <div>
      //           <h4 classNameName="mb-6 font-heading font-medium">
      //             More information
      //           </h4>
      //           <button
      //             classNameName="w-full pl-6 lg:pl-12 pr-6 py-4 mb-4 leading-7 rounded-2xl border-2 border-blueGray-200 hover:border-blueGray-300"
      //             onClick={toggleShippingAccordion}
      //           >
      //             <div classNameName="flex justify-between items-center">
      //               <h3 classNameName="text-lg font-heading font-medium">
      //                 Shipping & returns
      //               </h3>
      //               <span
      //                 classNameName={`inline-block transform transition-transform duration-500 ${
      //                   shippingAccordionOpen ? "rotate-180" : "rotate-0"
      //                 }`}
      //               >
      //                 <svg
      //                   width={12}
      //                   height={8}
      //                   viewBox="0 0 12 8"
      //                   fill="none"
      //                   xmlns="http://www.w3.org/2000/svg"
      //                 >
      //                   <path
      //                     d="M10.4594 0.289848C10.8128 -0.096616 11.3841 -0.096616 11.7349 0.289848C12.0871 0.676312 12.0897 1.30071 11.7349 1.68718L6.63794 7.21015C6.28579 7.59662 5.71584 7.59662 5.36108 7.21015L0.264109 1.68718C-0.0880363 1.30215 -0.0880363 0.676312 0.264109 0.289848C0.617558 -0.096616 1.18882 -0.096616 1.53966 0.289848L6.00147 4.81927L10.4594 0.289848Z"
      //                     fill="black"
      //                   ></path>
      //                 </svg>
      //               </span>
      //             </div>
      //             <div
      //               ref={shippingContainerRef}
      //               classNameName={`overflow-hidden transition-all duration-500 ${
      //                 shippingAccordionOpen ? "h-auto" : "h-0"
      //               }`}
      //               style={{
      //                 height: shippingAccordionOpen
      //                   ? `${shippingContainerRef.current?.scrollHeight}px`
      //                   : "0px",
      //               }}
      //             >
      //               <p classNameName="max-w-xl text-left mt-4 text-lg tracking-tighter text-gray-400">
      //                 Pretium ac auctor quis urna orci feugiat. Vulputate tellus
      //                 velit tellus orci auctor vel nulla facilisi ut. Dummy
      //                 conten amazing Ante nunc risus viverra vivamus.
      //               </p>
      //             </div>
      //           </button>
      //           <button
      //             classNameName="w-full pl-6 lg:pl-12 pr-6 py-4 leading-7 rounded-2xl border-2 border-blueGray-200 hover:border-blueGray-300"
      //             onClick={toggleDetailsAccordion}
      //           >
      //             <div classNameName="flex justify-between items-center">
      //               <h3 classNameName="text-lg font-heading font-medium">
      //                 Product details
      //               </h3>
      //               <span
      //                 classNameName={`inline-block transform transition-transform duration-500 ${
      //                   detailsAccordionOpen ? "rotate-180" : "rotate-0"
      //                 }`}
      //               >
      //                 <svg
      //                   width={12}
      //                   height={8}
      //                   viewBox="0 0 12 8"
      //                   fill="none"
      //                   xmlns="http://www.w3.org/2000/svg"
      //                 >
      //                   <path
      //                     d="M10.4594 0.289848C10.8128 -0.096616 11.3841 -0.096616 11.7349 0.289848C12.0871 0.676312 12.0897 1.30071 11.7349 1.68718L6.63794 7.21015C6.28579 7.59662 5.71584 7.59662 5.36108 7.21015L0.264109 1.68718C-0.0880363 1.30215 -0.0880363 0.676312 0.264109 0.289848C0.617558 -0.096616 1.18882 -0.096616 1.53966 0.289848L6.00147 4.81927L10.4594 0.289848Z"
      //                     fill="black"
      //                   ></path>
      //                 </svg>
      //               </span>
      //             </div>
      //             <div
      //               ref={detailsContainerRef}
      //               classNameName={`overflow-hidden transition-all duration-500 ${
      //                 detailsAccordionOpen ? "h-auto" : "h-0"
      //               }`}
      //               style={{
      //                 height: detailsAccordionOpen
      //                   ? `${detailsContainerRef.current?.scrollHeight}px`
      //                   : "0px",
      //               }}
      //             >
      //               <p classNameName="max-w-xl text-left mt-4 text-lg tracking-tighter text-gray-400">
      //                 Pretium ac auctor quis urna orci feugiat. Vulputate tellus
      //                 velit tellus orci auctor vel nulla facilisi ut. Dummy
      //                 conten amazing Ante nunc risus viverra vivamus.
      //               </p>
      //             </div>
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </section>