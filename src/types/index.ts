// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  categoryId?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: 'STRIPE' | 'BKASH';
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}