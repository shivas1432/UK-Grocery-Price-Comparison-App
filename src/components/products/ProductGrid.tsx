import React, { useMemo, useState, lazy, Suspense } from 'react';
import { Product, SearchFilters } from '../../types';
import { LoadingGrid } from '../common/LoadingSpinner';

// Lazy load ProductCard for better performance
const ProductCard = lazy(() => import('./ProductCard').then(module => ({ default: module.ProductCard })));

interface ProductGridProps {
  products: Product[];
  filters?: SearchFilters;
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filters,
  onProductSelect,
  isLoading = false,
  emptyMessage = "No products found matching your criteria."
}) => {
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter and sort products based on filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters?.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters?.stores && filters.stores.length > 0) {
      filtered = filtered.filter(product =>
        product.stores.some(store => 
          filters.stores!.includes(store.storeId) && store.availability === 'in-stock'
        )
      );
    }

    if (filters?.priceRange) {
      filtered = filtered.filter(product => {
        const minPrice = Math.min(...product.stores.map(s => s.price));
        return minPrice >= (filters.priceRange!.min * 100) && 
               minPrice <= (filters.priceRange!.max * 100);
      });
    }

    if (filters?.availability === 'in-stock') {
      filtered = filtered.filter(product =>
        product.stores.some(store => store.availability === 'in-stock')
      );
    }

    // Sort products
    switch (filters?.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.stores.map(s => s.price));
          const bMin = Math.min(...b.stores.map(s => s.price));
          return aMin - bMin;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.stores.map(s => s.price));
          const bMin = Math.min(...b.stores.map(s => s.price));
          return bMin - aMin;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const aDiscount = a.stores.reduce((max, store) => 
            Math.max(max, store.discount || 0), 0);
          const bDiscount = b.stores.reduce((max, store) => 
            Math.max(max, store.discount || 0), 0);
          return bDiscount - aDiscount;
        });
        break;
      default:
        // Default sort by relevance/popularity (using rating if available)
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, filters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, filteredProducts.length));
  };

  if (isLoading) {
    return <LoadingGrid count={12} />;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {emptyMessage}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters and try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {visibleProducts.length} of {filteredProducts.length} products
        </p>
        
        {filters?.sortBy && (
          <div className="text-sm text-gray-500">
            Sorted by: {filters.sortBy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Suspense fallback={<LoadingGrid count={visibleCount} />}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onProductSelect}
            />
          ))}
        </Suspense>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Products ({filteredProducts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};