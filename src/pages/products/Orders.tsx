// src/pages/OrderPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseConfig'; // Adjust Firebase import path
import Layout from '../layout/Layout';

interface CartItem {
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
  final_price: number;
  products: CartItem[];
  discount: number;
  coupon_id: string;
}

const Orders= () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'Orders', orderId!));
        if (orderDoc.exists()) {
          setOrder(orderDoc.data() as Order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Order ID: {order.order_id}</h3>
          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          <p>Total Items: {order.total_items}</p>
          <p>Final Price: ${order.final_price}</p>
          {order.discount > 0 && (
            <p>Discount Applied: {order.discount}%</p>
          )}
          {order.coupon_id && (
            <p>Coupon Code: {order.coupon_id}</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Products in Your Order</h3>
          <ul role="list" className="divide-y divide-gray-200">
            {order.products.map((item) => (
              <li key={item.id} className="flex py-4">
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-center object-cover" />
                <div className="ml-4">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                  <p className="text-sm text-gray-900">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <a href="/" className="text-indigo-600 font-medium">Continue Shopping</a>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
