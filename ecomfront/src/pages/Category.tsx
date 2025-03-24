import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "@/features/productSlice";
import { getAllCategories } from "@/features/categorySlice";
import { NavLink } from "react-router-dom";

const Category = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  const allProducts = useSelector((state) => state?.product?.products);
  const categories = useSelector((state) => state?.category?.category);

  // Filter products belonging to the category or subcategory
  const filteredByCategory = allProducts?.filter(
    (product) => product.categoryId === id || product.subcategoryId === id
  );

  // Sort & Filter State
  const [sortOption, setSortOption] = useState("");
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false,
    preOrder: false,
  });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);

  // Derived Sorted & Filtered Products
  const filteredProducts = useMemo(() => {
    let updated = [...(filteredByCategory || [])];

    // Availability Filter
    if (availability.inStock || availability.outOfStock || availability.preOrder) {
      updated = updated.filter((product) => {
        const qty = product.stock_quantity ?? 0;
        let pass = false;

        if (availability.inStock && qty > 0) pass = true;
        if (availability.outOfStock && qty === 0) pass = true;
        if (availability.preOrder) pass = true; // Define logic if pre-order items exist

        return pass;
      });
    }

    // Price Range Filter
    if (minPrice) updated = updated.filter((p) => p.basePrice >= Number(minPrice));
    if (maxPrice) updated = updated.filter((p) => p.basePrice <= Number(maxPrice));

    // Color Filter (if colors are selected)
    if (selectedColors.length > 0) {
      updated = updated.filter((product) =>
        product.variants.some((variant) =>
          variant.attributes.some(
            (attr) => attr.key === "Color" && selectedColors.includes(attr.value)
          )
        )
      );
    }

    // Sorting
    switch (sortOption) {
      case "Title, ASC":
        updated.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Title, DESC":
        updated.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price, ASC":
        updated.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "Price, DESC":
        updated.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        break;
    }

    return updated;
  }, [filteredByCategory, sortOption, availability, minPrice, maxPrice, selectedColors]);

  return (
    <div className="flex">
      {/* FILTER PANEL */}
      <div className="w-[250px] py-6 sm:py-8 lg:py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:text-2xl">Filter</h2>

        {/* SORT BY DROPDOWN */}
        <div className="mb-4">
          <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="SortBy"
            className="mt-1 rounded border-gray-300 text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="Title, ASC">Alphabetically, A-Z</option>
            <option value="Title, DESC">Alphabetically, Z-A</option>
            <option value="Price, ASC">Price, Low to High</option>
            <option value="Price, DESC">Price, High to Low</option>
          </select>
        </div>

        {/* AVAILABILITY FILTER */}
        <details className="mb-4">
          <summary className="cursor-pointer text-sm font-medium">Availability</summary>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={() =>
                  setAvailability((prev) => ({ ...prev, inStock: !prev.inStock }))
                }
              />
              In Stock
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={() =>
                  setAvailability((prev) => ({ ...prev, outOfStock: !prev.outOfStock }))
                }
              />
              Out of Stock
            </label>
          </div>
        </details>

        {/* PRICE FILTER */}
        <details className="mb-4">
          <summary className="cursor-pointer text-sm font-medium">Price</summary>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-md border-gray-300 text-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-md border-gray-300 text-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </details>

        {/* COLOR FILTER */}
        <details className="mb-4">
          <summary className="cursor-pointer text-sm font-medium">Colors</summary>
          <div className="mt-2 space-y-2">
            {["Red", "Blue", "Green", "Black", "White", "Gray"].map((color) => (
              <label key={color} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() =>
                    setSelectedColors((prev) =>
                      prev.includes(color)
                        ? prev.filter((c) => c !== color)
                        : [...prev, color]
                    )
                  }
                />
                {color}
              </label>
            ))}
          </div>
        </details>
      </div>

      {/* PRODUCTS GRID */}
      <div className="flex-1">
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{name}</h2>
            </div>

            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product._id}>
                  <NavLink to={`/product/${product._id}`} className="block">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-60 object-cover rounded-md"
                    />
                  </NavLink>
                  <h3 className="text-sm">{product.name}</h3>
                  <p className="text-lg font-semibold">${product.basePrice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;






// import { useParams } from "react-router-dom"
// import { useDispatch, useSelector } from "react-redux"
// import { useEffect } from "react"
// import { getAllProducts } from "@/features/productSlice"
// import { getAllCategories } from "@/features/categorySlice"
// import { NavLink } from "react-router-dom"
// const Category = () => {
//   const dispatch = useDispatch()

//   const {id, name} = useParams()
//   console.log("Category ID:", id)

//   useEffect(() => {
//     dispatch(getAllProducts(id))
//     dispatch(getAllCategories())
//   }
//   , [id])

//   const allproducts = useSelector((state) => state?.product?.products)
//   console.log("Products:", allproducts)
//   const categories = useSelector((state) => state?.category?.category)
//   console.log("Categories:", categories)

//   const filteredProducts = allproducts?.filter((product) => product.categoryId === id || product.subcategoryId === id)
//   console.log("Filtered Products:", filteredProducts)


//   return (
//    <div className="flex">
//          {/* filter */}
//          <div className="w-[250px] py-6 sm:py-8 lg:py-12 ">
//          <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:text-2xl">
//                    Filter
//                  </h2>
//            <div className="hidden space-y-4 lg:block ">
//              <div>
//                <label
//                  htmlFor="SortBy"
//                  className="block text-xs font-medium text-gray-700"
//                >
//                  {" "}
//                  Sort By{" "}
//                </label>
   
//                <select
//                  id="SortBy"
//                  className="mt-1 rounded border-gray-300 text-sm"
//                >
//                  <option>Sort By</option>
//                  <option value="Title, ASC">Alphebeticaly, A-Z</option>
//                  <option value="Title, DESC">Alphebeticaly, Z-A</option>
//                  <option value="Price, DESC">Price, Low to High</option>
//                  <option value="Price, ASC">Price, High to Low</option>
//                </select>
//              </div>
   
//              <div>
//                <p className="block text-xs font-medium text-gray-700">Filters</p>
   
//                <div className="mt-1 space-y-2">
//                  <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
//                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
//                      <span className="text-sm font-medium"> Availability </span>
   
//                      <span className="transition group-open:-rotate-180">
//                        <svg
//                          xmlns="http://www.w3.org/2000/svg"
//                          fill="none"
//                          viewBox="0 0 24 24"
//                          strokeWidth="1.5"
//                          stroke="currentColor"
//                          className="size-4"
//                        >
//                          <path
//                            strokeLinecap="round"
//                            strokeLinejoin="round"
//                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
//                          />
//                        </svg>
//                      </span>
//                    </summary>
   
//                    <div className="border-t border-gray-200 bg-white">
//                      <header className="flex items-center justify-between p-4">
//                        <span className="text-sm text-gray-700"> 0 Selected </span>
   
//                        <button
//                          type="button"
//                          className="text-sm text-gray-900 underline underline-offset-4"
//                        >
//                          Reset
//                        </button>
//                      </header>
   
//                      <ul className="space-y-1 border-t border-gray-200 p-4">
//                        <li>
//                          <label
//                            htmlFor="FilterInStock"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterInStock"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              In Stock (5+){" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterPreOrder"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterPreOrder"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Pre Order (3+){" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterOutOfStock"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterOutOfStock"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Out of Stock (10+){" "}
//                            </span>
//                          </label>
//                        </li>
//                      </ul>
//                    </div>
//                  </details>
   
//                  <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
//                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
//                      <span className="text-sm font-medium"> Price </span>
   
//                      <span className="transition group-open:-rotate-180">
//                        <svg
//                          xmlns="http://www.w3.org/2000/svg"
//                          fill="none"
//                          viewBox="0 0 24 24"
//                          strokeWidth="1.5"
//                          stroke="currentColor"
//                          className="size-4"
//                        >
//                          <path
//                            strokeLinecap="round"
//                            strokeLinejoin="round"
//                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
//                          />
//                        </svg>
//                      </span>
//                    </summary>
   
//                    <div className="border-t border-gray-200 bg-white">
//                      <header className="flex items-center justify-between p-4">
//                        <span className="text-sm text-gray-700">
//                          {" "}
//                          The highest price is $600{" "}
//                        </span>
   
//                        <button
//                          type="button"
//                          className="text-sm text-gray-900 underline underline-offset-4"
//                        >
//                          Reset
//                        </button>
//                      </header>
   
//                      <div className="border-t border-gray-200 p-4">
//                        <div className="flex justify-between gap-4">
//                          <label
//                            htmlFor="FilterPriceFrom"
//                            className="flex items-center gap-2"
//                          >
//                            <span className="text-sm text-gray-600">$</span>
   
//                            <input
//                              type="number"
//                              id="FilterPriceFrom"
//                              placeholder="From"
//                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
//                            />
//                          </label>
   
//                          <label
//                            htmlFor="FilterPriceTo"
//                            className="flex items-center gap-2"
//                          >
//                            <span className="text-sm text-gray-600">$</span>
   
//                            <input
//                              type="number"
//                              id="FilterPriceTo"
//                              placeholder="To"
//                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
//                            />
//                          </label>
//                        </div>
//                      </div>
//                    </div>
//                  </details>
   
//                  <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
//                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
//                      <span className="text-sm font-medium"> Colors </span>
   
//                      <span className="transition group-open:-rotate-180">
//                        <svg
//                          xmlns="http://www.w3.org/2000/svg"
//                          fill="none"
//                          viewBox="0 0 24 24"
//                          strokeWidth="1.5"
//                          stroke="currentColor"
//                          className="size-4"
//                        >
//                          <path
//                            strokeLinecap="round"
//                            strokeLinejoin="round"
//                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
//                          />
//                        </svg>
//                      </span>
//                    </summary>
   
//                    <div className="border-t border-gray-200 bg-white">
//                      <header className="flex items-center justify-between p-4">
//                        <span className="text-sm text-gray-700"> 0 Selected </span>
   
//                        <button
//                          type="button"
//                          className="text-sm text-gray-900 underline underline-offset-4"
//                        >
//                          Reset
//                        </button>
//                      </header>
   
//                      <ul className="space-y-1 border-t border-gray-200 p-4">
//                        <li>
//                          <label
//                            htmlFor="FilterRed"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterRed"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Red{" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterBlue"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterBlue"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Blue{" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterGreen"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterGreen"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Green{" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterOrange"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterOrange"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Orange{" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterPurple"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterPurple"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Purple{" "}
//                            </span>
//                          </label>
//                        </li>
   
//                        <li>
//                          <label
//                            htmlFor="FilterTeal"
//                            className="inline-flex items-center gap-2"
//                          >
//                            <input
//                              type="checkbox"
//                              id="FilterTeal"
//                              className="size-5 rounded border-gray-300"
//                            />
   
//                            <span className="text-sm font-medium text-gray-700">
//                              {" "}
//                              Teal{" "}
//                            </span>
//                          </label>
//                        </li>
//                      </ul>
//                    </div>
//                  </details>
//                </div>
//              </div>
//            </div>
//          </div>
//          {/* right */}
//          <div className="">
//            {/* product grid */}
//            <div className="bg-white py-6 sm:py-8 lg:py-12">
//              <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
//                <div className="mb-6 flex items-end justify-between gap-4">
//                  <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">

//                    {name}
//                  </h2>
   
//                  {/* <a href="#" className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">Show more</a> */}
//                </div>
   
//                <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 ">
//         { filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => (
//                  <div key={index} >
//                    <NavLink
//                      to={`/product/${product._id}`}
//                      className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
//                    >
//                      <img
//                        src={product.images[0]}
//                        loading="lazy"
//                        alt="Photo by Rachit Tank"
//                        className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
//                      />
   
//                      <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
//                        sale
//                      </span>
//                    </NavLink>
   
//                    <div>
//                      <NavLink
//                        to="#"
//                        className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
//                        >
//                        {product.name}
//                      </NavLink>
   
//                      <div className="flex items-end gap-2">
//                        <span className="font-bold text-gray-800 lg:text-lg">
//                          ${product.basePrice}
//                        </span>
//                        <span className="mb-0.5 text-red-500 line-through">
//                          ${product.basePrice * 1.5}
//                        </span>
//                      </div>
//                    </div>
//                  </div>
   
//                      ) )}
//                </div>
//              </div>
//            </div>
   
           
//          </div>
//        </div>
//   )
// }

// export default Category