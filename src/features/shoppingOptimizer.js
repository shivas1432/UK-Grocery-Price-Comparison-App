// UK Shopping List Optimization Engine
class ShoppingOptimizer {
  constructor(stores, deliveryPreferences = {}) {
    this.stores = stores;
    this.deliveryPreferences = deliveryPreferences;
  }

  optimizeShoppingList(items) {
    const optimizations = [];

    // Strategy 1: Single store optimization
    const singleStoreOptions = this.optimizeSingleStore(items);
    
    // Strategy 2: Multi-store optimization
    const multiStoreOptions = this.optimizeMultiStore(items);
    
    // Strategy 3: Bulk buying optimization
    const bulkOptions = this.optimizeBulkBuying(items);

    return {
      recommended: this.selectBestStrategy(singleStoreOptions, multiStoreOptions, bulkOptions),
      alternatives: [singleStoreOptions, multiStoreOptions, bulkOptions]
    };
  }

  optimizeSingleStore(items) {
    const storeOptions = Object.keys(this.stores).map(storeKey => {
      const store = this.stores[storeKey];
      let totalCost = 0;
      let availableItems = 0;

      const storeItems = items.map(item => {
        const storePrice = item.prices.find(p => p.store === storeKey);
        if (storePrice && storePrice.availability) {
          totalCost += storePrice.price * item.quantity;
          availableItems++;
          return { ...item, selectedPrice: storePrice };
        }
        return { ...item, selectedPrice: null };
      });

      return {
        strategy: 'single_store',
        store: storeKey,
        storeName: store.name,
        totalCost,
        deliveryCost: totalCost >= store.min_order ? 0 : 3.95,
        itemsAvailable: availableItems,
        totalItems: items.length,
        items: storeItems
      };
    });

    return storeOptions.filter(option => option.itemsAvailable > 0)
                      .sort((a, b) => (a.totalCost + a.deliveryCost) - (b.totalCost + b.deliveryCost))[0];
  }

  optimizeMultiStore(items) {
    // Find best price for each item across all stores
    const optimizedItems = items.map(item => {
      const bestPrice = item.prices
        .filter(p => p.availability)
        .sort((a, b) => a.price - b.price)[0];
      
      return { ...item, selectedPrice: bestPrice };
    });

    // Group by store for delivery calculation
    const storeGroups = optimizedItems.reduce((groups, item) => {
      if (item.selectedPrice) {
        const store = item.selectedPrice.store;
        if (!groups[store]) {
          groups[store] = { items: [], total: 0 };
        }
        groups[store].items.push(item);
        groups[store].total += item.selectedPrice.price * item.quantity;
      }
      return groups;
    }, {});

    const totalCost = Object.values(storeGroups).reduce((sum, group) => sum + group.total, 0);
    const deliveryCost = Object.keys(storeGroups).reduce((cost, storeKey) => {
      const store = this.stores[storeKey];
      const group = storeGroups[storeKey];
      return cost + (group.total >= store.min_order ? 0 : 3.95);
    }, 0);

    return {
      strategy: 'multi_store',
      storeGroups,
      totalCost,
      deliveryCost,
      itemsOptimized: optimizedItems.filter(item => item.selectedPrice).length,
      totalItems: items.length
    };
  }

  optimizeBulkBuying(items) {
    // Implement bulk buying logic here
    return {
      strategy: 'bulk_buying',
      message: 'Bulk buying optimization coming soon'
    };
  }

  selectBestStrategy(...strategies) {
    return strategies
      .filter(s => s && s.totalCost !== undefined)
      .sort((a, b) => (a.totalCost + a.deliveryCost) - (b.totalCost + b.deliveryCost))[0];
  }
}

module.exports = ShoppingOptimizer;
