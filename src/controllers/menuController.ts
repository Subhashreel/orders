import { Request, Response } from 'express';
import { pool } from '../config/database';
import { MenuItem } from '../models/types';

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const item: MenuItem = req.body;
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
    res.status(201).json({ 
      message: 'Menu item created successfully', 
      id: (result as any).insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

export const getMenuByRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [restaurantId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item: Partial<MenuItem> = req.body;
    
    // Build dynamic update query
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
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(itemId);
    const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    res.json({ 
      message: 'Menu item updated successfully', 
      affectedRows: (result as any).affectedRows 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [itemId]
    );
    res.json({ 
      message: 'Menu item deleted successfully', 
      affectedRows: (result as any).affectedRows 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};