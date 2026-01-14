import { pool } from '../config/database';
import { Restaurant } from '../models/types';

export const createRestaurantDB = async (restaurant: Restaurant) => {
  const [result] = await pool.execute(
    `INSERT INTO restaurants (name, location_type, base_weekday_discount, 
     base_weekend_discount, base_preparation_time, peak_hour_threshold)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      restaurant.name,
      restaurant.locationType,
      restaurant.baseWeekdayDiscount,
      restaurant.baseWeekendDiscount,
      restaurant.basePreparationTime,
      restaurant.peakHourThreshold
    ]
  );
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

export const updateRestaurantDB = async (id: number, updates: Partial<Restaurant>) => {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.locationType !== undefined) {
    fields.push('location_type = ?');
    values.push(updates.locationType);
  }
  if (updates.baseWeekdayDiscount !== undefined) {
    fields.push('base_weekday_discount = ?');
    values.push(updates.baseWeekdayDiscount);
  }
  if (updates.baseWeekendDiscount !== undefined) {
    fields.push('base_weekend_discount = ?');
    values.push(updates.baseWeekendDiscount);
  }
  if (updates.basePreparationTime !== undefined) {
    fields.push('base_preparation_time = ?');
    values.push(updates.basePreparationTime);
  }
  if (updates.peakHourThreshold !== undefined) {
    fields.push('peak_hour_threshold = ?');
    values.push(updates.peakHourThreshold);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);
  const query = `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(query, values);
  return result;
};

export const deleteRestaurantDB = async (id: number) => {
  const [result] = await pool.execute('DELETE FROM restaurants WHERE id = ?', [id]);
  return result;
};
