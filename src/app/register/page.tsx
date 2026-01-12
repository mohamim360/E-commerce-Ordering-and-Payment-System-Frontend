/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/lib/store';
import { authAPI } from '@/src/lib/api';
import { Mail, Lock, User, AlertCircle, X } from 'lucide-react';

/**
 * Render the registration page with a sign-up form, client-side validation state,
 * per-field error display, and submission handling that registers a new user.
 *
 * The component redirects authenticated users to /products, calls the auth API on submit,
 * updates authentication state on success, and displays success or error toasts.
 *
 * @returns The registration page React element, or `null` when a user is already authenticated.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace('/products');
    }
  }, [user, router]);

  // Don't render form if already logged in
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const { data } = await authAPI.register(formData);
      setAuth(data.user, data.token);
      toast.success('Account created successfully!', {
        icon: '🎉',
        duration: 2000,
      });
      router.push('/products');
    } catch (error: any) {
      // Handle Zod validation errors with detailed field errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errors: Record<string, string> = {};
        error.response.data.errors.forEach((err: { field: string; message: string }) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
        // Also set general error message
        const errorMessage = error.response.data.message || 'Please fix the errors below';
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
        });
      } else {
        const errorMessage = error.userMessage || error.response?.data?.message || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join us and start shopping today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-4 rounded-lg relative">
                <button
                  onClick={clearError}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Close error"
                >
                  <X size={18} />
                </button>
                <div className="flex items-start space-x-3 pr-6">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Registration Error</p>
                    <p className="text-sm">{error}</p>
                    {Object.keys(fieldErrors).length > 0 && (
                      <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
                        {Object.entries(fieldErrors).map(([field, message]) => (
                          <li key={field}>{message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${fieldErrors.name ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                    fieldErrors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="John Doe (optional)"
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                    fieldErrors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                    fieldErrors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter a strong password"
                />
              </div>
              {fieldErrors.password ? (
                <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.password}</span>
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Must contain: 8+ characters, uppercase letter, number, special character
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}