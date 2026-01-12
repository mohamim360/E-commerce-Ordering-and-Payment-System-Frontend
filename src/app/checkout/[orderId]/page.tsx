// src/app/checkout/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Order } from '@/src/types';
import { orderAPI, paymentAPI } from '@/src/lib/api';
import AuthGuard from '@/src/components/AuthGuard';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Renders a Stripe payment form for the specified order and handles confirmation flow.
 *
 * Displays a Stripe PaymentElement and a submit button, disables submission while Stripe is unavailable or a payment is processing, shows an error toast when confirmation fails, and relies on Stripe to redirect to the configured return URL on success.
 *
 * @param orderId - The identifier of the order being paid
 * @param clientSecret - The Stripe PaymentIntent client secret used to initialize Elements
 * @returns The JSX element for the checkout payment form
 */
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
          return_url: `${window.location.origin}/orders?payment=success`,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed. Please try again.', {
          duration: 5000,
        });
        setLoading(false);
      }
      // If no error, Stripe will automatically redirect to return_url
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

/**
 * Renders the authenticated checkout page for a specific order, including order summary and Stripe payment flow.
 *
 * Displays a loading view while fetching the order, an "Order Not Found" view if the order or Stripe client secret is missing,
 * and the main checkout UI (order items, total, and payment form) when data is available. Fetches order data on mount and
 * initializes a Stripe payment session; surface errors are reported via toasts and navigation to the orders list on fetch failure.
 *
 * @returns The checkout page JSX wrapped with AuthGuard, showing either a loading state, a not-found view, or the full checkout layout with Stripe Elements and a CheckoutForm.
 */
export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
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
    } catch (error: any) {
      const errorMessage = error.userMessage || error.response?.data?.message || 'Failed to load order. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
      });
      router.push('/orders');
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
    } catch (error: any) {
      const errorMessage = error.userMessage || error.response?.data?.message || 'Failed to initialize payment. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!order || !clientSecret) {
    return (
      <AuthGuard requireAuth>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find this order. It may have been canceled or doesn't exist.</p>
            <button
              onClick={() => router.push('/orders')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth>
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
    </AuthGuard>
  );
}