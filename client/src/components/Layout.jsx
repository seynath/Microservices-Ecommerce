import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div
    // style={{backgroundColor:"green", padding:"20px"}}
    // className="w-100"
    >
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer
      
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      
      />
    </div>
  );
}

export default Layout;
