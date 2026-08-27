import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mellowCafeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('mellowCafeUser', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('mellowCafeToken', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mellowCafeUser');
    localStorage.removeItem('mellowCafeToken');
    localStorage.removeItem('mellowCafeCart');
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('mellowCafeUser', JSON.stringify(newUser));
    return newUser;
  };

  // Convenience role helpers
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isStaff = ['worker', 'staff', 'admin', 'super_admin'].includes(user?.role);

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAdmin,
    isSuperAdmin,
    isStaff,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
