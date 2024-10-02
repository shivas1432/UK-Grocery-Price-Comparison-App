// UK Grocery Product Search Component
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/helpers';

const ProductSearch = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        onSearchResults(data.products || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [onSearchResults]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="uk-product-search">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search UK grocery products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <div className="loading-spinner">🔄</div>}
      </div>
      
      {suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => setSearchTerm(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
