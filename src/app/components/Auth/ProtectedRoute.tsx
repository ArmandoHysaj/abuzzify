"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  )
}) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      // Redirect to home page with a flag to show auth modal
      router.push('/?auth=login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!currentUser) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
