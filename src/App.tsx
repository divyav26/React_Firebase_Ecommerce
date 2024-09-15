
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import AddProducts from './pages/admin/dashboard/AddProducts'
import OrdersList from './pages/admin/dashboard/OrdersList'
import Cart from './pages/products/Cart'
import WishList from './pages/products/WishList'
import AdminHome from './pages/admin/dashboard/AdminHome'
import Orders from './pages/products/Orders'
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
        <Route path="/order/:orderId" element={<Orders />} />
        <Route path='/admin/dashboard/addproducts' element={<AddProducts />} />

        <Route path="/admin/dashboard/Home" element={<AdminHome/>}>
          {/* Default page when /admin/dashboard is accessed */}
          {/* <Route index element={<AddProducts />} /> */}
          <Route path="addproducts" element={<AddProducts />} />
          <Route path="orders" element={<OrdersList />} />
        </Route>
      </Routes>
     
    </BrowserRouter>
    </>
  )
}

export default App
