import axios from 'axios';
import type { Restaurant, MenuItem, Order, OrderStatus } from '../types';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/* ================== HELPERS ================== */

const unwrap = <T>(res: any): T => res.data.data;

/* ========== BACKEND (snake_case) → FRONTEND (camelCase) ========= */

const mapRestaurant = (r: any): Restaurant => ({
  id: r.id,
  name: r.name,
  locationType: r.location_type,
  baseWeekdayDiscount: Number(r.base_weekday_discount),
  baseWeekendDiscount: Number(r.base_weekend_discount),
  basePreparationTime: r.base_preparation_time,
  peakHourThreshold: r.peak_hour_threshold,
});

const mapMenuItem = (m: any): MenuItem => ({
  id: m.id,
  restaurantId: m.restaurant_id,
  name: m.name,
  category: m.category,
  basePrice: Number(m.base_price),
  preparationComplexity: m.preparation_complexity,
});

const mapOrder = (o: any) => ({
  id: o.id,
  restaurantId: o.restaurant_id,
  customerName: o.customer_name,
  customerPhone: o.customer_phone,
  status: o.order_status,

  subTotal: Number(o.subtotal),
  discountAmount: Number(o.discount_amount),
  totalAmount: Number(o.total_amount),
  estimatedPrepTime: o.estimated_preparation_time,

  createdAt: o.created_at,

  items: [], // ✅ REQUIRED for Order type
});



/* ================== API ================== */

export const api = {
  /* ---------- RESTAURANTS ---------- */

  restaurants: {
    getAll: async (): Promise<Restaurant[]> => {
      const res = await apiClient.get('/restaurants');
      return unwrap<any[]>(res).map(mapRestaurant);
    },

    create: async (data: Partial<Restaurant>): Promise<void> => {
      // 🔥 SEND CAMELCASE — backend service expects camelCase
      await apiClient.post('/restaurants', data);
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/restaurants/${id}`);
    },
  },

  /* ---------- MENU (PER RESTAURANT) ---------- */

  menu: {
    getByRestaurant: async (restaurantId: number): Promise<MenuItem[]> => {
      const res = await apiClient.get(`/menu/restaurant/${restaurantId}`);
      return unwrap<any[]>(res).map(mapMenuItem);
    },

    create: async (data: Partial<MenuItem>): Promise<void> => {
      // 🔥 SEND CAMELCASE
      await apiClient.post('/menu', data);
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/menu/${id}`);
    },
  },

  /* ---------- ORDERS (PER RESTAURANT) ---------- */

  orders: {
    getByRestaurant: async (restaurantId: number, status?: OrderStatus) => {
  const res = await apiClient.get(`/orders/restaurant/${restaurantId}`, {
    params: status ? { status } : {},
  });

  const rows = unwrap<any[]>(res);
  return rows.map(mapOrder);
},

    create: async (data: Partial<Order>): Promise<any> => {
      // 🔥 SEND CAMELCASE CreateOrderRequest
      const res = await apiClient.post('/orders', data);
      return unwrap<any>(res); // backend returns calculation summary
    },

    updateStatus: async (orderId: number, status: OrderStatus): Promise<void> => {
      await apiClient.put(`/orders/${orderId}/status`, { status });
    },

    getById: async (orderId: number) => {
  const res = await apiClient.get(`/orders/${orderId}`);
  const data = unwrap<any>(res);

  return {
    order: mapOrder(data.order),
    items: data.items,
  };
},

  },
};
