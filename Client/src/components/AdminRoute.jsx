import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// AdminRoute protects admin/staff routes.
// It waits for AuthContext to finish loading from localStorage before deciding,
// and permits worker, staff, admin, and super_admin roles.
const AdminRoute = () => {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-800 mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return isStaff ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminRoute;
