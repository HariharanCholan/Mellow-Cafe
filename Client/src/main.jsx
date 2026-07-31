import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';
    import { Toaster } from "@/components/ui/toaster";
    import { CartProvider } from '@/contexts/CartContext';
    import { AuthProvider } from './contexts/AuthContext';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <CartProvider>
          <App />
          <Toaster />
        </CartProvider>
      </React.StrictMode>
    );