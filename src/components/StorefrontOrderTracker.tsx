import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderTrackingDisplay } from './OrderTrackingDisplay';

export const StorefrontOrderTracker: React.FC = () => {
  const { recentConfirmedOrder, orders } = useApp();

  if (!recentConfirmedOrder) return null;

  const liveOrder = orders.find(o => o.id === recentConfirmedOrder.id) || recentConfirmedOrder;

  return (
    <div className="bg-[#19100a] border border-[#3b2317] rounded-2xl shadow-xl overflow-hidden mt-6 mx-4 md:mx-6">
      <div className="p-4 border-b border-[#3b2317] flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-[#faede1]">Live Order Tracking</h3>
        <span className="font-mono text-[10px] font-bold text-[#d49a5b]">
            TICKET #{liveOrder.orderNumber}
        </span>
      </div>
      <div className="p-4">
        <OrderTrackingDisplay order={liveOrder} />
      </div>
    </div>
  );
};
