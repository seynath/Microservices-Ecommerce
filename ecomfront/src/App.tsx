import './App.css';
import SingleProduct from './pages/SingleProduct';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layout/MainLayout';
import Test from './pages/Test';
import DashboardLayout from '@/layout/DashboardLayout';
import Dashboard from '@/admin/Dashboard'
import Product from '@/admin/Product'
import CategoryAdmin from '@/admin/Category'
import Shop from './pages/Shop';
import Order from './pages/Order';
import Contact from './pages/Contact';
import Category from './pages/Category';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './pages/Cart';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderCompleted from './pages/OrderCompleted';


function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/category/:id/:name' element={<Category />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/contact" element={<Contact />} />

          
          <Route path="/cart" element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order' element={<Order/>} />
          <Route path="/test" element={<Test />} />
          <Route path="/order-complete" element={<OrderCompleted />} />
          <Route path="*" element={<NotFoundPage/>} />

          {/* another layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="product" element={<Product />} />
            <Route path="category" element={<CategoryAdmin />} />
            {/* <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;