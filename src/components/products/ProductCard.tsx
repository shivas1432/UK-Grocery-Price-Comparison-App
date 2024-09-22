import React, { useState } from 'react';
import { ShoppingCart, Heart, TrendingDown, AlertCircle, Star, Plus } from 'lucide-react';
import { Product } from '../../types';
import { getStoreById } from '../../data/stores';
import { getCheapestStore, getTotalSavings } from '../../data/mockProducts';
import { useApp } from '../../contexts/AppContext';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  showComparison?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails,
  showComparison = true 
}) => {
  const { dispatch } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cheapestStoreId = getCheapestStore(product);
  const totalSavings = getTotalSavings(product);
  const cheapestPrice = Math.min(...product.stores.map(s => s.price));
  const averagePrice = product.stores.reduce((sum, s) => sum + s.price, 0) / product.stores.length;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to default shopping list or create one
    // This would be implemented based on your shopping list logic
    console.log('Add to cart:', product.id);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    }
  };

  const renderStorePrice = (storePrice: any) => {
    const store = getStoreById(storePrice.storeId);
    if (!store) return null;

    return (
      <div key={storePrice.storeId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: store.color }}
          />
          <span className="text-sm font-medium text-gray-700">{store.name}</span>
          {storePrice.availability !== 'in-stock' && (
            <span className="text-xs text-red-500">
              {storePrice.availability === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {storePrice.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                £{(storePrice.originalPrice / 100).toFixed(2)}
              </span>
            )}
            <span className={`text-sm font-semibold ${
              storePrice.storeId === cheapestStoreId ? 'text-green-600' : 'text-gray-900'
            }`}>
              £{(storePrice.price / 100).toFixed(2)}
            </span>
          </div>
          {storePrice.promotion && (
            <span className="text-xs text-orange-600 font-medium">
              {storePrice.promotion.description}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105 transition-transform duration-300`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleViewDetails}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isOrganic && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Organic
            </span>
          )}
          {totalSavings > 20 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              Save £{(totalSavings / 100).toFixed(2)}
            </span>
          )}
        </div>

        {/* Heart icon */}
        <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500">
              {product.brand} • {product.size}
            </p>
          </div>
          {product.rating && (
            <div className="flex items-center ml-2">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-green-600">
              £{(cheapestPrice / 100).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              from {getStoreById(cheapestStoreId)?.name}
            </span>
          </div>
          {averagePrice > cheapestPrice && (
            <p className="text-xs text-gray-500">
              Avg: £{(averagePrice / 100).toFixed(2)} • 
              Save up to £{(totalSavings / 100).toFixed(2)}
            </p>
          )}
        </div>

        {/* Store Comparison */}
        {showComparison && (
          <div className="space-y-2 mb-4">
            {product.stores
              .filter(store => store.availability === 'in-stock')
              .sort((a, b) => a.price - b.price)
              .slice(0, 3)
              .map(renderStorePrice)}
            
            {product.stores.filter(store => store.availability === 'in-stock').length > 3 && (
              <button
                onClick={handleViewDetails}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors py-1"
              >
                View all {product.stores.length} stores
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add to List</span>
          </button>
          
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};