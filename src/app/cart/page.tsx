'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuthStore, useCartStore } from '@/src/lib/store';
import { orderAPI } from '@/src/lib/api';

/**
 * Renders the shopping cart page with item list, order summary, and checkout controls.
 *
 * Displays an empty-cart call-to-action when there are no items; otherwise shows cart items with quantity controls, per-item totals, removal actions, and an order summary with subtotal, shipping, and total. The checkout control validates authentication and cart contents, creates an order via the API, clears the cart on success, shows toast notifications for success or failure, and navigates to the checkout page for the created order.
 *
 * @returns The React element for the cart page UI.
 */
export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout', {
        duration: 3000,
      });
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
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
      toast.success('Order created successfully! Redirecting to checkout...', {
        icon: '✅',
        duration: 2000,
      });
      router.push(`/checkout/${data.id}`);
    } catch (error: any) {
      const errorMessage = error.userMessage || error.response?.data?.message || 'Failed to create order. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <ShoppingCart className="text-blue-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet
            </p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse Products
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {items.map((item, index) => (
                <div 
                  key={item.product.id} 
                  className={`flex items-center p-6 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="text-gray-400" size={32} />
                  </div>
                  
                  <div className="ml-6 flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.product.description || 'No description available'}
                    </p>
                    <p className="text-blue-600 font-semibold text-lg">${Number(item.product.price).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-3 mx-6">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right mx-6">
                    <p className="text-lg font-bold text-gray-900">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      removeItem(item.product.id);
                      toast.success('Item removed from cart');
                    }}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${total().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please <button onClick={() => router.push('/login')} className="font-semibold underline">login</button> to checkout
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || !user}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full mt-3 text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}