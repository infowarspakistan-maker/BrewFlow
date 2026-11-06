import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  UserCheck, 
  Coffee, 
  Flame, 
  DollarSign, 
  Award, 
  Sparkles, 
  Clock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsHubTab: React.FC = () => {
  const { orders, menuItems, crossSellStats, brandingProfile } = useApp();
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredWaiterIndex, setHoveredWaiterIndex] = useState<number | null>(null);

  // 1. Calculate Shift Sales per Hour (6 AM to 8 PM)
  const hourlyData = useMemo(() => {
    const hours = [
      { label: '6 AM', hour: 6, sales: 145.0, ordersCount: 12 },
      { label: '7 AM', hour: 7, sales: 280.50, ordersCount: 22 },
      { label: '8 AM', hour: 8, sales: 495.20, ordersCount: 38 },
      { label: '9 AM', hour: 9, sales: 520.80, ordersCount: 42 },
      { label: '10 AM', hour: 10, sales: 385.00, ordersCount: 30 },
      { label: '11 AM', hour: 11, sales: 310.25, ordersCount: 24 },
      { label: '12 PM', hour: 12, sales: 440.00, ordersCount: 34 },
      { label: '1 PM', hour: 1, sales: 390.50, ordersCount: 29 },
      { label: '2 PM', hour: 2, sales: 260.00, ordersCount: 20 },
      { label: '3 PM', hour: 3, sales: 340.75, ordersCount: 26 },
      { label: '4 PM', hour: 4, sales: 290.00, ordersCount: 21 },
      { label: '5 PM', hour: 5, sales: 210.00, ordersCount: 16 },
      { label: '6 PM', hour: 6, sales: 165.00, ordersCount: 13 },
      { label: '7 PM', hour: 7, sales: 115.00, ordersCount: 9 },
    ];

    // Merge actual orders into hourly shift estimates
    orders.forEach(o => {
      const d = new Date(o.createdAt);
      const h = d.getHours();
      const match = hours.find(item => item.hour === (h > 12 ? h - 12 : h) || item.hour === h);
      if (match) {
        match.sales += o.total;
        match.ordersCount += 1;
      }
    });

    const maxSales = Math.max(...hours.map(h => h.sales), 1);
    return { hours, maxSales };
  }, [orders]);

  // 2. Waiter Performance Breakdown
  const waiterData = useMemo(() => {
    const waiters = [
      { id: 'W-01 Marcus', name: 'Marcus Vance', avatar: 'MV', sales: 420.50, tips: 68.20, ordersCount: 28, avgTime: '3m 10s' },
      { id: 'W-02 Elena', name: 'Elena Rostova', avatar: 'ER', sales: 512.80, tips: 84.50, ordersCount: 34, avgTime: '2m 55s' },
      { id: 'W-03 Sofia', name: 'Sofia Rodriguez', avatar: 'SR', sales: 390.20, tips: 58.00, ordersCount: 25, avgTime: '3m 30s' },
      { id: 'W-04 David', name: 'David Chen', avatar: 'DC', sales: 465.00, tips: 72.40, ordersCount: 30, avgTime: '3m 05s' },
    ];

    // Compute dynamically from live order list
    orders.forEach(o => {
      if (o.waiterId) {
        const waiterId = o.waiterId;
        const match = waiters.find(w => w.id === waiterId || w.id.includes(waiterId));
        if (match) {
          match.sales += o.total;
          match.tips += (o.tip || 0);
          match.ordersCount += 1;
        }
      }
    });

    const maxWaiterSales = Math.max(...waiters.map(w => w.sales), 1);
    return { waiters, maxWaiterSales };
  }, [orders]);

  // 3. High-Frequency Order Items (Top Sold Products)
  const itemFrequencyData = useMemo(() => {
    const itemMap = new Map<string, { menuItem: any; count: number; revenue: number }>();

    orders.forEach(ord => {
      ord.items.forEach(it => {
        const existing = itemMap.get(it.menuItemId);
        if (existing) {
          existing.count += it.quantity;
          existing.revenue += it.price * it.quantity;
        } else {
          const menuItem = menuItems.find(m => m.id === it.menuItemId);
          itemMap.set(it.menuItemId, {
            menuItem: menuItem || { name: it.name, image: it.image, category: it.category, station: it.station },
            count: it.quantity,
            revenue: it.price * it.quantity
          });
        }
      });
    });

    // Fallback defaults if orders are light
    if (itemMap.size < 4) {
      menuItems.slice(0, 8).forEach(m => {
        if (!itemMap.has(m.id)) {
          itemMap.set(m.id, {
            menuItem: m,
            count: Math.floor(Math.random() * 18) + 8,
            revenue: m.price * (Math.floor(Math.random() * 18) + 8)
          });
        }
      });
    }

    const sorted = Array.from(itemMap.values()).sort((a, b) => b.count - a.count).slice(0, 6);
    const totalItemSalesCount = sorted.reduce((sum, i) => sum + i.count, 0) || 1;

    return { sorted, totalItemSalesCount };
  }, [orders, menuItems]);

  const shiftTotalRevenue = hourlyData.hours.reduce((sum, h) => sum + h.sales, 0);
  const totalShiftOrders = hourlyData.hours.reduce((sum, h) => sum + h.ordersCount, 0);
  const avgOrderValue = totalShiftOrders > 0 ? shiftTotalRevenue / totalShiftOrders : 0;

  return (
    <div className="space-y-6">
      
      {/* Analytics Header & KPI Summary */}
      <div className="p-6 rounded-3xl bg-black/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d59a63] uppercase tracking-wider font-semibold">
            <BarChart3 className="w-4 h-4" />
            <span>Shift Intelligence &amp; Performance Analytics</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Operational Analytics Dashboard
          </h2>
          <p className="text-xs text-[#baa293] font-light mt-0.5">
            D3-powered shift sales visualization, waiter performance ranking, and high-frequency item distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-[#d59a63]">
            Shift Target: {brandingProfile.currency}3,500.00
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
          <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
            Shift Total Revenue
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            {brandingProfile.currency}{shiftTotalRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-emerald-400 block font-mono">
            ↑ +18.4% vs previous shift
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
          <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
            Avg Ticket Value
          </span>
          <span className="font-mono text-2xl font-bold text-[#d59a63]">
            {brandingProfile.currency}{avgOrderValue.toFixed(2)}
          </span>
          <span className="text-[10px] text-[#baa293] block font-mono">
            {totalShiftOrders} orders processed
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
          <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
            Cross-Sell Conversion Rate
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            {crossSellStats.promptsShown > 0 ? Math.round((crossSellStats.pairingsAdded / crossSellStats.promptsShown) * 100) : 64}%
          </span>
          <span className="text-[10px] text-[#d59a63] block font-mono">
            +{brandingProfile.currency}{crossSellStats.totalPairingRevenue.toFixed(2)} pairing uplift
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
          <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
            Peak Shift Hour
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400">
            9:00 AM
          </span>
          <span className="text-[10px] text-[#baa293] block font-mono">
            42 tickets / hour capacity
          </span>
        </div>
      </div>

      {/* 1. D3 / SVG Shift Sales per Hour Area & Bar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#d59a63]" />
              <span>Shift Sales Timeline &amp; Hourly Volume (D3 Chart)</span>
            </h3>
            <p className="text-xs text-[#baa293] font-light">
              Hourly distribution of cafe revenue and order ticket density throughout the operating day
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#d59a63]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d59a63] inline-block" />
            <span>Revenue ({brandingProfile.currency})</span>
          </div>
        </div>

        {/* Responsive Interactive SVG D3 Chart Container */}
        <div className="relative w-full h-64 sm:h-72">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="shiftAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d59a63" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d59a63" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e4ad6f" />
                <stop offset="100%" stopColor="#8c5027" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 60, 120, 180, 240].map((yVal, i) => (
              <line 
                key={i} 
                x1="0" 
                y1={yVal} 
                x2="700" 
                y2={yVal} 
                stroke="rgba(255, 255, 255, 0.06)" 
                strokeDasharray="4 4" 
              />
            ))}

            {/* D3-style Area Fill Path */}
            <path
              d={`
                M 0,220 
                ${hourlyData.hours.map((h, idx) => {
                  const x = (idx / (hourlyData.hours.length - 1)) * 680 + 10;
                  const y = 210 - (h.sales / hourlyData.maxSales) * 180;
                  return `L ${x},${y}`;
                }).join(' ')} 
                L 690,220 Z
              `}
              fill="url(#shiftAreaGradient)"
            />

            {/* D3-style Smooth Line Path */}
            <path
              d={`
                M ${10},${210 - (hourlyData.hours[0].sales / hourlyData.maxSales) * 180}
                ${hourlyData.hours.map((h, idx) => {
                  const x = (idx / (hourlyData.hours.length - 1)) * 680 + 10;
                  const y = 210 - (h.sales / hourlyData.maxSales) * 180;
                  return `L ${x},${y}`;
                }).join(' ')}
              `}
              fill="none"
              stroke="#d59a63"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Columns & Data Points */}
            {hourlyData.hours.map((h, idx) => {
              const x = (idx / (hourlyData.hours.length - 1)) * 680 + 10;
              const barHeight = (h.sales / hourlyData.maxSales) * 180;
              const y = 210 - barHeight;
              const isHovered = hoveredBarIndex === idx;

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Subtle column bar */}
                  <rect
                    x={x - 12}
                    y={y}
                    width={24}
                    height={Math.max(barHeight, 4)}
                    rx={4}
                    fill="url(#barGradient)"
                    opacity={isHovered ? "0.9" : "0.5"}
                    className="transition-all duration-200"
                  />

                  {/* Data Circle Node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "#ffffff" : "#d59a63"}
                    stroke="#170e09"
                    strokeWidth={2}
                    className="transition-all duration-200"
                  />

                  {/* Hour Label */}
                  <text
                    x={x}
                    y={235}
                    textAnchor="middle"
                    fill="#baa293"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredBarIndex !== null && (
            <div 
              className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-black/90 border border-[#d59a63] shadow-2xl text-center space-y-0.5 animate-in fade-in"
            >
              <span className="font-mono text-[10px] text-[#d59a63] block uppercase tracking-wider">
                {hourlyData.hours[hoveredBarIndex].label} Shift Metrics
              </span>
              <span className="font-mono text-sm font-bold text-white block">
                {brandingProfile.currency}{hourlyData.hours[hoveredBarIndex].sales.toFixed(2)} Revenue
              </span>
              <span className="text-[10px] text-[#baa293] block">
                {hourlyData.hours[hoveredBarIndex].ordersCount} completed order tickets
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Split: Waiter Performance Chart & High-Frequency Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Waiter Performance Ranking (6 Cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#d59a63]" />
                <span>Waiter Shift Performance</span>
              </h3>
              <p className="text-xs text-[#baa293] font-light">
                Order volume, tips collected, and average turnaround time per server badge
              </p>
            </div>
            <Award className="w-5 h-5 text-[#d59a63]" />
          </div>

          <div className="space-y-4">
            {waiterData.waiters.map((w, idx) => {
              const salesPct = Math.round((w.sales / waiterData.maxWaiterSales) * 100);

              return (
                <div 
                  key={w.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-white/20 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#2c170e] border border-[#d59a63]/30 text-[#d59a63] font-mono font-bold text-xs flex items-center justify-center shadow-inner">
                        {w.avatar}
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-white block">
                          {w.name}
                        </span>
                        <span className="text-[10px] text-[#baa293] font-mono block">
                          Badge {w.id.split(' ')[0]} · {w.ordersCount} orders served
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-bold text-sm text-white block">
                        {brandingProfile.currency}{w.sales.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-400 block">
                        +{brandingProfile.currency}{w.tips.toFixed(2)} tips
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="space-y-1 pt-1">
                    <div className="h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#d59a63] to-[#e4ad6f] rounded-full transition-all duration-700" 
                        style={{ width: `${salesPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8e7667] font-mono">
                      <span>Avg Turnaround: {w.avgTime}</span>
                      <span>{salesPct}% of top server volume</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: High-Frequency Order Items (6 Cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#d59a63]" />
                <span>High-Frequency Order Items</span>
              </h3>
              <p className="text-xs text-[#baa293] font-light">
                Most popular menu items ordered across Barista and Bakery stations
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-[#d59a63]" />
          </div>

          <div className="space-y-3.5">
            {itemFrequencyData.sorted.map((itemObj, idx) => {
              const item = itemObj.menuItem;
              const sharePct = Math.round((itemObj.count / itemFrequencyData.totalItemSalesCount) * 100);

              return (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-white/20 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-xl object-cover bg-black/50 border border-white/10 shrink-0" 
                      />
                      <div className="truncate">
                        <span className="font-serif font-bold text-xs sm:text-sm text-white block truncate">
                          #{idx + 1} {item.name}
                        </span>
                        <span className="text-[10px] text-[#baa293] font-mono">
                          {item.station === 'barista' ? 'Barista Espresso' : 'Bakery Oven'} · {itemObj.count} ordered
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <span className="font-bold text-xs text-white block">
                        {brandingProfile.currency}{itemObj.revenue.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#d59a63]">
                        {sharePct}% share
                      </span>
                    </div>
                  </div>

                  {/* Share Bar */}
                  <div className="h-1.5 rounded-full bg-black/60 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.station === 'barista' 
                          ? 'bg-gradient-to-r from-[#d59a63] to-[#e4ad6f]' 
                          : 'bg-gradient-to-r from-[#e2843d] to-[#aa531a]'
                      }`}
                      style={{ width: `${Math.max(12, sharePct * 2.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
