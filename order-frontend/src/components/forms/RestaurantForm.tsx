// src/components/forms/RestaurantForm.tsx

import React from 'react';
import type { Restaurant, LocationType } from '../../types';

interface RestaurantFormProps {
  data: Partial<Restaurant>;
  onChange: (data: Partial<Restaurant>) => void;
  onSubmit: () => void;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ data, onChange, onSubmit }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
      <input
        type="text"
        value={data.name || ''}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Location Type</label>
      <select
        value={data.locationType || ''}
        onChange={(e) => onChange({ ...data, locationType: e.target.value as LocationType })}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select type</option>
        <option value="college">College</option>
        <option value="workplace">Workplace</option>
        <option value="airport">Airport</option>
        <option value="city">City</option>
        <option value="urban">Urban</option>
      </select>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Weekday Discount (%)</label>
        <input
          type="number"
          value={data.baseWeekdayDiscount || ''}
          onChange={(e) => onChange({ ...data, baseWeekdayDiscount: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Weekend Discount (%)</label>
        <input
          type="number"
          value={data.baseWeekendDiscount || ''}
          onChange={(e) => onChange({ ...data, baseWeekendDiscount: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Base Prep Time (min)</label>
        <input
          type="number"
          value={data.basePreparationTime || ''}
          onChange={(e) => onChange({ ...data, basePreparationTime: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Peak Hour Threshold</label>
        <input
          type="number"
          value={data.peakHourThreshold || ''}
          onChange={(e) => onChange({ ...data, peakHourThreshold: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
    <button
      onClick={onSubmit}
      className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
    >
      Save Restaurant
    </button>
  </div>
);