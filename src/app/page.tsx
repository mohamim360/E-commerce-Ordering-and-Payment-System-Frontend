// src/app/page.tsx
import Link from 'next/link';
import { ShoppingBag, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to ShopHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your one-stop shop for quality products
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-block"
        >
          Browse Products
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <ShoppingBag className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            Browse through our extensive collection of products
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
          <p className="text-gray-600">
            Competitive pricing on all our products
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Shield className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-gray-600">
            Multiple payment options with secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}