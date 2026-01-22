import request from 'supertest';
import express from 'express';
import menuRouter from '../../routes/menuRoutes';
import { globalErrorHandler } from '../../middlewares/errorHandler';

jest.mock('../../services/menuService', () => ({
  upsertMenuItemDB: jest.fn(),
  getMenuByRestaurantDB: jest.fn(),
  deleteMenuItemDB: jest.fn()
}));

import {
  upsertMenuItemDB,
  getMenuByRestaurantDB,
  deleteMenuItemDB
} from '../../services/menuService';

const app = express();
app.use(express.json());
app.use('/api/menu', menuRouter);
app.use(globalErrorHandler); 
afterEach(() => {
  jest.clearAllMocks();
});


describe('POST /api/menu', () => {

  it('creates menu item successfully', async () => {
    (upsertMenuItemDB as jest.Mock).mockResolvedValue({
      affectedRows: 1,
      insertId: 10
    });

    const res = await request(app)
      .post('/api/menu')
      .send({
        restaurantId: 1,
        name: 'Pizza',
        category: 'main',
        basePrice: 10,
        preparationComplexity: 2
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(upsertMenuItemDB).toHaveBeenCalledTimes(1);
  });

  it('fails validation when basePrice is negative', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({
        restaurantId: 1,
        name: 'Pizza',
        category: 'main',
        basePrice: -5,
        preparationComplexity: 2
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('basePrice');
    expect(upsertMenuItemDB).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws error', async () => {
    (upsertMenuItemDB as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/menu')
      .send({
        restaurantId: 1,
        name: 'Pizza',
        category: 'main',
        basePrice: 10,
        preparationComplexity: 2
      });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

});


describe('GET /api/menu/restaurant/:restaurantId', () => {

  it('returns menu list successfully', async () => {
    (getMenuByRestaurantDB as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Pizza' }
    ]);

    const res = await request(app)
      .get('/api/menu/restaurant/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(getMenuByRestaurantDB).toHaveBeenCalledWith(1);
  });

  it('fails when restaurantId is invalid', async () => {
    const res = await request(app)
      .get('/api/menu/restaurant/abc');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(getMenuByRestaurantDB).not.toHaveBeenCalled();
  });

  it('returns 500 when service fails', async () => {
    (getMenuByRestaurantDB as jest.Mock).mockRejectedValue(new Error('DB fail'));

    const res = await request(app)
      .get('/api/menu/restaurant/1');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

});


describe('DELETE /api/menu/:itemId', () => {

  it('deletes menu item successfully', async () => {
    (deleteMenuItemDB as jest.Mock).mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .delete('/api/menu/5');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(deleteMenuItemDB).toHaveBeenCalledWith(5);
  });

  it('returns 404 when item not found', async () => {
    (deleteMenuItemDB as jest.Mock).mockResolvedValue({ affectedRows: 0 });

    const res = await request(app)
      .delete('/api/menu/5');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('fails validation when itemId is invalid', async () => {
    const res = await request(app)
      .delete('/api/menu/abc');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(deleteMenuItemDB).not.toHaveBeenCalled();
  });

});
