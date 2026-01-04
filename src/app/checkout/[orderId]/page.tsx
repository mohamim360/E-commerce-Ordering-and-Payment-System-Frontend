// src/app/checkout/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Order } from '@/src/types';
import { orderAPI, paymentAPI } from '@/src/lib/api';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ orderId, clientSecret }: { orderId: string; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else {
        toast.success('Payment successful!');
        router.push('/orders');
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getById(orderId);
      setOrder(data);
      await initiatePayment(data.id);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (orderId: string) => {
    try {
      const { data } = await paymentAPI.checkout({
        orderId,
        provider: 'STRIPE',
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error('Failed to initialize payment');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order || !clientSecret) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.product?.name} x {item.quantity}</span>
              <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
}