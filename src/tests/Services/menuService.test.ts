import { getMenuByRestaurantDB } from '../../services/menuService';
import { pool } from '../../config/database';

jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn(),
    execute: jest.fn()
  }
}));

describe('getMenuByRestaurantDB', () => {

  it('returns menu rows', async () => {
    const fakeRows = [
      { id: 1, name: 'Pizza', restaurant_id: 1 }
    ];

    (pool.execute as jest.Mock).mockResolvedValue([fakeRows]);

    const result = await getMenuByRestaurantDB(1);

    expect(pool.execute).toHaveBeenCalledWith(
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [1]
    );

    expect(result).toEqual(fakeRows);
  });


  it('throws error when DB fails', async () => {
    (pool.execute as jest.Mock).mockRejectedValue(new Error('DB down'));

    await expect(getMenuByRestaurantDB(1)).rejects.toThrow('DB down');
  });

});
