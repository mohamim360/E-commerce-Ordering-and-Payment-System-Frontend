// src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
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
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    addItem({ product, quantity: 1 });
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description || 'No description'}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}