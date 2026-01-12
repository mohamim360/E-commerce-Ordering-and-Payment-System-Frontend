'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/lib/store';
import { authAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, token, setAuth, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!requireAuth) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      if (!token) {
        toast.error('Please login to access this page');
        router.push('/login');
        setIsChecking(false);
        return;
      }

      try {
        // Verify token is still valid by fetching user data
        const { data } = await authAPI.getMe();
        setAuth(data, token);
        
        if (requireAdmin && data.role !== 'ADMIN') {
          toast.error('Access denied. Admin privileges required.');
          router.replace('/products');
          setIsChecking(false);
          return;
        }

        setIsAuthorized(true);
      } catch (error: any) {
        // Token is invalid, logout user
        logout();
        toast.error('Session expired. Please login again.');
        router.replace('/login');
        setIsChecking(false);
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
