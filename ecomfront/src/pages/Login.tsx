import React, { useState } from "react";
import { Navigate, NavLink,useNavigate } from "react-router-dom";
import { login } from "../api/UserAPI";
import "ldrs/ring";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/userSlice";
// import { lRing } from 'ldrs'

import { reuleaux } from "ldrs";

reuleaux.register();

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const response = dispatch(loginUser({ email, password }))
      .unwrap()
      .then((response) => {
        console.log("User logged in:", response);
        if(response.status === "success") {
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error logging in user:", error);
        if (error.message === "User not found") {
          setError("User Not Found, Please Sign Up First");
        } else if (error.message === "Invalid credentials") {
          setError("Please Enter Correct Credentials");
        } else if (error.message === "Network Error") {
          setError(error.message);
        }

        setEmail("");
        setPassword("");
        setLoading(false);
      });

    // try {
    //   const user = { email, password };
    //   const response: object = await dispatch(loginUser(user));
    //   // const response = await login(user);
    //   if(response.meta.requestStatus === "fulfilled"){

    //     console.log("User logged in:", response);
    //   }else if(response.meta.requestStatus === "rejected"){
    //     console.log("Error logging in user:", response.payload);
    //   }

    //   // Here you would typically send the data to your backend
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div>
      <section>
        {/* Container */}
        <div className="grid gap-0 md:h-screen md:grid-cols-2">
          {/* Component */}
          <div className="flex items-center justify-center bg-gray-100">
            <div className="mx-auto max-w-md px-5 py-16 md:px-10 md:py-20">
              <div className="mb-5 flex h-14 w-14 flex-col items-center justify-center bg-white md:mb-6 lg:mb-8">
                <img
                  src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a949eade6cf7d_Vector-2.svg"
                  alt=""
                  className="inline-block"
                />
              </div>
              <p className="mb-8 text-sm sm:text-base md:mb-12 lg:mb-16 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                urna, porttitor rhoncus dolor purus non enim.
              </p>
              <p className="text-sm font-bold sm:text-base">John Robert</p>
              <p className="text-sm sm:text-sm text-gray-500">
                Senior Webflow Developer
              </p>
            </div>
          </div>
          {/* Component */}
          <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20">
            <div className="max-w-md text-center">
              <h2 className="mb-8 text-3xl font-bold md:mb-12 md:text-5xl lg:mb-16">
                Start your 14-day free trial
              </h2>
              {/* Form */}
              <div className="mx-auto mb-4 max-w-sm pb-4">
                <form name="wf-form-password" onSubmit={handleSubmit}>
                  <div className="relative">
                    <img
                      alt=""
                      src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9455fae6cf89_EnvelopeSimple.svg"
                      className="absolute left-5 top-3 inline-block"
                    />
                    <input
                      type="email"
                      className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={true}
                    />
                  </div>
                  <div className="relative mb-4">
                    <img
                      alt=""
                      src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a946794e6cf8a_Lock-2.svg"
                      className="absolute left-5 top-3 inline-block"
                    />
                    <input
                      type="password"
                      className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                      placeholder="Password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={true}
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-xs mb-4">{error}</div>
                  )}

                  {loading ? (
                    //  <l-ring  color="coral"></l-ring>
                    <l-reuleaux
                      size="37"
                      stroke="5"
                      stroke-length="0.15"
                      bg-opacity="0.1"
                      speed="1.2"
                      color="black"
                    ></l-reuleaux>
                  ) : (
                    <button
                      type="submit"
                      // value="Join Flowspark"
                      className="inline-block w-full cursor-pointer items-center bg-black px-6 py-3 text-center font-semibold text-white"
                    >
                      Sign In
                    </button>
                  )}
                </form>
              </div>
              <p className="text-sm text-gray-500 sm:text-sm">
                Already have an account?
                <NavLink to={"/signup"} className="font-bold text-black">
                  <span> </span> Sign Up now
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

// import { useState, useEffect } from 'react'
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Textarea } from "../components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
// import { Label } from "../components/ui/label"
// import { CloudUpload } from 'lucide-react'

// declare global {
//   interface Window {
//     cloudinary: unknown;
//   }
// }

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
//     const widget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: 'your_cloud_name',
//         uploadPreset: 'your_upload_preset',
//       },
//       (error: unknown, result: unknown) => {
//         if (!error && result && result.event === 'success') {
//           setImageUrl(result.info.secure_url)
//         }
//       }
//     )
//     widget.open()
//   }

//   const handleSubmit = (e: React.FormEvent) => {
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
