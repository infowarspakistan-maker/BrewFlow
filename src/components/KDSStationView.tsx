import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Flame, 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  ArrowRight,
  Filter,
  Sparkles,
  Milk,
  Snowflake,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemStatus, Order, OrderItem, StationType } from '../types';

interface KDSStationViewProps {
  stationMode: 'barista' | 'bakery' | 'expeditor';
}

export const KDSStationView: React.FC<KDSStationViewProps> = ({ stationMode }) => {
  const { 
    orders, 
    updateItemStatus, 
    updateOrderStatus, 
    playChime,
    setActiveView 
  } = useApp();

  const [currentStation, setCurrentStation] = useState<'barista' | 'bakery' | 'expeditor'>(stationMode);
  const [filterStatus, setFilterStatus] = useState<'active' | 'ready' | 'all'>('active');
  const [now, setNow] = useState(Date.now());

  // Keep live elapsed timer ticking every 1 second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync station mode if parent prop changes
  useEffect(() => {
    setCurrentStation(stationMode);
  }, [stationMode]);

  // Filter orders according to station and status
  const relevantOrders = orders.filter(order => {
    // Status filter
    if (filterStatus === 'active' && order.overallStatus === 'completed') return false;
    if (filterStatus === 'ready' && order.overallStatus !== 'ready') return false;

    // Station item check
    if (currentStation === 'barista') {
      return order.items.some(i => i.station === 'barista');
    }
    if (currentStation === 'bakery') {
      return order.items.some(i => i.station === 'bakery');
    }
    return true; // expeditor shows all
  });

  const getElapsedMinutes = (createdAt: string) => {
    const diff = Math.floor((now - new Date(createdAt).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return { mins, secs, totalSecs: diff };
  };

  const getAgeColor = (totalSecs: number) => {
    if (totalSecs > 480) return 'text-rose-500 bg-rose-950/40 border-rose-900/60'; // > 8 min: Red
    if (totalSecs > 240) return 'text-amber-400 bg-amber-950/40 border-amber-900/60'; // > 4 min: Orange
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60'; // normal: Green
  };

  const handleToggleItemStatus = (orderId: string, item: OrderItem) => {
    let nextStatus: ItemStatus = 'pending';
    if (item.itemStatus === 'pending') nextStatus = 'in_prep';
    else if (item.itemStatus === 'in_prep') nextStatus = 'ready';
    else if (item.itemStatus === 'ready') nextStatus = 'completed';
    else nextStatus = 'pending';

    updateItemStatus(orderId, item.cartItemId, nextStatus);
  };

  const handleBumpTicket = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  return (
    <div className="bg-[#100906] min-h-[calc(100vh-4rem)] p-4 sm:p-6 text-[#f4ece4]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* KDS Header & Station Switcher */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#180f0a] border border-[#2b1910] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#d49a5b] font-bold">
                KDS Real-Time Station Routing
              </span>
              <span className="text-[#684b39]">·</span>
              <span className="text-xs text-[#a98f7e]">
                {relevantOrders.length} {relevantOrders.length === 1 ? 'ticket' : 'tickets'} in station queue
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#faede1] flex items-center gap-2">
              {currentStation === 'barista' && (
                <>
                  <Coffee className="w-6 h-6 text-[#d49a5b]" />
                  <span>Barista Bar Station (Chilled, Blends &amp; Hot Classics)</span>
                </>
              )}
              {currentStation === 'bakery' && (
                <>
                  <Flame className="w-6 h-6 text-[#e2843d]" />
                  <span>Bakery &amp; Warming Station (Pastries &amp; Sweets)</span>
                </>
              )}
              {currentStation === 'expeditor' && (
                <>
                  <LayoutGrid className="w-6 h-6 text-[#d49a5b]" />
                  <span>Master Kitchen Expeditor (All Stations)</span>
                </>
              )}
            </h1>
          </div>

          {/* Quick Station Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#20130c] p-1 rounded-xl border border-[#341e12]">
              <button
                onClick={() => { setCurrentStation('barista'); playChime('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStation === 'barista'
                    ? 'bg-[#3b2316] text-[#faede1] shadow-sm'
                    : 'text-[#9c8273] hover:text-[#faede1]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-[#d49a5b]" />
                <span>Barista Bar</span>
              </button>

              <button
                onClick={() => { setCurrentStation('bakery'); playChime('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStation === 'bakery'
                    ? 'bg-[#3b2316] text-[#faede1] shadow-sm'
                    : 'text-[#9c8273] hover:text-[#faede1]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#e2843d]" />
                <span>Bakery Station</span>
              </button>

              <button
                onClick={() => { setCurrentStation('expeditor'); playChime('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStation === 'expeditor'
                    ? 'bg-[#3b2316] text-[#faede1] shadow-sm'
                    : 'text-[#9c8273] hover:text-[#faede1]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#d49a5b]" />
                <span>Expeditor</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-[#20130c] p-1 rounded-xl border border-[#341e12] text-xs">
              {(['active', 'ready', 'all'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    filterStatus === st
                      ? 'bg-[#d49a5b] text-[#120b08] font-bold'
                      : 'text-[#8e7667] hover:text-[#faede1]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        {relevantOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#160e09] border border-[#28170f] space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#563d2e] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#faede1]">
              Station All Caught Up!
            </h3>
            <p className="text-xs text-[#8c7465] max-w-sm mx-auto">
              No pending tickets routed to this station. Place an order from the Storefront or Order Booker to trigger live routing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {relevantOrders.map(order => {
              const { mins, secs, totalSecs } = getElapsedMinutes(order.createdAt);
              const ageStyle = getAgeColor(totalSecs);

              // Filter items routed to current station (or show all if expeditor)
              const displayItems = currentStation === 'expeditor' 
                ? order.items 
                : order.items.filter(i => i.station === currentStation);

              const otherStationItems = currentStation === 'expeditor'
                ? []
                : order.items.filter(i => i.station !== currentStation);

              const allStationItemsDone = displayItems.every(i => i.itemStatus === 'ready' || i.itemStatus === 'completed');

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-[#180f0a] border border-[#2e1c12] shadow-xl overflow-hidden flex flex-col justify-between hover:border-[#422718] transition-all"
                >
                  {/* Ticket Header */}
                  <div className="p-4 bg-[#1f130c] border-b border-[#2d1b11] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#f7e4d0]">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-[#2b180f] text-[#d49a5b]">
                          {order.orderType.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Ticket Age Timer */}
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${ageStyle}`}>
                        <Clock className="w-3 h-3" />
                        <span>
                          {mins}:{secs < 10 ? `0${secs}` : secs}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#a98f7e]">
                      <span className="font-medium text-[#faede1]">{order.customerName}</span>
                      {order.tableNumber && (
                        <span className="font-mono text-[#d49a5b] font-semibold">{order.tableNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Station Items Body */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-80">
                    {displayItems.map(item => {
                      const isPending = item.itemStatus === 'pending';
                      const isInPrep = item.itemStatus === 'in_prep';
                      const isReady = item.itemStatus === 'ready';
                      const isCompleted = item.itemStatus === 'completed';

                      return (
                        <div
                          key={item.cartItemId}
                          onClick={() => handleToggleItemStatus(order.id, item)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 select-none ${
                            isReady || isCompleted
                              ? 'bg-emerald-950/20 border-emerald-900/60 opacity-80'
                              : isInPrep
                              ? 'bg-[#29170e] border-[#d49a5b]'
                              : 'bg-[#1e130c] border-[#311d13] hover:border-[#4d2c1b]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <span className="font-mono font-bold text-sm text-[#faede1] bg-[#140b07] px-1.5 py-0.5 rounded border border-[#2e1b11]">
                                {item.quantity}x
                              </span>
                              <div>
                                <h4 className="font-serif font-bold text-sm text-[#faede1] leading-tight">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] uppercase font-mono text-[#8a7263]">
                                  {item.category.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            {/* Status Pill on Item */}
                            <div>
                              {isPending && (
                                <span className="bg-[#2a1a11] text-[#bda18e] border border-[#3e2619] text-[10px] font-medium px-2 py-0.5 rounded">
                                  Tap to Start
                                </span>
                              )}
                              {isInPrep && (
                                <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                  <span>In Prep</span>
                                </span>
                              )}
                              {isReady && (
                                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>Ready</span>
                                </span>
                              )}
                              {isCompleted && (
                                <span className="bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                                  Done
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Specific station modifier callouts */}
                          {item.station === 'bakery' && (
                            <div className="space-y-1 pt-1 border-t border-[#29170e] text-[11px]">
                              {item.customization.warming ? (
                                <div className="text-[#f49b42] font-semibold flex items-center gap-1.5 bg-[#2a150b] px-2 py-1 rounded border border-[#442211]">
                                  <Flame className="w-3.5 h-3.5 animate-bounce" />
                                  <span>🔥 WARM IT UP — TOAST IN DECK OVEN (45 SECONDS)</span>
                                </div>
                              ) : (
                                <div className="text-[#9e8372]">
                                  Ambient room temperature / Fresh from case
                                </div>
                              )}

                              <div className="text-[#bfa99a]">
                                Serving: <strong className="text-[#f4ece4]">{item.customization.servingStyle || 'For Here (slate plate)'}</strong>
                              </div>
                              {item.customization.powderedSugar && (
                                <div className="text-[#d49a5b]">
                                  ✨ Powdered sugar dusted on top
                                </div>
                              )}
                            </div>
                          )}

                          {item.station === 'barista' && (
                            <div className="space-y-0.5 pt-1 border-t border-[#29170e] text-[11px] text-[#bda290]">
                              {item.customization.milk && (
                                <p>
                                  Milk: <strong className="text-[#f4ece4]">{item.customization.milk}</strong>
                                </p>
                              )}
                              {item.customization.iceLevel && (
                                <p>
                                  Ice: <strong className="text-[#7ec2ed]">{item.customization.iceLevel}</strong>
                                </p>
                              )}
                              {item.customization.whippedCream && item.customization.whippedCream !== 'No Whip' && (
                                <p className="text-[#d49a5b]">
                                  Crown: <strong>{item.customization.whippedCream}</strong>
                                </p>
                              )}
                              {item.customization.shots && item.customization.shots !== 'Standard Shot' && (
                                <p className="text-[#e2843d] font-semibold">
                                  ⚡ {item.customization.shots}
                                </p>
                              )}
                            </div>
                          )}

                          {item.customization.notes && (
                            <div className="text-[10px] italic text-[#d49a5b] bg-[#140b07] p-1.5 rounded">
                              Customer Note: "{item.customization.notes}"
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Notification if this order also has items at the other station */}
                    {otherStationItems.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-[#140b07] border border-[#27150c] text-[10px] text-[#8e7667] space-y-1">
                        <div className="font-semibold text-[#a98f7e]">
                          Cross-Station Items ({currentStation === 'barista' ? 'Bakery' : 'Barista Bar'}):
                        </div>
                        {otherStationItems.map(osi => (
                          <div key={osi.cartItemId} className="flex justify-between">
                            <span>{osi.quantity}x {osi.name}</span>
                            <span className="capitalize text-[#bfa99b]">{osi.itemStatus}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ticket Footer Action */}
                  <div className="p-3 bg-[#150c07] border-t border-[#2a170e] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#7d6758]">
                      {allStationItemsDone ? '✅ Station Items Ready' : 'Click items to advance'}
                    </span>

                    <button
                      onClick={() => handleBumpTicket(order.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#27170f] hover:bg-[#382115] text-[#faede1] border border-[#3b2317] font-semibold text-xs transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Bump Ticket</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
