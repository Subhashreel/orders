import { Request, Response } from 'express';
import {upsertRestaurantDB,getAllRestaurantsDB,getRestaurantByIdDB,deleteRestaurantDB} from '../services/restaurantService';

export const upsertRestaurant = async (req: Request, res: Response) => {
  try {
    const result: any = await upsertRestaurantDB(req.body);

    const isInserted = result.affectedRows === 1 && result.insertId > 0;
    const isUpdated = result.affectedRows === 2;

    res.status(isInserted ? 201 : 200).json({
      message: isInserted
        ? 'Restaurant created successfully'
        : 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upsert restaurant' });
  }
};

export const getAllRestaurants = async (_req: Request, res: Response) => {
  try {
    const rows = await getAllRestaurantsDB();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantByIdDB(Number(req.params.id));
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const result: any = await deleteRestaurantDB(Number(req.params.id));

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};
