import React, { Suspense, lazy, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Header } from './components/layout/Header';
import { AppProvider, useApp } from './contexts/AppContext';

// Lazy load main components
const ProductGrid = lazy(() => import('./components/products/ProductGrid').then(module => ({ default: module.ProductGrid })));
const PriceChart = lazy(() => import('./components/charts/PriceChart').then(module => ({ default: module.PriceChart })));

const categories = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'meat', name: 'Meat & Fish', icon: '🥩' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'pantry', name: 'Pantry', icon: '🥫' },
  { id: 'beverages', name: 'Beverages', icon: '☕' },
];

const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.settings.theme;
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  const handleCategoryFilter = (category: string) => {
    if (category === 'all') {
      dispatch({ type: 'SET_SEARCH_FILTERS', payload: {} });
    } else {
      dispatch({ 
        type: 'SET_SEARCH_FILTERS', 
        payload: { ...state.searchFilters, category: category as any } 
      });
    }
  };

  const filteredProducts = React.useMemo(() => {
    let products = state.products;
    
    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return products;
  }, [state.products, state.searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare UK Grocery Prices
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the best deals across Tesco, ASDA, Sainsbury's, Morrisons, Lidl, and Aldi. 
            Save money on your weekly shopping with real-time price comparisons.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  (category.id === 'all' && !state.searchFilters.category) ||
                  state.searchFilters.category === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Product Detail View */}
        {state.selectedProduct && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-6">
              <img
                src={state.selectedProduct.image}
                alt={state.selectedProduct.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {state.selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {state.selectedProduct.brand} • {state.selectedProduct.size}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {state.selectedProduct.stores
                    .sort((a, b) => a.price - b.price)
                    .map((store) => (
                      <div key={store.storeId} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-900">{store.storeName}</div>
                        <div className="text-lg font-bold text-green-600">
                          £{(store.price / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {store.availability.replace('-', ' ')}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <div className="mt-8">
              <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
                <PriceChart product={state.selectedProduct} />
              </Suspense>
            </div>
            
            <button
              onClick={() => dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null })}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to all products
            </button>
          </div>
        )}

        {/* Products Grid */}
        <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
          <ProductGrid
            products={filteredProducts}
            filters={state.searchFilters}
            onProductSelect={(product) => 
              dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product })
            }
            isLoading={state.isLoading}
          />
        </Suspense>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600">Major UK Supermarkets</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {state.products.length}+
            </div>
            <div className="text-gray-600">Products Compared</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">Real-time</div>
            <div className="text-gray-600">Price Updates</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                UK Price Compare
              </h3>
              <p className="text-gray-600">
                Your trusted source for comparing grocery prices across major UK supermarkets.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Price Comparison</li>
                <li>Shopping Lists</li>
                <li>Price Alerts</li>
                <li>Store Locator</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Stores</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Tesco</li>
                <li>ASDA</li>
                <li>Sainsbury's</li>
                <li>Morrisons</li>
                <li>Lidl</li>
                <li>Aldi</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 UK Price Compare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;