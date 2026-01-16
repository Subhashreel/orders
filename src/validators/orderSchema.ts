import { z } from 'zod';
import { ORDER_STATUSES } from '../constants/appConstants';

//BODY — CREATE ORDER

export const createOrderSchema = z
  .object({
    restaurantId: z
      .number()
      .int('restaurantId must be an integer')
      .positive('restaurantId must be greater than 0'),

    customerName: z.string().min(1, 'Customer name is required'),

    customerPhone: z
      .string()
      .min(8, 'Customer phone must be at least 8 characters'),

    items: z
      .array(
        z.object({
          menuItemId: z
            .number()
            .int('menuItemId must be an integer')
            .positive('menuItemId must be greater than 0'),

          quantity: z
            .number()
            .int('quantity must be an integer')
            .positive('quantity must be greater than 0')
        })
      )
      .min(1, 'At least one item is required')
  })
  .strict();

//BODY — UPDATE STATUS

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUSES)
  })
  .strict();

//PARAMS

export const orderIdParamSchema = z.object({
  orderId: z.string().regex(/^\d+$/, 'orderId must be a valid number')
});

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().regex(/^\d+$/, 'restaurantId must be a valid number')
});


//QUERY

export const ordersQuerySchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),

    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
      .optional()
  })
  .strict();
