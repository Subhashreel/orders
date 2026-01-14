import { pool } from '../config/database';
import { MenuItem } from '../models/types';

export const createMenuItemDB = async (item: MenuItem) => {
  const [result] = await pool.execute(
    `INSERT INTO menu_items (restaurant_id, name, category, base_price, preparation_complexity)
     VALUES (?, ?, ?, ?, ?)`,
    [
      item.restaurantId,
      item.name,
      item.category,
      item.basePrice,
      item.preparationComplexity
    ]
  );
  return result;
};

export const getMenuByRestaurantDB = async (restaurantId: number) => {
  const [rows] = await pool.execute(
    'SELECT * FROM menu_items WHERE restaurant_id = ?',
    [restaurantId]
  );
  return rows;
};

export const updateMenuItemDB = async (itemId: number, item: Partial<MenuItem>) => {
  const fields: string[] = [];
  const values: any[] = [];

  if (item.name !== undefined) {
    fields.push('name = ?');
    values.push(item.name);
  }
  if (item.category !== undefined) {
    fields.push('category = ?');
    values.push(item.category);
  }
  if (item.basePrice !== undefined) {
    fields.push('base_price = ?');
    values.push(item.basePrice);
  }
  if (item.preparationComplexity !== undefined) {
    fields.push('preparation_complexity = ?');
    values.push(item.preparationComplexity);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(itemId);
  const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(query, values);
  return result;
};

export const deleteMenuItemDB = async (itemId: number) => {
  const [result] = await pool.execute('DELETE FROM menu_items WHERE id = ?', [itemId]);
  return result;
};

export const getMenuItemsByIdsDB = async (itemIds: number[]) => {
  const placeholders = itemIds.map(() => '?').join(',');
  const [rows] = await pool.execute(
    `SELECT * FROM menu_items WHERE id IN (${placeholders})`,
    itemIds
  );
  return rows;
};
