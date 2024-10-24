import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import InputImages from "./components/InputImage";
import { getCategories } from "@/api/CategoryAPI";
import { createProduct } from "@/api/ProductAPI";
import ProductTable from "./components/ProductTable";
import { Button, Modal } from "flowbite-react";
import { getProducts } from "@/api/ProductAPI";
import { getProductById, updateProduct,deleteProduct } from "@/api/ProductAPI";
import UploadWidget from "./components/UploadWidget";
import UpdateUploadWidget from "./components/UpdateUploadWidget";
import { HiOutlineExclamationCircle } from "react-icons/hi";


// Define types for the images and variants
interface ImageType {
  url: string;
  width: number;
  height: number;
  public_id: string;
}

interface VariantType {
  size?: string;
  color?: string;
  price: number;
  stock_quantity: number;
}

const Product: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const[editProductId, setEditProductId] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const[loadEditProduct, setLoadEditProduct] = useState(
    {
      title: "",
      description: "",
      basePrice: 0,
      category: "",
      subcategory: "",
      images: [],
      variants: [],
      stockQuantity: 0,
    }
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // const [keywords, setKeywords] = useState<string>("");
  // const [author, setAuthor] = useState<string>("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  // const [subcategories, setSubcategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subcategory, setSubcategory] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [deleteProductId, setDeleteProductId] = useState<string>("");
  const [variant, setVariant] = useState<VariantType>({
    size: "",
    color: "",
    price: 0,
    stock_quantity: 0,
  });

  // Add new variant to the list
  const handleAddVariant = () => {
    setVariants((prevVariants) => [...prevVariants, variant]);
    setVariant({ size: "", color: "", price: 0, stock_quantity: 0 }); // Reset variant input fields
  };

  // Remove a specific variant from the list
  const handleRemoveVariant = (index: number) => {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  };


  const deleteProductDo = async () => {
    setOpenDeleteModal(false);
    try {
      const response = await deleteProduct(deleteProductId);
      if (response.status === 200) {
        fetchProducts();
        console.log("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  const handleDeleteProduct = async (productId) =>{
    setDeleteProductId(productId);
    setOpenDeleteModal(true);

  }

  // Handle product edit: Load product details, including images (URLs)
  const handleEditProduct = async (id: string) => {
    setEditProductId(id);
    const fetchedProduct = await getProductById(id);
    setTitle(fetchedProduct.name);
    setDescription(fetchedProduct.description);
    setBasePrice(fetchedProduct.basePrice);
    setCategory(fetchedProduct.categoryId);
    setSubcategory(fetchedProduct.subcategoryId);
    setImages(fetchedProduct.images); // Load URLs
    setVariants(fetchedProduct.variants);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      name: title,
      description,
      basePrice,
      categoryId: category,
      subcategoryId: subcategory,
      images, // Send URLs
      variants,
    };

    try {
      const response = await createProduct(product);
      console.log('Product created:', response);
    } catch (error) {
      console.error('Product creation failed:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(variants)
    const product = {
      name: title,
      description,
      basePrice,
      categoryId: category,
      subcategoryId: subcategory,
      images, // Send URLs
      variants,
    };

    try {
      const response = await updateProduct(editProductId, product);
      console.log('Product updated:', response);
    } catch (error) {
      console.error('Product update failed:', error);
    }
  }


  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const category = categories.find((cat) => cat.name === categoryName);
    console.log("Selected category:", category);
    setCategory(category._id);
    setSelectedCategory(category);
  };
  // const handleRemoveImage = async (public_id: string, index: number) => {
  //   try {
  //     await axios.post("/api/delete-image", { public_id });
  //     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  //   } catch (error: any) {
  //     console.error("Failed to remove image:", error);
  //   }
  // };

  // Fetch categories and subcategories
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        console.log("Products fetched in Product:", allProducts);
        // Map the products data to the format needed by ProductTable
        const mappedProducts = allProducts.map((product, index) => ({
          key: product._id,
          name: product.name,
          basePrice: product.basePrice,
          stock_quantity: product.stock_quantity,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          image: product.images[0], // Display the first image
          variants: product.variants || [],
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  useEffect(() => {


    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCategories();
        // console.log("Categories fetched in Product:", response);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>{editProduct}</h1>
      <div>
        <Button onClick={() => setOpenModal(true)}>Add Product</Button>
        <Modal
          dismissible
          show={openModal}
          size="6xl"
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <form
              // onSubmit={handleSubmit}
              onSubmit= {editProduct ? handleUpdate : handleSubmit}
              className="max-w-5xl mx-auto p-6 rounded-lg shadow-md"
            >
              {
                editProduct && editProduct ? (
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Edit Product
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Create a New Product
                  </h2>
                )
              }
             

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-lg font-medium mb-2"
                >
                  Title
                </label>
                {/* {
                  editProduct && editProduct ? (
                    <input
                      type="text"
                      id="title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                      value={editProduct.title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter the title"
                    />
                  ) : (
                    <input
                      type="text"
                      id="title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter the title"
                    />
                  )
                } */}
                <input
                  type="text"
                  id="title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter the title"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-lg font-medium mb-2"
                >
                  Description
                </label>
                <Editor
                  apiKey="btkxtx8y73a9lfz8np04eyg0so0dli82s9wexjru5jlzmzmm"
                  value={description}
                  onEditorChange={(content) => setDescription(content)}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: "link lists image media table",
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image media",
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="basePrice"
                  className="block text-lg font-medium mb-2"
                >
                  Base Price
                </label>
                <input
                  type="number"
                  id="basePrice"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                  placeholder="Enter the base price"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-lg font-medium mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  // value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subcategory"
                  className="block text-lg font-medium mb-2"
                >
                  Subcategory
                </label>
                {selectedCategory && (
                  <select
                    id="subcategory"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  >
                    <option value="">Select a subcategory</option>
                    {selectedCategory.subCategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Variant Management */}
              <div className="mb-4">
                <h3 className="block text-lg font-medium mb-2">
                  Product Variants
                </h3>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Size (e.g., S, M, L)"
                    value={variant.size}
                    onChange={(e) =>
                      setVariant((prev) => ({ ...prev, size: e.target.value }))
                    }
                    className="mr-2 p-2 border"
                  />
                  <input
                    type="text"
                    placeholder="Color (e.g., Red, Blue)"
                    value={variant.color}
                    onChange={(e) =>
                      setVariant((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="mr-2 p-2 border"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      setVariant((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value),
                      }))
                    }
                    className="mr-2 p-2 border"
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={variant.stock_quantity}
                    onChange={(e) =>
                      setVariant((prev) => ({
                        ...prev,
                        stock_quantity: parseInt(e.target.value),
                      }))
                    }
                    className="mr-2 p-2 border"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="p-2 bg-blue-600 text-white rounded"
                  >
                    Add Variant
                  </button>
                </div>
              </div>

              {/* Display Added Variants */}
              {variants.length > 0 && (
                <div className="mb-4">
                  <h4 className="block text-lg font-medium mb-2">
                    Added Variants:
                  </h4>
                  <ul>
                    {variants.map((variant, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        {variant.size || "No Size"},{" "}
                        {variant.color || "No Color"} - ${variant.price} -{" "}
                        {variant.stock_quantity} units
                        <button
                          type="button"
                          className="ml-4 p-2 bg-red-600 text-white rounded"
                          onClick={() => handleRemoveVariant(idx)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* <InputImages images={images} setImages={setImages} /> */}
              {/* {
                editProduct && editProduct ? (
                  <UpdateUploadWidget setImages={setImages} images={images}/>)
                  : (
                    <UploadWidget setImages={setImages} images={images}/>
                  )

              } */}
                    <UploadWidget setImages={setImages} images={images} />


{/* {
  editProduct && editProduct ? (
    <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
    onClick={handleUpdate}
  >
    Update Product
  </button>
  ) : (
    <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
  >
    Create Product
  </button>
  )
} */}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
              >
{editProduct ? 'Update Product' : 'Create Product'}   
           </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpenModal(false)}>I accept</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <img src='https://res.cloudinary.com/dzqihtcs4/image/upload/v1728988788/ue0robpnjxppstxxqceh.jpg' alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
      <div>
        <ProductTable
          products={products}
          setOpenModal={setOpenModal}
          openModal={openModal}
          setEditProduct={setEditProduct}
          editProduct={editProduct}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>
      <div>
      <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => { setOpenDeleteModal(false);  }}>
                No, cancel
              </Button>
              <Button color="failure" onClick={() =>{ setOpenDeleteModal(false); deleteProductDo();}}>
                {"Yes, I'm sure"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    </div>
  );
};

export default Product;
