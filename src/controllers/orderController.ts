import { Request, Response } from 'express';
import { CreateOrderRequest, OrderStatus } from '../models/types';
import { processOrderCalculations } from '../utils/orderProcessor';
import { createOrderDB, addOrderItemsDB, updateOrderStatusDB, getOrderByIdDB, getOrdersByRestaurantDB } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: CreateOrderRequest = req.body;
    const { orderItems, subtotal, discountPercentage, discountAmount, totalAmount, estimatedPrepTime, isPeakHour } = await processOrderCalculations(orderRequest);

    const orderId = await createOrderDB(
      orderRequest.restaurantId,
      orderRequest.customerName,
      orderRequest.customerPhone,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      estimatedPrepTime
    );

    await addOrderItemsDB(orderId, orderItems);

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      estimatedPreparationTime: estimatedPrepTime,
      isPeakHour
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create order',
      details: (error as Error).message
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const result = await updateOrderStatusDB(Number(req.params.orderId), req.body.status);
    if (!result) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully', oldStatus: result.oldStatus, newStatus: result.newStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const result = await getOrderByIdDB(Number(req.params.orderId));
    if (!result) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: result.order, items: result.items, status_history: result.statusHistory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const getOrdersByRestaurant = async (req: Request, res: Response) => {
  try {
    const orders = await getOrdersByRestaurantDB(Number(req.params.restaurantId), req.query.status as string | undefined, req.query.date as string | undefined);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};