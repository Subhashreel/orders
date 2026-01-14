import express from 'express';
import {
  upsertRestaurant,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant
} from '../controllers/restaurantController';

const router = express.Router();

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create or update a restaurant (UPSERT)
 *     tags: [Restaurants]
 *     description: >
 *       If id is provided and exists, the restaurant is updated.
 *       If id is not provided, a new restaurant is created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - locationType
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Campus Cafe"
 *               locationType:
 *                 type: string
 *                 enum: [college, workplace, airport, city, urban]
 *                 example: "college"
 *               baseWeekdayDiscount:
 *                 type: number
 *                 example: 5
 *               baseWeekendDiscount:
 *                 type: number
 *                 example: 15
 *               basePreparationTime:
 *                 type: integer
 *                 example: 20
 *               peakHourThreshold:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       200:
 *         description: Restaurant updated successfully
 */
router.post('/', upsertRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 */
router.get('/', getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', getRestaurantById);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete('/:id', deleteRestaurant);

export default router;
