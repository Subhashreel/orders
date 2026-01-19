// src/components/MenuItemCard.tsx

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-rose-100 text-rose-800 text-xs rounded-full">
          {item.category}
        </span>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Edit2 size={16} className="text-slate-600" />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-600">Price:</span>
        <span className="font-bold text-red-600">${item.basePrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Complexity:</span>
        <span className="font-semibold text-slate-800">{item.preparationComplexity}</span>
      </div>
    </div>
  </div>
);