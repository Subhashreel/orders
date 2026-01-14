import { Request, Response } from 'express';
import { Restaurant } from '../models/types';
import { createRestaurantDB, getAllRestaurantsDB, getRestaurantByIdDB, updateRestaurantDB, deleteRestaurantDB } from '../services/restaurantService';

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const result = await createRestaurantDB(req.body);
    res.status(201).json({ message: 'Restaurant created successfully', id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const rows = await getAllRestaurantsDB();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantByIdDB(Number(req.params.id));
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const result = await updateRestaurantDB(Number(req.params.id), req.body);
    if (!result) return res.status(400).json({ error: 'No fields to update' });
    res.json({ message: 'Restaurant updated successfully', affectedRows: (result as any).affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const result = await deleteRestaurantDB(Number(req.params.id));
    res.json({ message: 'Restaurant deleted successfully', affectedRows: (result as any).affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};