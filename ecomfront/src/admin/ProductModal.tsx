
const ProductModal = () => {
  return (
    <div>ProductModal</div>
  )
}

export default ProductModal

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"


// const ProductModal = ({ isOpen, onClose, handleSubmit, product, handleProductChange, handleVariantChange, addVariant, variant, addImage }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//       <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
//         <div className="flex justify-end">
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
//           <div>
//             <Label htmlFor="name">Product Name</Label>
//             <Input id="name" name="name" value={product.name} onChange={handleProductChange} required />
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" name="description" value={product.description} onChange={handleProductChange} />
//           </div>

//           <div>
//             <Label htmlFor="basePrice">Base Price</Label>
//             <Input id="basePrice" name="basePrice" type="number" value={product.basePrice} onChange={handleProductChange} required />
//           </div>

//           <div>
//             <Label htmlFor="categoryId">Category ID</Label>
//             <Input id="categoryId" name="categoryId" value={product.categoryId} onChange={handleProductChange} required />
//           </div>

//           <div>
//             <Label htmlFor="subCategoryId">Sub-Category ID (Optional)</Label>
//             <Input id="subCategoryId" name="subCategoryId" value={product.subCategoryId} onChange={handleProductChange} />
//           </div>

//           <div>
//             <Label htmlFor="image">Add Image URL</Label>
//             <Input id="image" name="image" type="url" onChange={addImage} />
//             <div className="mt-2">
//               {product.images.map((img, index) => (
//                 <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
//                   {img}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="border-t pt-4">
//             <h3 className="text-lg font-semibold mb-2">Add Variant</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <Input placeholder="Size" name="size" value={variant.size} onChange={handleVariantChange} />
//               <Input placeholder="Color" name="color" value={variant.color} onChange={handleVariantChange} />
//               <Input placeholder="Price" name="price" type="number" value={variant.price} onChange={handleVariantChange} />
//               <Input placeholder="Stock Quantity" name="stock_quantity" type="number" value={variant.stock_quantity} onChange={handleVariantChange} />
//             </div>
//             <Button type="button" onClick={addVariant} className="mt-2">Add Variant</Button>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-2">Variants</h3>
//             <ul className="list-disc pl-5">
//               {product.variants.map((v, index) => (
//                 <li key={index}>
//                   {v.size} - {v.color} - ${v.price} - Stock: {v.stock_quantity}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <Label htmlFor="stock_quantity">Total Stock Quantity</Label>
//             <Input id="stock_quantity" name="stock_quantity" type="number" value={product.stock_quantity} readOnly />
//           </div>

//           <Button type="submit">Create Product</Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductModal;