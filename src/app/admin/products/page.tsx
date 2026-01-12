/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, X, Package, AlertCircle } from 'lucide-react';
import { Product } from '@/src/types';
import { productAPI } from '@/src/lib/api';
import AuthGuard from '@/src/components/AuthGuard';

/**
 * Renders the admin products management page with product listing, creation, editing, and deletion via a modal form, including inline field validation and toast feedback.
 *
 * @returns The rendered admin products management UI.
 */
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
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [submitLoading, setSubmitLoading] = useState(false);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const { data } = await productAPI.getAll(1, 100);
			setProducts(data.data);
		} catch (error: any) {
			const errorMessage = error.userMessage || error.response?.data?.message || 'Failed to load products. Please try again.';
			toast.error(errorMessage, {
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});
		setSubmitLoading(true);
		
		try {
			if (editingProduct) {
				await productAPI.update(editingProduct.id, formData);
				toast.success('Product updated successfully!', {
					icon: '✅',
					duration: 3000,
				});
			} else {
				await productAPI.create(formData);
				toast.success('Product created successfully!', {
					icon: '✅',
					duration: 3000,
				});
			}
			setShowModal(false);
			resetForm();
			fetchProducts();
		} catch (error: any) {
			// Handle Zod validation errors
			if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
				const errors: Record<string, string> = {};
				error.response.data.errors.forEach((err: { field: string; message: string }) => {
					errors[err.field] = err.message;
				});
				setFieldErrors(errors);
			}
			const errorMessage = error.userMessage || error.response?.data?.message || 'Operation failed. Please try again.';
			toast.error(errorMessage, {
				duration: 5000,
			});
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this product?')) return;

		try {
			await productAPI.delete(id);
			toast.success('Product deleted successfully!', {
				icon: '✅',
				duration: 3000,
			});
			fetchProducts();
		} catch (error: any) {
			const errorMessage = error.userMessage || error.response?.data?.message || 'Failed to delete product. Please try again.';
			toast.error(errorMessage, {
				duration: 5000,
			});
		}
	};

	const openCreateModal = () => {
		resetForm();
		setEditingProduct(null);
		setFieldErrors({});
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
		setFieldErrors({});
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
		setFieldErrors({});
	};

	const closeModal = () => {
		setShowModal(false);
		resetForm();
		setEditingProduct(null);
	};

	return (
		<AuthGuard requireAuth requireAdmin>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
						<div className="mb-4 sm:mb-0">
							<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
								Manage Products
							</h1>
							<p className="text-gray-600">
								Create, edit, and manage your product catalog
							</p>
						</div>
						<button
							onClick={openCreateModal}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
						>
							<Plus size={20} />
							<span>Add Product</span>
						</button>
					</div>

					{/* Products Table */}
					{loading ? (
						<div className="bg-white rounded-xl shadow-md p-12 text-center">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
							<p className="text-gray-600">Loading products...</p>
						</div>
					) : products.length === 0 ? (
						<div className="bg-white rounded-xl shadow-md p-12 text-center">
							<Package size={64} className="mx-auto text-gray-400 mb-4" />
							<h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
							<p className="text-gray-500 mb-6">Get started by creating your first product</p>
							<button
								onClick={openCreateModal}
								className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 mx-auto shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
							>
								<Plus size={20} />
								<span>Add Your First Product</span>
							</button>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-md overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SKU</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
											<th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{products.map((product) => (
											<tr key={product.id} className="hover:bg-gray-50 transition-colors">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">{product.name}</div>
													{product.description && (
														<div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 font-mono">{product.sku}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-semibold text-gray-900">${Number(product.price).toFixed(2)}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
														{product.stock}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
														product.status === 'ACTIVE' 
															? 'bg-green-100 text-green-800' 
															: 'bg-red-100 text-red-800'
													}`}>
														{product.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<div className="flex items-center justify-end space-x-3">
														<button
															onClick={() => openEditModal(product)}
															className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
															aria-label="Edit product"
														>
															<Pencil size={18} />
														</button>
														<button
															onClick={() => handleDelete(product.id)}
															className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
															aria-label="Delete product"
														>
															<Trash2 size={18} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Modal */}
					{showModal && (
						<div 
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
							onClick={closeModal}
						>
							<div 
								className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Modal Header */}
								<div className="flex items-center justify-between p-6 border-b border-gray-200">
									<h2 className="text-2xl font-bold text-gray-900">
										{editingProduct ? 'Edit Product' : 'Create Product'}
									</h2>
									<button
										onClick={closeModal}
										className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
										aria-label="Close modal"
									>
										<X size={24} />
									</button>
								</div>

								{/* Modal Body */}
								<form onSubmit={handleSubmit} className="p-6 space-y-5">
									{/* Name */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Product Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											placeholder="Enter product name"
											value={formData.name}
											onChange={(e) => {
												setFormData({ ...formData, name: e.target.value });
												if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
											}}
											className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
												fieldErrors.name
													? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
													: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
											}`}
											required
										/>
										{fieldErrors.name && (
											<p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
												<AlertCircle size={12} />
												<span>{fieldErrors.name}</span>
											</p>
										)}
									</div>

									{/* Description */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Description
										</label>
										<textarea
											placeholder="Enter product description (optional)"
											value={formData.description}
											onChange={(e) => {
												setFormData({ ...formData, description: e.target.value });
												if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: '' });
											}}
											className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors resize-none ${
												fieldErrors.description
													? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
													: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
											}`}
											rows={3}
										/>
										{fieldErrors.description && (
											<p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
												<AlertCircle size={12} />
												<span>{fieldErrors.description}</span>
											</p>
										)}
									</div>

									{/* SKU */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											SKU <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											placeholder="Enter SKU"
											value={formData.sku}
											onChange={(e) => {
												setFormData({ ...formData, sku: e.target.value });
												if (fieldErrors.sku) setFieldErrors({ ...fieldErrors, sku: '' });
											}}
											className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors font-mono ${
												fieldErrors.sku
													? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
													: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
											}`}
											required
										/>
										{fieldErrors.sku && (
											<p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
												<AlertCircle size={12} />
												<span>{fieldErrors.sku}</span>
											</p>
										)}
									</div>

									{/* Price and Stock Row */}
									<div className="grid grid-cols-2 gap-4">
										{/* Price */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Price <span className="text-red-500">*</span>
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
												<input
													type="number"
													placeholder="0.00"
													value={formData.price || ''}
													onChange={(e) => {
														setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
														if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: '' });
													}}
													className={`w-full pl-7 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
														fieldErrors.price
															? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
															: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
													}`}
													step="0.01"
													min="0"
													required
												/>
											</div>
											{fieldErrors.price && (
												<p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
													<AlertCircle size={12} />
													<span>{fieldErrors.price}</span>
												</p>
											)}
										</div>

										{/* Stock */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Stock <span className="text-red-500">*</span>
											</label>
											<input
												type="number"
												placeholder="0"
												value={formData.stock || ''}
												onChange={(e) => {
													setFormData({ ...formData, stock: parseInt(e.target.value) || 0 });
													if (fieldErrors.stock) setFieldErrors({ ...fieldErrors, stock: '' });
												}}
												className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
													fieldErrors.stock
														? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
														: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
												}`}
												min="0"
												required
											/>
											{fieldErrors.stock && (
												<p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
													<AlertCircle size={12} />
													<span>{fieldErrors.stock}</span>
												</p>
											)}
										</div>
									</div>

									{/* Status */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Status
										</label>
										<select
											value={formData.status}
											onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										>
											<option value="ACTIVE">Active</option>
											<option value="INACTIVE">Inactive</option>
										</select>
									</div>

									{/* Modal Footer */}
									<div className="flex space-x-3 pt-4 border-t border-gray-200">
										<button
											type="button"
											onClick={closeModal}
											className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={submitLoading}
											className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
										>
											{submitLoading ? (
												<span className="flex items-center justify-center">
													<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
													{editingProduct ? 'Updating...' : 'Creating...'}
												</span>
											) : (
												editingProduct ? 'Update Product' : 'Create Product'
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</AuthGuard>
	);
}