import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const ProtectedRoute: React.FC<{ element: React.ReactNode; allowedRoles?: ('admin' | 'candidate' | 'employer')[] }> = ({ element, allowedRoles }) => {
  const { user, } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user && !!user.role;
  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles ? allowedRoles.includes(userRole!) : true;

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;