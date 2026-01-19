// src/components/RestaurantCard.tsx

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) => (
  <div
    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 cursor-pointer ${
      isSelected ? 'border-red-500' : 'border-transparent'
    }`}
    onClick={onSelect}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{restaurant.name}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          {restaurant.locationType}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Edit2 size={16} className="text-slate-600" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-600">Weekday Discount:</span>
        <span className="font-semibold text-slate-800">{restaurant.baseWeekdayDiscount}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Weekend Discount:</span>
        <span className="font-semibold text-slate-800">{restaurant.baseWeekendDiscount}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Prep Time:</span>
        <span className="font-semibold text-slate-800">{restaurant.basePreparationTime} min</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Peak Threshold:</span>
        <span className="font-semibold text-slate-800">{restaurant.peakHourThreshold} orders</span>
      </div>
    </div>
  </div>
);