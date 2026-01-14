import { pool } from '../config/database';
import { Restaurant } from '../models/types';

/**
 * UPSERT Restaurant by ID
 * - If id exists -> UPDATE
 * - If id is null/undefined -> INSERT (auto-increment)
 */
export const upsertRestaurantDB = async (
  restaurant: Partial<Restaurant> & { id?: number }
) => {
  const query = `
    INSERT INTO restaurants
      (id, name, location_type, base_weekday_discount,
       base_weekend_discount, base_preparation_time, peak_hour_threshold)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      location_type = VALUES(location_type),
      base_weekday_discount = VALUES(base_weekday_discount),
      base_weekend_discount = VALUES(base_weekend_discount),
      base_preparation_time = VALUES(base_preparation_time),
      peak_hour_threshold = VALUES(peak_hour_threshold)
  `;

  const values = [
    restaurant.id ?? null, // null → auto increment insert
    restaurant.name,
    restaurant.locationType,
    restaurant.baseWeekdayDiscount,
    restaurant.baseWeekendDiscount,
    restaurant.basePreparationTime,
    restaurant.peakHourThreshold
  ];

  const [result] = await pool.execute(query, values);
  return result;
};

export const getAllRestaurantsDB = async () => {
  const [rows] = await pool.execute('SELECT * FROM restaurants');
  return rows;
};

export const getRestaurantByIdDB = async (id: number) => {
  const [rows]: any = await pool.execute(
    'SELECT * FROM restaurants WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const deleteRestaurantDB = async (id: number) => {
  const [result] = await pool.execute(
    'DELETE FROM restaurants WHERE id = ?',
    [id]
  );
  return result;
};
