import { pool } from '../config/database';
import { MenuItem } from '../models/types';

/**
 * UPSERT Menu Item
 * - Insert if new
 * - Update if (restaurant_id + name) already exists
 */
export const upsertMenuItemDB = async (item: MenuItem) => {
  const query = `
    INSERT INTO menu_items
      (restaurant_id, name, category, base_price, preparation_complexity)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category = VALUES(category),
      base_price = VALUES(base_price),
      preparation_complexity = VALUES(preparation_complexity)
  `;

  const values = [
    item.restaurantId,
    item.name,
    item.category,
    item.basePrice,
    item.preparationComplexity
  ];

  const [result] = await pool.execute(query, values);
  return result;
};

/**
 * Get full menu for a restaurant
 */
export const getMenuByRestaurantDB = async (restaurantId: number) => {
  const [rows] = await pool.execute(
    'SELECT * FROM menu_items WHERE restaurant_id = ?',
    [restaurantId]
  );
  return rows;
};

/**
 * Delete menu item by ID
 */
export const deleteMenuItemDB = async (itemId: number) => {
  const [result] = await pool.execute(
    'DELETE FROM menu_items WHERE id = ?',
    [itemId]
  );
  return result;
};

/**
 * Fetch multiple menu items by IDs (used during order creation)
 */
export const getMenuItemsByIdsDB = async (itemIds: number[]) => {
  if (itemIds.length === 0) return [];

  const placeholders = itemIds.map(() => '?').join(',');
  const [rows] = await pool.execute(
    `SELECT * FROM menu_items WHERE id IN (${placeholders})`,
    itemIds
  );
  return rows;
};
