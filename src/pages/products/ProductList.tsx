import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import { Card, CardContent } from '@/components/ui/card';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slice/CartSlice';
import { addToWishlist } from '@/redux/slice/whishlistSlice';
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import { FaRegHeart } from "react-icons/fa";

// For accessing logged-in user info

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

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, 'id'>),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      showErrorToast('User Not Login!!!.');
      return;
    }
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.costPrice,
      img: product.img,
      quantity: 1, // Default quantity of 1 for the initial add
      discountedPrice: product.discountedPrice,
      costPrice: product.costPrice,
    };
  
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
  
        // Check if cart exists in user's document and if the product is already in the cart
        const existingCart = userData?.cart || [];
        const existingProduct = existingCart.find((item: any) => item.id === product.id);
  
        if (existingProduct) {
          // Update quantity if the product is already in the cart
          const updatedCart = existingCart.map((item: any) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 } // Increment quantity by 1
              : item
          );
  
          await updateDoc(userDocRef, {
            cart: updatedCart,
          });
  
          showSuccessToast('Product added to cart');
        } else {
          // Add new product if not already in cart
          await updateDoc(userDocRef, {
            cart: arrayUnion(cartItem),
          });
  
          showSuccessToast('Product added to cart');
        }
  
        // Add item to Redux state (if applicable)
        dispatch(addToCart(cartItem));
      } catch (error) {
        console.error("Error adding/updating item in cart: ", error);
      }
    }
  };
  

  const handleAddToWishlist = async (product: Product) => {
    if (!user) {
      showErrorToast('User Not Login!!!.');
      return;
    }
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.costPrice,
      img: product.img,
      discountedPrice: product.discountedPrice,
      costPrice: product.costPrice,
    };

    dispatch(addToWishlist(wishlistItem));
    showSuccessToast('Product added to wishlist');

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the logged-in user's document
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(product.id), // Add the product ID to the wishlist array
        });
        console.log("userDocRef", userDocRef)
        console.log("Product added to wishlist in Firebase");
      } catch (error) {
        console.error("Error adding product to wishlist: ", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {products.map(product => (
          <Card key={product.id} className='w-full'>
            <CardContent>
              <div className=''>
                <img src={product.img} alt={product.name} className="mt-2 w-full h-[150px] object-cover" />
              </div>
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <div className='text-xs text-gray-700'>
                <p>{product.description.slice(0, 100)}</p>
                <div className='gap-4 my-1 text-sm'>
                  <p className='flex items-center font-semibold'>
                    <LiaRupeeSignSolid className='text-bold' />{product.costPrice}
                    <span className='line-through flex items-center mx-2'>
                      <LiaRupeeSignSolid className='text-bold line-through' />{product.price}
                    </span>
                    <span className='text-green-800'>{product.discountedPrice}% off</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between gap-4'>
                <button onClick={() => handleAddToCart(product)} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-normal py-1 px-4 rounded">
                  Add to Cart
                </button>
                <FaRegHeart onClick={() => handleAddToWishlist(product)} className='mt-4' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;