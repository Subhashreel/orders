import { upsertRestaurantSchema } from '../../validators/restaurantSchema';

describe('upsertRestaurantSchema', () => {

  const validRestaurant = {
    name: 'Campus Cafe',
    locationType: 'college',
    baseWeekdayDiscount: 5,
    baseWeekendDiscount: 15,
    basePreparationTime: 20,
    peakHourThreshold: 10
  };

  it('passes with valid data', () => {
    const result = upsertRestaurantSchema.safeParse(validRestaurant);
    expect(result.success).toBe(true);
  });

  it('fails when name is missing', () => {
    const result = upsertRestaurantSchema.safeParse({ ...validRestaurant, name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name']);
    }
  });

  it('fails when discount > 100', () => {
    const result = upsertRestaurantSchema.safeParse({
      ...validRestaurant,
      baseWeekendDiscount: 120
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['baseWeekendDiscount']);
    }
  });

  it('fails when basePreparationTime is decimal', () => {
    const result = upsertRestaurantSchema.safeParse({
      ...validRestaurant,
      basePreparationTime: 20.5
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['basePreparationTime']);
    }
  });

  it('fails when locationType is invalid', () => {
    const result = upsertRestaurantSchema.safeParse({
      ...validRestaurant,
      locationType: 'village'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['locationType']);
    }
  });

});
