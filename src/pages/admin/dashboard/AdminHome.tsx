import TaskPage from "../adminTable/TableComponents/page"
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/FirebaseConfig";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  brand: string;
  price: number;
  discountedPrice: number;
  costPrice: number;
  img: string;
}

const AdminHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] =useState<number>(0)
  const [productsCount, setProductCount] = useState<number>(0)
  const navigate = useNavigate()

  //get all products from firestore
  const fetchAllProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList: Product[] = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          quantity: data.quantity || 0,
          category: data.category || '',
          brand: data.brand || '',
          price: data.price || 0,
          discountedPrice: data.discountedPrice || 0,
          costPrice: data.costPrice || 0,
          img: data.img || '',
        };
      });
      setProducts(productsList);
      setProductCount(productsList.length)
      console.log('All products fetched:', productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };



  //get all users from firestore and count the number of users
  const fetchAllUserCount = async()=>{
    const UserDataRef =collection(db,'users')
    const userDataShapshot = await getDocs(UserDataRef) 
    setUserCount(userDataShapshot.size)
    console.log(userDataShapshot.size)
  }
  

  //get userData from cookies 

const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  console.log("User data: ", userData);

  const handleLogout = async () => {
    Cookies.remove("user_id")
    Cookies.remove("user_token");
    Cookies.remove("user"); // Remove user data
    await signOut(auth);
    navigate("/login");
  };
  useEffect(() => {
    fetchAllUserCount()
    fetchAllProducts();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="flex bg-gray-100 min-h-screen ">
    
    {/* Sidebar */}
    <aside className="hidden sm:flex sm:flex-col ">
      
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
        <nav className="flex flex-col mx-4 my-6 space-y-4">
          <div>
            <img src="https://www.pngarts.com/files/16/E-Commerce-Transparent.png" alt="logo" className="h-12 w-12 object-cover" />
          </div>
          <a href="#" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            All Orders
          </a>
          <a href="#" className="inline-flex items-center justify-center py-3 text-purple-600 rounded-lg">
            All Users
          </a>
          <a href="#" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Messages</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <a href="#" className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <span className="sr-only">Documents</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </a>
        </nav>
       
      </div>
    
    </aside>

    {/* Main Content */}
    <div className="flex-grow text-gray-800 ">
      <header className="h-10 px-6 sm:px-10 bg-white">
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm font-semibold flex items-center gap-2"><FaUserTie /> {userData?.email}</div>
          <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className=" p-1 rounded cursor-pointer hover:text-text-red transition-all ">
                <IoPersonCircleOutline className="text-xl  " />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col text-xs ">
                  <p className=" flex justify-center items-center gap-1 ">
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
        </div>
      </header>

      {/* Main Content Section */}
      <main className="p-2">
        <div className=" space-x-4 mb-2">
         {/* <NavLink to="/addproducts"> */}
          <button className="py-1 px-2 bg-gray-800 text-white text-xs  rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50">
            Add New Product
          </button>
         {/* </NavLink> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Users</h2>
            <p className="text-xs font-bold text-purple-600">{userCount}</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Orders</h2>
            <p className="text-xs font-bold text-purple-600">85%</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">All Products</h2>
            <p className="text-xs font-bold text-purple-600">{productsCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Finished AdminHomeworks</h2>
            <p className="text-xs font-bold text-purple-600">75%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
         <TaskPage products={products} />
        </div>
      </main>
    </div>
  </div>
  )
}

export default AdminHome
