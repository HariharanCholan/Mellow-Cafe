import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Coffee, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const Layout = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return <Outlet />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear credentials
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    // Remove splash screen flag to force showing splash page on logout
    sessionStorage.removeItem("splashShown");
    
    // Redirect to root, which will prompt the Splash screen
    navigate('/splash');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-stone-900 tracking-tight font-serif"
            >
              <Coffee className="h-6 w-6 text-amber-800" />
              <span>Mellow Café</span>
            </Link>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center space-x-4">

              {/* CART */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 hover:text-amber-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-amber-800 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* PROFILE ICON */}
              <Link to="/profile">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-stone-200 hover:bg-stone-100 transition-colors flex items-center justify-center">
                  <User className="h-4.5 w-4.5 text-stone-500" />
                </div>
              </Link>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-8 border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-stone-300">
            &copy; {new Date().getFullYear()} Mellow Café. All Rights Reserved.
          </p>
          <p className="text-xs mt-2 text-stone-500 tracking-wider">
            DELICIOUSLY YOURS, SINCE 2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
