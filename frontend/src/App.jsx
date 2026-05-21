import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProductList from './pages/ProductList'
import SideMenu from './components/SideMenu'
import PrivateComponent from './components/PrivateComponent'
import UserRoute from './components/UserRoute'
import Home from './admin/Home'
import AddProduct from './admin/AddProduct'
import UpdateProduct from './admin/UpdateProduct'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Orders from './pages/Orders'
import AdminRoute from './components/AdminRoute'


import './App.css'
import Products from './admin/Products';
import OrderList from './admin/OrderList';
import Users from './admin/Users';
import MyAccount from './pages/MyAccount';


function App() {

  const auth = JSON.parse(localStorage.getItem('user') || '{}')

  return (

    <BrowserRouter>
      {
        auth?.role === "admin"
          ?
          // ADMIN LAYOUT
          <div className="d-flex">
            <SideMenu />
            <div
              className="flex-grow-1"
              style={{
                minHeight: "100vh",
                background: "#f1f5f9"
              }}
            >
              <Routes>
                {/* ADMIN ROUTES */}
                <Route element={<AdminRoute />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/products" element={<Products/>} />
                  <Route path="/orders-list" element={<OrderList/>} />
                  <Route path="/users" element={<Users/>} />
                  <Route path="/update/:id" element={<UpdateProduct />} />
                </Route>
                {/* PUBLIC */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </div>
          </div>
          :
          // USER LAYOUT
          <>
            <SideMenu />
            <Routes>
              {/* PRIVATE ROUTE */}
              <Route element={<PrivateComponent />}>
                <Route path="/" element={<ProductList />} />
                <Route path="/profile" element={<h1>Profile</h1>} />
              </Route>
              {/* USER ROUTES */}
              <Route element={<UserRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-account" element={<MyAccount />} />
                
              </Route>
              {/* PUBLIC */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </>
      }
    </BrowserRouter>
  )
}

export default App