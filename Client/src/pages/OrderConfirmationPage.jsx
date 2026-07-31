import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { clearCart, cartItems, totalAmount } = useCart();
  const submittedRef = useRef(false); // ⬅️ prevents multiple submissions

  useEffect(() => {
    const submitOrder = async () => {
      if (submittedRef.current) return; // ⬅️ Already submitted? Skip it.
      submittedRef.current = true;

      try {
        const userEmail = localStorage.getItem('userEmail') || 'guest@mellowcafe.com';

        const res = await fetch('http://localhost:5000/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            items: cartItems,
            total: totalAmount,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          console.log('✅ Order saved to DB:', data);
        } else {
          console.error('❌ Order error:', data.message);
        }
      } catch (err) {
        console.error('❌ Order submit error:', err.message);
      } finally {
        clearCart();
      }
    };

    submitOrder();
  }, [cartItems, totalAmount, clearCart]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed! - Mellow Café</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>
      <div className="min-h-[70vh] flex items-center justify-center bg-yellow-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <Card className="w-full max-w-md mx-auto text-center shadow-lg">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-red-500 mt-4">
                Order Confirmed!
              </CardTitle>
              <CardDescription className="text-gray-600">
                Thank you for your purchase. Your delicious treats are being prepared!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                You will receive a notification when your order is ready for pickup. Remember to collect it within the specified time.
              </p>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
