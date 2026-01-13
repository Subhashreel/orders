export type LocationType = 'college' | 'workplace' | 'airport' | 'city' | 'urban';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'beverage';

export interface Restaurant {
  id?: number;
  name: string;
  locationType: LocationType;
  baseWeekdayDiscount: number;
  baseWeekendDiscount: number;
  basePreparationTime: number;
  peakHourThreshold: number;
}

export interface MenuItem {
  id?: number;
  restaurantId: number;
  name: string;
  category: MenuCategory;
  basePrice: number;
  preparationComplexity: number;
}

export interface Order {
  id?: number;
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  orderStatus: OrderStatus;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  estimatedPreparationTime: number;
  orderDate: string;
  orderTime: string;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface CreateOrderRequest {
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
}