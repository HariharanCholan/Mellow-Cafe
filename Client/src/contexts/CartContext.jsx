import React, { createContext, useContext, useState, useEffect } from 'react';

    const CartContext = createContext();

    export const useCart = () => useContext(CartContext);

    export const CartProvider = ({ children }) => {
      const [cartItems, setCartItems] = useState(() => {
        try {
          const localData = localStorage.getItem('mellow-cart');
          return localData ? JSON.parse(localData) : [];
        } catch (error) {
          console.error("Could not parse cart data from localStorage", error);
          return [];
        }
      });

      useEffect(() => {
        localStorage.setItem('mellow-cart', JSON.stringify(cartItems));
      }, [cartItems]);

      const addToCart = (item) => {
        setCartItems(prevItems => {
          const cartId = item.option ? `${item.id}-${item.option}` : item.id;
          const existingItem = prevItems.find(i => i.cartId === cartId);
          
          if (existingItem) {
            return prevItems.map(i =>
              i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...prevItems, { ...item, quantity: 1, cartId }];
        });
      };

      const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
      };

      const updateQuantity = (cartId, quantity) => {
        if (quantity <= 0) {
          removeFromCart(cartId);
        } else {
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.cartId === cartId ? { ...item, quantity } : item
            )
          );
        }
      };
      
      const clearCart = () => {
        setCartItems([]);
      };

      const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
      const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      };

      return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
    };