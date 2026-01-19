import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { MenuItem } from '../types';
import { api } from '../services/api';

import { MenuItemCard } from '../components/MenuItemCard';
import { Modal } from '../components/Modal';
import { MenuForm } from '../components/forms/MenuForm';

interface MenuPageProps {
  restaurantId: number;
  notify: (type: 'success' | 'error', message: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ restaurantId, notify }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  /* -------- Load Menu Per Restaurant -------- */

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  const loadMenu = async () => {
    try {
      const data = await api.menu.getByRestaurant(restaurantId);
      setMenuItems(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to fetch menu items';
      notify('error', msg);
    }
  };

  /* -------- Add / Edit -------- */

  const openAdd = () => {
    setFormData({ restaurantId });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await api.menu.create({ ...formData, restaurantId });
      notify('success', 'Menu item saved successfully');
      setShowModal(false);
      loadMenu();
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors;
      const backendMessage = err?.response?.data?.message;

      if (backendErrors && backendErrors.length > 0) {
        notify('error', backendErrors.join(', '));
      } else if (backendMessage) {
        notify('error', backendMessage);
      } else {
        notify('error', 'Failed to save menu item');
      }
    }
  };

  /* -------- Delete -------- */

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this menu item?')) return;

    try {
      await api.menu.delete(id);
      notify('success', 'Menu item deleted successfully');
      loadMenu();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to delete menu item';
      notify('error', msg);
    }
  };

  /* -------- UI -------- */

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Menu Items</h2>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        {menuItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No menu items yet
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={formData.id ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <MenuForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};
