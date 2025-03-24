import axios from "axios";
import { createCategory, getCategories, updateCategory, deleteCategory } from "@/api/CategoryAPI";
import { Button, Modal, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from "react-icons/hi";

// Updated interfaces based on the data structure provided
interface SubCategory {
  _id?: string;
  name: string;
  description: string;
  image?: string;
}

interface Category {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  subCategories: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
}

const CategoryManager: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const categoryNameRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    image: "",
    subCategories: [],
  });

  const [subCategory, setSubCategory] = useState<SubCategory>({
    name: "",
    description: "",
    image: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      console.log("Fetched categories:", response);
      setCategories(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file: File, isCategoryImage: boolean) => {
    if (!file) return;
    
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ecommicro"); // Cloudinary upload preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzqihtcs4/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;

      if (isCategoryImage) {
        setCategory({ ...category, image: imageUrl });
      } else {
        setSubCategory({ ...subCategory, image: imageUrl });
      }
      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    }
  };

  const addSubCategory = () => {
    if (!subCategory.name) return;
    
    setCategory({
      ...category,
      subCategories: [...category.subCategories, subCategory],
    });
    setSubCategory({ name: "", description: "", image: "" }); // Clear subcategory form
  };

  const removeSubCategory = (index: number) => {
    const updatedSubCategories = category.subCategories.filter((_, i) => i !== index);
    setCategory({ ...category, subCategories: updatedSubCategories });
  };

  const handleSubmit = async () => {
    if (!category.name.trim()) {
      alert("Category name is required");
      return;
    }
    
    try {
      setSubmitLoading(true);
      if (editMode && selectedCategory?._id) {
        await updateCategory(selectedCategory._id, category);
        console.log("Category updated successfully");
      } else {
        await createCategory(category);
        console.log("Category created successfully");
      }
      resetForm();
      fetchCategories();
      setOpenModal(false);
      setSubmitLoading(false);
    } catch (error) {
      console.error("Error saving category:", error);
      setSubmitLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setCategory({ ...cat });
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteConfirm = (cat: Category) => {
    setSelectedCategory(cat);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory?._id) return;
    
    try {
      setDeleteLoading(true);
      await deleteCategory(selectedCategory._id);
      fetchCategories();
      setDeleteModal(false);
      setSelectedCategory(null);
      setDeleteLoading(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setCategory({
      name: "",
      description: "",
      image: "",
      subCategories: [],
    });
    setSubCategory({
      name: "",
      description: "",
      image: "",
    });
    setEditMode(false);
    setSelectedCategory(null);
  };

  const openNewCategoryModal = () => {
    resetForm();
    setOpenModal(true);
  };

  // Format the date properly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Category Manager</h2>
        <Button 
          color="blue" 
          onClick={openNewCategoryModal}
          className="flex items-center gap-2"
        >
          <HiPlus className="h-5 w-5" />
          Add New Category
        </Button>
      </div>

      {/* Category list */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Category List</h3>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner size="xl" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No categories found. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      title="Edit category"
                    >
                      <HiOutlinePencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm(cat)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      title="Delete category"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{cat.description}</p>
                
                {cat.image && (
                  <div className="mb-4">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-40 object-cover rounded-lg" 
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                      // }}
                    />
                  </div>
                )}
                
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2 text-gray-700">Subcategories:</h4>
                    <div className="space-y-2">
                      {cat.subCategories.map((sub, index) => (
                        <div key={sub._id || index} className="p-2 bg-gray-50 rounded-md text-sm flex justify-between">
                          <div>
                            <span className="font-medium">{sub.name}</span>
                            {sub.description && <p className="text-xs text-gray-500 mt-1">{sub.description}</p>}
                          </div>
                          {sub.image && (
                            <img 
                              src={sub.image} 
                              alt={sub.name} 
                              className="w-8 h-8 object-cover rounded-full"
                              // onError={(e) => {
                              //   const target = e.target as HTMLImageElement;
                              //   target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                              // }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cat.createdAt && (
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    Created: {formatDate(cat.createdAt)}
                    {cat.updatedAt && cat.updatedAt !== cat.createdAt && (
                      <span className="ml-3">• Updated: {formatDate(cat.updatedAt)}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Modal 
        show={openModal} 
        size="2xl" 
        popup 
        onClose={() => {
          if (!submitLoading) {
            setOpenModal(false);
            resetForm();
          }
        }}
        initialFocus={categoryNameRef}
      >
        <Modal.Header className="px-6 pt-5 pb-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {editMode ? 'Edit Category' : 'Create New Category'}
          </h3>
        </Modal.Header>
        <Modal.Body className="px-6 py-5">
          <div className="space-y-6">
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">Category Name*</label>
                <input
                  id="category-name"
                  ref={categoryNameRef}
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleCategoryChange}
                  placeholder="Enter category name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="category-description"
                  name="description"
                  value={category.description}
                  onChange={handleCategoryChange}
                  placeholder="Describe this category"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                <input 
                  type="file" 
                  onChange={(e) => e.target.files && uploadImage(e.target.files[0], true)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                  disabled={uploadingImage}
                />
                
                {uploadingImage && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Spinner size="sm" className="mr-2" /> Uploading image...
                  </div>
                )}
                
                {category.image && (
                  <div className="mt-3">
                    <img 
                      src={category.image} 
                      alt="Category preview" 
                      className="mt-2 max-w-full h-36 object-contain rounded border p-1" 
                    />
                    <button 
                      onClick={() => setCategory({...category, image: ""})}
                      className="mt-1 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <label htmlFor="subcategory-name" className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                  <input
                    id="subcategory-name"
                    type="text"
                    name="name"
                    value={subCategory.name}
                    onChange={handleSubCategoryChange}
                    placeholder="Enter subcategory name"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="subcategory-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="subcategory-description"
                    name="description"
                    value={subCategory.description}
                    onChange={handleSubCategoryChange}
                    placeholder="Describe this subcategory"
                    rows={2}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Image</label>
                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && uploadImage(e.target.files[0], false)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                    disabled={uploadingImage}
                  />
                  
                  {uploadingImage && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Spinner size="sm" className="mr-2" /> Uploading image...
                    </div>
                  )}
                  
                  {subCategory.image && (
                    <div className="mt-3">
                      <img 
                        src={subCategory.image} 
                        alt="Subcategory preview" 
                        className="mt-2 max-w-full h-24 object-contain rounded border p-1" 
                      />
                      <button 
                        onClick={() => setSubCategory({...subCategory, image: ""})}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={addSubCategory}
                  color="light"
                  className="w-full mt-2"
                  disabled={!subCategory.name || uploadingImage}
                >
                  <HiPlus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </div>

              {category.subCategories.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-md font-medium mb-3">Added Subcategories ({category.subCategories.length})</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {category.subCategories.map((sub, index) => (
                      <div
                        key={sub._id || index}
                        className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-white"
                      >
                        <div className="flex items-center space-x-3">
                          {sub.image && (
                            <img 
                              src={sub.image} 
                              alt={sub.name} 
                              className="w-10 h-10 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h5 className="font-medium text-sm">{sub.name}</h5>
                            {sub.description && <p className="text-xs text-gray-500">{sub.description}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeSubCategory(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove subcategory"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
              <Button 
                color="gray" 
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button 
                color="blue"
                onClick={handleSubmit}
                disabled={submitLoading || !category.name.trim() || uploadingImage}
              >
                {submitLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {editMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  editMode ? 'Update Category' : 'Save Category'
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={deleteModal} 
        size="md" 
        popup 
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModal(false);
          }
        }}
      >
        <Modal.Header className="px-6 pt-5 pb-0" />
        <Modal.Body className="px-6 py-5">
          <div className="text-center">
            <HiOutlineTrash className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Delete Category
            </h3>
            <p className="mb-5 text-gray-500">
              Are you sure you want to delete the category "<span className="font-semibold">{selectedCategory?.name}</span>"?
              {selectedCategory?.subCategories && selectedCategory.subCategories.length > 0 && (
                <span className="block mt-2 text-sm text-red-500">
                  This will also delete {selectedCategory.subCategories.length} subcategories!
                </span>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                color="gray" 
                onClick={() => setDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button 
                color="failure" 
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Yes, delete'
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManager;



// // import React, { useState } from "react";
// import axios from "axios";
// import { createCategory , getCategories} from "@/api/CategoryAPI";
// import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
// import { useEffect, useRef, useState } from "react";

// // Define the types for subcategory and category
// interface SubCategory {
//   name: string;
//   description: string;
//   image?: string;
// }

// interface Category {
//   name: string;
//   description: string;
//   image?: string;
//   subCategories: SubCategory[];
// }

// const CategoryManager: React.FC = () => {
//   const [openModal, setOpenModal] = useState(true);
//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);

//   const [category, setCategory] = useState<Category>({
//     name: "",
//     description: "",
//     image: "",
//     subCategories: [],
//   });

//   const [subCategory, setSubCategory] = useState<SubCategory>({
//     name: "",
//     description: "",
//     image: "",
//   });

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setCategory({ ...category, [e.target.name]: e.target.value });
//   };

//   const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
//   };

//   const uploadImage = async (file: File, isCategoryImage: boolean) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "ecommicro"); // Cloudinary upload preset

//     const response = await axios.post(
//       "https://api.cloudinary.com/v1_1/dzqihtcs4/image/upload",
//       formData
//     );

//     const imageUrl = response.data.secure_url;

//     if (isCategoryImage) {
//       setCategory({ ...category, image: imageUrl });
//     } else {
//       setSubCategory({ ...subCategory, image: imageUrl });
//     }
//   };

//   const addSubCategory = () => {
//     setCategory({
//       ...category,
//       subCategories: [...category.subCategories, subCategory],
//     });
//     setSubCategory({ name: "", description: "", image: "" }); // Clear subcategory form
//   };

//   const removeSubCategory = (index: number) => {
//     const updatedSubCategories = category.subCategories.filter((_, i) => i !== index);
//     setCategory({ ...category, subCategories: updatedSubCategories });
//   };

//   const handleSubmit = async () => {
//     console.log("Category to save:", category);
//     try {
//       // await createCategory(category);
//       const response = await createCategory(category);
//       console.log("Category saved:", response.data);
//     } catch (error) {
//       console.error("Error saving category:", error);
//     }
//   };
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();
//         console.log("Categories fetched:", response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }
//   , []);

//   return (
    
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">Category Manager</h2>
//        <>
//       <Button onClick={() => setOpenModal(true)}>Add Category</Button>
//       <Modal show={openModal} size="2xl" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
//         <Modal.Header />
//         <Modal.Body>
//         <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Create Category</h3>
//         <input
//           type="text"
//           name="name"
//           value={category.name}
//           onChange={handleCategoryChange}
//           placeholder="Category Name"
//           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//         />
//         <textarea
//           name="description"
//           value={category.description}
//           onChange={handleCategoryChange}
//           placeholder="Category Description"
//           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//         ></textarea>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Category Image:</label>
//           <input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], true)} />
//           {category.image && <img src={category.image} alt="Category" className="mt-4 w-32 h-32 object-cover" />}
//         </div>
//       </div>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Subcategories</h3>

//         <div className="mb-4">
//           <input
//             type="text"
//             name="name"
//             value={subCategory.name}
//             onChange={handleSubCategoryChange}
//             placeholder="Subcategory Name"
//             className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//           <textarea
//             name="description"
//             value={subCategory.description}
//             onChange={handleSubCategoryChange}
//             placeholder="Subcategory Description"
//             className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//           ></textarea>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">Subcategory Image:</label>
//             <input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], false)} />
//             {subCategory.image && (
//               <img src={subCategory.image} alt="Subcategory" className="mt-4 w-32 h-32 object-cover" />
//             )}
//           </div>

//           <button
//             onClick={addSubCategory}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
//           >
//             Add a Subcategory
//           </button>
//         </div>

//         {category.subCategories.length > 0 && (
//           <div className="mb-6">
//             <h4 className="text-lg font-semibold mb-2">Added Subcategories</h4>
//             <div className="space-y-4">
//               {category.subCategories.map((sub, index) => (
//                 <div
//                   key={index}
//                   className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
//                 >
//                   <div>
//                     <h4 className="font-semibold">{sub.name}</h4>
//                     <p>{sub.description}</p>
//                     {sub.image && <img src={sub.image} alt={sub.name} className="mt-2 w-16 h-16 object-cover" />}
//                   </div>
//                   <button
//                     onClick={() => removeSubCategory(index)}
//                     className="text-red-500 hover:text-red-700 transition duration-300"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition duration-300"
//       >
//         Save Category
//       </button>
//         </Modal.Body>
//       </Modal>
//       <h2 className="text-2xl font-bold mb-6 text-center">Category List</h2>
//       <div>

//       </div>

//     </>

//       {/* di */}

   
//     </div>
//   );
// };

// export default CategoryManager;
