import { Request, Response, NextFunction } from 'express';
import {
  upsertRestaurantDB, getAllRestaurantsDB,
  getRestaurantByIdDB, deleteRestaurantDB
} from '../services/restaurantService';
import { NotFoundError } from '../utils/appError';
import { sendSuccess } from '../utils/apiResponse';

export const upsertRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await upsertRestaurantDB(req.body);
    const isInserted = result.affectedRows === 1 && result.insertId > 0;

    return sendSuccess(
      res,
      isInserted ? 'Restaurant created successfully' : 'Restaurant updated successfully',
      null,
      isInserted ? 201 : 200
    );
  } catch (e) { next(e); }
};

export const getAllRestaurants = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await getAllRestaurantsDB();
    return sendSuccess(res, 'Restaurants fetched successfully', rows);
  } catch (e) { next(e); }
};

export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await getRestaurantByIdDB(Number(req.params.id));
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return sendSuccess(res, 'Restaurant fetched successfully', restaurant);
  } catch (e) { next(e); }
};

export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await deleteRestaurantDB(Number(req.params.id));
    if (result.affectedRows === 0) throw new NotFoundError('Restaurant not found');
    return sendSuccess(res, 'Restaurant deleted successfully');
  } catch (e) { next(e); }
};
