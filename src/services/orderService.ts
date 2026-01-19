import { pool } from '../config/database';
import { OrderStatus } from '../models/types';
import { withTransaction } from '../utils/dbTransaction';

//create order

export const createOrderDB = async (
  restaurantId: number,
  customerName: string,
  customerPhone: string,
  subtotal: number,
  discountPercentage: number,
  discountAmount: number,
  totalAmount: number,
  estimatedPrepTime: number
) => {
  return withTransaction(async (conn) => {
    const [orderResult]: any = await conn.execute(
      `INSERT INTO orders (
        restaurant_id, customer_name, customer_phone, order_status,
        subtotal, discount_percentage, discount_amount, total_amount,
        estimated_preparation_time
      )
      VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        customerName,
        customerPhone,
        subtotal,
        discountPercentage,
        discountAmount,
        totalAmount,
        estimatedPrepTime
      ]
    );

    return orderResult.insertId;
  });
};

//add order items to an order

export const addOrderItemsDB = async (orderId: number, items: any[]) => {
  return withTransaction(async (conn) => {
    for (const item of items) {
      await conn.execute(
        `INSERT INTO order_items (
          order_id, menu_item_id, quantity, unit_price, total_price
        )
        VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.menuItemId, item.quantity, item.unitPrice, item.totalPrice]
      );
    }
  });
};

//update order status

export const updateOrderStatusDB = async (orderId: number, newStatus: OrderStatus) => {
  return withTransaction(async (conn) => {
    const [orders]: any = await conn.execute(
      'SELECT id FROM orders WHERE id = ?',
      [orderId]
    );

    if (orders.length === 0) return null;

    await conn.execute(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [newStatus, orderId]
    );

    return { newStatus };
  });
};

//get order by ID with items

export const getOrderByIdDB = async (orderId: number) => {
  const [orders]: any = await pool.execute(
    'SELECT * FROM orders WHERE id = ?',
    [orderId]
  );

  if (orders.length === 0) return null;

  const [items] = await pool.execute(
    `SELECT oi.*, mi.name AS item_name
     FROM order_items oi
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return { order: orders[0], items };
};

//get orders by restaurant with optional filters

export const getOrdersByRestaurantDB = async (
  restaurantId: number,
  status?: string,
  date?: string
) => {
  let query = 'SELECT * FROM orders WHERE restaurant_id = ?';
  const params: any[] = [restaurantId];

  if (status) {
    query += ' AND order_status = ?';
    params.push(status);
  }

  if (date) {
    query += ' AND DATE(created_at) = ?';
    params.push(date);
  }

  query += ' ORDER BY created_at DESC';

  const [orders] = await pool.execute(query, params);
  return orders;
};

//get restaurant details for order calculations

export const getRestaurantForOrderDB = async (restaurantId: number) => {
  const [restaurants]: any = await pool.execute(
    'SELECT * FROM restaurants WHERE id = ?',
    [restaurantId]
  );

  if (restaurants.length === 0) return null;

  const row = restaurants[0];
  return {
    id: row.id,
    name: row.name,
    locationType: row.location_type,
    baseWeekdayDiscount: row.base_weekday_discount,
    baseWeekendDiscount: row.base_weekend_discount,
    basePreparationTime: row.base_preparation_time,
    peakHourThreshold: row.peak_hour_threshold
  };
};

//hourly order count for peak hour calculation

export const getHourlyOrderCountDB = async (restaurantId: number, currentHour: number) => {
  const [hourlyOrders]: any = await pool.execute(
    `SELECT COUNT(*) AS count
     FROM orders
     WHERE restaurant_id = ?
     AND DATE(created_at) = CURDATE()
     AND HOUR(created_at) = ?`,
    [restaurantId, currentHour]
  );

  return hourlyOrders[0].count;
};

