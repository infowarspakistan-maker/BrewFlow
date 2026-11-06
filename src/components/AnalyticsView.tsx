import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Flame, 
  Coffee, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { crossSellStats, orders } = useApp();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const conversionRate = crossSellStats.promptsShown > 0 
    ? Math.round((crossSellStats.pairingsAdded / crossSellStats.promptsShown) * 100) 
    : 0;

  // Station items count
  let baristaItemsCount = 0;
  let bakeryItemsCount = 0;
  let warmedItemsCount = 0;
  let forHereCount = 0;

  orders.forEach(ord => {
    ord.items.forEach(item => {
      if (item.station === 'barista') baristaItemsCount += item.quantity;
      if (item.station === 'bakery') {
        bakeryItemsCount += item.quantity;
        if (item.customization.warming) warmedItemsCount += item.quantity;
        if (item.customization.servingStyle?.includes('Here')) forHereCount += item.quantity;
      }
    });
  });

  const warmedPercentage = bakeryItemsCount > 0 ? Math.round((warmedItemsCount / bakeryItemsCount) * 100) : 75;
  const forHerePercentage = bakeryItemsCount > 0 ? Math.round((forHereCount / bakeryItemsCount) * 100) : 65;

  return (
    <div className="bg-[#120b08] min-h-[calc(100vh-4rem)] p-4 sm:p-6 text-[#f4ece4]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#180f0a] border border-[#2b1910] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#d49a5b] font-bold">
                Operational Intelligence
              </span>
              <span className="text-[#644a3b]">·</span>
              <span className="text-xs text-[#a98f7e]">Station Routing &amp; Conversion Metrics</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#faede1]">
              BrewFlow Performance &amp; Station Bottleneck Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#24150e] border border-[#392114] text-xs font-mono text-[#d49a5b]">
              Live Shift Data · Active
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-xl bg-[#19100a] border border-[#2c1a10] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9d8373]">
              <span>"The Perfect Match" Conversion</span>
              <Sparkles className="w-4 h-4 text-[#d49a5b]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#f7e4d0]">
              {conversionRate}%
            </div>
            <p className="text-[11px] text-[#8e7667]">
              {crossSellStats.pairingsAdded} pairings added from {crossSellStats.promptsShown} prompts
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#19100a] border border-[#2c1a10] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9d8373]">
              <span>Incremental Cross-Sell Revenue</span>
              <DollarSign className="w-4 h-4 text-[#d49a5b]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#d49a5b]">
              +${crossSellStats.totalPairingRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-[#8e7667]">
              Generated purely via automated pairing engine
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#19100a] border border-[#2c1a10] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9d8373]">
              <span>Barista Avg Ticket Time</span>
              <Coffee className="w-4 h-4 text-[#d49a5b]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#f7e4d0]">
              3m 14s
            </div>
            <p className="text-[11px] text-emerald-400">
              Optimal throughput (Target &lt; 4m)
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#19100a] border border-[#2c1a10] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9d8373]">
              <span>Bakery Warming Time</span>
              <Flame className="w-4 h-4 text-[#e2843d]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#f7e4d0]">
              1m 45s
            </div>
            <p className="text-[11px] text-emerald-400">
              Deck oven 45s toasts + plating
            </p>
          </div>

        </div>

        {/* 2-Column Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Station Load & Bottleneck Prevention (6 cols) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#180f0a] border border-[#2c1a10] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29170e]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#faede1]">
                  Station Routing &amp; Load Balancing
                </h3>
                <p className="text-xs text-[#8e7667]">
                  Independent routing prevents barista bottlenecks during peak rush
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#d49a5b]" />
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Barista Station Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-[#d49a5b]">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Barista Station Volume</span>
                  </span>
                  <span className="font-mono font-bold text-[#faede1]">
                    {baristaItemsCount} drinks processed
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#27170f] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d49a5b] to-[#9c5f2f]" style={{ width: '64%' }} />
                </div>
              </div>

              {/* Bakery Station Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-[#e2843d]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Bakery &amp; Warming Station Volume</span>
                  </span>
                  <span className="font-mono font-bold text-[#faede1]">
                    {bakeryItemsCount} pastries processed
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#27170f] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#e2843d] to-[#aa531a]" style={{ width: '48%' }} />
                </div>
              </div>

              {/* Food Modifiers Distribution */}
              <div className="pt-3 border-t border-[#26150d] grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#21130b] border border-[#341d11]">
                  <span className="text-[11px] text-[#9a8272] block">"Warm it up" Ratio</span>
                  <div className="font-mono text-xl font-bold text-[#f49b42] mt-0.5">
                    {warmedPercentage}%
                  </div>
                  <span className="text-[10px] text-[#7d6556]">Customers requesting hot oven toast</span>
                </div>

                <div className="p-3 rounded-xl bg-[#21130b] border border-[#341d11]">
                  <span className="text-[11px] text-[#9a8272] block">Slate Plate Presentation</span>
                  <div className="font-mono text-xl font-bold text-[#d49a5b] mt-0.5">
                    {forHerePercentage}%
                  </div>
                  <span className="text-[10px] text-[#7d6556]">Dine-in slate board plating</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Top Automated Pairings (6 cols) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#180f0a] border border-[#2c1a10] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29170e]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#faede1]">
                  Top "Perfect Match" Pairings
                </h3>
                <p className="text-xs text-[#8e7667]">
                  Cross-selling combinations ranked by customer acceptance
                </p>
              </div>
              <Award className="w-4 h-4 text-[#d49a5b]" />
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  trigger: 'Double Origin Espresso',
                  suggestion: 'Chocolate Croissant',
                  conversion: '74% match rate',
                  rationale: 'Dark cocoa notes paired with warm French butter',
                  revenue: '+$145.50',
                },
                {
                  trigger: 'Biscoff Caramel Shake',
                  suggestion: 'Artisan Hazelnut Donut',
                  conversion: '68% match rate',
                  rationale: 'Double crunch & caramelized speculoos compliment',
                  revenue: '+$118.75',
                },
                {
                  trigger: 'Signature Iced Coffee',
                  suggestion: 'Triple Fudge Brownie',
                  conversion: '61% match rate',
                  rationale: 'Chilled cold brew cuts dense cocoa sweetness',
                  revenue: '+$94.50',
                },
              ].map((pairing, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#21140c] border border-[#321e13] flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-medium text-[#faede1] flex items-center gap-1.5">
                      <span>{pairing.trigger}</span>
                      <span className="text-[#d49a5b]">→</span>
                      <strong className="text-[#d49a5b]">{pairing.suggestion}</strong>
                    </div>
                    <p className="text-[10px] text-[#8e7667] truncate">
                      {pairing.rationale}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-[#faede1] block">
                      {pairing.conversion}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      {pairing.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
