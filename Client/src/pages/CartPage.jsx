import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';
import API_BASE_URL from '@/config/api';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, cartCount, clearCart } = useCart();
  const [pickupTime, setPickupTime] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!pickupTime) {
      alert('Please select a pickup time.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_SVu1xxl1piYCFI",
        amount: order.amount,
        currency: "INR",
        name: "Mellow Café",
        description: "Food Order",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                items: cartItems,
                totalAmount: cartTotal,
                userEmail: localStorage.getItem("userEmail") || "guest@mellowcafe.com",
                pickupTime
              }),
            });

            const data = await verifyRes.json();

            if (data.success) {
              clearCart();
              window.open(data.invoiceUrl, "_blank");
              navigate('/order-confirmation');
            } else {
              alert("Payment verification failed ❌");
            }
          } catch (err) {
            console.error(err);
          }
        },

        theme: { color: "#92400E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
    }
  };

  const getPickupTimeOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 1; i <= 4; i++) {
      const pickupDate = new Date(now.getTime() + i * 60 * 60 * 1000);
      options.push(pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return options;
  };

  return (
    <>
      <Helmet>
        <title>Your Cart - Mellow Café</title>
      </Helmet>

      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 transition-colors text-sm font-medium mb-8">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1">Checkout</p>
            <h1 className="text-3xl font-bold font-serif text-stone-900">Your Cart</h1>
            <p className="text-stone-500 text-sm mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </motion.div>

          <div className="mt-8 grid lg:grid-cols-12 gap-8">

            {/* Cart Items */}
            <section className="lg:col-span-7">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-200/80 rounded-2xl">
                  <ShoppingBag className="mx-auto h-14 w-14 text-stone-200 mb-4" />
                  <h2 className="text-lg font-semibold text-stone-700">Your cart is empty</h2>
                  <p className="text-stone-400 text-sm mt-1">Add something delicious from our menu!</p>
                  <Link to="/" className="inline-block mt-5 text-sm font-semibold text-amber-800 hover:text-amber-900 underline">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm divide-y divide-stone-100">
                  <AnimatePresence>
                    {cartItems.map(item => (
                      <motion.div
                        key={item.cartId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-stone-900 text-sm truncate">{item.name}</p>
                          {item.option && <p className="text-xs text-stone-400 mt-0.5">{item.option}</p>}
                          <p className="text-xs text-stone-500 mt-1">₹{item.price} each</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="h-5 w-5 flex items-center justify-center text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-sm font-semibold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="h-5 w-5 flex items-center justify-center text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-stone-900 w-14 text-right">₹{item.price * item.quantity}</span>

                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-stone-300 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <section className="lg:col-span-5">
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm sticky top-24">
                  <h2 className="text-base font-bold text-stone-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 text-sm text-stone-600 border-b border-stone-100 pb-4">
                    {cartItems.map(item => (
                      <div key={item.cartId} className="flex justify-between">
                        <span className="truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 text-base font-bold text-stone-900">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  {/* Pickup Time */}
                  <div className="mt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                      <Clock className="h-3.5 w-3.5 text-amber-800" /> Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800/20 cursor-pointer"
                    >
                      <option value="">Select a time slot</option>
                      {getPickupTimeOptions().map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayment}
                    className="w-full mt-5 bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Pay & Place Order
                  </Button>

                  <p className="text-center text-xs text-stone-400 mt-3">Secured by Razorpay</p>
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;