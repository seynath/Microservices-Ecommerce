import { getAllProducts } from "@/features/productSlice";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
const Shop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  const products = useSelector((state) => state.product.products);




  return (
    <div className="flex">
      {/* filter */}
      <div className="w-[250px] py-6 sm:py-8 lg:py-12 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:text-2xl">
                Filter
              </h2>
        <div className="hidden space-y-4 lg:block ">
          <div>
            <label
              htmlFor="SortBy"
              className="block text-xs font-medium text-gray-700"
            >
              {" "}
              Sort By{" "}
            </label>

            <select
              id="SortBy"
              className="mt-1 rounded border-gray-300 text-sm"
            >
              <option>Sort By</option>
              <option value="Title, DESC">Title, DESC</option>
              <option value="Title, ASC">Title, ASC</option>
              <option value="Price, DESC">Price, DESC</option>
              <option value="Price, ASC">Price, ASC</option>
            </select>
          </div>

          <div>
            <p className="block text-xs font-medium text-gray-700">Filters</p>

            <div className="mt-1 space-y-2">
              <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700"> 0 Selected </span>

                    <button
                      type="button"
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <ul className="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label
                        htmlFor="FilterInStock"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterInStock"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          In Stock (5+){" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterPreOrder"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterPreOrder"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Pre Order (3+){" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterOutOfStock"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterOutOfStock"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Out of Stock (10+){" "}
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700">
                      {" "}
                      The highest price is $600{" "}
                    </span>

                    <button
                      type="button"
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <div className="border-t border-gray-200 p-4">
                    <div className="flex justify-between gap-4">
                      <label
                        htmlFor="FilterPriceFrom"
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm text-gray-600">$</span>

                        <input
                          type="number"
                          id="FilterPriceFrom"
                          placeholder="From"
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                      </label>

                      <label
                        htmlFor="FilterPriceTo"
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm text-gray-600">$</span>

                        <input
                          type="number"
                          id="FilterPriceTo"
                          placeholder="To"
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </details>

              <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                  <span className="text-sm font-medium"> Colors </span>

                  <span className="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700"> 0 Selected </span>

                    <button
                      type="button"
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <ul className="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label
                        htmlFor="FilterRed"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterRed"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Red{" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterBlue"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterBlue"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Blue{" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterGreen"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterGreen"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Green{" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterOrange"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterOrange"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Orange{" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterPurple"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterPurple"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Purple{" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterTeal"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterTeal"
                          className="size-5 rounded border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Teal{" "}
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="">
        {/* product grid */}
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                Our Store
              </h2>

              {/* <a href="#" className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">Show more</a> */}
            </div>

            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 ">
     { products && products.length > 0 && products.map((product, index) => (
              <div key={index} >
                <NavLink
                  to={`/product/${product._id}`}
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src={product.images[0]}
                    loading="lazy"
                    alt="Photo by Rachit Tank"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />

                  <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                    sale
                  </span>
                </NavLink>

                <div>
                  <NavLink
                    to="#"
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

                  ) )}
              {/* <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Galina N"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Fancy Plant
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $9.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by eniko kis"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Elderly Cam
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $45.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Irene Kredenets"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Shiny Shoe
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $29.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1528476513691-07e6f563d97f?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Charles Deluvio"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Spiky Plant
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $4.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1612033448550-9d6f9c17f07d?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Fernando Lavin"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Wieldy Film
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $19.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1579609598065-79f8e5bcfb70?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Kiran CK"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                  <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                    sale
                  </span>
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Sturdy Stand
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $12.00
                    </span>
                    <span className="mb-0.5 text-red-500 line-through">
                      $24.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#"
                  className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1619066045029-5c7e8537bd8c?auto=format&q=75&fit=crop&w=600"
                    loading="lazy"
                    alt="Photo by Fakurian Design"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>

                <div>
                  <a
                    href="#"
                    className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                  >
                    Lazy Bottle
                  </a>

                  <div className="flex items-end gap-2">
                    <span className="font-bold text-gray-800 lg:text-lg">
                      $9.00
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Shop;
