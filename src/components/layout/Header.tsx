import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, Menu, Sun, Moon, Settings } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { SearchBar } from '../search/SearchBar';

export const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const totalCartItems = state.shoppingLists.reduce(
    (total, list) => total + list.items.length, 0
  );

  const toggleTheme = () => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: newTheme } });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">
                UK Price Compare
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Toggle theme"
            >
              {state.settings.theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              {state.priceAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.priceAlerts.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Categories
              </a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Deals
              </a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Store Locator
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};