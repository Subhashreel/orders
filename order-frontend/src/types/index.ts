// src/types/index.ts

export type LocationType = 'college' | 'workplace' | 'airport' | 'city' | 'urban';
export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'beverage';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Restaurant {
  id: number;
  name: string;
  locationType: LocationType;
  baseWeekdayDiscount: number;
  baseWeekendDiscount: number;
  basePreparationTime: number;
  peakHourThreshold: number;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  category: MenuCategory;
  basePrice: number;
  preparationComplexity: number;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  menuItem?: MenuItem;
}

export interface Order {
  subTotal: ReactNode;
  id: number;
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  estimatedPrepTime: number;
  items: OrderItem[];
  createdAt: string;
}