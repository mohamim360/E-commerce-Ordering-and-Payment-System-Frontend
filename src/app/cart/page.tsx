// src/app/cart/page.tsx
'use client';


import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuthStore, useCartStore } from '@/src/lib/store';
import { orderAPI } from '@/src/lib/api';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const { data } = await orderAPI.create(orderData);
      clearCart();
      toast.success('Order created successfully!');
      router.push(`/checkout/${data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center border-b py-4 last:border-b-0">
            <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
            
            <div className="ml-4 flex-grow">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="ml-6 font-semibold w-24 text-right">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(item.product.id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between text-xl font-bold mb-6">
          <span>Total:</span>
          <span className="text-blue-600">${total().toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}