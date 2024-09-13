
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import AdminDashboard from './pages/admin/dashboard/AdminDashboard'
import AddProducts from './pages/admin/dashboard/AddProducts'
import OrdersList from './pages/admin/dashboard/OrdersList'
import AllProductList from './pages/admin/dashboard/AllProductList'
import AllUsers from './pages/admin/dashboard/AllUsers'
import Cart from './pages/products/Cart'
import WishList from './pages/products/WishList'
function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/wishlist" element={<WishList />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          {/* Default page when /admin/dashboard is accessed */}
          <Route index element={<AddProducts />} />
          <Route path="addproducts" element={<AddProducts />} />
          <Route path="allproducts" element={<AllProductList />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="allusers" element={<AllUsers />} />
        </Route>
      </Routes>
     
    </BrowserRouter>
    </>
  )
}

export default App
