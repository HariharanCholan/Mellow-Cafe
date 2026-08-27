import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, RotateCcw, Plus, LogOut } from 'lucide-react';
import API_BASE_URL from "@/config/api";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart() || {};
  const { user: authUser, logout, loading: authLoading } = useAuth();

  const user = authUser || (() => {
    try {
      const stored = localStorage.getItem("mellowCafeUser") || localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const email = user?.email;

  const fetchProfile = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${email}`);
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      } else {
        // Fallback to local user data if backend profile isn't populated
        setProfile(user);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfile(user);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchOrders = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/orders/${email}`);
      const data = await res.json();
      setOrders(data.orders || []);

      const counts = {};
      data.orders?.forEach(order => {
        order.items?.forEach(item => {
          counts[item.name] = (counts[item.name] || 0) + 1;
        });
      });

      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      setFavourites(sorted);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!email) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchOrders();
  }, [email, authLoading]);

  const handleReorder = (items) => {
    clearCart();
    items.forEach((item) => {
      addToCart({
        id: `${item.name}-${item.price}`,
        name: item.name,
        price: item.price,
        option: null,
        quantity: item.quantity || 1,
      });
    });
    navigate("/cart");
  };

  const handleIncludeAll = (items) => {
    items.forEach((item) => {
      addToCart({
        id: `${item.name}-${item.price}`,
        name: item.name,
        price: item.price,
        option: null,
        quantity: item.quantity || 1,
      });
    });
    navigate("/cart");
  };

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("splashShown");
    navigate('/login');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - Mellow Café</title>
      </Helmet>

      <div className="min-h-screen bg-stone-50 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-8 mb-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-stone-100 bg-stone-100 flex items-center justify-center shrink-0">
                  {profile.picture && profile.picture !== "null" ? (
                    <img
                      src={profile.picture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-stone-500">
                      {profile.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h1 className="text-2xl font-bold font-serif text-stone-900">{profile.name}</h1>
                  <p className="text-stone-500 text-sm mt-0.5">{profile.email}</p>
                  {profile.phone && <p className="text-stone-500 text-sm">{profile.phone}</p>}
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 uppercase tracking-wider">
                    {profile.type === 'google' ? 'Google Account' : 'Member'}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </motion.div>

          {/* Favourites */}
          {favourites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-amber-800" />
                <h2 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Favourite Dishes</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {favourites.map((dish, i) => (
                  <span key={i} className="bg-stone-50 border border-stone-200 text-stone-700 text-sm px-3 py-1 rounded-full">
                    {dish}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-amber-800" />
                <span className="font-bold text-stone-900 text-sm uppercase tracking-wider">Order History</span>
                {orders.length > 0 && (
                  <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                )}
              </div>
              <span className="text-stone-400 text-sm">{showOrders ? '▲' : '▼'}</span>
            </button>

            {showOrders && (
              <div className="border-t border-stone-100">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-10 w-10 text-stone-200 mx-auto mb-2" />
                    <p className="text-stone-400 text-sm">No orders yet. Start exploring the menu!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <div key={order._id} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-stone-400">
                            {new Date(order.timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                          <p className="font-bold text-stone-900">₹{order.total || order.totalAmount || 0}</p>
                        </div>

                        <ul className="space-y-1 mb-4">
                          {order.items.map((item, i) => (
                            <li key={i} className="text-sm text-stone-600 flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-stone-400">× {item.quantity || 1}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReorder(order.items)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" /> Reorder
                          </button>

                          <button
                            onClick={() => handleIncludeAll(order.items)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-amber-200"
                          >
                            <Plus className="h-3 w-3" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;