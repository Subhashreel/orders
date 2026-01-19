import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { MenuItem } from '../../types';
import { api } from '../../services/api';

export interface OrderFormData {
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  items: { menuItemId: number; quantity: number }[];
}

interface OrderFormProps {
  data: OrderFormData;
  onChange: (data: OrderFormData) => void;
  onSubmit: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  data,
  onChange,
  onSubmit,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  /* -------- Load Menu For This Restaurant -------- */

  useEffect(() => {
    if (!data.restaurantId) return;

    loadMenu();
  }, [data.restaurantId]);

  const loadMenu = async () => {
    try {
      setLoadingMenu(true);
      const items = await api.menu.getByRestaurant(data.restaurantId);
      setMenuItems(items);
    } finally {
      setLoadingMenu(false);
    }
  };

  /* -------- Item Controls -------- */

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { menuItemId: 0, quantity: 1 }],
    });
  };

  const updateItem = (
    index: number,
    field: 'menuItemId' | 'quantity',
    value: number
  ) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const removeItem = (index: number) => {
    onChange({
      ...data,
      items: data.items.filter((_, i) => i !== index),
    });
  };

  const isValid =
    data.customerName.trim() &&
    data.customerPhone.trim() &&
    data.items.length > 0 &&
    data.items.every(i => i.menuItemId && i.quantity > 0);

  /* -------- UI -------- */

  return (
    <div className="space-y-4">

      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Customer Name
        </label>
        <input
          type="text"
          value={data.customerName}
          onChange={e => onChange({ ...data, customerName: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Customer Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Customer Phone
        </label>
        <input
          type="text"
          value={data.customerPhone}
          onChange={e => onChange({ ...data, customerPhone: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Order Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-slate-700">
            Order Items
          </label>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {loadingMenu ? (
          <div className="text-sm text-slate-500">Loading menu...</div>
        ) : (
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={item.menuItemId}
                  onChange={e =>
                    updateItem(index, 'menuItemId', Number(e.target.value))
                  }
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={0}>Select menu item</option>
                  {menuItems.map(mi => (
                    <option key={mi.id} value={mi.id}>
                      {mi.name} — ₹{mi.basePrice}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e =>
                    updateItem(index, 'quantity', Number(e.target.value))
                  }
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <button
                  onClick={() => removeItem(index)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            ))}

            {data.items.length === 0 && (
              <div className="text-sm text-slate-500">
                No items added yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!isValid}
        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Order
      </button>
    </div>
  );
};
