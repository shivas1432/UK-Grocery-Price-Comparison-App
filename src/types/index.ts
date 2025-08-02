export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  size: string;
  barcode?: string;
  image: string;
  stores: StorePrice[];
  priceHistory: PriceHistoryEntry[];
  tags: string[];
  isOrganic?: boolean;
  rating?: number;
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: Date;
  deliveryAvailable: boolean;
  promotion?: Promotion;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  color: string;
  website: string;
  locations: StoreLocation[];
}

export interface StoreLocation {
  id: string;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  openingHours: OpeningHours;
}

export interface OpeningHours {
  [key: string]: { open: string; close: string } | null;
}

export interface PriceHistoryEntry {
  date: Date;
  storeId: string;
  price: number;
}

export interface Promotion {
  type: 'percentage' | 'fixed' | 'buy-one-get-one' | 'meal-deal';
  value: number;
  description: string;
  validUntil: Date;
}

export type ProductCategory = 
  | 'dairy' 
  | 'bakery' 
  | 'meat' 
  | 'vegetables' 
  | 'fruits' 
  | 'pantry' 
  | 'frozen' 
  | 'beverages' 
  | 'snacks' 
  | 'household';

export interface ShoppingListItem {
  productId: string;
  quantity: number;
  preferredStore?: string;
  notes?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  storeId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  category?: ProductCategory;
  stores?: string[];
  priceRange?: { min: number; max: number };
  availability?: 'in-stock' | 'all';
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'discount';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currency: 'GBP';
  notifications: boolean;
  defaultStore?: string;
  postcode?: string;
}