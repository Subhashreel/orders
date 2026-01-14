import { Request, Response } from 'express';
import { MenuItem } from '../models/types';
import {
  upsertMenuItemDB,
  getMenuByRestaurantDB,
  deleteMenuItemDB
} from '../services/menuService';

export const upsertMenuItem = async (req: Request, res: Response) => {
  try {
    const item: MenuItem = req.body;

    const result: any = await upsertMenuItemDB(item);

    const isInserted = result.affectedRows === 1 && result.insertId > 0;
    const isUpdated = result.affectedRows === 2;

    res.status(isInserted ? 201 : 200).json({
      message: isInserted
        ? 'Menu item created successfully'
        : 'Menu item updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upsert menu item' });
  }
};

export const getMenuByRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const rows = await getMenuByRestaurantDB(restaurantId);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.itemId);
    const result: any = await deleteMenuItemDB(itemId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};
