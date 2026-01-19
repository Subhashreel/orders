// src/components/Notification.tsx

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

export const Notification: React.FC<NotificationProps> = ({ type, message }) => (
  <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
    type === 'success' ? 'bg-red-500' : 'bg-red-600'
  } text-white`}>
    {type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
    {message}
  </div>
);