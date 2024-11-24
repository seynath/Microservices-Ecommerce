import React, { useState,  } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { Button } from "flowbite-react";
import { logout } from "@/features/userSlice";
import {useSelector, useDispatch} from 'react-redux';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

  // Use Redux to get the logged-in user
  const user = useSelector((state: { user: { user: object } }) => state.user.user);
console.log(user)
  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    // change user state to fal
  
    
  };

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <NavLink to={"/"}>
            <img className="w-auto h-6 sm:h-9" src={Logo} alt="logo" />
          </NavLink>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              <svg
                className={`w-6 h-6 ${!isOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8h16M4 16h16"
                />
              </svg>

              <svg
                className={`w-6 h-6 ${isOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
        <div
          className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${
            isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"
          }`}
        >
          <div className="flex flex-col md:flex-row md:mx-6">
            <NavLink
              to={"/test"}
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
            >
              HOME
            </NavLink>
            <NavLink
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              to={"/shop"}
            >
              SHOP
            </NavLink>
            <a
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              href="#"
            >
              CONTACT
            </a>
            <a
              className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              href="#"
            >
              ABOUT
            </a>
          </div>
          <div></div>
       
     
          {/* aa */}
          {
            user && user ? (
          <div className="dropdown dropdown-end mr-3">
            <div tabIndex={0} role="button" className="  border-none m-1">
              <img
                width="35"
                height="35"
                src="https://img.icons8.com/ios/100/FA5252/user-male-circle--v1.png"
                alt="user-male-circle--v1"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow top-[50px]"
            >
            
              <li>
                <NavLink to={"/profile"}>My Account</NavLink>
              </li>
              <li>
                <NavLink to={"/order"}>My Orders</NavLink>
              </li>
              <li>
                <div onClick={handleLogout} >Logout</div>
              </li>
            </ul>
          </div>) : (
            <div>
                 {/* Login */}
          <div className="flex justify-center md:block mr-3">
            <NavLink
              className="relative text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300"
              to={"/login"}
            >
              <Button gradientDuoTone="pinkToOrange">Login</Button>
            </NavLink>
          </div>
            </div>
          )
              
          }
        
          {/* cart */}
          <div className="flex justify-center md:block">
            <NavLink
              className="relative text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300"
              to={"/cart"}
            >
              <img
                width="35"
                height="35"
                src="https://img.icons8.com/windows/96/FA5252/shopping-cart.png"
                alt="shopping-cart"
              />

              <span className="absolute top-0 left-0 p-1 text-xs text-white bg-blue-500 rounded-full" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
