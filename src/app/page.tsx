import Link from 'next/link';
import { ShoppingBag, TrendingUp, Shield, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Render the ShopHub homepage layout including a gradient hero, feature cards, and a call-to-action section.
 *
 * @returns The JSX structure for the ShopHub homepage containing the hero (with CTAs), a three-card features grid, and a bottom CTA.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Welcome to ShopHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Your one-stop destination for quality products at amazing prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Browse Products
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700/50 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-blue-700/70 transition-all border-2 border-white/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose ShopHub?
          </h2>
          <p className="text-gray-600 text-lg">
            Experience shopping like never before
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <ShoppingBag className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Wide Selection</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse through our extensive collection of products from various categories. Find exactly what you're looking for.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Best Prices</h3>
            <p className="text-gray-600 leading-relaxed">
              Get the best deals with our competitive pricing. We ensure you get value for every dollar spent.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 transition-transform">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <Shield className="text-purple-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600 leading-relaxed">
              Shop with confidence. We offer multiple secure payment options with encrypted transactions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of satisfied customers and discover amazing products today
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Explore Products
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}