import { CreateOrderRequest } from '../models/types';
import { calculateDiscount, calculatePreparationTime } from './orderUtils';
import { getRestaurantForOrderDB, getHourlyOrderCountDB } from '../services/orderService';
import { getMenuItemsByIdsDB } from '../services/menuService';

export const processOrderCalculations = async (orderRequest: CreateOrderRequest) => {
  const restaurant = await getRestaurantForOrderDB(orderRequest.restaurantId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  const menuItems: any = await getMenuItemsByIdsDB(orderRequest.items.map(i => i.menuItemId));

  let subtotal = 0;
  const orderItems = orderRequest.items.map(item => {
    const menuItem = menuItems.find((m: any) => m.id === item.menuItemId);
    if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);

    const totalPrice = menuItem.base_price * item.quantity;
    subtotal += totalPrice;

    return {
      ...item,
      unitPrice: menuItem.base_price,
      totalPrice,
      preparationComplexity: menuItem.preparation_complexity
    };
  });

  const now = new Date();
  const currentHour = now.getHours();
  const hourlyCount = await getHourlyOrderCountDB(orderRequest.restaurantId, currentHour);
  const isPeakHour = hourlyCount >= restaurant.peakHourThreshold;

  const discountPercentage = calculateDiscount(restaurant);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const totalAmount = subtotal - discountAmount;

  const estimatedPrepTime = calculatePreparationTime(
    restaurant.basePreparationTime,
    orderItems,
    isPeakHour
  );

  return {
    orderItems,
    subtotal,
    discountPercentage,
    discountAmount,
    totalAmount,
    estimatedPrepTime,
    isPeakHour
  };
};
