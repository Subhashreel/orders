import { Request, Response, NextFunction } from 'express';
import { CreateOrderRequest, OrderStatus } from '../models/types';
import { processOrderCalculations } from '../utils/orderProcessor';
import {
  createOrderDB,
  addOrderItemsDB,
  updateOrderStatusDB,
  getOrderByIdDB,
  getOrdersByRestaurantDB
} from '../services/orderService';
import { NotFoundError, BadRequestError } from '../utils/appError';
import { sendSuccess } from '../utils/apiResponse';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const o: CreateOrderRequest = req.body;

    const {
      orderItems,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      estimatedPrepTime,
      isPeakHour
    } = await processOrderCalculations(o);

    const orderId = await createOrderDB(
      o.restaurantId,
      o.customerName,
      o.customerPhone,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      estimatedPrepTime
    );

    await addOrderItemsDB(orderId, orderItems);

    return sendSuccess(
      res,
      'Order created successfully',
      {
        orderId,
        subtotal,
        discountPercentage,
        discountAmount,
        totalAmount,
        estimatedPreparationTime: estimatedPrepTime,
        isPeakHour
      },
      201
    );
  } catch (e) {
    next(e);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body as { status: OrderStatus };

    if (!status) throw new BadRequestError('Status is required');

    const result = await updateOrderStatusDB(orderId, status);

    if (!result) throw new NotFoundError('Order not found');

    return sendSuccess(res, 'Order status updated successfully', result);
  } catch (e) {
    next(e);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);

    const result = await getOrderByIdDB(orderId);

    if (!result) throw new NotFoundError('Order not found');

    return sendSuccess(res, 'Order fetched successfully', result);
  } catch (e) {
    next(e);
  }
};

export const getOrdersByRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const status = req.query.status as string | undefined;
    const date = req.query.date as string | undefined;

    const orders = await getOrdersByRestaurantDB(restaurantId, status, date);

    return sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (e) {
    next(e);
  }
};
