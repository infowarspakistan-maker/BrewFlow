import React from 'react';
import { Coffee, Flame, Clock } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingDisplayProps {
  order: Order;
}

export const OrderTrackingDisplay: React.FC<OrderTrackingDisplayProps> = ({ order }) => {
  const baristaItems = order.items.filter(i => i.station === 'barista');
  const bakeryItems = order.items.filter(i => i.station === 'bakery');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded">Ready</span>;
      case 'in_prep':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded animate-pulse">In Prep</span>;
      case 'completed':
        return <span className="bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">Completed</span>;
      default:
        return <span className="bg-[#2a1a11] text-[#bda18e] border border-[#3d2518] text-[10px] font-medium px-2 py-0.5 rounded">Queued</span>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-3 rounded-xl bg-[#22150e] border border-[#382216] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#d49a5b]" />
          <span className="font-medium text-[#f4ece4]">
            Est. Kitchen Prep: <strong className="text-[#d49a5b]">3–5 mins</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#8e7667]">Overall Status:</span>
          {getStatusBadge(order.overallStatus)}
        </div>
      </div>

      {baristaItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#d49a5b]">
            <Coffee className="w-3.5 h-3.5" />
            <span>Barista Station (Beverages)</span>
          </div>
          <div className="space-y-1.5">
            {baristaItems.map((item) => (
              <div key={item.cartItemId} className="p-2.5 rounded-lg bg-[#1f130b] border border-[#2e1c12] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded object-cover" />
                  <div>
                    <div className="font-medium text-[#faede1]">{item.quantity}x {item.name}</div>
                    <div className="text-[10px] text-[#8e7667]">{item.customization.milk || 'Whole Milk'} · {item.customization.iceLevel || 'Hot'}</div>
                  </div>
                </div>
                {getStatusBadge(item.itemStatus)}
              </div>
            ))}
          </div>
        </div>
      )}

      {bakeryItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#e2843d]">
            <Flame className="w-3.5 h-3.5" />
            <span>Bakery & Warming Station</span>
          </div>
          <div className="space-y-1.5">
            {bakeryItems.map((item) => (
              <div key={item.cartItemId} className="p-2.5 rounded-lg bg-[#1f130b] border border-[#2e1c12] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded object-cover" />
                  <div>
                    <div className="font-medium text-[#faede1]">{item.quantity}x {item.name}</div>
                    <div className="text-[10px] text-[#8e7667]">{item.customization.warming ? '🔥 Heated 45s' : 'Ambient'}</div>
                  </div>
                </div>
                {getStatusBadge(item.itemStatus)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
