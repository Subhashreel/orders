// src/components/Header.tsx

import React from 'react';
import { Store } from 'lucide-react';
import type { Restaurant } from '../types';

interface HeaderProps {
  selectedRestaurant: Restaurant | undefined;
}

export const Header: React.FC<HeaderProps> = ({ selectedRestaurant }) => (
  <header className="bg-white shadow-sm border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-2 rounded-lg">
            <Store className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Restaurant Order Manager
            </h1>
            <p className="text-sm text-slate-500">Manage your orders with ease!</p>
          </div>
        </div>
        {selectedRestaurant && (
          <div className="text-right">
            <p className="text-sm text-slate-500">Current Restaurant</p>
            <p className="font-semibold text-slate-800">{selectedRestaurant.name}</p>
          </div>
        )}
      </div>
    </div>
  </header>
);