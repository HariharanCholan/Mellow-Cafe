import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// AdminRoute protects admin-only routes. It checks if the user is authenticated
// and has a role of 'admin' or 'super_admin'. If not, it redirects to the login page.
const AdminRoute = () => {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
