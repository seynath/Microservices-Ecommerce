import React, { useCallback, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import InputImages from "./components/InputImage";
import { getCategories } from "@/api/CategoryAPI";
import { createProduct } from "@/api/ProductAPI";
import ProductTable from "./components/ProductTable";
import { Button, Modal } from "flowbite-react";
import { getProducts } from "@/api/ProductAPI";
import { getProductById, updateProduct, deleteProduct } from "@/api/ProductAPI";
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

// interface VariantType {
//   size?: string;
//   color?: string;
//   price: number;
//   stock_quantity: number;
// }

const Product: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadEditProduct, setLoadEditProduct] = useState({
    title: "",
    description: "",
    basePrice: 0,
    category: "",
    subcategory: "",
    images: [],
    variants: [],
    stockQuantity: 0,
  });
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
  const [variants, setVariants] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState<string>("");
  const [variant, setVariant] = useState({
    size: "",
    color: "",
    price: 0,
    stock_quantity: 0,
  });

  const [availableAttributes, setAvailableAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [tags, setTags] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [editSelectedAttributes, setEditSelectedAttributes] = useState([]);
  const [editVariantCombinations, setEditVariantCombinations] = useState([]);
  const [editAvailableAttributes, setEditAvailableAttributes] = useState([]);
  const [newEditAttributeName, setNewEditAttributeName] = useState("");
  const [newEditAttributeValue, setNewEditAttributeValue] = useState("");
  const [selectedEditAttributes, setEditSelectedEditAttributes] = useState([]);

  // Add new attribute with an empty values array
  const handleAddNewAttribute = () => {
    if (
      newAttributeName &&
      !availableAttributes.some((attr) => attr.name === newAttributeName)
    ) {
      setAvailableAttributes([
        ...availableAttributes,
        { name: newAttributeName, values: [] },
      ]);
      setNewAttributeName("");
    }
  };
  const handleAddEditNewAttribute = () => {
    if (
      newEditAttributeName &&
      !editAvailableAttributes.some(
        (attr) => attr.name === newEditAttributeName
      )
    ) {
      setEditAvailableAttributes([
        ...editAvailableAttributes,
        { name: newEditAttributeName, values: [] },
      ]);
      setNewEditAttributeName("");
    }
  };

  // Add a value to an attribute
  const handleAddAttributeValue = (attributeName: string) => {
    setAvailableAttributes((prevAttributes) =>
      prevAttributes.map((attr) =>
        attr.name === attributeName && newAttributeValue
          ? { ...attr, values: [...attr.values, newAttributeValue] }
          : attr
      )
    );
    setNewAttributeValue("");
  };

  const handleAddEditAttributeValue = (attributeName: string) => {
    setEditAvailableAttributes((prevAttributes) =>
      prevAttributes.map((attr) =>
        attr.name === attributeName && newEditAttributeValue
          ? { ...attr, values: [...attr.values, newEditAttributeValue] }
          : attr
      )
    );
    setNewEditAttributeValue("");
  };

  // Toggle selected attributes for variations
  const handleAttributeSelection = (attributeName: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attributeName)
        ? prev.filter((attr) => attr !== attributeName)
        : [...prev, attributeName]
    );
  };
  const handleEditAttributeSelection = (attributeName: string) => {
    setEditSelectedAttributes((prev) =>
      prev.includes(attributeName)
        ? prev.filter((attr) => attr !== attributeName)
        : [...prev, attributeName]
    );
  };

  // Generate all combinations of selected attribute values
  const generateCombinations = (
    attributes: { name: string; values: string[] }[]
  ) => {
    if (attributes.length === 0) return [[]];
    const [first, ...rest] = attributes;
    const combinations = generateCombinations(rest);
    return first.values.flatMap((value) =>
      combinations.map((combo) => [{ key: first.name, value }, ...combo])
    );
  };

  useEffect(() => {
    const selectedAttrObjects = availableAttributes.filter((attr) =>
      selectedAttributes.includes(attr.name)
    );
    setVariantCombinations(
      generateCombinations(selectedAttrObjects).map((combo) => ({
        attributes: combo,
        price: 0,
        stock_quantity: 0,
      }))
    );
  }, [selectedAttributes, availableAttributes]);

  // useEffect(() => {
  //   const selectedEditAttrObjects = editAvailableAttributes.filter((attr) =>
  //     editSelectedAttributes.includes(attr.name)
  //   );
  //   setEditVariantCombinations(
  //     generateCombinations(selectedEditAttrObjects).map((combo) => ({
  //       attributes: combo,
  //       price: 0,
  //       stock_quantity: 0,
  //     }))
  //   );

  // }, [editSelectedAttributes, editAvailableAttributes]);

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
  };

  const handleDeleteProduct = async (productId) => {
    setDeleteProductId(productId);
    setOpenDeleteModal(true);
  };
  // const handleEditAttributeSelection = (attributeName: string) => {
  //   setEditSelectedAttributes((prev) =>
  //     prev.includes(attributeName)
  //       ? prev.filter((attr) => attr !== attributeName)
  //       : [...prev, attributeName]
  //   );
  // };

  // Handle product edit: Load product details, including images (URLs)
  // const handleEditProduct = async (id: string) => {
  //   setEditProductId(id);
  //   const fetchedProduct = await getProductById(id);
  //   setTitle(fetchedProduct.name);
  //   setDescription(fetchedProduct.description);
  //   setBasePrice(fetchedProduct.basePrice);
  //   setCategory(fetchedProduct.categoryId);
  //   setSubcategory(fetchedProduct.subcategoryId);
  //   setImages(fetchedProduct.images); // Load URLs
  //   setVariants(fetchedProduct.variants);
  //   setTags(fetchedProduct.tags);
  //   setBrand(fetchedProduct.brand);
  // };

  // const handleEditProduct = async (id: string) => {
  //   setEditProductId(id);
  //   const fetchedProduct = await getProductById(id);

  //   // Populate main product details
  //   setTitle(fetchedProduct.name);
  //   setDescription(fetchedProduct.description);
  //   setBasePrice(fetchedProduct.basePrice);
  //   setCategory(fetchedProduct.categoryId);
  //   setSubcategory(fetchedProduct.subcategoryId);
  //   setImages(fetchedProduct.images);
  //   setTags(fetchedProduct.tags || []);
  //   setBrand(fetchedProduct.brand || "");

  //   // Populate attributes and variants
  //   if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
  //     // Extract unique attributes from variants
  //     const attributes = {};
  //     fetchedProduct.variants.forEach((variant) => {
  //       variant.attributes.forEach((attr) => {
  //         if (!attributes[attr.key]) {
  //           attributes[attr.key] = new Set();
  //         }
  //         attributes[attr.key].add(attr.value);
  //       });
  //     });

  //     // Set availableAttributes with values as an array
  //     const formattedAttributes = Object.entries(attributes).map(
  //       ([name, values]) => ({
  //         name,
  //         values: Array.from(values),
  //       })
  //     );
  //     setAvailableAttributes(formattedAttributes);

  //     // Set selected attributes based on variant keys
  //     setSelectedAttributes(formattedAttributes.map((attr) => attr.name));

  //     // Set variant combinations
  //     const formattedVariants = fetchedProduct.variants.map((variant) => ({
  //       attributes: variant.attributes,
  //       price: variant.price,
  //       stock_quantity: variant.stock_quantity,
  //     }));
  //     setVariantCombinations(formattedVariants);
  //   }

  //   setEditProduct(true);
  //   setOpenModal(true); // Open modal to edit product
  // };

  // const handleEditProduct = async (id: string) => {
  //   setEditProductId(id);
  //   const fetchedProduct = await getProductById(id);

  //   // Populate main product details
  //   setTitle(fetchedProduct.name);
  //   setDescription(fetchedProduct.description);
  //   setBasePrice(fetchedProduct.basePrice);
  //   setCategory(fetchedProduct.categoryId);
  //   setSubcategory(fetchedProduct.subcategoryId);
  //   setImages(fetchedProduct.images);
  //   setTags(fetchedProduct.tags || []);
  //   setBrand(fetchedProduct.brand || "");

  //   // Populate attributes and variants
  //   if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
  //     // Extract unique attributes from variants
  //     const attributes = {};
  //     fetchedProduct.variants.forEach((variant) => {
  //       variant.attributes.forEach((attr) => {
  //         if (!attributes[attr.key]) {
  //           attributes[attr.key] = new Set();
  //         }
  //         attributes[attr.key].add(attr.value);
  //       });
  //     });

  //     // Set availableAttributes with values as an array
  //     const formattedAttributes = Object.entries(attributes).map(
  //       ([name, values]) => ({
  //         name,
  //         values: Array.from(values),
  //       })
  //     );
  //     setAvailableAttributes(formattedAttributes);

  //     // Set selected attributes based on variant keys
  //     setSelectedAttributes(formattedAttributes.map((attr) => attr.name));

  //     // Set variant combinations with existing price and stock_quantity
  //     const formattedVariants = fetchedProduct.variants.map((variant) => ({
  //       attributes: variant.attributes,
  //       price: variant.price,
  //       stock_quantity: variant.stock_quantity,
  //     }));
  //     setVariantCombinations(formattedVariants);
  //   }

  //   setEditProduct(true);
  //   setOpenModal(true); // Open modal to edit product
  // };

  const handleEditProduct = useCallback( async (id: string) => {
    setEditProductId(id);
    const fetchedProduct = await getProductById(id);

    console.log("Fetched product:", fetchedProduct);

    // Populate main product details
    setTitle(fetchedProduct.name);
    setDescription(fetchedProduct.description);
    setBasePrice(fetchedProduct.basePrice);
    setCategory(fetchedProduct.categoryId);
    setSubcategory(fetchedProduct.subcategoryId);
    setImages(fetchedProduct.images);
    setTags(fetchedProduct.tags || []);
    setBrand(fetchedProduct.brand || "");

    // setVariantCombinations(fetchedProduct.variants);

    // Populate attributes and variants
    if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
      // Extract unique attributes from variants
      const attributes = {};
      fetchedProduct.variants.forEach((variant) => {
        variant.attributes.forEach((attr) => {
          if (!attributes[attr.key]) {
            attributes[attr.key] = new Set();
          }
          attributes[attr.key].add(attr.value);
        });
      });

      console.log("Attributes:", attributes);

      // Set availableAttributes with values as an array
      const formattedAttributes = Object.entries(attributes).map(
        ([name, values]) => ({
          name,
          values: Array.from(values),
        })
      );

      console.log("Formatted attributes:", formattedAttributes);
      setEditAvailableAttributes(formattedAttributes);
      // setAvailableAttributes(formattedAttributes);

      // Set selected attributes based on variant keys
      // setSelectedAttributes(formattedAttributes.map((attr) => attr.name));
      setEditSelectedAttributes(formattedAttributes.map((attr) => attr.name));

      // Filter out any empty or invalid variants and set variant combinations
      const formattedVariants = fetchedProduct.variants
        .filter(
          (variant) =>
            variant.price !== 0 &&
            variant.stock_quantity !== 0 &&
            variant.attributes.length > 0
        )
        .map((variant) => ({
          attributes: variant.attributes,
          price: variant.price,
          stock_quantity: variant.stock_quantity,
        }));

      console.log("Formatted variants:", formattedVariants);
      setEditVariantCombinations(formattedVariants);
      // setVariantCombinations(formattedVariants);
    }

    setEditProduct(true);
    setOpenModal(true); // Open modal to edit product
  },[]
);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      name: title,
      description,
      basePrice,
      categoryId: category,
      subcategoryId: subcategory,
      images, // Send URLs
      variants: variantCombinations,
      tags,
      brand,
    };

    try {
      console.log(product);
      const response = await createProduct(product);
      console.log("Product created:", response);
      fetchProducts();
      setOpenModal(false); // Close modal after successful product creation
    } catch (error) {
      console.error("Product creation failed:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(variants);
    const product = {
      name: title,
      description,
      basePrice,
      categoryId: category,
      subcategoryId: subcategory,
      images, // Send URLs
      variants: editVariantCombinations,
      tags,
      brand,
    };

    try {
      console.log(product);
      const response = await updateProduct(editProductId, product);
      console.log("Product updated:", response);
      fetchProducts();
      setOpenModal(false); // Close modal after successful product update
    } catch (error) {
      console.error("Product update failed:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const category = categories.find((cat) => cat.name === categoryName);
    console.log("Selected category:", category);
    setCategory(category._id);
    setSelectedCategory(category);
  };

  const handleTagsChange = (e: React.FormEvent<HTMLInputElement>) => {
    const enteredTags = e.target.value.split(",").map((tag) => tag.trim());
    setTags(enteredTags);
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
        brand: product.brand,
        tags: product.tags,
        variants: product.variants || [],
      }));
      console.log("Mapped products:", mappedProducts);
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
      <div className="my-5 flex justify-center  ">
        <Button onClick={() => setOpenModal(true)}>Add Product</Button>
        <Modal
          dismissible
          show={openModal}
          size="6xl"
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header>Product Listing</Modal.Header>
          <Modal.Body>
            <form
              // onSubmit={handleSubmit}
              onSubmit={editProduct ? handleUpdate : handleSubmit}
              className="max-w-5xl mx-auto p-6 rounded-lg shadow-md"
            >
              {editProduct && editProduct ? (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Edit Product
                </h2>
              ) : (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Create a New Product
                </h2>
              )}

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-lg font-medium mb-2"
                >
                  Title
                </label>
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
              {/* Description */}

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

              {/* Base Price */}

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
                {editProduct && editProduct ? (
                  <div>
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
                ) : (
                  <div>
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
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subcategory"
                  className="block text-lg font-medium mb-2"
                >
                  Subcategory
                </label>
                {editProduct && editProduct ? (
                  <div>
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
                ) : (
                  <div>
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
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="tags"
                  className="block text-lg font-medium mb-2"
                >
                  Tags
                </label>
                <input
                  type="string"
                  id="tags"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-slate-100"
                  value={tags.join(", ")}
                  onChange={handleTagsChange}
                  placeholder="Enter comma-separated tags"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="brand"
                  className="block text-lg font-medium mb-2"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter the brand name"
                />
              </div>

              {/* Dynamic Attribute Management */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Define Attributes
                </h3>
                <input
                  type="text"
                  placeholder="Attribute name (e.g., Size)"
                  value={newAttributeName}
                  onChange={(e) => setNewAttributeName(e.target.value)}
                  className="mr-2 p-2 border rounded"
                />
                <Button onClick={handleAddNewAttribute}>Add Attribute</Button>
                {availableAttributes.map((attr) => (
                  <div key={attr.name} className="mt-4">
                    <h4>{attr.name} Values</h4>
                    <input
                      type="text"
                      placeholder={`Value for ${attr.name}`}
                      value={newAttributeValue}
                      onChange={(e) => setNewAttributeValue(e.target.value)}
                      className="mr-2 p-2 border rounded"
                    />
                    <Button onClick={() => handleAddAttributeValue(attr.name)}>
                      Add Value
                    </Button>
                    <div>
                      {attr.values.map((value) => (
                        <span
                          key={value}
                          className="inline-block p-1 bg-gray-200 rounded mr-2"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {editProduct && editProduct ? (
                <div>
                  <h3>Add Define New Attributes in Product Edit</h3>
                  <input
                    type="text"
                    placeholder="Attribute name (e.g., Size)"
                    value={newEditAttributeName}
                    onChange={(e) => setNewEditAttributeName(e.target.value)}
                    className="mr-2 p-2 border rounded"
                  />
                  <Button onClick={handleAddEditNewAttribute}>
                    Add Attribute
                  </Button>
                  {editAvailableAttributes.map((attr) => (
                    <div key={attr.name} className="mt-4">
                      <h4>{attr.name} Values</h4>
                      <input
                        type="text"
                        placeholder={`Value for ${attr.name}`}
                        value={newEditAttributeValue}
                        onChange={(e) =>
                          setNewEditAttributeValue(e.target.value)
                        }
                        className="mr-2 p-2 border rounded"
                      />
                      <Button
                        onClick={() => handleAddEditAttributeValue(attr.name)}
                      >
                        Add Value
                      </Button>
                      <div>
                        {attr.values.map((value) => (
                          <span
                            key={value}
                            className="inline-block p-1 bg-gray-200 rounded mr-2"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Mode is not editing</div>
              )}

              {/* Attribute Selection for Variants */}

              {/* <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Select Attributes for Variations
                </h3>
                {availableAttributes.map((attr) => (
                  <label key={attr.name} className="mr-4">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(attr.name)}
                      onChange={() => handleAttributeSelection(attr.name)}
                    />
                    {attr.name}
                  </label>
                ))}
              </div> */}
              <div className="mb-6">
                <div>yyyyyyyyyyyyyyyyyy</div>
                {editProduct && editProduct ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Edit Attributes for Variations
                    </h3>
                    {editAvailableAttributes.map((attr) => (
                      <label key={attr.name} className="mr-4">
                        <input
                          type="checkbox"
                          checked={editSelectedAttributes.includes(attr.name)}
                          onChange={() =>
                            handleEditAttributeSelection(attr.name)
                          }
                        />
                        {attr.name}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    {" "}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Select Attributes for Variations
                      </h3>
                      {availableAttributes.map((attr) => (
                        <label key={attr.name} className="mr-4">
                          <input
                            type="checkbox"
                            checked={selectedAttributes.includes(attr.name)}
                            onChange={() => handleAttributeSelection(attr.name)}
                          />
                          {attr.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div>yyyyyyyyyyyyyyyyyy</div>
              </div>

              {/* Variant Combination Inputs */}
              {/* {variantCombinations.map((variant, idx) => (
                <div key={idx} className="p-4 border rounded mb-4">
                  <div>
                    {variant.attributes.map((attr) => (
                      <span key={attr.key} className="mr-2">
                        <strong>{attr.key}:</strong> {attr.value}
                      </span>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={variant.stock_quantity}
                    onChange={(e) => {
                      const updatedVariants = [...variantCombinations];
                      updatedVariants[idx].stock_quantity = parseInt(
                        e.target.value
                      );
                      setVariantCombinations(updatedVariants);
                    }}
                    className="mr-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => {
                      const updatedVariants = [...variantCombinations];
                      updatedVariants[idx].price = parseFloat(e.target.value);
                      setVariantCombinations(updatedVariants);
                    }}
                    className="p-2 border rounded"
                  />
                </div>
              ))} */}

              {editProduct && editProduct ? (
                <div>
                  {editVariantCombinations.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded mb-4 bg-orange-300"
                    >
                      <div>
                        {variant.attributes.map((attr) => (
                          <span key={attr.key} className="mr-2">
                            <strong>{attr.key}:</strong> {attr.value}
                          </span>
                        ))}
                      </div>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={variant.stock_quantity}
                        onChange={(e) => {
                          const updatedVariants = [...editVariantCombinations];
                          updatedVariants[idx].stock_quantity = parseInt(
                            e.target.value,
                            10
                          );
                          setEditVariantCombinations(updatedVariants);
                        }}
                        className="mr-2 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => {
                          const updatedVariants = [...editVariantCombinations];
                          updatedVariants[idx].price = parseFloat(
                            e.target.value
                          );
                          setEditVariantCombinations(updatedVariants);
                        }}
                        className="p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {" "}
                  {variantCombinations.map(
                    (variant, idx) => (
                      console.log(variant),
                      (
                        <div
                          key={idx}
                          className="p-4 border rounded mb-4 bg-green-300"
                        >
                          <div>
                            {variant.attributes.map((attr) => (
                              <span key={attr.key} className="mr-2">
                                <strong>{attr.key}:</strong> {attr.value}
                              </span>
                            ))}
                          </div>
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={variant.stock_quantity}
                            onChange={(e) => {
                              const updatedVariants = [...variantCombinations];
                              updatedVariants[idx].stock_quantity = parseInt(
                                e.target.value,
                                10
                              );
                              setVariantCombinations(updatedVariants);
                            }}
                            className="mr-2 p-2 border rounded"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={variant.price}
                            onChange={(e) => {
                              const updatedVariants = [...variantCombinations];
                              updatedVariants[idx].price = parseFloat(
                                e.target.value
                              );
                              setVariantCombinations(updatedVariants);
                            }}
                            className="p-2 border rounded"
                          />
                        </div>
                      )
                    )
                  )}
                </div>
              )}

              {/* Upload Image */}

              <div className="flex my-3 bg-red-300 justify-center rounded-lg">
                <UploadWidget setImages={setImages} images={images} />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
              >
                {editProduct ? "Update Product" : "Create Product"}
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

      <div className="mt-5">
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
        <Modal
          show={openDeleteModal}
          size="md"
          onClose={() => setOpenDeleteModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="gray"
                  onClick={() => {
                    setOpenDeleteModal(false);
                  }}
                >
                  No, cancel
                </Button>
                <Button
                  color="failure"
                  onClick={() => {
                    setOpenDeleteModal(false);
                    deleteProductDo();
                  }}
                >
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

// import React, { useEffect, useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import axios from "axios";
// import InputImages from "./components/InputImage";
// import { getCategories } from "@/api/CategoryAPI";
// import { createProduct } from "@/api/ProductAPI";
// import ProductTable from "./components/ProductTable";
// import { Button, Modal } from "flowbite-react";
// import { getProducts } from "@/api/ProductAPI";
// import { getProductById, updateProduct, deleteProduct } from "@/api/ProductAPI";
// import UploadWidget from "./components/UploadWidget";
// import UpdateUploadWidget from "./components/UpdateUploadWidget";
// import { HiOutlineExclamationCircle } from "react-icons/hi";

// // Define types for the images and variants
// interface ImageType {
//   url: string;
//   width: number;
//   height: number;
//   public_id: string;
// }

// interface VariantType {
//   size?: string;
//   color?: string;
//   price: number;
//   stock_quantity: number;
// }

// const Product: React.FC = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [editProduct, setEditProduct] = useState(false);
//   const [editProductId, setEditProductId] = useState("");
//   const [products, setProducts] = useState<any[]>([]);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [loadEditProduct, setLoadEditProduct] = useState({
//     title: "",
//     description: "",
//     basePrice: 0,
//     category: "",
//     subcategory: "",
//     images: [],
//     variants: [],
//     stockQuantity: 0,
//   });
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   // const [keywords, setKeywords] = useState<string>("");
//   // const [author, setAuthor] = useState<string>("");
//   const [images, setImages] = useState<ImageType[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   // const [subcategories, setSubcategories] = useState<string[]>([]);
//   const [category, setCategory] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const [subcategory, setSubcategory] = useState<string>("");
//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [variants, setVariants] = useState<VariantType[]>([]);
//   const [deleteProductId, setDeleteProductId] = useState<string>("");
//   const [variant, setVariant] = useState<VariantType>({
//     size: "",
//     color: "",
//     price: 0,
//     stock_quantity: 0,
//   });

//   const [availableAttributes, setAvailableAttributes] = useState<
//     { name: string; values: string[] }[]
//   >([]);
//   const [newAttributeName, setNewAttributeName] = useState("");
//   const [newAttributeValue, setNewAttributeValue] = useState("");
//   const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
//   const [variantCombinations, setVariantCombinations] = useState<VariantType[]>(
//     []
//   );
//   const [tags, setTags] = useState<string[]>([]);
//   const [brand, setBrand] = useState("");

//   // Add new attribute with an empty values array
//   const handleAddNewAttribute = () => {
//     if (
//       newAttributeName &&
//       !availableAttributes.some((attr) => attr.name === newAttributeName)
//     ) {
//       setAvailableAttributes([
//         ...availableAttributes,
//         { name: newAttributeName, values: [] },
//       ]);
//       setNewAttributeName("");
//     }
//   };

//   // Add a value to an attribute
//   const handleAddAttributeValue = (attributeName: string) => {
//     setAvailableAttributes((prevAttributes) =>
//       prevAttributes.map((attr) =>
//         attr.name === attributeName && newAttributeValue
//           ? { ...attr, values: [...attr.values, newAttributeValue] }
//           : attr
//       )
//     );
//     setNewAttributeValue("");
//   };

//   // Toggle selected attributes for variations
//   const handleAttributeSelection = (attributeName: string) => {
//     setSelectedAttributes((prev) =>
//       prev.includes(attributeName)
//         ? prev.filter((attr) => attr !== attributeName)
//         : [...prev, attributeName]
//     );
//   };

//   // Generate all combinations of selected attribute values
//   const generateCombinations = (
//     attributes: { name: string; values: string[] }[]
//   ) => {
//     if (attributes.length === 0) return [[]];
//     const [first, ...rest] = attributes;
//     const combinations = generateCombinations(rest);
//     return first.values.flatMap((value) =>
//       combinations.map((combo) => [{ key: first.name, value }, ...combo])
//     );
//   };

//   useEffect(() => {
//     const selectedAttrObjects = availableAttributes.filter((attr) =>
//       selectedAttributes.includes(attr.name)
//     );
//     setVariantCombinations(
//       generateCombinations(selectedAttrObjects).map((combo) => ({
//         attributes: combo,
//         price: 0,
//         stock_quantity: 0,
//       }))
//     );
//   }, [selectedAttributes, availableAttributes]);

//   // // Add new variant to the list
//   // const handleAddVariant = () => {
//   //   setVariants((prevVariants) => [...prevVariants, variant]);
//   //   setVariant({ size: "", color: "", price: 0, stock_quantity: 0 }); // Reset variant input fields
//   // };

//   // // Remove a specific variant from the list
//   // const handleRemoveVariant = (index: number) => {
//   //   setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
//   // };

//   const deleteProductDo = async () => {
//     setOpenDeleteModal(false);
//     try {
//       const response = await deleteProduct(deleteProductId);
//       if (response.status === 200) {
//         fetchProducts();
//         console.log("Product deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     setDeleteProductId(productId);
//     setOpenDeleteModal(true);
//   };

//   // Handle product edit: Load product details, including images (URLs)
//   const handleEditProduct = async (id: string) => {
//     setEditProductId(id);
//     const fetchedProduct = await getProductById(id);
//     setTitle(fetchedProduct.name);
//     setDescription(fetchedProduct.description);
//     setBasePrice(fetchedProduct.basePrice);
//     setCategory(fetchedProduct.categoryId);
//     setSubcategory(fetchedProduct.subcategoryId);
//     setImages(fetchedProduct.images); // Load URLs
//     setVariants(fetchedProduct.variants);
//     setTags(fetchedProduct.tags);
//     setBrand(fetchedProduct.brand);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const product = {
//       name: title,
//       description,
//       basePrice,
//       categoryId: category,
//       subcategoryId: subcategory,
//       images, // Send URLs
//       variants: variantCombinations,
//       tags,
//       brand,
//     };

//     try {
//       console.log(product);
//       // const response = await createProduct(product);
//       // console.log("Product created:", response);
//     } catch (error) {
//       console.error("Product creation failed:", error);
//     }
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(variants);
//     const product = {
//       name: title,
//       description,
//       basePrice,
//       categoryId: category,
//       subcategoryId: subcategory,
//       images, // Send URLs
//       variants,
//       tags,
//       brand,
//     };

//     try {
//       const response = await updateProduct(editProductId, product);
//       console.log("Product updated:", response);
//     } catch (error) {
//       console.error("Product update failed:", error);
//     }
//   };

//   const handleCategoryChange = (event) => {
//     const categoryName = event.target.value;
//     const category = categories.find((cat) => cat.name === categoryName);
//     console.log("Selected category:", category);
//     setCategory(category._id);
//     setSelectedCategory(category);
//   };

//   const handleTagsChange = (e: React.FormEvent<HTMLInputElement>) => {
//     const enteredTags = e.target.value.split(",").map((tag) => tag.trim());
//     setTags(enteredTags);
//   };

//   // const handleRemoveImage = async (public_id: string, index: number) => {
//   //   try {
//   //     await axios.post("/api/delete-image", { public_id });
//   //     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//   //   } catch (error: any) {
//   //     console.error("Failed to remove image:", error);
//   //   }
//   // };

//   // Fetch categories and subcategories
//   const fetchProducts = async () => {
//     try {
//       const allProducts = await getProducts();
//       console.log("Products fetched in Product:", allProducts);
//       // Map the products data to the format needed by ProductTable
//       const mappedProducts = allProducts.map((product, index) => ({
//         key: product._id,
//         name: product.name,
//         basePrice: product.basePrice,
//         stock_quantity: product.stock_quantity,
//         categoryId: product.categoryId,
//         subcategoryId: product.subcategoryId,
//         image: product.images[0], // Display the first image
//         variants: product.variants || [],
//       }));
//       setProducts(mappedProducts);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const allCategories = await getCategories();
//         // console.log("Categories fetched in Product:", response);
//         setCategories(allCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div>
//       <h1>{editProduct}</h1>
//       <div className="my-5 flex justify-center  ">
//         <Button onClick={() => setOpenModal(true)}>Add Product</Button>
//         <Modal
//           dismissible
//           show={openModal}
//           size="6xl"
//           onClose={() => setOpenModal(false)}
//         >
//           <Modal.Header>Product Listing</Modal.Header>
//           <Modal.Body>
//             <form
//               // onSubmit={handleSubmit}
//               onSubmit={editProduct ? handleUpdate : handleSubmit}
//               className="max-w-5xl mx-auto p-6 rounded-lg shadow-md"
//             >
//               {editProduct && editProduct ? (
//                 <h2 className="text-2xl font-bold mb-6 text-center">
//                   Edit Product
//                 </h2>
//               ) : (
//                 <h2 className="text-2xl font-bold mb-6 text-center">
//                   Create a New Product
//                 </h2>
//               )}

//               <div className="mb-4">
//                 <label
//                   htmlFor="title"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                   placeholder="Enter the title"
//                 />
//               </div>
//               {/* Description */}

//               <div className="mb-4">
//                 <label
//                   htmlFor="description"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Description
//                 </label>
//                 <Editor
//                   apiKey="btkxtx8y73a9lfz8np04eyg0so0dli82s9wexjru5jlzmzmm"
//                   value={description}
//                   onEditorChange={(content) => setDescription(content)}
//                   init={{
//                     height: 300,
//                     menubar: false,
//                     plugins: "link lists image media table",
//                     toolbar:
//                       "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image media",
//                   }}
//                 />
//               </div>

//               {/* Base Price */}

//               <div className="mb-4">
//                 <label
//                   htmlFor="basePrice"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Base Price
//                 </label>
//                 <input
//                   type="number"
//                   id="basePrice"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
//                   value={basePrice}
//                   onChange={(e) => setBasePrice(parseFloat(e.target.value))}
//                   placeholder="Enter the base price"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="category"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Category
//                 </label>
//                 <select
//                   id="category"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
//                   // value={category}
//                   onChange={handleCategoryChange}
//                 >
//                   <option value="">Select a category</option>

//                   {categories.map((category) => (
//                     <option key={category._id} value={category.name}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="subcategory"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Subcategory
//                 </label>
//                 {selectedCategory && (
//                   <select
//                     id="subcategory"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
//                     value={subcategory}
//                     onChange={(e) => setSubcategory(e.target.value)}
//                   >
//                     <option value="">Select a subcategory</option>
//                     {selectedCategory.subCategories.map((subcategory) => (
//                       <option key={subcategory._id} value={subcategory._id}>
//                         {subcategory.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="tags"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Tags
//                 </label>
//                 <input
//                   type="string"
//                   id="tags"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-slate-100"
//                   value={tags.join(", ")}
//                   onChange={handleTagsChange}
//                   placeholder="Enter comma-separated tags"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="brand"
//                   className="block text-lg font-medium mb-2"
//                 >
//                   Brand
//                 </label>
//                 <input
//                   type="text"
//                   id="brand"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
//                   value={brand}
//                   onChange={(e) => setBrand(e.target.value)}
//                   placeholder="Enter the brand name"
//                 />
//               </div>

//               {/* Dynamic Attribute Management */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">
//                   Define Attributes
//                 </h3>
//                 <input
//                   type="text"
//                   placeholder="Attribute name (e.g., Size)"
//                   value={newAttributeName}
//                   onChange={(e) => setNewAttributeName(e.target.value)}
//                   className="mr-2 p-2 border rounded"
//                 />
//                 <Button onClick={handleAddNewAttribute}>Add Attribute</Button>
//                 {availableAttributes.map((attr) => (
//                   <div key={attr.name} className="mt-4">
//                     <h4>{attr.name} Values</h4>
//                     <input
//                       type="text"
//                       placeholder={`Value for ${attr.name}`}
//                       value={newAttributeValue}
//                       onChange={(e) => setNewAttributeValue(e.target.value)}
//                       className="mr-2 p-2 border rounded"
//                     />
//                     <Button onClick={() => handleAddAttributeValue(attr.name)}>
//                       Add Value
//                     </Button>
//                     <div>
//                       {attr.values.map((value) => (
//                         <span
//                           key={value}
//                           className="inline-block p-1 bg-gray-200 rounded mr-2"
//                         >
//                           {value}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Attribute Selection for Variants */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">
//                   Select Attributes for Variations
//                 </h3>
//                 {availableAttributes.map((attr) => (
//                   <label key={attr.name} className="mr-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedAttributes.includes(attr.name)}
//                       onChange={() => handleAttributeSelection(attr.name)}
//                     />
//                     {attr.name}
//                   </label>
//                 ))}
//               </div>

//               {/* Variant Combination Inputs */}
//               {variantCombinations.map((variant, idx) => (
//                 <div key={idx} className="p-4 border rounded mb-4">
//                   <div>
//                     {variant.attributes.map((attr) => (
//                       <span key={attr.key} className="mr-2">
//                         <strong>{attr.key}:</strong> {attr.value}
//                       </span>
//                     ))}
//                   </div>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={variant.stock_quantity}
//                     onChange={(e) => {
//                       const updatedVariants = [...variantCombinations];
//                       updatedVariants[idx].stock_quantity = parseInt(
//                         e.target.value
//                       );
//                       setVariantCombinations(updatedVariants);
//                     }}
//                     className="mr-2 p-2 border rounded"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     value={variant.price}
//                     onChange={(e) => {
//                       const updatedVariants = [...variantCombinations];
//                       updatedVariants[idx].price = parseFloat(e.target.value);
//                       setVariantCombinations(updatedVariants);
//                     }}
//                     className="p-2 border rounded"
//                   />
//                 </div>
//               ))}

//               {/* Upload Image */}

//               <div className="flex my-3 bg-red-300 justify-center rounded-lg">
//                 <UploadWidget setImages={setImages} images={images} />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
//               >
//                 {editProduct ? "Update Product" : "Create Product"}
//               </button>
//             </form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={() => setOpenModal(false)}>I accept</Button>
//             <Button color="gray" onClick={() => setOpenModal(false)}>
//               Decline
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>

//       <div className="mt-5">
//         <ProductTable
//           products={products}
//           setOpenModal={setOpenModal}
//           openModal={openModal}
//           setEditProduct={setEditProduct}
//           editProduct={editProduct}
//           handleEditProduct={handleEditProduct}
//           handleDeleteProduct={handleDeleteProduct}
//         />
//       </div>
//       <div>
//         <Modal
//           show={openDeleteModal}
//           size="md"
//           onClose={() => setOpenDeleteModal(false)}
//           popup
//         >
//           <Modal.Header />
//           <Modal.Body>
//             <div className="text-center">
//               <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
//               <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//                 Are you sure you want to delete this product?
//               </h3>
//               <div className="flex justify-center gap-4">
//                 <Button
//                   color="gray"
//                   onClick={() => {
//                     setOpenDeleteModal(false);
//                   }}
//                 >
//                   No, cancel
//                 </Button>
//                 <Button
//                   color="failure"
//                   onClick={() => {
//                     setOpenDeleteModal(false);
//                     deleteProductDo();
//                   }}
//                 >
//                   {"Yes, I'm sure"}
//                 </Button>
//               </div>
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Product;

// import React, { useEffect, useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { getCategories } from "@/api/CategoryAPI";
// import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "@/api/ProductAPI";
// import ProductTable from "./components/ProductTable";
// import { Button, Modal } from "flowbite-react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import UploadWidget from "./components/UploadWidget";

// // Define types for the images and variants
// interface ImageType {
//   url: string;
//   width: number;
//   height: number;
//   public_id: string;
// }

// interface VariantType {
//   attributes: { key: string; value: string }[];
//   price: number;
//   stock_quantity: number;
// }

// const Product: React.FC = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [editProduct, setEditProduct] = useState(false);
//   const [editProductId, setEditProductId] = useState("");
//   const [products, setProducts] = useState<any[]>([]);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [images, setImages] = useState<ImageType[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [category, setCategory] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [subcategory, setSubcategory] = useState<string>("");
//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [availableAttributes, setAvailableAttributes] = useState<{ name: string; values: string[] }[]>([]);
//   const [newAttributeName, setNewAttributeName] = useState("");
//   const [newAttributeValue, setNewAttributeValue] = useState("");
//   const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
//   const [variantCombinations, setVariantCombinations] = useState<VariantType[]>([]);

//   // Fetch categories and products
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const allCategories = await getCategories();
//         setCategories(allCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const allProducts = await getProducts();
//       setProducts(allProducts.map(product => ({
//         ...product,
//         key: product._id,
//         image: product.images[0],
//       })));
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Add new attribute with an empty values array
//   const handleAddNewAttribute = () => {
//     if (newAttributeName && !availableAttributes.some(attr => attr.name === newAttributeName)) {
//       setAvailableAttributes([...availableAttributes, { name: newAttributeName, values: [] }]);
//       setNewAttributeName("");
//     }
//   };

//   // Add a value to an attribute
//   const handleAddAttributeValue = (attributeName: string) => {
//     setAvailableAttributes(prevAttributes =>
//       prevAttributes.map(attr =>
//         attr.name === attributeName && newAttributeValue ? { ...attr, values: [...attr.values, newAttributeValue] } : attr
//       )
//     );
//     setNewAttributeValue("");
//   };

//   // Toggle selected attributes for variations
//   const handleAttributeSelection = (attributeName: string) => {
//     setSelectedAttributes(prev =>
//       prev.includes(attributeName) ? prev.filter(attr => attr !== attributeName) : [...prev, attributeName]
//     );
//   };

//   // Generate all combinations of selected attribute values
//   const generateCombinations = (attributes: { name: string; values: string[] }[]) => {
//     if (attributes.length === 0) return [[]];
//     const [first, ...rest] = attributes;
//     const combinations = generateCombinations(rest);
//     return first.values.flatMap(value => combinations.map(combo => [{ key: first.name, value }, ...combo]));
//   };

//   useEffect(() => {
//     const selectedAttrObjects = availableAttributes.filter(attr => selectedAttributes.includes(attr.name));
//     setVariantCombinations(generateCombinations(selectedAttrObjects).map(combo => ({
//       attributes: combo,
//       price: 0,
//       stock_quantity: 0,
//     })));
//   }, [selectedAttributes, availableAttributes]);

//   // Handle product submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const product = {
//       name: title,
//       description,
//       basePrice,
//       categoryId: category,
//       subcategoryId: subcategory,
//       images,
//       variants: variantCombinations,
//     };
//     try {
//       const response = editProduct ? await updateProduct(editProductId, product) : await createProduct(product);
//       console.log("Product saved:", response);
//       fetchProducts();
//       setOpenModal(false);
//     } catch (error) {
//       console.error("Product save failed:", error);
//     }
//   };

//   return (
//     <div>
//       <Button onClick={() => setOpenModal(true)}>{editProduct ? "Edit Product" : "Add Product"}</Button>
//       <Modal dismissible show={openModal} size="6xl" onClose={() => setOpenModal(false)}>
//         <Modal.Header>{editProduct ? "Edit Product" : "Create a New Product"}</Modal.Header>
//         <Modal.Body>
//           <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 rounded-lg shadow-md">
//             <div className="mb-4">
//               <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
//               <input type="text" id="title" className="w-full p-3 border rounded-lg" value={title} onChange={(e) => setTitle(e.target.value)} required />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="description" className="block text-lg font-medium mb-2">Description</label>
//               <Editor apiKey="your-api-key" value={description} onEditorChange={content => setDescription(content)} init={{ height: 300, plugins: "link lists image media table", toolbar: "undo redo | formatselect | bold italic | link image media" }} />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="basePrice" className="block text-lg font-medium mb-2">Base Price</label>
//               <input type="number" id="basePrice" className="w-full p-3 border rounded-lg" value={basePrice} onChange={(e) => setBasePrice(parseFloat(e.target.value))} />
//             </div>

//             {/* Dynamic Attribute Management */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Define Attributes</h3>
//               <input type="text" placeholder="Attribute name (e.g., Size)" value={newAttributeName} onChange={(e) => setNewAttributeName(e.target.value)} className="mr-2 p-2 border rounded" />
//               <Button onClick={handleAddNewAttribute}>Add Attribute</Button>
//               {availableAttributes.map(attr => (
//                 <div key={attr.name} className="mt-4">
//                   <h4>{attr.name} Values</h4>
//                   <input type="text" placeholder={`Value for ${attr.name}`} value={newAttributeValue} onChange={(e) => setNewAttributeValue(e.target.value)} className="mr-2 p-2 border rounded" />
//                   <Button onClick={() => handleAddAttributeValue(attr.name)}>Add Value</Button>
//                   <div>{attr.values.map(value => <span key={value} className="inline-block p-1 bg-gray-200 rounded mr-2">{value}</span>)}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Attribute Selection for Variants */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Select Attributes for Variations</h3>
//               {availableAttributes.map(attr => (
//                 <label key={attr.name} className="mr-4">
//                   <input type="checkbox" checked={selectedAttributes.includes(attr.name)} onChange={() => handleAttributeSelection(attr.name)} />
//                   {attr.name}
//                 </label>
//               ))}
//             </div>

//             {/* Variant Combination Inputs */}
//             {variantCombinations.map((variant, idx) => (
//               <div key={idx} className="p-4 border rounded mb-4">
//                 <div>
//                   {variant.attributes.map(attr => (
//                     <span key={attr.key} className="mr-2"><strong>{attr.key}:</strong> {attr.value}</span>
//                   ))}
//                 </div>
//                 <input type="number" placeholder="Quantity" value={variant.stock_quantity} onChange={(e) => {
//                   const updatedVariants = [...variantCombinations];
//                   updatedVariants[idx].stock_quantity = parseInt(e.target.value);
//                   setVariantCombinations(updatedVariants);
//                 }} className="mr-2 p-2 border rounded" />
//                 <input type="number" placeholder="Price" value={variant.price} onChange={(e) => {
//                   const updatedVariants = [...variantCombinations];
//                   updatedVariants[idx].price = parseFloat(e.target.value);
//                   setVariantCombinations(updatedVariants);
//                 }} className="p-2 border rounded" />
//               </div>
//             ))}

//             <UploadWidget setImages={setImages} images={images} />
//             <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-6">{editProduct ? "Update Product" : "Create Product"}</button>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Product;

// import React, { useState, useEffect } from 'react';

// const ProductForm = () => {
//   const [availableAttributes, setAvailableAttributes] = useState<
//     { name: string; values: string[] }[]
//   >([]);
//   const [newAttributeName, setNewAttributeName] = useState("");
//   const [newAttributeValue, setNewAttributeValue] = useState("");
//   const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
//   const [variantCombinations, setVariantCombinations] = useState([]);

//   // Add new attribute with an empty array for values
//   const handleAddNewAttribute = () => {
//     if (
//       newAttributeName &&
//       !availableAttributes.some((attr) => attr.name === newAttributeName)
//     ) {
//       setAvailableAttributes((prev) => [
//         ...prev,
//         { name: newAttributeName, values: [] },
//       ]);
//       setNewAttributeName("");
//     }
//   };

//   // Add a value to an existing attribute
//   const handleAddAttributeValue = (attributeName: string) => {
//     setAvailableAttributes((prev) =>
//       prev.map((attr) =>
//         attr.name === attributeName && newAttributeValue
//           ? { ...attr, values: [...attr.values, newAttributeValue] }
//           : attr
//       )
//     );
//     setNewAttributeValue("");
//   };

//   // Select which attributes to use for product variations
//   const handleAttributeSelection = (attributeName: string) => {
//     setSelectedAttributes((prev) =>
//       prev.includes(attributeName)
//         ? prev.filter((attr) => attr !== attributeName)
//         : [...prev, attributeName]
//     );
//   };

//   // Generate all combinations of selected attribute values
//   const generateCombinations = (attributes) => {
//     if (attributes.length === 0) return [[]];
//     const [first, ...rest] = attributes;
//     const combinations = generateCombinations(rest);
//     return first.values.flatMap((value) =>
//       combinations.map((combo) => [{ key: first.name, value }, ...combo])
//     );
//   };

//   // Update combinations based on selected attributes and their values
//   useEffect(() => {
//     const selectedAttrObjects = availableAttributes.filter((attr) =>
//       selectedAttributes.includes(attr.name)
//     );
//     const combinations = generateCombinations(selectedAttrObjects);
//     setVariantCombinations(
//       combinations.map((combo) => ({
//         attributes: combo,
//         quantity: 0,
//         price: 0,
//       }))
//     );
//   }, [selectedAttributes, availableAttributes]);

//   // Submit product data
//   const handleSubmit = async () => {
//     const product = {
//       name: "Example Product", // Replace with form data
//       description: "Example description",
//       basePrice: 100,
//       categoryId: "exampleCategoryId",
//       subcategoryId: "exampleSubcategoryId",
//       images: [], // Example images
//       variants: variantCombinations,
//     };

//     console.log("Submitting product:", product);
//     // Send product data to your API here
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Product Variations</h2>

//       {/* Add New Attribute */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Add a New Attribute</h3>
//         <input
//           type="text"
//           placeholder="Attribute name (e.g., Size)"
//           value={newAttributeName}
//           onChange={(e) => setNewAttributeName(e.target.value)}
//           className="mr-2 p-2 border rounded"
//         />
//         <button
//           type="button"
//           onClick={handleAddNewAttribute}
//           className="p-2 bg-green-600 text-white rounded"
//         >
//           Add Attribute
//         </button>
//       </div>

//       {/* Add Values to Each Attribute */}
//       <div className="mb-6">
//         {availableAttributes.map((attribute) => (
//           <div key={attribute.name} className="mb-4">
//             <h4 className="text-md font-semibold mb-2">
//               {attribute.name} Values
//             </h4>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder={`Add a value for ${attribute.name}`}
//                 value={newAttributeValue}
//                 onChange={(e) => setNewAttributeValue(e.target.value)}
//                 className="mr-2 p-2 border rounded"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleAddAttributeValue(attribute.name)}
//                 className="p-2 bg-blue-600 text-white rounded"
//               >
//                 Add Value
//               </button>
//             </div>
//             <div className="mt-2">
//               {attribute.values.map((value, idx) => (
//                 <span
//                   key={idx}
//                   className="mr-2 inline-block p-2 bg-gray-200 rounded"
//                 >
//                   {value}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Select Attributes for Variations */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">
//           Select Attributes for Variations:
//         </h3>
//         {availableAttributes.map((attribute) => (
//           <label key={attribute.name} className="mr-4">
//             <input
//               type="checkbox"
//               checked={selectedAttributes.includes(attribute.name)}
//               onChange={() => handleAttributeSelection(attribute.name)}
//             />
//             {attribute.name}
//           </label>
//         ))}
//       </div>

//       {/* Enter Details for Each Combination */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">
//           Enter Details for Each Combination:
//         </h3>
//         {variantCombinations.map((variant, index) => (
//           <div key={index} className="mb-4 p-4 border rounded">
//             <div className="mb-2">
//               {variant.attributes.map((attr) => (
//                 <span key={attr.key} className="mr-2">
//                   <strong>{attr.key}:</strong> {attr.value}
//                 </span>
//               ))}
//             </div>
//             <div className="flex space-x-4">
//               <input
//                 type="number"
//                 placeholder="Quantity"
//                 value={variant.quantity}
//                 onChange={(e) => {
//                   const newCombinations = [...variantCombinations];
//                   newCombinations[index].quantity = parseInt(e.target.value, 10);
//                   setVariantCombinations(newCombinations);
//                 }}
//                 className="p-2 border rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={variant.price}
//                 onChange={(e) => {
//                   const newCombinations = [...variantCombinations];
//                   newCombinations[index].price = parseFloat(e.target.value);
//                   setVariantCombinations(newCombinations);
//                 }}
//                 className="p-2 border rounded"
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         className="p-2 bg-blue-600 text-white rounded mt-4"
//       >
//         Submit Product
//       </button>
//     </div>
//   );
// };

// export default ProductForm;
