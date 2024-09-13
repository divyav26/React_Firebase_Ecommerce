import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, addDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseConfig';
import { Card, CardContent } from '@/components/ui/card';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slice/CartSlice';

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;  // Changed to number for consistency
  category: string;
  brand: string;
  price: number;  // Changed to number for consistency
  discountedPrice: number;  // Changed to number for consistency
  costPrice: number;  // Changed to number for consistency
  img: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;  // Changed to number for consistency
  img: string;
  quantity: number;  // Changed to number for consistency
  discountedPrice: number;  // Changed to number for consistency
  costPrice: number;  // Changed to number for consistency
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const saveCartToFirebase = async (cartItem: CartItem) => {
    try {
      const cartCollection = collection(db, 'cart');
      const existingCartItemQuery = query(cartCollection, where("id", "==", cartItem.id));
      const existingCartItemSnapshot = await getDocs(existingCartItemQuery);

      if (!existingCartItemSnapshot.empty) {
        // If the item exists, update its quantity
        const cartDocId = existingCartItemSnapshot.docs[0].id;
        const existingCartItemData = existingCartItemSnapshot.docs[0].data();
        await updateDoc(doc(cartCollection, cartDocId), {
          quantity: existingCartItemData.quantity + 1, // Updated to use number type
        });
      } else {
        // If the item doesn't exist, add it to the collection
        await addDoc(cartCollection, cartItem);
      }

      console.log('Cart item saved or updated in Firebase');
    } catch (error) {
      console.error('Error saving or updating cart item in Firebase:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.costPrice,
      img: product.img,
      quantity: 1, // Start with quantity 1, type number
      discountedPrice: product.discountedPrice,
      costPrice: product.costPrice,
    };

    dispatch(addToCart(cartItem));
    saveCartToFirebase(cartItem);
  };

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
          <Card key={product.id}>
            <CardContent>
              <div>
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
              <button onClick={() => handleAddToCart(product)} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-normal py-1 px-4 rounded">
                Add to Cart
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
