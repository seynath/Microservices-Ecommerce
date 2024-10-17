import React from 'react'

const AdminProduct = () => {
  return (
    <div>AdminProduct</div>
  )
}

export default AdminProduct



// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { CloudUpload } from 'lucide-react'

// export default function CreateProduct() {
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [price, setPrice] = useState('')
//   const [category, setCategory] = useState('')
//   const [imageUrl, setImageUrl] = useState('')

//   useEffect(() => {
//     // Load the Cloudinary Upload Widget script
//     const script = document.createElement('script')
//     script.src = 'https://upload-widget.cloudinary.com/global/all.js'
//     script.async = true
//     document.body.appendChild(script)

//     return () => {
//       document.body.removeChild(script)
//     }
//   }, [])

//   const handleImageUpload = () => {
//     // @ts-ignore
//     const widget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: 'your_cloud_name',
//         uploadPreset: 'your_upload_preset',
//       },
//       (error, result) => {
//         if (!error && result && result.event === 'success') {
//           setImageUrl(result.info.secure_url)
//         }
//       }
//     )
//     widget.open()
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Here you would typically send the data to your backend
//     console.log({ title, description, price, category, imageUrl })
//     // Reset form after submission
//     setTitle('')
//     setDescription('')
//     setPrice('')
//     setCategory('')
//     setImageUrl('')
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label htmlFor="title">Title</Label>
//           <Input
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Label htmlFor="price">Base Price</Label>
//           <Input
//             id="price"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Select value={category} onValueChange={setCategory}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="electronics">Electronics</SelectItem>
//               <SelectItem value="clothing">Clothing</SelectItem>
//               <SelectItem value="books">Books</SelectItem>
//               <SelectItem value="home">Home & Garden</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Product Image</Label>
//           <div className="flex items-center space-x-4">
//             <Button type="button" onClick={handleImageUpload}>
//               <CloudUpload className="mr-2 h-4 w-4" /> Upload Image
//             </Button>
//             {imageUrl && (
//               <img src={imageUrl} alt="Uploaded product" className="h-20 w-20 object-cover rounded" />
//             )}
//           </div>
//         </div>
//         <Button type="submit">Create Product</Button>
//       </form>
//     </div>
//   )
// }