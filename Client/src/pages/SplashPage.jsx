import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set splash screen shown flag for current session
    sessionStorage.setItem("splashShown", "true");

    const timer = setTimeout(() => {
      // Check if user is logged in
      const userEmail = localStorage.getItem("userEmail");
      const googleUser = localStorage.getItem("user");
      
      if (userEmail || googleUser) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 select-none">
      <div className="relative flex flex-col items-center">
        {/* Steam Effect */}
        <div className="flex space-x-1.5 mb-2 h-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-amber-800/40 rounded-full"
              initial={{ y: 15, opacity: 0, height: 12 }}
              animate={{ 
                y: [-5, -25], 
                opacity: [0, 0.8, 0],
                height: [12, 20, 12]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Coffee Cup Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-6 bg-white rounded-full shadow-sm border border-stone-100 flex items-center justify-center"
        >
          <Coffee className="h-16 w-16 text-amber-800" />
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl font-bold font-serif tracking-wider text-stone-900 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Mellow Café
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-stone-500 font-light mt-2 tracking-wide text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Brewing happiness, one cup at a time.
        </motion.p>
      </div>

      {/* Modern thin loading bar */}
      <div className="absolute bottom-16 w-48 h-0.5 bg-stone-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-amber-800"
          initial={{ left: "-100%", width: "100%", position: "relative" }}
          animate={{ left: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default SplashPage;