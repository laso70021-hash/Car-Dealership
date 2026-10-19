import React, { useState } from 'react';
import {
  Bell, CheckCircle2, Clock, AlertCircle, Calendar, MessageSquare,
  Check, Trash2
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../../data/initialData';
import { NotificationItem } from '../../types';

export const BuyerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleClear = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-[#ef172b]" />
            Buyer Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Stay informed on showroom replies, price drop alerts, and test drive appointment confirmations.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark All Read
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700">No new notifications</h3>
          <p className="mt-1">You're all caught up! New updates on your car enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                !item.read
                  ? 'bg-white border-red-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 opacity-80'
              }`}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                item.type === 'alert'
                  ? 'bg-red-50 text-[#ef172b]'
                  : item.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : item.type === 'booking'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-600'
              }`}>
                {item.type === 'alert' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : item.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : item.type === 'booking' ? (
                  <Calendar className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">{item.created_at}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{item.message}</p>
              </div>

              {!item.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef172b] flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
