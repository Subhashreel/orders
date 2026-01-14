import express from 'express';
import {
  upsertMenuItem,
  getMenuByRestaurant,
  deleteMenuItem
} from '../controllers/menuController';

const router = express.Router();

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create or update a menu item (UPSERT)
 *     tags: [Menu]
 *     description: >
 *       Inserts a new menu item if it does not exist, or updates it if the same
 *       restaurant already has an item with the same name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - name
 *               - category
 *               - basePrice
 *               - preparationComplexity
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
 *                 example: 2
 *     responses:
 *       201:
 *         description: Menu item created
 *       200:
 *         description: Menu item updated
 */
router.post('/', upsertMenuItem);

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
 *       404:
 *         description: Menu item not found
 */
router.delete('/:itemId', deleteMenuItem);

export default router;
