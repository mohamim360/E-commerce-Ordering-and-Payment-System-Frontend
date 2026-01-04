/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Product } from '@/src/types';
import { productAPI } from '@/src/lib/api';

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		sku: '',
		price: 0,
		stock: 0,
		status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const { data } = await productAPI.getAll(1, 100);
			setProducts(data.data);
		} catch (error) {
			toast.error('Failed to load products');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingProduct) {
				await productAPI.update(editingProduct.id, formData);
				toast.success('Product updated successfully');
			} else {
				await productAPI.create(formData);
				toast.success('Product created successfully');
			}
			setShowModal(false);
			resetForm();
			fetchProducts();
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Operation failed');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this product?')) return;

		try {
			await productAPI.delete(id);
			toast.success('Product deleted successfully');
			fetchProducts();
		} catch (error) {
			toast.error('Failed to delete product');
		}
	};

	const openCreateModal = () => {
		resetForm();
		setEditingProduct(null);
		setShowModal(true);
	};

	const openEditModal = (product: Product) => {
		setEditingProduct(product);
		setFormData({
			name: product.name,
			description: product.description || '',
			sku: product.sku,
			price: Number(product.price),
			stock: product.stock,
			status: product.status,
		});
		setShowModal(true);
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			sku: '',
			price: 0,
			stock: 0,
			status: 'ACTIVE',
		});
	};

	if (loading) {
		return <div className="text-center py-12">Loading...</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-12">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Manage Products</h1>
				<button
					onClick={openCreateModal}
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
				>
					<Plus size={20} />
					<span>Add Product</span>
				</button>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{products.map((product) => (
							<tr key={product.id}>
								<td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
								<td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
								<td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className={`px-2 py-1 rounded-full text-xs ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
										}`}>
										{product.status}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
									<button
										onClick={() => openEditModal(product)}
										className="text-blue-600 hover:text-blue-800"
									>
										<Pencil size={18} />
									</button>
									<button
										onClick={() => handleDelete(product.id)}
										className="text-red-600 hover:text-red-800"
									>
										<Trash2 size={18} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-8 max-w-md w-full">
						<h2 className="text-2xl font-bold mb-4">
							{editingProduct ? 'Edit Product' : 'Create Product'}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								placeholder="Product Name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								className="w-full px-4 py-2 border rounded-md"
								required
							/>
							<textarea
								placeholder="Description"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="w-full px-4 py-2 border rounded-md"
								rows={3}
							/>
							<input
								type="text"
								placeholder="SKU"
								value={formData.sku}
								onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
								className="w-full px-4 py-2 border rounded-md"
								required
							/>
							<input
								type="number"
								placeholder="Price"
								value={formData.price}
								onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
								className="w-full px-4 py-2 border rounded-md"
								step="0.01"
								required
							/>
							<input
								type="number"
								placeholder="Stock"
								value={formData.stock}
								onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
								className="w-full px-4 py-2 border rounded-md"
								required
							/>
							<select
								value={formData.status}
								onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
								className="w-full px-4 py-2 border rounded-md"
							>
								<option value="ACTIVE">Active</option>
								<option value="INACTIVE">Inactive</option>
							</select>
							<div className="flex space-x-2">
								<button
									type="submit"
									className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
								>
									{editingProduct ? 'Update' : 'Create'}
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}