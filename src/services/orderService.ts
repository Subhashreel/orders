import { pool } from '../config/database';
import { OrderStatus } from '../models/types';

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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult]: any = await conn.execute(
      `INSERT INTO orders (restaurant_id, customer_name, customer_phone, order_status,
       subtotal, discount_percentage, discount_amount, total_amount, 
       estimated_preparation_time, order_date, order_time)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
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

    await conn.execute(
      'INSERT INTO order_status_history (order_id, new_status) VALUES (?, "pending")',
      [orderResult.insertId]
    );

    await conn.commit();
    conn.release();
    return orderResult.insertId;
  } catch (error) {
    await conn.rollback();
    conn.release();
    throw error;
  }
};

export const addOrderItemsDB = async (orderId: number, items: any[]) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const item of items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.menuItemId, item.quantity, item.unitPrice, item.totalPrice]
      );
    }

    await conn.commit();
    conn.release();
  } catch (error) {
    await conn.rollback();
    conn.release();
    throw error;
  }
};

export const updateOrderStatusDB = async (orderId: number, newStatus: OrderStatus) => {
  const conn = await pool.getConnection();
  try {
    const [orders]: any = await conn.execute(
      'SELECT order_status FROM orders WHERE id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      conn.release();
      return null;
    }

    const oldStatus = orders[0].order_status;

    await conn.beginTransaction();

    await conn.execute('UPDATE orders SET order_status = ? WHERE id = ?', [newStatus, orderId]);

    await conn.execute(
      'INSERT INTO order_status_history (order_id, old_status, new_status) VALUES (?, ?, ?)',
      [orderId, oldStatus, newStatus]
    );

    await conn.commit();
    conn.release();
    return { oldStatus, newStatus };
  } catch (error) {
    await conn.rollback();
    conn.release();
    throw error;
  }
};

export const getOrderByIdDB = async (orderId: number) => {
  const [orders]: any = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);

  if (orders.length === 0) {
    return null;
  }

  const [items] = await pool.execute(
    `SELECT oi.*, mi.name as item_name FROM order_items oi
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  const [history] = await pool.execute(
    'SELECT * FROM order_status_history WHERE order_id = ? ORDER BY changed_at',
    [orderId]
  );

  return { order: orders[0], items, statusHistory: history };
};

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
    query += ' AND order_date = ?';
    params.push(date);
  }

  query += ' ORDER BY created_at DESC';

  const [orders] = await pool.execute(query, params);
  return orders;
};

export const getRestaurantForOrderDB = async (restaurantId: number) => {
  const [restaurants]: any = await pool.execute('SELECT * FROM restaurants WHERE id = ?', [
    restaurantId
  ]);
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

export const getHourlyOrderCountDB = async (restaurantId: number, currentHour: number) => {
  const [hourlyOrders]: any = await pool.execute(
    `SELECT COUNT(*) as count FROM orders 
     WHERE restaurant_id = ? 
     AND DATE(created_at) = CURDATE() 
     AND HOUR(created_at) = ?`,
    [restaurantId, currentHour]
  );
  return hourlyOrders[0].count;
};
