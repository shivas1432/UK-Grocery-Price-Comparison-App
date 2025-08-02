import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ShoppingList, PriceAlert, SearchFilters, AppSettings, ShoppingListItem } from '../types';
import { mockProducts } from '../data/mockProducts';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppState {
  products: Product[];
  shoppingLists: ShoppingList[];
  priceAlerts: PriceAlert[];
  searchFilters: SearchFilters;
  settings: AppSettings;
  isLoading: boolean;
  searchQuery: string;
  selectedProduct: Product | null;
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_FILTERS'; payload: SearchFilters }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'ADD_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'DELETE_SHOPPING_LIST'; payload: string }
  | { type: 'ADD_TO_SHOPPING_LIST'; payload: { listId: string; item: ShoppingListItem } }
  | { type: 'REMOVE_FROM_SHOPPING_LIST'; payload: { listId: string; productId: string } }
  | { type: 'ADD_PRICE_ALERT'; payload: PriceAlert }
  | { type: 'REMOVE_PRICE_ALERT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

const initialState: AppState = {
  products: [],
  shoppingLists: [],
  priceAlerts: [],
  searchFilters: {},
  settings: {
    theme: 'system',
    currency: 'GBP',
    notifications: true
  },
  isLoading: false,
  searchQuery: '',
  selectedProduct: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    case 'ADD_SHOPPING_LIST':
      return { 
        ...state, 
        shoppingLists: [...state.shoppingLists, action.payload] 
      };
    
    case 'UPDATE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.id ? action.payload : list
        )
      };
    
    case 'DELETE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.filter(list => list.id !== action.payload)
      };
    
    case 'ADD_TO_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: [...list.items, action.payload.item],
                updatedAt: new Date()
              }
            : list
        )
      };
    
    case 'REMOVE_FROM_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(item => item.productId !== action.payload.productId),
                updatedAt: new Date()
              }
            : list
        )
      };
    
    case 'ADD_PRICE_ALERT':
      return {
        ...state,
        priceAlerts: [...state.priceAlerts, action.payload]
      };
    
    case 'REMOVE_PRICE_ALERT':
      return {
        ...state,
        priceAlerts: state.priceAlerts.filter(alert => alert.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>('shoppingLists', []);
  const [priceAlerts, setPriceAlerts] = useLocalStorage<PriceAlert[]>('priceAlerts', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', initialState.settings);

  // Initialize data from localStorage
  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    
    // Load shopping lists from localStorage
    if (shoppingLists.length > 0) {
      dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
      shoppingLists.forEach(list => {
        dispatch({ type: 'ADD_SHOPPING_LIST', payload: list });
      });
    }
    
    // Load price alerts from localStorage
    if (priceAlerts.length > 0) {
      priceAlerts.forEach(alert => {
        dispatch({ type: 'ADD_PRICE_ALERT', payload: alert });
      });
    }
    
    // Load settings from localStorage
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    setShoppingLists(state.shoppingLists);
  }, [state.shoppingLists, setShoppingLists]);

  useEffect(() => {
    setPriceAlerts(state.priceAlerts);
  }, [state.priceAlerts, setPriceAlerts]);

  useEffect(() => {
    setSettings(state.settings);
  }, [state.settings, setSettings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};