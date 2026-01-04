// src/app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/src/types';
import { orderAPI } from '@/src/lib/api';

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const { data } = await orderAPI.getAll();
			setOrders(data);
		} catch (error) {
			toast.error('Failed to load orders');
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'PAID':
				return 'bg-green-100 text-green-800';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'CANCELED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-12">
				<div className="text-center">Loading orders...</div>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-12">
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
					<p className="text-gray-600">Start shopping to see your orders here</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-8">My Orders</h1>

			<div className="space-y-4">
				{orders.map((order) => (
					<div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
						<div
							className="p-6 cursor-pointer hover:bg-gray-50"
							onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
						>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-4 mb-2">
										<span className="font-semibold">Order #{order.id.slice(0, 8)}</span>
										<span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
											{order.status}
										</span>
									</div>
									<div className="text-sm text-gray-600">
										{new Date(order.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="text-right">
										<div className="text-sm text-gray-600">Total</div>
										<div className="text-xl font-bold text-blue-600">
											${Number(order.totalAmount).toFixed(2)}
										</div>
									</div>
									{expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
								</div>
							</div>
						</div>

						{expandedOrder === order.id && (
							<div className="border-t px-6 py-4 bg-gray-50">
								<h3 className="font-semibold mb-3">Order Items</h3>
								<div className="space-y-2">
									{order.items.map((item) => (
										<div key={item.id} className="flex justify-between items-center">
											<div>
												<span className="font-medium">{item.product?.name || 'Product'}</span>
												<span className="text-gray-600"> x {item.quantity}</span>
											</div>
											<span className="font-semibold">
												${(Number(item.price) * item.quantity).toFixed(2)}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}