import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Restaurant } from '../types';
import { api } from '../services/api';

import { RestaurantCard } from '../components/RestaurantCard';
import { Modal } from '../components/Modal';
import { RestaurantForm } from '../components/forms/RestaurantForm';

interface RestaurantsPageProps {
  restaurants: Restaurant[];
  selectedRestaurantId: number | null;
  onSelect: (id: number) => void;
  onRefresh: () => void;
  notify: (type: 'success' | 'error', message: string) => void;
}

export const RestaurantsPage: React.FC<RestaurantsPageProps> = ({
  restaurants,
  selectedRestaurantId,
  onSelect,
  onRefresh,
  notify,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Restaurant>>({});

  /* ---------- Actions ---------- */

  const openAdd = () => {
    setFormData({});
    setShowModal(true);
  };

  const openEdit = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await api.restaurants.create(formData);
      notify('success', 'Restaurant saved successfully');
      setShowModal(false);
      onRefresh();
    } catch {
      notify('error', 'Failed to save restaurant');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this restaurant?')) return;

    try {
      await api.restaurants.delete(id);
      notify('success', 'Restaurant deleted successfully');
      onRefresh();
    } catch {
      notify('error', 'Failed to delete restaurant');
    }
  };

  /* ---------- UI ---------- */

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Restaurants</h2>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            isSelected={selectedRestaurantId === r.id}
            onSelect={() => onSelect(r.id)}
            onEdit={() => openEdit(r)}
            onDelete={() => handleDelete(r.id)}
          />
        ))}
      </div>

      {/* ---------- MODAL ---------- */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={formData.id ? 'Edit Restaurant' : 'Add Restaurant'}
      >
        <RestaurantForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};
