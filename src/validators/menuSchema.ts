import { z } from 'zod';
import { MENU_CATEGORIES } from '../constants/appConstants';

//BODY VALIDATION 
export const upsertMenuSchema = z
  .object({
    id: z
      .number()
      .int('id must be an integer')
      .positive('id must be greater than 0')
      .optional(),

    restaurantId: z
      .number()
      .int('restaurantId must be an integer')
      .positive('restaurantId must be greater than 0'),

    name: z.string().min(1, 'Menu item name is required'),

    category: z
      .enum(MENU_CATEGORIES)
      .refine(val => MENU_CATEGORIES.includes(val), {
        message: 'Invalid menu category'
      }),

    basePrice: z.number().positive('basePrice must be greater than 0'),

    preparationComplexity: z
    .number()
    .positive('preparationComplexity must be greater than 0')
    .max(9.99, 'preparationComplexity must be less than or equal to 9.99')

  })
  .strict();
  
//PARAM VALIDATION 

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().regex(/^\d+$/, 'restaurantId must be a valid number')
});

export const itemIdParamSchema = z.object({
  itemId: z.string().regex(/^\d+$/, 'itemId must be a valid number')
});
