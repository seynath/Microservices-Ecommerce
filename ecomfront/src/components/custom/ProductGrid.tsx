import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getAllProducts } from "@/features/productSlice";
import { Link } from "react-router-dom";
const ProductGrid = () => {

  const dispatch = useDispatch()
  const products = useSelector((state) => state?.product?.products)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])



  
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

      <div className="mb-10 md:mb-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Selected</h2>
  
        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.</p>
      </div>

  
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

{
  products && products.map(product => (
    <div>
    <Link to={`/product/${product._id}`} className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
      <img src={`${product.images[0]}`} loading="lazy" alt="Photo by Austin Wade" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

      <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">-50%</span>
    </Link>

    <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
      <div className="flex flex-col">
        <a href="#" className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">{product.name}</a>
        <span className="text-sm text-gray-500 lg:text-base">by {product.brand}</span>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-bold text-gray-600 lg:text-lg">${product.basePrice}</span>
        <span className="text-sm text-red-500 line-through">$39.99</span>
      </div>
    </div>
  </div>
      ))
}
        {/* <div>
          <a href="#" className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
            <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&q=75&fit=crop&crop=top&w=600&h=700" loading="lazy" alt="Photo by Austin Wade" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
  
            <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">-50%</span>
          </a>
  
          <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
            <div className="flex flex-col">
              <a href="#" className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">Fancy Outfit</a>
              <span className="text-sm text-gray-500 lg:text-base">by Fancy Brand</span>
            </div>
  
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-600 lg:text-lg">$19.99</span>
              <span className="text-sm text-red-500 line-through">$39.99</span>
            </div>
          </div>
        </div>

  

        <div>
          <a href="#" className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
            <img src="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&q=75&fit=crop&crop=top&w=600&h=700" loading="lazy" alt="Photo by Nick Karvounis" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
          </a>
  
          <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
            <div className="flex flex-col">
              <a href="#" className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">Cool Outfit</a>
              <span className="text-sm text-gray-500 lg:text-base">by Cool Brand</span>
            </div>
  
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-600 lg:text-lg">$29.99</span>
            </div>
          </div>
        </div>

  

        <div>
          <a href="#" className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
            <img src="https://images.unsplash.com/photo-1548286978-f218023f8d18?auto=format&q=75&fit=crop&crop=top&w=600&h=700" loading="lazy" alt="Photo by Austin Wade" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
          </a>
  
          <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
            <div className="flex flex-col">
              <a href="#" className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">Nice Outfit</a>
              <span className="text-sm text-gray-500 lg:text-base">by Nice Brand</span>
            </div>
  
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-600 lg:text-lg">$35.00</span>
            </div>
          </div>
        </div>

  

        <div>
          <a href="#" className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
            <img src="https://images.unsplash.com/photo-1566207274740-0f8cf6b7d5a5?auto=format&q=75&fit=crop&crop=top&w=600&h=700" loading="lazy" alt="Photo by Vladimir Fedotov" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
          </a>
  
          <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
            <div className="flex flex-col">
              <a href="#" className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">Lavish Outfit</a>
              <span className="text-sm text-gray-500 lg:text-base">by Lavish Brand</span>
            </div>
  
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-600 lg:text-lg">$49.99</span>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  </div>
  )
}

export default ProductGrid
