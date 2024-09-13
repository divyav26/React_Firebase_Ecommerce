import { auth } from "@/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";

import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      Cookies.remove("user_token"); // Use the same name here
      await signOut(auth);
      navigate("/login");
    };


  return (
    <nav className="bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-bold">
              Admin Panel
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="text-black flex justify-center items-center">
                Logout
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
