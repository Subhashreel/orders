import React, { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { api } from '../services/api';

import { OrderCard } from '../components/OrderCard';
import { Modal } from '../components/Modal';
import { OrderForm, type OrderFormData } from '../components/forms/OrderForm';

interface OrdersPageProps {
  restaurantId: number;
  notify: (type: 'success' | 'error', message: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  restaurantId,
  notify,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  /* -------- Create Order Modal -------- */
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* -------- Order Details Modal -------- */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  /* -------- Cache Items Per Order -------- */
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, any[]>>({});

  /* -------- Order Form -------- */
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    restaurantId,
    customerName: '',
    customerPhone: '',
    items: [],
  });

  useEffect(() => {
    setOrderForm(prev => ({
      ...prev,
      restaurantId,
      items: [],
    }));
  }, [restaurantId]);

  /* -------- Load Orders -------- */

  useEffect(() => {
    loadOrders();
  }, [restaurantId, statusFilter]);

  const loadOrders = async () => {
    try {
      const data = await api.orders.getByRestaurant(
        restaurantId,
        statusFilter || undefined
      );
      setOrders(data);
    } catch (err: any) {
      notify('error', err?.response?.data?.message || 'Failed to fetch orders');
    }
  };

  /* -------- View Order Details + Load Items -------- */

  const viewDetails = async (order: Order) => {
    try {
      let items = itemsByOrder[order.id];

      if (!items) {
        const res = await api.orders.getById(order.id);
        items = res.items;

        setItemsByOrder(prev => ({
          ...prev,
          [order.id]: items,
        }));
      }

      setSelectedOrder(order);
      setOrderItems(items);
      setDetailsOpen(true);

    } catch (err: any) {
      notify('error', err?.response?.data?.message || 'Failed to load order details');
    }
  };

  /* -------- Create Order -------- */

  const openCreate = () => {
    setOrderForm({
      restaurantId,
      customerName: '',
      customerPhone: '',
      items: [],
    });
    setShowCreateModal(true);
  };

  const handleCreateOrder = async () => {
    try {
      await api.orders.create(orderForm);
      notify('success', 'Order created successfully');
      setShowCreateModal(false);
      loadOrders();
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors;
      const backendMessage = err?.response?.data?.message;

      if (backendErrors?.length) notify('error', backendErrors.join(', '));
      else if (backendMessage) notify('error', backendMessage);
      else notify('error', 'Failed to create order');
    }
  };

  /* -------- Update Status -------- */

  const handleStatusUpdate = async (orderId: number, status: OrderStatus) => {
    try {
      await api.orders.updateStatus(orderId, status);
      notify('success', 'Order status updated');
      loadOrders();
    } catch (err: any) {
      notify('error', err?.response?.data?.message || 'Failed to update status');
    }
  };

  /* -------- Filters -------- */

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerPhone.includes(searchTerm)
  );

  /* -------- UI -------- */

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Orders</h2>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as OrderStatus | '')
            }
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            New Order
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id}>

            <OrderCard
          order={order}
          items={itemsByOrder[order.id] || []}
          onStatusUpdate={status =>
            handleStatusUpdate(order.id, status)
          }
        />


            <div className="text-right mt-1">
              <button
                onClick={() => viewDetails(order)}
                className="text-sm text-red-600 hover:underline"
              >
                View Details
              </button>
            </div>

          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No orders found
          </div>
        )}
      </div>

      {/* -------- Create Order Modal -------- */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Order"
      >
        <OrderForm
          data={orderForm}
          onChange={setOrderForm}
          onSubmit={handleCreateOrder}
        />
      </Modal>

      {/* -------- Order Details Modal -------- */}
      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Order #${selectedOrder?.id}`}
      >
        <div className="space-y-4">

          {orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2 text-sm"
            >
              <div>
                <div className="font-medium">
                  {item.item_name} × {item.quantity}
                </div>
                <div className="text-slate-500 text-xs">
                  ₹{item.unit_price} each
                </div>
              </div>

              <div className="font-semibold">
                ₹{item.total_price}
              </div>
            </div>
          ))}

          {selectedOrder && (
            <div className="pt-3 text-sm text-right space-y-1 border-t">
              <div>Subtotal: ₹{selectedOrder.subTotal}</div>
              <div>Discount: ₹{selectedOrder.discountAmount}</div>
              <div className="font-semibold text-base">
                Total: ₹{selectedOrder.totalAmount}
              </div>
              <div className="text-slate-500">
                Est. Prep Time: {selectedOrder.estimatedPrepTime} min
              </div>
            </div>
          )}

        </div>
      </Modal>
    </div>
  );
};
