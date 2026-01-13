import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersByRestaurant
} from '../controllers/orderController';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order with dynamic discount and automated prep time
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               customerName:
 *                 type: string
 *                 example: "John Doe"
 *               customerPhone:
 *                 type: string
 *                 example: "+1234567890"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created with calculated discount
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:orderId/status', updateOrderStatus);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details with items and history
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:orderId', getOrderById);

/**
 * @swagger
 * /api/orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Get orders for a restaurant
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);

export default router;