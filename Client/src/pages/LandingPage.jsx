
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Coffee, Heart, Star } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Welcome to Mellow Café - Premium Coffee & Delicious Food</title>
        <meta name="description" content="Experience the finest coffee, delicious food, and warm atmosphere at Mellow Café. Your perfect dining destination awaits!" />
      </Helmet>
      
      <div className="min-h-screen cafe-gradient flex items-center justify-center overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full"
            animate={{ 
              scale: [1.2, 1, 1.2],
              y: [-20, 20, -20]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 right-10 w-16 h-16 bg-red-300/15 rounded-full"
            animate={{ 
              x: [-10, 10, -10],
              rotate: [0, -180, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="text-center z-10 px-4">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(220, 38, 38, 0.3)",
                    "0 0 40px rgba(251, 191, 36, 0.4)",
                    "0 0 20px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                <Coffee className="w-16 h-16 text-red-600" />
              </motion.div>
              
              {/* Floating Icons */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-6 h-6 text-yellow-400 fill-current" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ 
                  rotate: [360, 0],
                  y: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Star className="w-6 h-6 text-white fill-current" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: "easeOut"
            }}
            className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.5)",
                  "0 0 20px rgba(251, 191, 36, 0.8)",
                  "0 0 10px rgba(255, 255, 255, 0.5)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              MELLOW
            </motion.span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.8,
              ease: "easeOut"
            }}
            className="text-4xl md:text-6xl font-light text-yellow-100 mb-8 tracking-wide"
          >
            CAFÉ
          </motion.h2>

          {/* Subtitle Animation */}
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1,
              delay: 1.2,
              ease: "easeOut"
            }}
            className="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Where every sip tells a story and every bite creates memories
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 1.8
            }}
            className="flex flex-col items-center space-y-6"
          >
            <motion.div
              className="flex space-x-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-4 h-4 bg-white rounded-full"
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-white/80 text-lg font-medium"
            >
              Preparing your experience...
            </motion.p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 2.5
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
