import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import Layout from '../layout/Layout';
import { showErrorToast } from '@/commanComponents/CommanToast';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  discountedPrice: number;
}

interface Order {
  order_id: string;
  date: string;
  total_items: number;
  final_price: string;
  products: OrderItem[];
  discount: number;
  coupon_id: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;
  console.log('user orders', user);

  const fetchOrders = async () => {
    if (!user) {
      showErrorToast("User not authenticated.");
      return;
    }

    try {
      console.log('Fetching orders for user:', user.uid);
      const userRef = doc(db, 'users', user.uid);  // Check if path is correct
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log('No user document found.');
        setError("No user data found.");
        return;
      }

      const userData = userDoc.data();
      console.log('User data:', userData);

      if (userData && userData.orders && Array.isArray(userData.orders)) {
        const ordersList = userData.orders as Order[];
        console.log('Orders list:', ordersList); // Check if ordersList is valid
        setOrders(ordersList);
      } else {
        console.log('No orders found in user data.');
        setError('No orders found.');
      }
    } catch (error) {
      console.error('Error fetching orders: ', error);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      showErrorToast('User not authenticated.');
    }
  }, [user]);

  return (
    <Layout>
      <div className="bg-white h-[90vh] overflow-y-auto p-4">
        <h2 className="text-lg font-medium text-center mb-4">Order History</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.order_id} className="border border-gray-200 p-4 rounded-md">
                <h3 className="text-xl font-semibold">Order ID: {order.order_id}</h3>
                <p className="text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className="text-gray-500">Total Items: {order.total_items}</p>
                <p className="text-gray-500">Final Price: ${order.final_price}</p>
               
              </li>
            ))}
          </ul>
        )}
      </div>    
    </Layout>
  );
};

export default OrderHistory;
