import { Restaurant } from '../models/types';

const LOCATION_MULTIPLIERS: Record<string, number> = {
  college: 1.3,
  workplace: 1.2,
  airport: 1.1,
  city: 1.05,
  urban: 1.0
};

//function to calculate discount based on restaurant location and time

export const calculateDiscount = (
  restaurant: Restaurant
): number => {
  if (!restaurant.baseWeekdayDiscount || !restaurant.baseWeekendDiscount) {
    return 0;
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  let discount = isWeekend 
    ? restaurant.baseWeekendDiscount 
    : restaurant.baseWeekdayDiscount;
  
  const locationMultiplier = LOCATION_MULTIPLIERS[restaurant.locationType] || 1.0;
  discount *= locationMultiplier;
  
  return Math.min(discount, 50);
};

export const calculatePreparationTime = (
  baseTime: number,
  orderItems: Array<{ quantity: number; preparationComplexity: number }>,
  isPeakHour: boolean
): number => {
  const totalComplexity = orderItems.reduce(
    (sum, item) => sum + (item.quantity * item.preparationComplexity),
    0
  );
  
  let prepTime = baseTime + (totalComplexity * 2);
  
  if (isPeakHour) {
    prepTime *= 1.5;
  }
  
  return Math.ceil(prepTime / 5) * 5;
};