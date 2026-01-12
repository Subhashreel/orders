import express from 'express';
import { 
  createRestaurant, 
  getAllRestaurants, 
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController';

const router = express.Router();

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location_type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Campus Cafe"
 *               location_type:
 *                 type: string
 *                 enum: [college, workplace, airport, city, urban]
 *                 example: "college"
 *               base_weekday_discount:
 *                 type: number
 *                 example: 5
 *               base_weekend_discount:
 *                 type: number
 *                 example: 15
 *               base_preparation_time:
 *                 type: integer
 *                 example: 20
 *               peak_hour_threshold:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post('/', createRestaurant);

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
 */
router.get('/:id', getRestaurantById);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               location_type:
 *                 type: string
 *               base_weekday_discount:
 *                 type: number
 *               base_weekend_discount:
 *                 type: number
 *               base_preparation_time:
 *                 type: integer
 *               peak_hour_threshold:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put('/:id', updateRestaurant);

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
 *         description: Restaurant deleted
 */
router.delete('/:id', deleteRestaurant);

export default router;