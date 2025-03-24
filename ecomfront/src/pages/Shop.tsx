import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllProducts } from "@/features/productSlice";

const Shop = () => {
  const dispatch = useDispatch();

  // 1. On mount, fetch products from Redux
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // 2. Grab products from store
  const products = useSelector((state) => state.product.products);

  // 3. Add local states for sort/filters
  const [sortOption, setSortOption] = useState("");
  // availability choices, e.g. { inStock: true, outOfStock: false, preOrder: false }
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false,
    preOrder: false,
  });
  // price range
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 4. Derive final filtered+sorted array of products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let updated = [...products];

    // ---- 4a) AVAILABILITY FILTERS ----
    // Example logic: 
    //   - inStock => stock_quantity > 0
    //   - outOfStock => stock_quantity === 0
    //   - preOrder => you might define your own condition
    // If none of the checkboxes is selected, skip. If one is selected, filter accordingly.

    const { inStock, outOfStock, preOrder } = availability;
    const anyAvailabilitySelected = inStock || outOfStock || preOrder;

    if (anyAvailabilitySelected) {
      updated = updated.filter((p) => {
        const qty = p.stock_quantity ?? 0;

        // Decide if product meets ANY of the checked conditions
        let pass = false;

        if (inStock && qty > 0) {
          pass = true;
        }
        if (outOfStock && qty === 0) {
          pass = true;
        }
        // If you want a "preOrder" definition, you'd check some property
        // if (preOrder && p.isPreOrder) { pass = true; }

        return pass;
      });
    }

    // ---- 4b) PRICE FILTER ----
    // If user has typed a minPrice or maxPrice, filter accordingly.
    if (minPrice) {
      updated = updated.filter((p) => p.basePrice >= Number(minPrice));
    }
    if (maxPrice) {
      updated = updated.filter((p) => p.basePrice <= Number(maxPrice));
    }

    // ---- 4c) SORTING ----
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
      // no sorting
    }

    return updated;
  }, [products, sortOption, availability, minPrice, maxPrice]);

  // 5. Render
  return (
    <div className="flex">
      {/* FILTER COLUMN */}
      <div className="w-[250px] py-6 sm:py-8 lg:py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:text-2xl">Filter</h2>

        {/* SORT-BY DROPDOWN */}
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
            <option value="Title, ASC">Alphebeticaly, A-Z</option>
            <option value="Title, DESC">Alphebeticaly, Z-A</option>
            <option value="Price, ASC">Price, Low to High</option>
            <option value="Price, DESC">Price, High to Low</option>
          </select>
        </div>

        {/* AVAILABILITY FILTER */}
        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden mb-4">
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
            <span className="text-sm font-medium"> Availability </span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </summary>
          <div className="border-t border-gray-200 bg-white">
            <ul className="space-y-1 border-t border-gray-200 p-4">
              <li>
                <label htmlFor="FilterInStock" className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="FilterInStock"
                    className="size-5 rounded border-gray-300"
                    checked={availability.inStock}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, inStock: e.target.checked }))
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
              </li>
              <li>
                <label htmlFor="FilterOutOfStock" className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="FilterOutOfStock"
                    className="size-5 rounded border-gray-300"
                    checked={availability.outOfStock}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, outOfStock: e.target.checked }))
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">Out of Stock</span>
                </label>
              </li>
              <li>
                <label htmlFor="FilterPreOrder" className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="FilterPreOrder"
                    className="size-5 rounded border-gray-300"
                    checked={availability.preOrder}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, preOrder: e.target.checked }))
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">Pre Order</span>
                </label>
              </li>
            </ul>
          </div>
        </details>

        {/* PRICE FILTER */}
        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden mb-4">
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
            <span className="text-sm font-medium"> Price </span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </summary>

          <div className="border-t border-gray-200 bg-white">
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between gap-4">
                <label htmlFor="FilterPriceFrom" className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    id="FilterPriceFrom"
                    placeholder="From"
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </label>

                <label htmlFor="FilterPriceTo" className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    id="FilterPriceTo"
                    placeholder="To"
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* PRODUCT GRID */}
      <div className="flex-1">
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">Our Store</h2>
            </div>

            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product._id}>
                  <NavLink
                    to={`/product/${product._id}`}
                    className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                  >
                    <img
                      src={product.images[0]}
                      loading="lazy"
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    />
                    <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                      sale
                    </span>
                  </NavLink>
                  <div>
                    <NavLink
                      to={`/product/${product._id}`}
                      className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                    >
                      {product.name}
                    </NavLink>
                    <div className="flex items-end gap-2">
                      <span className="font-bold text-gray-800 lg:text-lg">
                        ${product.basePrice}
                      </span>
                      <span className="mb-0.5 text-red-500 line-through">
                        ${product.basePrice * 1.5}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
