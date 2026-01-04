// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore, useCartStore } from '../lib/store';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ShopHub
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin/products" className="text-gray-700 hover:text-blue-600">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/orders"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <Package size={20} />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 relative"
                >
                  <ShoppingCart size={20} />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm">{user.name || user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}