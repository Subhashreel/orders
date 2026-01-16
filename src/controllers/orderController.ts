import { Request, Response, NextFunction } from 'express';
import { CreateOrderRequest, OrderStatus } from '../models/types';
import { processOrderCalculations } from '../utils/orderProcessor';
import {
  createOrderDB, addOrderItemsDB, updateOrderStatusDB,
  getOrderByIdDB, getOrdersByRestaurantDB
} from '../services/orderService';
import { NotFoundError } from '../utils/appError';
import { sendSuccess } from '../utils/apiResponse';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const o: CreateOrderRequest = req.body;
    const { orderItems, subtotal, discountPercentage, discountAmount, totalAmount, estimatedPrepTime, isPeakHour }
      = await processOrderCalculations(o);

    const orderId = await createOrderDB(
      o.restaurantId, o.customerName, o.customerPhone,
      subtotal, discountPercentage, discountAmount, totalAmount, estimatedPrepTime
    );

    await addOrderItemsDB(orderId, orderItems);

    return sendSuccess(res, 'Order created successfully', {
      orderId, subtotal, discountPercentage, discountAmount,
      totalAmount, estimatedPreparationTime: estimatedPrepTime, isPeakHour
    }, 201);
  } catch (e) { next(e); }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const result = await updateOrderStatusDB(orderId, req.body.status);
    if (!result) throw new NotFoundError('Order not found');
    return sendSuccess(res, 'Order status updated successfully', result);
  } catch (e) { next(e); }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOrderByIdDB(Number(req.params.orderId));
    if (!result) throw new NotFoundError('Order not found');
    return sendSuccess(res, 'Order fetched successfully', result);
  } catch (e) { next(e); }
};

export const getOrdersByRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { restaurantId } = req.params;
    const orders = await getOrdersByRestaurantDB(
      Number(restaurantId), req.query.status as string, req.query.date as string
    );
    return sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (e) { next(e); }
};
