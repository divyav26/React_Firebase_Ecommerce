import { NavLink } from "react-router-dom"


const Sidebar = () => {
  return (
    <div className="px-4 py-2">
      <NavLink to="/admin/dashboard" className="flex items-center p-2 text-xs text-gray-900 hover:bg-gray-100 hover:text-black">
        Add Products
      </NavLink>

      <NavLink to="/admin/dashboard/allproducts" className="flex items-center p-2 text-xs text-gray-900 hover:bg-gray-100 hover:text-black">
        All Products
      </NavLink>

      <NavLink to="/admin/dashboard/orders" className="flex items-center p-2 text-xs text-gray-900 hover:bg-gray-100 hover:text-black">
        Orders
      </NavLink>

      <NavLink to="/admin/dashboard/allusers" className="flex items-center p-2 text-xs text-gray-900 hover:bg-gray-100 hover:text-black">
        All Users
      </NavLink>
    </div>
  )
}

export default Sidebar
