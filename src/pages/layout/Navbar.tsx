import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { BsCartCheck } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const isLoggedIn = !!Cookies.get("user_token");
  const navigate = useNavigate();
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);

  // Retrieve and parse user data from cookies
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  console.log("User data: ", userData);

  const handleLogout = async () => {
    Cookies.remove("user_id")
    Cookies.remove("user_token");
    Cookies.remove("user"); // Remove user data
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-800 text-white w-full p-2 shadow">
        <div className="flex justify-between items-center gap-2 text-sm">
          <div className="flex justify-between items-center gap-2">
            <NavLink to="/">ECommerce</NavLink>
            <NavLink to="/" className="text-white flex justify-center items-center">
              Men
            </NavLink>
            <NavLink to="/" className="text-white flex justify-center items-center">
              Women
            </NavLink>
            <NavLink to="/" className="text-white flex justify-center items-center">
              Electronics
            </NavLink>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div>
                <Input placeholder="Search..." className="w-full" />
              </div>
              <div className="text-xl">
                <IoIosHeartEmpty />
              </div>
              <NavLink to="/cart" className="text-white text-lg flex justify-center items-center">
                <BsCartCheck />
                <span className="text-sm text-white">({totalQuantity})</span>
              </NavLink>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className=" p-1 rounded cursor-pointer hover:text-text-red transition-all ">
                <IoPersonCircleOutline className="text-xl  " />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col text-xs ">
                  <p className="text-xs font-semibold mb-1">
                    {userData?.full_name}
                  </p>
                  <p className=" flex items-center gap-1 ">
                    {/* <MdOutlineEmail className="text-base  " /> */}

                    <span>{userData?.email}</span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <p className="text-xs flex items-center gap-2 font-medium">
                  <MdOutlinePowerSettingsNew className="text-red-700 text-base " />{" "}
                  Log out
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/login" className="text-black flex justify-center items-center">
                Login
              </NavLink>
              <NavLink to="/register" className="text-black flex justify-center items-center">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
