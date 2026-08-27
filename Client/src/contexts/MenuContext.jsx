import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '@/config/api';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/menu/all`);
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();
      setCategories(data.categories || []);
      setItems(data.items || {});
    } catch (err) {
      console.error('Menu fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <MenuContext.Provider value={{ categories, items, loading, error, refetch: fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
