
export const menuCategories = [
  {
    id: 'beverages-desserts',
    name: 'Hot & Cold Beverages',
    description: 'Refreshing drinks and sweet treats',
    image: 'Coffee and desserts on a wooden table',
    items: [
      { id: 'tea', name: 'Tea', price: 30, stock: 50, description: 'Fresh brewed tea' },
      { id: 'coffee', name: 'Coffee', price: 35, stock: 45, description: 'Aromatic coffee blend' },
      { id: 'hot-chocolate', name: 'Hot Chocolate', price: 90, stock: 25, description: 'Rich and creamy hot chocolate' },
      { id: 'fresh-lime-soda', name: 'Fresh Lime Soda', price: 60, stock: 30, description: 'Refreshing lime soda' },
      { id: 'vanilla-milkshake', name: 'Vanilla Milk Shake', price: 100, stock: 20, description: 'Creamy vanilla milkshake' },
      { id: 'strawberry-milkshake', name: 'Strawberry Milk Shake', price: 100, stock: 20, description: 'Fresh strawberry milkshake' },
      { id: 'butterscotch-milkshake', name: 'Butterscotch Milk Shake', price: 100, stock: 20, description: 'Rich butterscotch milkshake' },
      { id: 'blackcurrant-milkshake', name: 'Blackcurrant Milk Shake', price: 100, stock: 20, description: 'Tangy blackcurrant milkshake' },
      { id: 'mango-milkshake', name: 'Mango Milk Shake', price: 100, stock: 20, description: 'Tropical mango milkshake' },
      { id: 'chocolate-milkshake', name: 'Chocolate Milk Shake', price: 120, stock: 18, description: 'Decadent chocolate milkshake' },
      { id: 'cold-coffee', name: 'Cold Coffee', price: 120, stock: 25, description: 'Chilled coffee delight' },
      { id: 'boost-milkshake', name: 'Boost Milk Shake', price: 120, stock: 15, description: 'Energy boost milkshake' },
      { id: 'pastry-ice-cream', name: 'Pastry With Ice Cream', price: 120, stock: 12, description: 'Pastry served with ice cream' },
      { id: 'pie-ice-cream', name: 'Pie With Ice Cream', price: 130, stock: 10, description: 'Pie served with ice cream' },
      { id: 'brownie-ice-cream', name: 'Spl Brownie With Ice Cream', price: 150, stock: 8, description: 'Special brownie with ice cream' }
    ]
  },
  {
    id: 'starters',
    name: 'Starters',
    description: 'Delicious appetizers and quick bites',
    image: 'Assorted appetizers and starters on plates',
    items: [
      { id: 'french-fries', name: 'French Fries', price: 90, stock: 40, description: 'Crispy golden french fries' },
      { id: 'cheesy-garlic-toast', name: 'Cheesy Garlic Toast', price: 120, stock: 25, description: 'Cheesy garlic bread toast' },
      { id: 'chilli-cheese-toast', name: 'Chilli Cheese Toast', price: 120, stock: 25, description: 'Spicy chilli cheese toast' },
      { id: 'veg-nuggets', name: 'Veg Nuggets', price: 100, stock: 30, description: 'Crispy vegetable nuggets' },
      { id: 'veg-burger', name: 'Veg Burger', price: 120, stock: 20, description: 'Fresh vegetable burger' },
      { id: 'chicken-nuggets', name: 'Chicken Nuggets', price: 130, stock: 25, description: 'Tender chicken nuggets' },
      { id: 'chicken-burger', name: 'Chicken Burger', price: 150, stock: 18, description: 'Juicy chicken burger' }
    ]
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    description: 'Fresh and tasty sandwich varieties',
    image: 'Variety of sandwiches on a wooden board',
    items: [
      { id: 'veg-sandwich', name: 'Veg Sandwich', price: 80, stock: 35, description: 'Fresh vegetable sandwich' },
      { id: 'classic-egg-sandwich', name: 'Classic Egg Sandwich', price: 80, stock: 30, description: 'Classic egg sandwich' },
      { id: 'paneer-sandwich', name: 'Paneer Sandwich', price: 100, stock: 25, description: 'Grilled paneer sandwich' },
      { id: 'veg-club-sandwich', name: 'Veg Club Sandwich', price: 120, stock: 20, description: 'Multi-layer veg club sandwich' },
      { id: 'chicken-sandwich', name: 'Chicken Sandwich', price: 120, stock: 22, description: 'Grilled chicken sandwich' },
      { id: 'chicken-tikka-sandwich', name: 'Chicken Tikka Sandwich', price: 140, stock: 18, description: 'Spicy chicken tikka sandwich' },
      { id: 'chicken-club-sandwich', name: 'Chicken Club Sandwich', price: 160, stock: 15, description: 'Premium chicken club sandwich' }
    ]
  },
  {
    id: 'pizzas',
    name: 'Pizzas',
    description: 'Wood-fired pizzas with fresh toppings',
    image: 'Delicious pizzas with various toppings',
    items: [
      { id: 'margeritta-pizza', name: 'Margeritta Pizza', price: 140, stock: 20, description: 'Classic margeritta pizza' },
      { id: 'classic-veg-pizza', name: 'Classic Veg Pizza', price: 150, stock: 18, description: 'Loaded vegetable pizza' },
      { id: 'paneer-pizza', name: 'Paneer Pizza', price: 180, stock: 15, description: 'Paneer and vegetable pizza' },
      { id: 'sweet-corn-pizza', name: 'Sweet Corn Pizza', price: 180, stock: 15, description: 'Sweet corn and cheese pizza' },
      { id: 'classic-chicken-pizza', name: 'Classic Chicken Pizza', price: 180, stock: 16, description: 'Chicken and vegetable pizza' },
      { id: 'chicken-tikka-pizza', name: 'Chicken Tikka Pizza', price: 200, stock: 12, description: 'Spicy chicken tikka pizza' },
      { id: 'chicken-sausage-pizza', name: 'Chicken Sausage Pizza', price: 200, stock: 12, description: 'Chicken sausage pizza' }
    ]
  },
  {
    id: 'cakes',
    name: 'Cakes',
    description: 'Fresh cream cakes and specialty desserts',
    image: 'Beautiful decorated cakes on display',
    items: [
      { id: 'vanilla-cake-half', name: 'Vanilla Cake (½ Kg)', price: 250, stock: 10, description: 'Fresh cream vanilla cake' },
      { id: 'vanilla-cake-full', name: 'Vanilla Cake (1 Kg)', price: 500, stock: 8, description: 'Fresh cream vanilla cake' },
      { id: 'pineapple-cake-half', name: 'Pineapple Cake (½ Kg)', price: 350, stock: 8, description: 'Fresh pineapple cake' },
      { id: 'pineapple-cake-full', name: 'Pineapple Cake (1 Kg)', price: 700, stock: 6, description: 'Fresh pineapple cake' },
      { id: 'butterscotch-cake-half', name: 'Butter Scotch Cake (½ Kg)', price: 350, stock: 8, description: 'Rich butterscotch cake' },
      { id: 'butterscotch-cake-full', name: 'Butter Scotch Cake (1 Kg)', price: 700, stock: 6, description: 'Rich butterscotch cake' },
      { id: 'black-forest-cake-half', name: 'Black Forest Cake (½ Kg)', price: 350, stock: 8, description: 'Classic black forest cake' },
      { id: 'black-forest-cake-full', name: 'Black Forest Cake (1 Kg)', price: 700, stock: 6, description: 'Classic black forest cake' },
      { id: 'red-velvet-cake-half', name: 'Red Velvet Cake (½ Kg)', price: 500, stock: 5, description: 'Premium red velvet cake' },
      { id: 'red-velvet-cake-full', name: 'Red Velvet Cake (1 Kg)', price: 1000, stock: 4, description: 'Premium red velvet cake' },
      { id: 'rainbow-cake', name: 'Rainbow Cake (1 Kg)', price: 1000, stock: 3, description: 'Colorful rainbow layer cake' }
    ]
  },
  {
    id: 'pastries-pies',
    name: 'Pastries & Pies',
    description: 'Individual pastries and fresh pies',
    image: 'Assorted pastries and pies in display case',
    items: [
      { id: 'blueberry-pie', name: 'Blueberry Pie', price: 70, stock: 15, description: 'Fresh blueberry pie slice' },
      { id: 'apple-pie', name: 'Apple Pie', price: 70, stock: 15, description: 'Classic apple pie slice' },
      { id: 'strawberry-pie', name: 'Strawberry Pie', price: 70, stock: 15, description: 'Fresh strawberry pie slice' },
      { id: 'chocolate-pie', name: 'Chocolate Pie', price: 70, stock: 15, description: 'Rich chocolate pie slice' },
      { id: 'pista-pie', name: 'Pista Pie', price: 70, stock: 12, description: 'Pistachio flavored pie slice' },
      { id: 'fruit-truffle', name: 'Fruit Truffle', price: 70, stock: 20, description: 'Fresh fruit truffle pastry' },
      { id: 'red-velvet-pastry', name: 'Red Velvet Pastry', price: 70, stock: 18, description: 'Red velvet pastry slice' },
      { id: 'choco-delight', name: 'Choco Delight', price: 60, stock: 20, description: 'Chocolate delight pastry' },
      { id: 'lychee-pastry', name: 'Lychee Pastry', price: 55, stock: 15, description: 'Exotic lychee pastry' },
      { id: 'choco-fudge', name: 'Choco Fudge', price: 60, stock: 18, description: 'Rich chocolate fudge pastry' }
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks',
    description: 'Quick bites and savory treats',
    image: 'Various snacks and baked goods',
    items: [
      { id: 'veg-puff', name: 'Veg Puff', price: 25, stock: 50, description: 'Crispy vegetable puff' },
      { id: 'korean-buns', name: 'Korean Cream Cheese Garlic Buns', price: 60, stock: 20, description: 'Korean style cream cheese buns' },
      { id: 'paneer-puff', name: 'Paneer Puff', price: 40, stock: 30, description: 'Spiced paneer puff' },
      { id: 'egg-puff', name: 'Egg Puff', price: 25, stock: 40, description: 'Classic egg puff' },
      { id: 'chicken-puff', name: 'Chicken Puff', price: 40, stock: 35, description: 'Chicken filled puff' },
      { id: 'chicken-pepper-roll', name: 'Chicken Pepper Roll', price: 40, stock: 25, description: 'Spicy chicken pepper roll' },
      { id: 'muffin-plain', name: 'Muffin Plain', price: 40, stock: 25, description: 'Classic plain muffin' },
      { id: 'muffin-chocochip', name: 'Muffin Chocochip', price: 50, stock: 20, description: 'Chocolate chip muffin' },
      { id: 'nutella-brownie', name: 'Nutella Brownie', price: 70, stock: 15, description: 'Rich nutella brownie' },
      { id: 'walnut-brownie', name: 'Walnut Brownie', price: 80, stock: 12, description: 'Walnut chocolate brownie' }
    ]
  }
];

export const getMenuItemById = (itemId) => {
  for (const category of menuCategories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      return { ...item, category: category.name };
    }
  }
  return null;
};

export const getCategoryByName = (categoryName) => {
  return menuCategories.find(category => 
    category.id === categoryName || 
    category.name.toLowerCase().replace(/\s+/g, '-') === categoryName
  );
};
