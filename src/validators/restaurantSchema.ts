import { z } from 'zod';
import { LOCATION_TYPES } from '../constants/appConstants';

//BODY — UPSERT RESTAURANT

export const upsertRestaurantSchema = z
  .object({
    id: z
      .number()
      .int('id must be an integer')
      .positive('id must be greater than 0')
      .optional(),

    name: z.string().min(1, 'Restaurant name is required'),

    locationType: z
      .enum(LOCATION_TYPES)
      .refine(val => LOCATION_TYPES.includes(val), {
        message: 'Invalid location type'
      }),

    baseWeekdayDiscount: z
      .number()
      .min(0, 'baseWeekdayDiscount cannot be negative')
      .max(100, 'baseWeekdayDiscount cannot exceed 100'),

    baseWeekendDiscount: z
      .number()
      .min(0, 'baseWeekendDiscount cannot be negative')
      .max(100, 'baseWeekendDiscount cannot exceed 100'),

    basePreparationTime: z
      .number()
      .int('basePreparationTime must be an integer')
      .positive('basePreparationTime must be greater than 0'),

    peakHourThreshold: z
      .number()
      .int('peakHourThreshold must be an integer')
      .positive('peakHourThreshold must be greater than 0')
  })
  .strict(); // no extra fields allowed

//PARAMS
 

export const restaurantIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a valid number')
});
