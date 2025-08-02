import { Product, ProductCategory } from '../types';
import { generatePriceHistory, generateStorePrice } from '../utils/dataGeneration';

const productData: Omit<Product, 'stores' | 'priceHistory'>[] = [
  // Dairy
  {
    id: 'milk-semi-2l',
    name: 'Semi-Skimmed Milk',
    category: 'dairy',
    brand: 'Various',
    size: '2 Litres',
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    tags: ['fresh', 'dairy', 'milk'],
    rating: 4.5
  },
  {
    id: 'butter-250g',
    name: 'Salted Butter',
    category: 'dairy',
    brand: 'Lurpak',
    size: '250g',
    image: 'https://images.pexels.com/photos/4110006/pexels-photo-4110006.jpeg',
    tags: ['dairy', 'butter', 'cooking'],
    rating: 4.7
  },
  {
    id: 'eggs-dozen',
    name: 'Free Range Eggs',
    category: 'dairy',
    brand: 'Various',
    size: '12 Pack',
    image: 'https://images.pexels.com/photos/162712/egg-white-food-eating-162712.jpeg',
    tags: ['eggs', 'free-range', 'protein'],
    isOrganic: true,
    rating: 4.6
  },
  {
    id: 'cheese-cheddar-400g',
    name: 'Mature Cheddar Cheese',
    category: 'dairy',
    brand: 'Cathedral City',
    size: '400g',
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg',
    tags: ['cheese', 'cheddar', 'mature'],
    rating: 4.4
  },

  // Bakery
  {
    id: 'bread-white-800g',
    name: 'White Sliced Bread',
    category: 'bakery',
    brand: 'Hovis',
    size: '800g',
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
    tags: ['bread', 'white', 'sliced'],
    rating: 4.2
  },
  {
    id: 'bread-wholemeal-800g',
    name: 'Wholemeal Bread',
    category: 'bakery',
    brand: 'Warburtons',
    size: '800g',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
    tags: ['bread', 'wholemeal', 'healthy'],
    rating: 4.3
  },
  {
    id: 'croissants-6pack',
    name: 'All Butter Croissants',
    category: 'bakery',
    brand: 'Various',
    size: '6 Pack',
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
    tags: ['croissants', 'pastry', 'butter'],
    rating: 4.1
  },

  // Meat
  {
    id: 'chicken-breast-1kg',
    name: 'Chicken Breast Fillets',
    category: 'meat',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    tags: ['chicken', 'fresh', 'protein'],
    rating: 4.3
  },
  {
    id: 'beef-mince-500g',
    name: 'Lean Beef Mince',
    category: 'meat',
    brand: 'Various',
    size: '500g',
    image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-chicken.jpg',
    tags: ['beef', 'mince', 'lean'],
    rating: 4.2
  },
  {
    id: 'salmon-fillet-400g',
    name: 'Atlantic Salmon Fillet',
    category: 'meat',
    brand: 'Various',
    size: '400g',
    image: 'https://images.pexels.com/photos/1409050/pexels-photo-1409050.jpeg',
    tags: ['salmon', 'fish', 'omega-3'],
    rating: 4.5
  },

  // Vegetables
  {
    id: 'potatoes-2kg',
    name: 'White Potatoes',
    category: 'vegetables',
    brand: 'Various',
    size: '2kg',
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
    tags: ['potatoes', 'vegetables', 'fresh'],
    rating: 4.0
  },
  {
    id: 'carrots-1kg',
    name: 'Carrots',
    category: 'vegetables',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    tags: ['carrots', 'vegetables', 'vitamin-a'],
    isOrganic: true,
    rating: 4.1
  },
  {
    id: 'onions-1kg',
    name: 'Brown Onions',
    category: 'vegetables',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg',
    tags: ['onions', 'vegetables', 'cooking'],
    rating: 4.0
  },
  {
    id: 'tomatoes-500g',
    name: 'Cherry Tomatoes',
    category: 'vegetables',
    brand: 'Various',
    size: '500g',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    tags: ['tomatoes', 'cherry', 'fresh'],
    rating: 4.2
  },

  // Fruits
  {
    id: 'bananas-1kg',
    name: 'Bananas',
    category: 'fruits',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
    tags: ['bananas', 'fruits', 'potassium'],
    rating: 4.3
  },
  {
    id: 'apples-1kg',
    name: 'Gala Apples',
    category: 'fruits',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    tags: ['apples', 'gala', 'fresh'],
    rating: 4.4
  },
  {
    id: 'oranges-1kg',
    name: 'Navel Oranges',
    category: 'fruits',
    brand: 'Various',
    size: '1kg',
    image: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg',
    tags: ['oranges', 'citrus', 'vitamin-c'],
    rating: 4.2
  },

  // Pantry
  {
    id: 'rice-1kg',
    name: 'Basmati Rice',
    category: 'pantry',
    brand: 'Tilda',
    size: '1kg',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    tags: ['rice', 'basmati', 'grain'],
    rating: 4.5
  },
  {
    id: 'pasta-500g',
    name: 'Spaghetti',
    category: 'pantry',
    brand: 'Barilla',
    size: '500g',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    tags: ['pasta', 'spaghetti', 'italian'],
    rating: 4.4
  },
  {
    id: 'olive-oil-500ml',
    name: 'Extra Virgin Olive Oil',
    category: 'pantry',
    brand: 'Various',
    size: '500ml',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg',
    tags: ['oil', 'olive', 'cooking'],
    rating: 4.6
  },

  // Beverages
  {
    id: 'orange-juice-1l',
    name: 'Freshly Squeezed Orange Juice',
    category: 'beverages',
    brand: 'Tropicana',
    size: '1 Litre',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
    tags: ['juice', 'orange', 'fresh'],
    rating: 4.3
  },
  {
    id: 'coffee-200g',
    name: 'Ground Coffee',
    category: 'beverages',
    brand: 'Nescafe',
    size: '200g',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    tags: ['coffee', 'ground', 'caffeine'],
    rating: 4.1
  },
  {
    id: 'tea-bags-80',
    name: 'English Breakfast Tea',
    category: 'beverages',
    brand: 'PG Tips',
    size: '80 Bags',
    image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg',
    tags: ['tea', 'english', 'breakfast'],
    rating: 4.5
  }
];

// Base prices for each product (in pence to avoid floating point issues)
const basePrices: Record<string, number> = {
  'milk-semi-2l': 125,
  'butter-250g': 349,
  'eggs-dozen': 285,
  'cheese-cheddar-400g': 425,
  'bread-white-800g': 105,
  'bread-wholemeal-800g': 125,
  'croissants-6pack': 199,
  'chicken-breast-1kg': 599,
  'beef-mince-500g': 425,
  'salmon-fillet-400g': 649,
  'potatoes-2kg': 149,
  'carrots-1kg': 89,
  'onions-1kg': 95,
  'tomatoes-500g': 189,
  'bananas-1kg': 118,
  'apples-1kg': 199,
  'oranges-1kg': 225,
  'rice-1kg': 249,
  'pasta-500g': 89,
  'olive-oil-500ml': 449,
  'orange-juice-1l': 249,
  'coffee-200g': 399,
  'tea-bags-80': 329
};

export const generateMockProducts = (): Product[] => {
  return productData.map(product => {
    const basePrice = basePrices[product.id] || 199;
    
    return {
      ...product,
      stores: generateStorePrice(basePrice, product.id),
      priceHistory: generatePriceHistory(basePrice, product.id)
    };
  });
};

export const mockProducts = generateMockProducts();

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand?.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getCheapestStore = (product: Product): string => {
  const availableStores = product.stores.filter(store => store.availability === 'in-stock');
  if (availableStores.length === 0) return '';
  
  const cheapest = availableStores.reduce((prev, current) => 
    prev.price < current.price ? prev : current
  );
  
  return cheapest.storeId;
};

export const getTotalSavings = (product: Product): number => {
  const prices = product.stores
    .filter(store => store.availability === 'in-stock')
    .map(store => store.price);
  
  if (prices.length < 2) return 0;
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return maxPrice - minPrice;
};