import { Request, Response } from 'express';
import { MenuItem } from '../models/types';
import { createMenuItemDB, getMenuByRestaurantDB, updateMenuItemDB, deleteMenuItemDB } from '../services/menuService';

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const result = await createMenuItemDB(req.body);
    res.status(201).json({ message: 'Menu item created successfully', id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

export const getMenuByRestaurant = async (req: Request, res: Response) => {
  try {
    const rows = await getMenuByRestaurantDB(Number(req.params.restaurantId));
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const result = await updateMenuItemDB(Number(req.params.itemId), req.body);
    if (!result) return res.status(400).json({ error: 'No fields to update' });
    res.json({ message: 'Menu item updated successfully', affectedRows: (result as any).affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const result = await deleteMenuItemDB(Number(req.params.itemId));
    res.json({ message: 'Menu item deleted successfully', affectedRows: (result as any).affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};