import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { BsCartCheck } from "react-icons/bs";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoBagCheckOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";




const Navbar = () => {
  const isLoggedIn = !!Cookies.get("user_token");
  const navigate = useNavigate();
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);
  const [product, setProduct] = useState<any>({});
  console.log("product--", product);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  console.log("category--", category);
  console.log("filteredProducts--", filteredProducts);

  // Retrieve and parse user data from cookies
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  // console.log("User data: ", userData);

  const fetchproduct = async () => {
    const productRef = collection(db, "products");
    const querySnapshot = await getDocs(productRef);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("data--", data);
    setProduct(data);
  }

 
  const handleCategory = (category: string) => {
    setCategory(category);
    const filteredProducts = product.filter((product: any) =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
    console.log("filteredProducts selected category--", filteredProducts);
    setFilteredProducts(filteredProducts);
  };

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);

    const filteredProducts = product.filter((product:any) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log("filteredProducts--", filteredProducts);
    setFilteredProducts(filteredProducts);
  };




  const handleLogout = async () => {
    Cookies.remove("user_id")
    Cookies.remove("user_token");
    Cookies.remove("user"); // Remove user data
    await signOut(auth);
    navigate("/login");
  };

useEffect(() => {
  fetchproduct();
  
}, []);

  return (
    <>
      <nav className="bg-gray-800 text-white w-full p-2 shadow">
        <div className="flex justify-between items-center gap-2 text-sm">
          <ul className="flex  items-center gap-2">
            <Link to="/" onClick={()=>handleCategory("all")} className="text-white flex justify-center items-center cursor-pointer">Ecommcerce</Link>
            <li onClick={()=>handleCategory("men")}  className="text-white flex justify-center items-center cursor-pointer">
              Men
            </li>
            <li onClick={()=>handleCategory("women")} className="text-white flex justify-center items-center cursor-pointer">
              Women
            </li>
            <li onClick={()=>handleCategory("electronics")} className="text-white flex justify-center items-center cursor-pointer">
              Electronics
            </li>
          </ul>
          <div>
            <Input placeholder="Search..." className="w-[200%]"
                onChange={handleSearch}
                value={searchText}
                />
            </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              
              <div className="text-xl">
                <NavLink to="/wishlist">
                <IoIosHeartEmpty />
                </NavLink>
              </div>
              <NavLink to="/cart" className="text-white text-lg flex justify-center items-center">
                <BsCartCheck />
                <span className="text-sm text-white">({totalQuantity})</span>
              </NavLink>
              <NavLink to="/orderhistory" className="text-white text-lg flex justify-center items-center">
                <IoBagCheckOutline />
              
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
              
              <NavLink to="/login" className=" flex justify-center items-center">
                Login
              </NavLink>
              <NavLink to="/register" className=" flex justify-center items-center">
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
