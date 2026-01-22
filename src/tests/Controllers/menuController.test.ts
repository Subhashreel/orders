import request from 'supertest';
import express from 'express';
import menuRouter from '../../routes/menuRoutes';
import { globalErrorHandler } from '../../middlewares/errorHandler';

// ✅ mock service layer (NOT DB directly)
jest.mock('../../services/menuService', () => ({
  upsertMenuItemDB: jest.fn(),
  getMenuByRestaurantDB: jest.fn(),
  deleteMenuItemDB: jest.fn()
}));

import { upsertMenuItemDB } from '../../services/menuService';

const app = express();
app.use(express.json());
app.use('/api/menu', menuRouter);
app.use(globalErrorHandler); 

describe('POST /api/menu', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

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


  it('fails when basePrice is negative (validation)', async () => {

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


  it('returns error when service throws', async () => {

    (upsertMenuItemDB as jest.Mock).mockRejectedValue(
      new Error('DB error')
    );

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
