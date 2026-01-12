import { Restaurant } from '../models/types';

const LOCATION_MULTIPLIERS: Record<string, number> = {
  college: 1.3,
  workplace: 1.2,
  airport: 1.1,
  city: 1.05,
  urban: 1.0
};

//function to calculate discount based on restaurant location (peak hour removed for fixed pricing)

export const calculateDiscount = (
  restaurant: Restaurant
): number => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  let discount = isWeekend 
    ? restaurant.base_weekend_discount 
    : restaurant.base_weekday_discount;
  
  const locationMultiplier = LOCATION_MULTIPLIERS[restaurant.location_type] || 1.0;
  discount *= locationMultiplier;
  
  return Math.min(discount, 50);
};

export const calculatePreparationTime = (
  baseTime: number,
  orderItems: Array<{ quantity: number; preparation_complexity: number }>,
  isPeakHour: boolean
): number => {
  const totalComplexity = orderItems.reduce(
    (sum, item) => sum + (item.quantity * item.preparation_complexity),
    0
  );
  
  let prepTime = baseTime + (totalComplexity * 2);
  
  if (isPeakHour) {
    prepTime *= 1.5;
  }
  
  return Math.ceil(prepTime / 5) * 5;
};