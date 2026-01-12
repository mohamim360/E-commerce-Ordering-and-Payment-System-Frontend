// src/app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, CheckCircle, Clock, XCircle, RefreshCw, Package } from 'lucide-react';
import { Order } from '@/src/types';
import { orderAPI } from '@/src/lib/api';
import AuthGuard from '@/src/components/AuthGuard';

export default function OrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		// Check if redirected from payment completion
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			if (params.get('payment') === 'success') {
				toast.success('Payment completed successfully!', {
					icon: '✅',
					duration: 4000,
				});
				// Remove query param from URL
				window.history.replaceState({}, '', '/orders');
			}
		}
		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchOrders = async () => {
		setRefreshing(true);
		try {
			const { data } = await orderAPI.getAll();
			setOrders(data);
		} catch (error: unknown) {
			const errorMessage = (error as { userMessage?: string; response?: { data?: { message?: string } } }).userMessage
				|| (error as { response?: { data?: { message?: string } } }).response?.data?.message
				|| 'Failed to load orders. Please try again.';
			toast.error(errorMessage, {
				duration: 5000,
			});
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'PAID':
				return {
					bg: 'bg-green-100 text-green-800 border-green-200',
					icon: <CheckCircle size={16} className="text-green-600" />,
					label: 'Paid'
				};
			case 'PENDING':
				return {
					bg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
					icon: <Clock size={16} className="text-yellow-600" />,
					label: 'Pending Payment'
				};
			case 'CANCELED':
				return {
					bg: 'bg-red-100 text-red-800 border-red-200',
					icon: <XCircle size={16} className="text-red-600" />,
					label: 'Canceled'
				};
			default:
				return {
					bg: 'bg-gray-100 text-gray-800 border-gray-200',
					icon: null,
					label: status
				};
		}
	};

	if (loading) {
		return (
			<AuthGuard requireAuth>
				<div className="max-w-6xl mx-auto px-4 py-12">
					<div className="text-center py-16">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
						<p className="text-gray-600">Loading your orders...</p>
					</div>
				</div>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard requireAuth>
			<div className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
					<button
						onClick={fetchOrders}
						disabled={refreshing}
						className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
						<span>Refresh</span>
					</button>
				</div>

				{orders.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-lg shadow-sm">
						<Package size={64} className="mx-auto text-gray-400 mb-4" />
						<h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
						<p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
						<button
							onClick={() => router.push('/products')}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Browse Products
						</button>
					</div>
				) : (

					<div className="space-y-4">
						{orders.map((order) => {
							const statusConfig = getStatusConfig(order.status);
							return (
								<div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
									<div
										className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
										onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
									>
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-4 mb-3">
													<span className="font-bold text-lg text-gray-900">
														Order #{order.orderNumber || order.id.slice(0, 8)}
													</span>
													<span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${statusConfig.bg}`}>
														{statusConfig.icon}
														<span>{statusConfig.label}</span>
													</span>
												</div>
												<div className="text-sm text-gray-500">
													Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit',
													})}
												</div>
											</div>
											<div className="flex items-center space-x-6">
												<div className="text-right">
													<div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</div>
													<div className="text-2xl font-bold text-blue-600">
														${Number(order.totalAmount).toFixed(2)}
													</div>
												</div>
												{expandedOrder === order.id ? (
													<ChevronUp className="text-gray-400" size={24} />
												) : (
													<ChevronDown className="text-gray-400" size={24} />
												)}
											</div>
										</div>
									</div>

									{expandedOrder === order.id && (
										<div className="border-t px-6 py-5 bg-gray-50">
											<h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
											<div className="space-y-3 mb-4">
												{order.items.map((item) => (
													<div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
														<div className="flex-1">
															<span className="font-medium text-gray-900">{item.product?.name || 'Product'}</span>
															<span className="text-gray-500 ml-2">x {item.quantity}</span>
															{item.product?.sku && (
																<div className="text-xs text-gray-400 mt-1">SKU: {item.product.sku}</div>
															)}
														</div>
														<span className="font-semibold text-gray-900">
															${(Number(item.price) * item.quantity).toFixed(2)}
														</span>
													</div>
												))}
											</div>
											<div className="flex justify-between items-center pt-3 border-t border-gray-300">
												<span className="text-gray-600 font-medium">Subtotal:</span>
												<span className="font-semibold">${Number(order.subtotal || order.totalAmount).toFixed(2)}</span>
											</div>
											<div className="flex justify-between items-center pt-2">
												<span className="text-lg font-bold text-gray-900">Total:</span>
												<span className="text-xl font-bold text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</AuthGuard>
	);
}