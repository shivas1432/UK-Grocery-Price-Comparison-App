import { StorePrice, PriceHistoryEntry } from '../types';
import { stores } from '../data/stores';

// Store-specific price modifiers (some stores are generally cheaper/more expensive)
const storeModifiers: Record<string, number> = {
  'tesco': 1.0,
  'asda': 0.95,
  'sainsburys': 1.05,
  'morrisons': 0.98,
  'lidl': 0.85,
  'aldi': 0.82
};

// Generate realistic price variations
const generatePriceVariation = (basePrice: number, storeId: string): number => {
  const storeModifier = storeModifiers[storeId] || 1.0;
  const randomVariation = 0.9 + Math.random() * 0.2; // ±10% random variation
  const seasonalModifier = 0.95 + Math.random() * 0.1; // ±5% seasonal variation
  
  const finalPrice = basePrice * storeModifier * randomVariation * seasonalModifier;
  
  // Round to nearest penny
  return Math.round(finalPrice);
};

// Generate promotional deals occasionally
const generatePromotion = (price: number, storeId: string) => {
  const promoChance = Math.random();
  
  if (promoChance < 0.15) { // 15% chance of promotion
    const discountType = Math.random();
    
    if (discountType < 0.6) {
      // Percentage discount
      const discountPercent = 10 + Math.random() * 30; // 10-40% off
      const discountAmount = Math.round(price * (discountPercent / 100));
      
      return {
        type: 'percentage' as const,
        value: discountPercent,
        description: `${Math.round(discountPercent)}% off`,
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
      };
    } else if (discountType < 0.8) {
      // Fixed discount
      const discountAmount = Math.round(price * 0.1 + Math.random() * price * 0.2);
      
      return {
        type: 'fixed' as const,
        value: discountAmount,
        description: `£${(discountAmount / 100).toFixed(2)} off`,
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 days
      };
    } else {
      // Buy one get one offer
      return {
        type: 'buy-one-get-one' as const,
        value: 50,
        description: 'Buy One Get One 50% Off',
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days
      };
    }
  }
  
  return undefined;
};

export const generateStorePrice = (basePrice: number, productId: string): StorePrice[] => {
  return stores.map(store => {
    const price = generatePriceVariation(basePrice, store.id);
    const promotion = generatePromotion(price, store.id);
    
    // Calculate discounted price if promotion exists
    let finalPrice = price;
    let originalPrice: number | undefined;
    let discount: number | undefined;
    
    if (promotion) {
      originalPrice = price;
      
      switch (promotion.type) {
        case 'percentage':
          discount = Math.round(price * (promotion.value / 100));
          finalPrice = price - discount;
          break;
        case 'fixed':
          discount = promotion.value;
          finalPrice = Math.max(10, price - discount); // Minimum 10p
          break;
        case 'buy-one-get-one':
          // For BOGO, show original price but indicate savings
          discount = Math.round(price * 0.25); // Average 25% savings
          break;
      }
    }
    
    // Determine availability (90% in stock, 7% low stock, 3% out of stock)
    const availabilityRand = Math.random();
    let availability: 'in-stock' | 'low-stock' | 'out-of-stock';
    
    if (availabilityRand < 0.9) {
      availability = 'in-stock';
    } else if (availabilityRand < 0.97) {
      availability = 'low-stock';
    } else {
      availability = 'out-of-stock';
    }
    
    return {
      storeId: store.id,
      storeName: store.name,
      price: finalPrice,
      originalPrice,
      discount,
      availability,
      lastUpdated: new Date(),
      deliveryAvailable: Math.random() > 0.1, // 90% have delivery
      promotion
    };
  });
};

export const generatePriceHistory = (basePrice: number, productId: string): PriceHistoryEntry[] => {
  const history: PriceHistoryEntry[] = [];
  
  // Generate 30 days of price history
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    stores.forEach(store => {
      // Create some price fluctuation over time
      const dayVariation = 0.95 + Math.random() * 0.1; // ±5% daily variation
      const trendFactor = 1 + (Math.sin(i / 10) * 0.05); // Subtle trend over time
      
      const price = generatePriceVariation(basePrice * dayVariation * trendFactor, store.id);
      
      history.push({
        date,
        storeId: store.id,
        price
      });
    });
  }
  
  return history.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Function to simulate real-time price updates
export const updatePricesRealTime = (products: any[]) => {
  return products.map(product => ({
    ...product,
    stores: product.stores.map((store: StorePrice) => ({
      ...store,
      price: Math.max(10, store.price + Math.round((Math.random() - 0.5) * 10)), // ±5p change
      lastUpdated: new Date()
    }))
  }));
};