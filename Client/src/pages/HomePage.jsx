import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { menuData } from '@/data/menu';
import { ArrowRight } from 'lucide-react';

const categoryImages = {
  "hot-cold": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop",
  "starters": "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop",
  "sandwiches": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop",
  "pizzas": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
  "cakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop",
  "pies": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop",
  "pastries": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop",
  "snacks": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=600&auto=format&fit=crop",
  "cakes-brownies": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop",
  "dry-cakes": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&auto=format&fit=crop",
  "cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop",
  "doughnuts-rolls": "https://images.unsplash.com/photo-1506224772180-d75b3efbe9be?w=600&auto=format&fit=crop",
  "breads": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
};

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Mellow Café - Menu</title>
        <meta name="description" content="Welcome to Mellow Café! Explore our delicious menu." />
      </Helmet>

      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-2">Our Menu</p>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-stone-900 tracking-tight">
              What would you like<br />to enjoy today?
            </h1>
            <p className="mt-3 text-stone-500 text-base max-w-lg">
              Handcrafted with love — from freshly brewed beverages to artisan bakes.
            </p>
          </motion.div>

          {/* Category Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {menuData.categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link to={`/category/${category.id}`} className="group block">
                  <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-stone-100">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={categoryImages[category.id] || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"}
                        alt={category.name}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h2 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{category.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-amber-800 text-xs font-semibold">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default HomePage;