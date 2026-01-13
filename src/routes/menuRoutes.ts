import express from 'express';
import { createMenuItem, getMenuByRestaurant, updateMenuItem, deleteMenuItem } from '../controllers/menuController';

const router = express.Router();

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a menu item
 *     tags: [Menu]
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
 *               name:
 *                 type: string
 *                 example: "Margherita Pizza"
 *               category:
 *                 type: string
 *                 enum: [appetizer, main, dessert, beverage]
 *                 example: "main"
 *               basePrice:
 *                 type: number
 *                 example: 12.99
 *               preparationComplexity:
 *                 type: number
 *                 example: 1.5
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post('/', createMenuItem);

/**
 * @swagger
 * /api/menu/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu items list
 */
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

/**
 * @swagger
 * /api/menu/{itemId}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               preparationComplexity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.put('/:itemId', updateMenuItem);

/**
 * @swagger
 * /api/menu/{itemId}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted
 */
router.delete('/:itemId', deleteMenuItem);

export default router;