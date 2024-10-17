import React, { useState } from "react";
import axios from "axios";
import { createCategory } from "@/api/CategoryAPI";

// Define the types for subcategory and category
interface SubCategory {
  name: string;
  description: string;
  image?: string;
}

interface Category {
  name: string;
  description: string;
  image?: string;
  subCategories: SubCategory[];
}

const CategoryManager: React.FC = () => {
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file: File, isCategoryImage: boolean) => {
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
  };

  const addSubCategory = () => {
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
    console.log("Category to save:", category);
    try {
      // await createCategory(category);
      const response = await createCategory(category);
      console.log("Category saved:", response.data);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Category Manager</h2>

      {/* di */}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Create Category</h3>
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleCategoryChange}
          placeholder="Category Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          name="description"
          value={category.description}
          onChange={handleCategoryChange}
          placeholder="Category Description"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Image:</label>
          <input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], true)} />
          {category.image && <img src={category.image} alt="Category" className="mt-4 w-32 h-32 object-cover" />}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Subcategories</h3>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={subCategory.name}
            onChange={handleSubCategoryChange}
            placeholder="Subcategory Name"
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <textarea
            name="description"
            value={subCategory.description}
            onChange={handleSubCategoryChange}
            placeholder="Subcategory Description"
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subcategory Image:</label>
            <input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], false)} />
            {subCategory.image && (
              <img src={subCategory.image} alt="Subcategory" className="mt-4 w-32 h-32 object-cover" />
            )}
          </div>

          <button
            onClick={addSubCategory}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Add Subcategory
          </button>
        </div>

        {category.subCategories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Added Subcategories</h4>
            <div className="space-y-4">
              {category.subCategories.map((sub, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold">{sub.name}</h4>
                    <p>{sub.description}</p>
                    {sub.image && <img src={sub.image} alt={sub.name} className="mt-2 w-16 h-16 object-cover" />}
                  </div>
                  <button
                    onClick={() => removeSubCategory(index)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition duration-300"
      >
        Save Category
      </button>
    </div>
  );
};

export default CategoryManager;
