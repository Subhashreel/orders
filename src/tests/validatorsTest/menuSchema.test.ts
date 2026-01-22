import { upsertMenuSchema } from '../../validators/menuSchema';

describe('upsertMenuSchema', () => {

  const validMenu = {
    restaurantId: 1,
    name: 'Pizza',
    category: 'main',
    basePrice: 200,
    preparationComplexity: 2.5
  };

  it('passes with valid data', () => {
    const result = upsertMenuSchema.safeParse(validMenu);
    expect(result.success).toBe(true);
  });

  it('fails when name is missing', () => {
    const result = upsertMenuSchema.safeParse({ ...validMenu, name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name']);
    }
  });

  it('fails when basePrice is negative', () => {
    const result = upsertMenuSchema.safeParse({ ...validMenu, basePrice: -10 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['basePrice']);
    }
  });

  it('fails when category is invalid', () => {
    const result = upsertMenuSchema.safeParse({ ...validMenu, category: 'snack' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['category']);
    }
  });

  it('fails when restaurantId is missing', () => {
    const { restaurantId, ...rest } = validMenu;
    const result = upsertMenuSchema.safeParse(rest);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['restaurantId']);
    }
  });

});
