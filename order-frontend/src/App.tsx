import React, { useState, useEffect } from 'react';
import type { Restaurant } from './types';
import { api } from './services/api';

import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';

import { RestaurantsPage } from './pages/RestaurantsPage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<'restaurants' | 'menu' | 'orders'>('restaurants');

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

  const [notification, setNotification] =
    useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* -------- Load Restaurants Only Here -------- */

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await api.restaurants.getAll();
      setRestaurants(data);
      if (data.length && !selectedRestaurantId) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch {
      showNotification('error', 'Failed to fetch restaurants');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const selectedRestaurant =
    restaurants.find(r => r.id === selectedRestaurantId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <Header selectedRestaurant={selectedRestaurant} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {activeTab === 'restaurants' && (
          <RestaurantsPage
            restaurants={restaurants}
            onRefresh={loadRestaurants}
            onSelect={setSelectedRestaurantId}
            selectedRestaurantId={selectedRestaurantId}
            notify={showNotification}
          />
        )}

        {activeTab === 'menu' && selectedRestaurantId && (
          <MenuPage
            restaurantId={selectedRestaurantId}
            notify={showNotification}
          />
        )}

        {activeTab === 'orders' && selectedRestaurantId && (
          <OrdersPage
            restaurantId={selectedRestaurantId}
            notify={showNotification}
          />
        )}

      </main>
    </div>
  );
};

export default App;
