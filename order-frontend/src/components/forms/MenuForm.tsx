import React from 'react';
import type { MenuItem, MenuCategory } from '../../types';

interface MenuFormProps {
  data: Partial<MenuItem>;
  onChange: (data: Partial<MenuItem>) => void;
  onSubmit: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({ data, onChange, onSubmit }) => (
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
      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
      <select
        value={data.category || ''}
        onChange={(e) => onChange({ ...data, category: e.target.value as MenuCategory })}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select category</option>
        <option value="appetizer">Appetizer</option>
        <option value="main">Main</option>
        <option value="dessert">Dessert</option>
        <option value="beverage">Beverage</option>
      </select>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
        <input
          type="number"
          step="0.01"
          value={data.basePrice || ''}
          onChange={(e) => onChange({ ...data, basePrice: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Prep Complexity</label>
        <input
          type="number"
          value={data.preparationComplexity || ''}
          onChange={(e) => onChange({ ...data, preparationComplexity: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
    <button
      onClick={onSubmit}
      className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
    >
      Save Menu Item
    </button>
  </div>
);