// UK Grocery Price Comparison Service
class PriceService {
  constructor() {
    this.stores = require('../../config/stores.json').uk_stores;
    this.cache = new Map();
  }

  async getPrice(storeKey, productId) {
    const cacheKey = `${storeKey}_${productId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        return cached.data;
      }
    }

    try {
      const store = this.stores[storeKey];
      const response = await fetch(`${store.api_endpoint}/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'UK-Grocery-Comparison/1.0'
        }
      });

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Failed to fetch price from ${storeKey}:`, error);
      return null;
    }
  }

  async compareStores(productId) {
    const pricePromises = Object.keys(this.stores).map(async (storeKey) => {
      const price = await this.getPrice(storeKey, productId);
      return {
        store: storeKey,
        storeName: this.stores[storeKey].name,
        price: price?.price || null,
        availability: price?.availability || false
      };
    });

    return Promise.all(pricePromises);
  }
}

module.exports = PriceService;
