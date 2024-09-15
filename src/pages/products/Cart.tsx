import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import { increment, decrement, clearCart } from '@/redux/slice/CartSlice';
import { showSuccessToast, showErrorToast } from '@/commanComponents/CommanToast';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  discountedPrice: number;
}

interface Coupon {
  name: string;
  code: string;
  discount: number;
  minPurchasesAmount: number;
}

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch coupons from Firestore
  const fetchCoupons = async () => {
    try {
      const couponsCollection = collection(db, 'Coupon');
      const couponsSnapshot = await getDocs(couponsCollection);
      const couponsList = couponsSnapshot.docs.map((doc) => doc.data() as Coupon);

      // Filter coupons with discount greater than 23%
      const validCoupons = couponsList.filter((coupon) => coupon.discount > 23);
      setCoupons(validCoupons);
    } catch (error) {
      console.error('Error fetching coupons: ', error);
      setError('Failed to fetch coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleIncrement = (id: string) => {
    dispatch(increment(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrement(id));
  };

  const handleApplyCoupon = (code: string) => {
    const selectedCoupon = coupons.find((coupon) => coupon.code === code);

    if (!selectedCoupon) {
      showErrorToast('Invalid coupon code.');
      return;
    }

    const totalAmount = cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

    if (totalAmount >= selectedCoupon.minPurchasesAmount) {
      setAppliedCoupon(selectedCoupon);
      showSuccessToast(`Coupon "${selectedCoupon.name}" applied successfully!`);
    } else {
      showErrorToast(`Minimum purchase amount for this coupon is ${selectedCoupon.minPurchasesAmount}`);
    }
  };

  const calculateTotalPrice = () => {
    const subtotal = cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const shipping = 5;
    const tax = 8.32;

    return (subtotal - discount + shipping + tax).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!user) {
      showErrorToast("User not authenticated.");
      return;
    }

    const userId = user.uid;
    const order_id = doc(collection(db, 'Orders')).id;  // Generate a new order ID

    const order = {
      order_id,
      date: new Date().toISOString(),
      total_items: cartItems.length,
      final_price: calculateTotalPrice(),
      products: cartItems,
      discount: appliedCoupon ? appliedCoupon.discount : 0,
      coupon_id: appliedCoupon ? appliedCoupon.code : ''
    };

    try {
      // 1. Save the order in the Orders collection
      await setDoc(doc(db, 'Orders', order_id), order);

      // 2. Add the order reference to the user's document
      const userRef = doc(db, 'users', userId);

      // Check if the user document exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // If not, create it with an empty orders array
        await setDoc(userRef, { orders: [] });
      }

      // Debug: Log the cart data before clearing
      console.log('Before clearing, cart in Firebase:', userDoc.data()?.cart);

      // Update the user's orders array and clear the cart
      await updateDoc(userRef, {
        orders: arrayUnion({
          order_id,
          date: order.date,
          total_items: order.total_items,
          final_price: order.final_price
        }),
        cart: []  // Clear the cart in Firebase
      });

      // Debug: Fetch and log the cart data after clearing
      const updatedUserDoc = await getDoc(userRef);
      console.log('After clearing, cart in Firebase:', updatedUserDoc.data()?.cart);

      // 3. Clear the cart in Redux after successful checkout
      dispatch(clearCart());

      // 4. Redirect to the order confirmation page
      navigate(`/order/${order_id}`);

      // 5. Show success toast
      showSuccessToast('Order placed successfully! Cart has been cleared.');
      
    } catch (error) {
      console.error("Error placing the order: ", error);
      showErrorToast("Failed to place the order.");
    }
  };

  return (
    <Layout>
      {
        cartItems.length === 0 ?
          (<div className='h-screen flex flex-col justify-center items-center'>
            <img src='https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-10681467-8593283.png' alt='empty cart' className='w-[300px] h-[300px] object-cover' /> 
            <h2 className='text-2xl font-bold mt-4 text-red-800'>Your cart is empty.</h2>
          </div>)
          : (
            <div className="bg-white h-[90vh] overflow-y-auto">
            <div className="w-full py-2 px-4 lg:px-2">
              <form className="mt-4">
                <div className="flex gap-6">
                  {/* Cart Items */}
                  <div className="w-[60%]">
                    <h2 className="text-lg text-center">Items in your shopping cart</h2>
                    <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                      {cartItems.map((item: CartItem) => (
                        <li key={item.id} className="flex py-6 sm:py-10">
                          <div className="flex-shrink-0">
                            <img src={item.img} alt={item.name} className="w-24 h-24 rounded-lg object-center object-cover" />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <div className="pr-6">
                                  <h3 className="text-sm font-medium">{item.name}</h3>
                                  <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                                  <p className="mt-1 text-sm text-gray-500">{item.discountedPrice}% off</p>
                                </div>
                                <p className="text-sm font-medium text-red-900 text-right">${item.price * item.quantity}</p>
                              </div>
                              <div className="flex items-center mt-2">
                                <button type="button" onClick={() => handleDecrement(item.id)} className="px-2 py-1 border rounded-md">-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button type="button" onClick={() => handleIncrement(item.id)} className="px-2 py-1 border rounded-md">+</button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
    
                  {/* Order Summary */}
                  <div className="w-[40%]">
                    <h3 className="text-lg font-medium">Order Summary</h3>
                    <p>Subtotal: ${calculateTotalPrice()}</p>
                    <p>Shipping: $5</p>
                    <p>Tax: $8.32</p>
                    <p>Total: ${calculateTotalPrice()}</p>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </form>
    
              {/* Coupons Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Available Coupons</h3>
                {loading ? (
                  <p>Loading coupons...</p>
                ) : (
                  <ul>
                    {coupons.map((coupon: Coupon) => (
                      <li key={coupon.code} className="mb-2">
                        <div className="flex justify-between items-center">
                          <p>
                            <strong>{coupon.name}</strong>: {coupon.discount}% off, min purchase: {coupon.minPurchasesAmount}
                          </p>
                          <button
                            onClick={() => handleApplyCoupon(coupon.code)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-md"
                          >
                            Apply
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {error && <p className="text-red-600">{error}</p>}
              </div>
            </div>
          </div>
          )
      }
     
    </Layout>
  );
};

export default Cart;
