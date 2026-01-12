import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Restaurant } from '../models/types';

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant: Restaurant = req.body;
    const [result] = await pool.execute(
      `INSERT INTO restaurants (name, location_type, base_weekday_discount, 
       base_weekend_discount, base_preparation_time, peak_hour_threshold)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        restaurant.name,
        restaurant.location_type,
        restaurant.base_weekday_discount,
        restaurant.base_weekend_discount,
        restaurant.base_preparation_time,
        restaurant.peak_hour_threshold
      ]
    );
    res.status(201).json({ 
      message: 'Restaurant created successfully', 
      id: (result as any).insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: Partial<Restaurant> = req.body;
    
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.location_type !== undefined) {
      fields.push('location_type = ?');
      values.push(updates.location_type);
    }
    if (updates.base_weekday_discount !== undefined) {
      fields.push('base_weekday_discount = ?');
      values.push(updates.base_weekday_discount);
    }
    if (updates.base_weekend_discount !== undefined) {
      fields.push('base_weekend_discount = ?');
      values.push(updates.base_weekend_discount);
    }
    if (updates.base_preparation_time !== undefined) {
      fields.push('base_preparation_time = ?');
      values.push(updates.base_preparation_time);
    }
    if (updates.peak_hour_threshold !== undefined) {
      fields.push('peak_hour_threshold = ?');
      values.push(updates.peak_hour_threshold);
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);
    res.json({ 
      message: 'Restaurant updated successfully', 
      affectedRows: (result as any).affectedRows 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM restaurants WHERE id = ?',
      [id]
    );
    res.json({ 
      message: 'Restaurant deleted successfully', 
      affectedRows: (result as any).affectedRows 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};