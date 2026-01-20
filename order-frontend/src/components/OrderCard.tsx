import React, { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  items?: any[];
  onStatusUpdate: (status: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  items = [],
  onStatusUpdate,
}) => {

  /* -------- Countdown Timer -------- */

  const calcRemaining = () => {
    const created = new Date(order.createdAt).getTime();
    const now = Date.now();
    const diffMin = Math.floor((now - created) / 60000); // minutes passed
    return Math.max(order.estimatedPrepTime - diffMin, 0);
  };

  const [remainingTime, setRemainingTime] = useState<number>(calcRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calcRemaining());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [order.createdAt, order.estimatedPrepTime]);

  /* -------- UI -------- */

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Order #{order.id}
          </h3>

          <div className="text-slate-600 text-sm mt-1">
            {order.customerName} • {order.customerPhone}
          </div>

          <div className="text-slate-400 text-xs mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="text-right">
          <div className="text-red-600 text-xl font-bold">
            ₹{order.totalAmount}
          </div>
          <div className="text-sm text-slate-500">
            Discount: ₹{order.discountAmount}
          </div>

          {/* ⏳ LIVE TIMER */}
          <div
            className={`text-sm font-semibold ${
              remainingTime <= 2 ? 'text-red-600' : 'text-slate-600'
            }`}
          >
            ⏱ {remainingTime} min left
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Items */}
      <div className="mb-3">
        <div className="font-medium text-slate-700 mb-1">Items:</div>

        {items.length > 0 ? (
          <div className="space-y-1 text-sm text-slate-600">
            {items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.item_name} × {item.quantity}</span>
                <span>₹{item.total_price}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-400">
            Loading items...
          </div>
        )}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        {['pending','confirmed','preparing','ready','delivered'].map(s => (
          <button
            key={s}
            onClick={() => onStatusUpdate(s as OrderStatus)}
            className={`px-3 py-1 rounded-full text-xs ${
              order.status === s
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  );
};
