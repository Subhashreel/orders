import { calculateDiscount } from '../../utils/orderUtils';
import { Restaurant } from '../../models/types';

const baseRestaurant: Restaurant = {
  id: 1,
  name: 'Test Cafe',
  locationType: 'urban',
  baseWeekdayDiscount: 10,
  baseWeekendDiscount: 20,
  basePreparationTime: 20,
  peakHourThreshold: 10
};

describe('calculateDiscount', () => {

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses weekday discount on weekdays', () => {
    jest.setSystemTime(new Date('2026-01-12')); // Monday

    const discount = calculateDiscount(baseRestaurant);
    expect(discount).toBe(10);
  });

  it('uses weekend discount on weekends', () => {
    jest.setSystemTime(new Date('2026-01-11')); // Sunday

    const discount = calculateDiscount(baseRestaurant);
    expect(discount).toBe(20);
  });

  it('applies location multiplier', () => {
    jest.setSystemTime(new Date('2026-01-12')); // weekday

    const restaurant: Restaurant = {
      ...baseRestaurant,
      locationType: 'college' // multiplier 1.3
    };

    const discount = calculateDiscount(restaurant);
    expect(discount).toBeCloseTo(13); // 10 * 1.3
  });

  it('caps discount at 50', () => {
    jest.setSystemTime(new Date('2026-01-11')); // weekend

    const restaurant: Restaurant = {
      ...baseRestaurant,
      baseWeekendDiscount: 60,
      locationType: 'college' // 60 * 1.3 = 78 → must cap
    };

    const discount = calculateDiscount(restaurant);
    expect(discount).toBe(50);
  });

  it('returns 0 if base discounts are missing', () => {
    jest.setSystemTime(new Date('2026-01-12'));

    const restaurant: Restaurant = {
      ...baseRestaurant,
      baseWeekdayDiscount: 0,
      baseWeekendDiscount: 0
    };

    const discount = calculateDiscount(restaurant);
    expect(discount).toBe(0);
  });

  it('uses default multiplier if location type is unknown', () => {
    jest.setSystemTime(new Date('2026-01-12'));

    const restaurant = {
      ...baseRestaurant,
      locationType: 'unknown' as any
    };

    const discount = calculateDiscount(restaurant);
    expect(discount).toBe(10); // no multiplier applied
  });

});
