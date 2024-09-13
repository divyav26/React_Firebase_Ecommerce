import React, { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Product {
  name: string;
  description: string;
  quantity: number;
  category: string;
  brand: string;
  price: number;
  discountedPrice: number;
  costPrice: number;
  img: File | null;
}

const AddProducts: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    quantity: 0,
    category: '',
    brand: '',
    price: 0,
    discountedPrice: 0,
    costPrice: 0,
    img: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      setProduct({
        ...product,
        [name]: files ? files[0] : null,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageUrl = '';

      if (product.img) {
        console.log('Selected image file:', product.img);
        const storage = getStorage();
        const storageRef = ref(storage, `product-images/${product.img.name}`);
        await uploadBytes(storageRef, product.img);
        imageUrl = await getDownloadURL(storageRef);
        console.log('Image uploaded, URL:', imageUrl);
      }

      const docRef = await addDoc(collection(db, 'products'), {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        category: product.category,
        brand: product.brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        costPrice: product.costPrice,
        img: imageUrl,  // Store the image URL in Firestore
      });

      console.log('Product added successfully with ID:', docRef.id);
      toast.success('Product added successfully!');

      // Reset the form after successful submission
      setProduct({
        name: '',
        description: '',
        quantity: 0,
        category: '',
        brand: '',
        price: 0,
        discountedPrice: 0,
        costPrice: 0,
        img: null,
      });

    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Add New Product</h2>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quantity"
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Enter product quantity"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter product category"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
            Brand
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="brand"
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            placeholder="Enter product brand"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountedPrice">
            Discounted Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="discountedPrice"
            type="number"
            name="discountedPrice"
            value={product.discountedPrice}
            onChange={handleChange}
            placeholder="Enter discounted price"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costPrice">
            Cost Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="costPrice"
            type="number"
            name="costPrice"
            value={product.costPrice}
            onChange={handleChange}
            placeholder="Enter cost price"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="img">
            Product Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="img"
            type="file"
            name="img"
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
