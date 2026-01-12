// src/lib/api.ts
import axios from 'axios';
import type { AuthResponse, User, Product, Order, Category, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      error.userMessage = message;
    } else if (error.request) {
      // Request was made but no response received
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      error.userMessage = error.message || 'An unexpected error occurred';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get<User>('/users/me'),
};

// Product APIs
export const productAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Product>>('/products', { params: { page, limit } }),
  
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  
  create: (data: Partial<Product>) =>
    api.post<Product>('/products', data),
  
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/products/${id}`),
  
  getRecommendations: (productId: string) =>
    api.get<Product[]>(`/products/${productId}/recommendations`),
};

// Category APIs
export const categoryAPI = {
  create: (data: { name: string; parentId?: string }) =>
    api.post<Category>('/categories', data),
  
  getSubtree: (id: string) =>
    api.get<string[]>(`/categories/${id}/subtree`),
};

// Order APIs
export const orderAPI = {
  create: (data: { items: Array<{ productId: string; quantity: number }> }) =>
    api.post<Order>('/orders', data),
  
  getAll: () => api.get<Order[]>('/orders'),
  
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
};

// Payment APIs
export const paymentAPI = {
  checkout: (data: { orderId: string; provider: 'STRIPE' | 'BKASH' }) =>
    api.post('/payments/checkout', data),
  
  executeBkash: (paymentID: string) =>
    api.post('/api/v1/payments/bkash/execute', { paymentID }),
  
  queryBkash: (transactionId: string) =>
    api.get(`/api/v1/payments/bkash/query/${transactionId}`),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => api.get<User[]>('/admin/users'),
};

export default api;