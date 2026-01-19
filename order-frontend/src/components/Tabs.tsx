// src/components/Tabs.tsx

import React from 'react';
import { Store, UtensilsCrossed, ShoppingCart } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: 'restaurants' | 'menu' | 'orders') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => (
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex gap-1">
        {[
          { key: 'restaurants', label: 'Restaurants', icon: Store },
          { key: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
          { key: 'orders', label: 'Orders', icon: ShoppingCart }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key as 'restaurants' | 'menu' | 'orders')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
              activeTab === key
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
);