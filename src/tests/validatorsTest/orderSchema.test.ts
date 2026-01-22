import {
  createOrderSchema,
  updateOrderStatusSchema
} from '../../validators/orderSchema';

describe('createOrderSchema', () => {

  const validOrder = {
    restaurantId: 1,
    customerName: 'John',
    customerPhone: '9876543210',
    items: [{ menuItemId: 1, quantity: 2 }]
  };

  it('passes with valid order', () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('fails when items are empty', () => {
    const result = createOrderSchema.safeParse({ ...validOrder, items: [] });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['items']);
    }
  });

  it('fails when quantity is negative', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [{ menuItemId: 1, quantity: -1 }]
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['items', 0, 'quantity']);
    }
  });

  it('fails when customerPhone is too short', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customerPhone: '123'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['customerPhone']);
    }
  });

});

describe('updateOrderStatusSchema', () => {

  it('passes for valid status', () => {
    const result = updateOrderStatusSchema.safeParse({ status: 'ready' });
    expect(result.success).toBe(true);
  });

  it('fails for invalid status', () => {
    const result = updateOrderStatusSchema.safeParse({ status: 'shipping' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['status']);
    }
  });

});
