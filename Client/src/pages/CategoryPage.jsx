import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { menuData } from '@/data/menu';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, PlusCircle, ShoppingBag } from 'lucide-react';
import FlavorDialog from '@/components/FlavorDialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const category = menuData.categories.find(c => c.id === categoryId);
  const items = menuData.items[categoryId] || [];

  if (!category) {
    return <div className="text-center py-10 text-stone-500">Category not found.</div>;
  }

  const handleAddToCart = (item) => {
    const itemName = item.option ? `${item.name} (${item.option})` : item.name;
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${itemName} has been added.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{category.name} - Mellow Café</title>
        <meta name="description" content={`Browse our delicious ${category.name}.`} />
      </Helmet>

      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Back & Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 transition-colors text-sm font-medium mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Link>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-2">Menu</p>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight">{category.name}</h1>
            <p className="mt-1 text-stone-500 text-sm">{category.description}</p>
          </motion.div>

          {/* Items Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <div className={`bg-white border border-stone-200/80 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-200 ${item.stock === 0 ? 'opacity-60' : ''}`}>
                  
                  {/* Icon placeholder */}
                  <div className="h-20 bg-stone-50 rounded-lg flex items-center justify-center mb-4 border border-stone-100">
                    <ShoppingBag className="h-7 w-7 text-stone-300" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-stone-900 text-sm leading-snug">{item.name}</h3>
                    {item.size && <p className="text-xs text-stone-400 mt-0.5">{item.size}</p>}
                    
                    {/* Stock badge */}
                    <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.stock === 0 
                        ? 'bg-red-50 text-red-500' 
                        : item.stock < 10 
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? `Only ${item.stock} left` : 'In Stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <p className="text-lg font-bold text-stone-900">₹{item.price}</p>

                    {item.options ? (
                      <FlavorDialog item={item} onAddToCart={handleAddToCart}>
                        <Button
                          size="sm"
                          disabled={item.stock === 0}
                          className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3 cursor-pointer disabled:opacity-50"
                        >
                          <PlusCircle className="mr-1 h-3.5 w-3.5" />
                          Add
                        </Button>
                      </FlavorDialog>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock === 0}
                        className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3 cursor-pointer disabled:opacity-50"
                      >
                        <PlusCircle className="mr-1 h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;