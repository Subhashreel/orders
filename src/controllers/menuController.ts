import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../models/types';
import {
  upsertMenuItemDB,
  getMenuByRestaurantDB,
  deleteMenuItemDB
} from '../services/menuService';
import { NotFoundError } from '../utils/appError';
import { sendSuccess } from '../utils/apiResponse';

export const upsertMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item: MenuItem = req.body;
    const result: any = await upsertMenuItemDB(item);

    const isInserted = result.affectedRows === 1 && result.insertId > 0;

    return sendSuccess(
      res,
      isInserted
        ? 'Menu item created successfully'
        : 'Menu item updated successfully',
      null,
      isInserted ? 201 : 200
    );
  } catch (error) {
    next(error); // 👉 goes to global error handler
  }
};

export const getMenuByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const rows = await getMenuByRestaurantDB(restaurantId);
    return sendSuccess(res, 'Menu items fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async ( 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = Number(req.params.itemId);
    const result: any = await deleteMenuItemDB(itemId);

    if (result.affectedRows === 0) {
      throw new NotFoundError('Menu item not found');
    }

    return sendSuccess(res, 'Menu item deleted successfully');
  } catch (error) {
    next(error);
  }
};
