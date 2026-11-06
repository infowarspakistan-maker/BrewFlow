import React from 'react';
import { 
  CheckCircle2, 
  Coffee, 
  Flame, 
  Clock, 
  Sparkles, 
  X, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderConfirmationModal: React.FC = () => {
  const { 
    recentConfirmedOrder, 
    setRecentConfirmedOrder, 
    orders, 
    setActiveView, 
    playChime 
  } = useApp();

  if (!recentConfirmedOrder) return null;

  // Find live updated order from orders state
  const liveOrder = orders.find(o => o.id === recentConfirmedOrder.id) || recentConfirmedOrder;

  const baristaItems = liveOrder.items.filter(i => i.station === 'barista');
  const bakeryItems = liveOrder.items.filter(i => i.station === 'bakery');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#19100a] border border-[#3b2317] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#f4ece4]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Top banner */}
        <div className="p-5 bg-gradient-to-r from-[#21130b] via-[#2d1b11] to-[#21130b] border-b border-[#3b2317] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#d49a5b]">
                  TICKET #{liveOrder.orderNumber}
                </span>
                <span className="text-[#644a3b]">·</span>
                <span className="text-xs text-[#a98f7e] capitalize">
                  {liveOrder.orderType.replace('_', ' ')}
                  {liveOrder.tableNumber ? ` (${liveOrder.tableNumber})` : ''}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#faede1]">
                Order Confirmed &amp; Dispatched
              </h3>
            </div>
          </div>

          <button
            onClick={() => setRecentConfirmedOrder(null)}
            className="p-1.5 rounded-lg text-[#8a7263] hover:text-[#faede1] hover:bg-[#251710] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Station Routing Progress */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[65vh] text-xs">
          
          <div className="p-3 rounded-xl bg-[#22150e] border border-[#382216] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d49a5b]" />
              <span className="font-medium text-[#f4ece4]">
                Est. Kitchen Prep: <strong className="text-[#d49a5b]">3–5 mins</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#8e7667]">Overall Status:</span>
              {getStatusBadge(liveOrder.overallStatus)}
            </div>
          </div>

          {/* Barista Station Items */}
          {baristaItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#d49a5b] pb-1 border-b border-[#2d1b11]">
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Barista Station (Beverages)</span>
                </div>
                <button
                  onClick={() => {
                    setRecentConfirmedOrder(null);
                    setActiveView('kds_barista');
                    playChime('click');
                  }}
                  className="text-[11px] text-[#bda18e] hover:text-[#faede1] flex items-center gap-1 hover:underline"
                >
                  <span>View Barista Screen</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                {baristaItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-2.5 rounded-lg bg-[#1f130b] border border-[#2e1c12] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-[#faede1]">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-[10px] text-[#8e7667]">
                          {item.customization.milk || 'Whole Milk'} · {item.customization.iceLevel || 'Hot'}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.itemStatus)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bakery / Warming Station Items */}
          {bakeryItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#e2843d] pb-1 border-b border-[#2d1b11]">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Bakery &amp; Warming Station (Pastries)</span>
                </div>
                <button
                  onClick={() => {
                    setRecentConfirmedOrder(null);
                    setActiveView('kds_bakery');
                    playChime('click');
                  }}
                  className="text-[11px] text-[#bda18e] hover:text-[#faede1] flex items-center gap-1 hover:underline"
                >
                  <span>View Bakery Screen</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                {bakeryItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-2.5 rounded-lg bg-[#1f130b] border border-[#2e1c12] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-[#faede1]">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-[10px] text-[#8e7667]">
                          {item.customization.warming ? '🔥 Heated 45s' : 'Ambient temp'} · {item.customization.servingStyle || 'For Here'}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.itemStatus)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipt Total */}
          <div className="pt-2 border-t border-[#29170e] flex items-center justify-between text-xs text-[#a98f7e]">
            <span>Paid via {liveOrder.paymentMethod?.replace('_', ' ').toUpperCase()}</span>
            <span className="font-mono text-sm font-bold text-[#faede1]">
              Total: ${liveOrder.total.toFixed(2)}
            </span>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-[#140c08] border-t border-[#2b1910] flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setRecentConfirmedOrder(null)}
            className="px-4 py-2 rounded-lg bg-[#24160e] hover:bg-[#311d13] text-[#faede1] border border-[#382317] font-medium transition-colors"
          >
            Keep Browsing
          </button>

          <button
            onClick={() => {
              setRecentConfirmedOrder(null);
              setActiveView('kds_expeditor');
              playChime('click');
            }}
            className="px-4 py-2 rounded-lg bg-[#d49a5b] hover:bg-[#e4ad6f] text-[#120b08] font-bold transition-all flex items-center gap-1.5"
          >
            <span>Monitor Live Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
