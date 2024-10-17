import React, { useState} from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { signup } from "../api/UserAPI";
import { reuleaux } from "ldrs";
import BackgrounImage from "../assets/shop.png";
import Logo from "../assets/logo.png";
// import { redirect } from "react-router-dom";


reuleaux.register();

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!agreement) {
      alert("Please agree to the terms and conditions");
      return;
    }
    setLoading(true);

    try {
      const user = { email, password, name, mobile };
      const response = await signup(user)

      navigate("/login");
      console.log("User registered:", response);
    } catch (error:unknown) {

      setError(error?.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
      // return redirect("/login");




    }
  };

  return (
    <div>
      <section>
        {/* Container */}
        <div className="grid gap-0 md:h-screen md:grid-cols-2">
          {/* Component */}
          <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20">
            <div className="max-w-md text-center">
              <div className="flex justify-center">

              <img src={Logo} className="w-60 my-3" />
              </div>
              <h3 className="mb-8 text-3xl font-bold md:mb-12 md:text-4xl lg:mb-16">
                Join Us Today and Start Your Journey!
              </h3>
              {/* Form */}
              <div className="mx-auto max-w-sm mb-4 pb-4">
                <form name="wf-form-password" onSubmit={handleSubmit}>
                  <div className="relative mb-4">
                    <img
                      alt=""
                      src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a946794e6cf8a_Lock-2.svg"
                      className="absolute left-5 top-3 inline-block"
                    />
                    <input
                      type="name"
                      className="mb-4 block bg-white  h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      type="mobile"
                      className="mb-4 bg-white block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                      placeholder="Mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required={true}
                    />
                  </div>
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

                  <label className="mb-6 flex items-center justify-start pb-12 pl-5 font-medium md:mb-10 lg:mb-1">
                    <input
                      type="checkbox"
                      name="agreement"
                      onChange={(e) => setAgreement(!agreement)}
                      className="float-left mt-1"
                    />
                    <span className="ml-4 inline-block cursor-pointer text-sm">
                      I agree with the
                      <a href="#" className="font-bold">
                        Terms &amp; Conditions
                      </a>
                    </span>
                  </label>
                  {
                    error ? (
                      <div className="text-red-500 text-sm mb-4">{error}</div>
                    ) : null
                    
                  }
               
                  {loading ? (
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
                      Sign Up
                    </button>
                  )}
                </form>
              </div>
              <p className="text-sm text-gray-500 sm:text-sm">
                Already have an account?
                <NavLink to={"/login"} className="font-bold text-black">
                  <span> </span> Login now
                </NavLink>
              </p>
            </div>
          </div>
          {/* Component */}
          <div className="flex items-center justify-center " style={{backgroundImage: `url(${BackgrounImage})`, backgroundPosition:"center", backgroundSize:"cover",borderRadius:"20px"}}>
            {/* <div className="mx-auto max-w-md px-5 py-16 md:px-10 md:py-24 lg:py-32 bg">
              <div className="mb-5 flex h-14 w-14 flex-col items-center justify-center bg-white md:mb-6 lg:mb-8">
                <img
                  src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a949eade6cf7d_Vector-2.svg"
                  alt=""
                  className="inline-block"
                />
              </div>
              <p className="mb-8 text-sm sm:text-base md:mb-12 lg:mb-16">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                urna, porttitor rhoncus dolor purus non enim.
              </p>
              <p className="text-sm font-bold sm:text-base">John Robert</p>
              <p className="text-sm sm:text-sm">Senior Webflow Developer</p>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
