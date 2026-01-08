'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Package, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Product } from '@/src/types';
import { useCartStore } from '@/src/lib/store';
import { productAPI } from '@/src/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate slight delay to show off skeleton (remove in production if needed)
      const { data } = await productAPI.getAll(page, 12);
      setProducts(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) return;
    addItem({ product, quantity: 1 });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Collection
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Browse our latest products and find your perfect match.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : (
            // Product Cards
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-600"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="px-4 py-1 text-sm font-medium text-gray-700">
                Page <span className="text-blue-600">{page}</span> of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-600"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for individual product card
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {/* Placeholder for missing image - replace with <img /> if you have URLs */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <Package size={48} strokeWidth={1} />
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              Sold Out
            </span>
          ) : (
             product.stock < 5 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                Low Stock
              </span>
             )
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {product.description || 'No description available for this item.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`
              p-3 rounded-xl flex items-center justify-center transition-all duration-200
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'}
            `}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for loading state
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}