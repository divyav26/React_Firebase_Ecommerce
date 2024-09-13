import { useDispatch, useSelector } from 'react-redux';
import {
  increment,
  decrement,
} from '@/redux/slice/CartSlice'; // Adjust import path based on your project structure
import Layout from '../layout/Layout';



const Cart = () => {

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items); // Adjust state type if needed

  

  const handleIncrement = (id: string) => {
    dispatch(increment(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrement(id));
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total: number, item: any) => total + item.discountedPrice * item.quantity, 0)
      .toFixed(2);
  };
  return (
    <Layout>
     <div className="bg-white h-[90vh] overflow-y-auto">
        <div className="w-full py-2 px-4 lg:px-2">
          <form className="mt-4">
            <div className="flex gap-6">
              <div className="w-[60%]">
                <h2 className="text-lg text-center">Items in your shopping cart</h2>
                <ul
                  role="list"
                  className="border-t border-b border-gray-200 divide-y divide-gray-200 border-2"
                >
                  {cartItems.map((item:any) => (
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-center object-cover sm:w-32 sm:h-32"
                        />
                      </div>
                      <div className="relative ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                        <div>
                          <div className="flex justify-between sm:grid sm:grid-cols-2 border-2 border-red-500">
                            <div className="pr-6">
                              <h3 className="text-sm">
                                <a
                                  href="#"
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {item.name}
                                </a>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.discountedPrice}% off
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900 text-right">
                              ${calculateTotalPrice()}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <button
                              type="button"
                              onClick={() => handleDecrement(item.id)}
                              className="px-2 py-1 border rounded-md"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(item.id)}
                              className="px-2 py-1 border rounded-md"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Order summary */}
              <div className="w-[40%]">
                <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
                  <h2 className="sr-only">Order summary</h2>
                  <div className="flow-root">
                    <dl className="-my-4 text-sm divide-y divide-gray-200">
                      <div className="py-4 flex items-center justify-between">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="font-medium text-gray-900">${calculateTotalPrice()}</dd>
                      </div>
                      <div className="py-4 flex items-center justify-between">
                        <dt className="text-gray-600">Shipping</dt>
                        <dd className="font-medium text-gray-900">$5.00</dd>
                      </div>
                      <div className="py-4 flex items-center justify-between">
                        <dt className="text-gray-600">Tax</dt>
                        <dd className="font-medium text-gray-900">$8.32</dd>
                      </div>
                      <div className="py-4 flex items-center justify-between">
                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                        <dd className="text-base font-medium text-gray-900">
                          ${(parseFloat(calculateTotalPrice()) + 5 + 8.32).toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    Checkout
                  </button>
                </div>
                <div className="mt-6 text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
