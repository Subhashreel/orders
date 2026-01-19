// // src/components/OrderCard.tsx

// import React from 'react';
// import { Clock } from 'lucide-react';
// import type { Order, OrderStatus } from '../types';

// interface OrderCardProps {
//   order: Order;
//   onStatusUpdate: (status: OrderStatus) => void;
// }

// const getStatusColor = (status: OrderStatus) => {
//   const colors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     confirmed: 'bg-blue-100 text-blue-800',
//     preparing: 'bg-rose-100 text-rose-800',
//     ready: 'bg-green-100 text-green-800',
//     delivered: 'bg-gray-100 text-gray-800',
//     cancelled: 'bg-red-100 text-red-800'
//   };
//   return colors[status];
// };

// export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => (
//   <div className="bg-white rounded-xl shadow-md p-6">
//     <div className="flex justify-between items-start mb-4">
//       <div>
//         <div className="flex items-center gap-3 mb-2">
//           <h3 className="font-bold text-lg text-slate-800">Order #{order.id}</h3>
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//             {order.status}
//           </span>
//         </div>
//         <p className="text-slate-600">{order.customerName} • {order.customerPhone}</p>
//         <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
//       </div>
//       <div className="text-right">
//         <p className="text-2xl font-bold text-red-600">${order.totalAmount.toFixed(2)}</p>
//         <p className="text-sm text-slate-500">Discount: ${order.discountAmount.toFixed(2)}</p>
//         <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
//           <Clock size={14} />
//           {order.estimatedPrepTime} min
//         </div>
//       </div>
//     </div>

//     <div className="border-t border-slate-200 pt-4 mb-4">
//       <p className="text-sm font-semibold text-slate-700 mb-2">Items:</p>
//       <div className="space-y-1">
//         {order.items.map((item, idx) => (
//           <div key={idx} className="flex justify-between text-sm">
//             <span className="text-slate-600">
//               {item.quantity}x Item #{item.menuItemId}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>

//     <div className="flex gap-2 flex-wrap">
//       {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map(status => (
//         <button
//           key={status}
//           onClick={() => onStatusUpdate(status as OrderStatus)}
//           disabled={order.status === status}
//           className={`px-3 py-1 text-xs rounded-lg transition-all ${
//             order.status === status
//               ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
//               : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700'
//           }`}
//         >
//           {status}
//         </button>
//       ))}
//     </div>
//   </div>
// );

import React from 'react';
import type { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  items?: any[]; // 👈 NEW
  onStatusUpdate: (status: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  items = [],
  onStatusUpdate,
}) => {
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
          <div className="text-sm text-slate-500">
            ⏱ {order.estimatedPrepTime} min
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Items Section */}
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
            Click "View Details" to load items
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
