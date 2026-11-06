import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Coffee, 
  Flame, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  DollarSign, 
  Settings, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  LogOut, 
  CreditCard, 
  Check, 
  Search, 
  Printer, 
  TrendingUp, 
  Smartphone, 
  Sparkles,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, Order, OrderItem, ProductCategory, StationType, ItemStatus } from '../types';
import { AnalyticsHubTab } from './AnalyticsHubTab';

export const OperationsHub: React.FC = () => {
  const { 
    menuItems, 
    orders, 
    createOrder, 
    updateItemStatus, 
    updateOrderStatus, 
    settleOrderBill,
    brandingProfile, 
    updateBrandingProfile, 
    paymentGateways, 
    updatePaymentGateways, 
    activeOperationsTab, 
    setActiveOperationsTab, 
    setActiveView, 
    logoutAdmin,
    playChime 
  } = useApp();

  // POS State
  const [selectedWaiter, setSelectedWaiter] = useState<'W-01 Marcus' | 'W-02 Elena' | 'W-03 Sofia' | 'W-04 David'>('W-01 Marcus');
  const [selectedTable, setSelectedTable] = useState('Table 4');
  const [posCategory, setPosCategory] = useState<'all' | ProductCategory>('all');
  const [posSearch, setPosSearch] = useState('');
  const [posStagedCart, setPosStagedCart] = useState<OrderItem[]>([]);
  const [posOrderType, setPosOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');

  // KDS State
  const [kdsFilter, setKdsFilter] = useState<'all' | 'barista' | 'bakery'>('all');

  // Waiter Ledger State
  const [ledgerWaiterFilter, setLedgerWaiterFilter] = useState<string>('all');
  const [inspectedReceiptOrder, setInspectedReceiptOrder] = useState<Order | null>(null);

  // Settings State (Draft form)
  const [brandingForm, setBrandingForm] = useState(brandingProfile);
  const [gatewaysForm, setGatewaysForm] = useState(paymentGateways);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Filtered menu for POS
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = posCategory === 'all' || item.category === posCategory;
      const matchSearch = item.name.toLowerCase().includes(posSearch.toLowerCase()) || 
                          item.subtitle.toLowerCase().includes(posSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, posCategory, posSearch]);

  // POS Add item
  const handlePosAddItem = (item: MenuItem) => {
    setPosStagedCart(prev => {
      const existing = prev.find(p => p.menuItemId === item.id);
      if (existing) {
        return prev.map(p => p.menuItemId === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      const newItem: OrderItem = {
        cartItemId: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category,
        station: item.station,
        image: item.image,
        customization: {
          size: !item.isFood ? 'Regular (12oz)' : undefined,
          warming: item.isFood ? true : undefined,
          servingStyle: posOrderType === 'dine_in' ? 'For Here (on slate plate)' : 'To-Go (in craft bag)',
        },
        itemStatus: 'pending',
      };
      return [...prev, newItem];
    });
    playChime('click');
  };

  const handlePosSubmitOrder = () => {
    if (posStagedCart.length === 0) return;
    const subtotal = posStagedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * (brandingProfile.taxRate || 0.0825);
    const total = subtotal + tax;

    createOrder({
      customerName: `${selectedTable} (${selectedWaiter.split(' ')[1]})`,
      orderType: posOrderType,
      tableNumber: posOrderType === 'dine_in' ? selectedTable : undefined,
      waiterId: selectedWaiter,
      waiterName: selectedWaiter.split(' ')[1],
      items: [...posStagedCart],
      subtotal,
      tax,
      total,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      overallStatus: 'received',
    });

    setPosStagedCart([]);
    playChime('order');
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandingProfile(brandingForm);
    updatePaymentGateways(gatewaysForm);
    setSettingsSavedToast(true);
    playChime('ready');
    setTimeout(() => setSettingsSavedToast(false), 2400);
  };

  // Print receipt invoice popup handler
  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=450,height=600');
    if (!printWindow) return;

    const itemsHtml = order.items.map(it => `
      <tr>
        <td style="padding: 6px 0; border-bottom: 1px dashed #ddd;">
          <div style="font-weight: 600; font-size: 13px;">${it.quantity}x ${it.name}</div>
          <div style="font-size: 11px; color: #555;">${it.customization?.size || ''} ${it.customization?.servingStyle || ''}</div>
        </td>
        <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #ddd; font-family: monospace; font-size: 13px;">
          ${brandingProfile.currency}${(it.price * it.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt #${order.orderNumber} - ${brandingProfile.name}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 340px; margin: 0 auto; padding: 20px; color: #111; background: #fff; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
            .header h2 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 3px 0; font-size: 12px; color: #444; }
            .meta { font-size: 12px; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            .meta table { width: 100%; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
            .totals { font-size: 13px; border-top: 2px solid #000; padding-top: 8px; }
            .totals table { width: 100%; }
            .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #555; border-top: 1px dashed #ccc; padding-top: 12px; }
            @media print { body { width: 100%; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${brandingProfile.name}</h2>
            <p>${brandingProfile.address}</p>
            <p>Tel: ${brandingProfile.phone}</p>
            <p>${brandingProfile.email}</p>
          </div>
          <div class="meta">
            <table>
              <tr><td><strong>Order #:</strong> ${order.orderNumber}</td><td style="text-align: right;">${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td></tr>
              <tr><td><strong>Server:</strong> ${order.waiterId || 'Staff'}</td><td style="text-align: right;"><strong>Table:</strong> ${order.tableNumber || 'To-Go'}</td></tr>
              <tr><td><strong>Type:</strong> ${order.orderType === 'dine_in' ? 'Dine In' : 'Takeaway'}</td><td style="text-align: right;"><strong>Status:</strong> ${order.paymentStatus.toUpperCase()}</td></tr>
            </table>
          </div>
          <table class="items">
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="totals">
            <table>
              <tr><td>Subtotal:</td><td style="text-align: right; font-family: monospace;">${brandingProfile.currency}${order.subtotal.toFixed(2)}</td></tr>
              <tr><td>Tax (${((brandingProfile.taxRate || 0.0825) * 100).toFixed(2)}%):</td><td style="text-align: right; font-family: monospace;">${brandingProfile.currency}${order.tax.toFixed(2)}</td></tr>
              ${order.tip ? `<tr><td>Tip:</td><td style="text-align: right; font-family: monospace;">${brandingProfile.currency}${order.tip.toFixed(2)}</td></tr>` : ''}
              <tr style="font-weight: bold; font-size: 15px;"><td>TOTAL:</td><td style="text-align: right; font-family: monospace;">${brandingProfile.currency}${order.total.toFixed(2)}</td></tr>
              <tr><td>Payment Method:</td><td style="text-align: right; text-transform: uppercase;">${order.paymentMethod || 'Card'}</td></tr>
            </table>
          </div>
          <div class="footer">
            <p>Thank you for visiting ${brandingProfile.name}!</p>
            <p>Please come again.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Waiter Ledger analytics calculation
  const waiterStats = useMemo(() => {
    const list = ledgerWaiterFilter === 'all' 
      ? orders 
      : orders.filter(o => o.waiterId === ledgerWaiterFilter);

    const totalSales = list.reduce((sum, o) => sum + o.total, 0);
    const totalTips = list.reduce((sum, o) => sum + (o.tip || 0), 0);
    const count = list.length;
    return { list, totalSales, totalTips, count };
  }, [orders, ledgerWaiterFilter]);

  return (
    <div className="min-h-screen bg-[#0e0805] text-[#faede1] pb-24">
      
      {/* 1. Top Operations Bar */}
      <div className="sticky top-0 z-40 bg-[#160d08]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('storefront')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-[#baa293] hover:text-white transition-all border border-white/10"
            title="Return to Customer Storefront"
          >
            <Store className="w-3.5 h-3.5 text-[#d59a63]" />
            <span>Storefront</span>
          </button>
          
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
              {brandingProfile.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#d59a63]/20 border border-[#d59a63]/30 text-[10px] font-mono text-[#d59a63]">
              BOH Hub
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: 'pos', label: 'Waiter POS', icon: UtensilsCrossed },
            { id: 'kds', label: 'Kitchen KDS', icon: Coffee },
            { id: 'ready_board', label: 'Ready Board', icon: CheckCircle2 },
            { id: 'waiter_ledger', label: 'Waiter Ledger', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'branding_settings', label: 'Settings & Branding', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeOperationsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveOperationsTab(tab.id as any);
                  playChime('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive 
                    ? 'bg-[#d59a63] text-[#120b08] font-bold shadow-md' 
                    : 'text-[#baa293] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Staff Sign Out */}
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs transition-all border border-rose-800/30"
          title="Sign out of operations"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lock Hub</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: WAITER ORDER TAKER POS                            */}
        {/* ======================================================== */}
        {activeOperationsTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Area: Waiter Selection & Menu Catalog (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Waiter & Table Selector Header Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-black/50 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#d59a63]" />
                    <span className="text-xs uppercase tracking-wider text-[#baa293] font-medium">
                      Server Badge:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['W-01 Marcus', 'W-02 Elena', 'W-03 Sofia', 'W-04 David'] as const).map(w => (
                        <button
                          key={w}
                          onClick={() => setSelectedWaiter(w)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all border ${
                            selectedWaiter === w
                              ? 'bg-[#d59a63] text-[#120b08] font-bold border-[#d59a63]'
                              : 'bg-black/40 border-white/5 text-[#baa293] hover:text-white'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPosOrderType('dine_in')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                        posOrderType === 'dine_in'
                          ? 'bg-[#2b170e] border-[#d59a63] text-white'
                          : 'bg-black/30 border-white/5 text-[#baa293]'
                      }`}
                    >
                      Dine-In
                    </button>
                    <button
                      onClick={() => setPosOrderType('takeaway')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                        posOrderType === 'takeaway'
                          ? 'bg-[#2b170e] border-[#d59a63] text-white'
                          : 'bg-black/30 border-white/5 text-[#baa293]'
                      }`}
                    >
                      To-Go
                    </button>
                  </div>
                </div>

                {/* Table Picker */}
                {posOrderType === 'dine_in' && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#baa293] block">
                      Assign Floor Table / Seating Area:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Bar 1', 'Bar 2', 'VIP Booth'].map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTable(t)}
                          className={`px-3 py-1 rounded-xl text-xs transition-all border ${
                            selectedTable === t
                              ? 'bg-[#d59a63] text-[#120b08] font-bold border-[#d59a63]'
                              : 'bg-black/40 border-white/5 text-[#baa293] hover:border-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'hot_classics', label: 'Espresso' },
                    { id: 'chilled', label: 'Chilled' },
                    { id: 'bakery', label: 'Bakery' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setPosCategory(cat.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        posCategory === cat.id
                          ? 'bg-[#2b170e] text-[#d59a63] border border-[#d59a63]/50 font-bold'
                          : 'text-[#baa293] hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#baa293]" />
                  <input
                    type="text"
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#7d6758] focus:outline-none focus:border-[#d59a63]"
                  />
                </div>
              </div>

              {/* Grid of Menu Items with Product Photography */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredMenuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handlePosAddItem(item)}
                    className="p-3 rounded-2xl bg-black/50 hover:bg-black/70 border border-white/5 hover:border-white/20 transition-all text-left shadow-[0_10px_25px_rgba(0,0,0,0.7)] group flex flex-col justify-between h-48 active:scale-98"
                  >
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-black/30 border border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-mono text-[#d59a63]">
                        {item.station === 'barista' ? 'Bar' : 'Oven'}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white group-hover:text-[#d59a63] transition-colors truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-xs font-bold text-[#faede1]">
                          {brandingProfile.currency}{item.price.toFixed(2)}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-[#d59a63] group-hover:text-black flex items-center justify-center text-[10px] text-[#baa293] transition-colors">
                          +
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* Right Area: Staged POS Order Ticket (4 Cols) */}
            <div className="lg:col-span-4 sticky top-20">
              <div className="p-5 rounded-3xl bg-black/60 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      Active Table Slip
                    </h3>
                    <span className="text-[11px] text-[#baa293] block">
                      {posOrderType === 'dine_in' ? selectedTable : 'To-Go'} · {selectedWaiter}
                    </span>
                  </div>

                  {posStagedCart.length > 0 && (
                    <button
                      onClick={() => setPosStagedCart([])}
                      className="text-[11px] text-[#8e7667] hover:text-rose-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Staged Items List with Photo Thumbnails */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-none">
                  {posStagedCart.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8e7667] space-y-2">
                      <Receipt className="w-8 h-8 mx-auto opacity-40 text-[#d59a63]" />
                      <p>Tap items from the left to build the table ticket.</p>
                    </div>
                  ) : (
                    posStagedCart.map(item => (
                      <div
                        key={item.cartItemId}
                        className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover bg-black/40 border border-white/5 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-serif text-xs font-semibold text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-[#baa293] font-mono">
                              {brandingProfile.currency}{item.price.toFixed(2)} ea
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/50">
                            <button
                              onClick={() => setPosStagedCart(prev => prev.map(p => p.cartItemId === item.cartItemId ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p).filter(p => p.quantity > 0))}
                              className="px-1.5 py-0.5 text-xs text-[#baa293] hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-1.5 font-mono text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setPosStagedCart(prev => prev.map(p => p.cartItemId === item.cartItemId ? { ...p, quantity: p.quantity + 1 } : p))}
                              className="px-1.5 py-0.5 text-xs text-[#baa293] hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono text-xs font-bold text-[#faede1] min-w-[45px] text-right">
                            {brandingProfile.currency}{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Action */}
                {posStagedCart.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#baa293]">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">
                        {brandingProfile.currency}
                        {posStagedCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handlePosSubmitOrder}
                      className="w-full py-3 rounded-2xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Send Ticket to Kitchen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: KITCHEN KDS (BARISTA & BAKERY CARDS)             */}
        {/* ======================================================== */}
        {activeOperationsTab === 'kds' && (
          <div className="space-y-6">
            
            {/* Station Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-black/50 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#d59a63]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Kitchen Display Production Queue
                  </h3>
                  <span className="text-[11px] text-[#baa293] block">
                    Product photos visible across all preparation phases
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-2xl border border-white/10">
                {[
                  { id: 'all', label: 'All Kitchen Orders' },
                  { id: 'barista', label: 'Barista Espresso' },
                  { id: 'bakery', label: 'Bakery Oven' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setKdsFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      kdsFilter === f.id
                        ? 'bg-[#d59a63] text-[#120b08] font-bold shadow-md'
                        : 'text-[#baa293] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KDS Order Cards Grid: Lifted with Deep Shadows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.filter(o => o.overallStatus !== 'completed').map(order => {
                const filteredItems = order.items.filter(it => 
                  kdsFilter === 'all' || it.station === kdsFilter
                );
                if (filteredItems.length === 0) return null;

                const elapsedMinutes = Math.max(1, Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000));
                const isUrgent = elapsedMinutes >= 6;

                return (
                  <div
                    key={order.id}
                    className={`rounded-3xl p-5 bg-[#170e09] border transition-all duration-300 shadow-[0_25px_65px_rgba(0,0,0,0.9)] flex flex-col justify-between ${
                      isUrgent 
                        ? 'border-rose-500/60 ring-2 ring-rose-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className="space-y-2 border-b border-white/10 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-bold text-white">
                            #{order.orderNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            order.overallStatus === 'ready' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.overallStatus === 'in_prep' 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/10 text-[#d59a63] border border-white/10'
                          }`}>
                            {order.overallStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#baa293] font-mono">
                          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-[#d59a63]'}`} />
                          <span>{elapsedMinutes}m ago</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#baa293]">
                        <span className="font-medium text-white truncate">
                          {order.tableNumber ? `${order.tableNumber}` : 'Takeaway Counter'}
                        </span>
                        <span className="font-mono text-[11px] text-[#d59a63]">
                          {order.waiterId || 'Staff'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items with High-Res Photos at all stages */}
                    <div className="py-4 space-y-3 flex-1">
                      {filteredItems.map(item => (
                        <div 
                          key={item.cartItemId}
                          className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 shadow-sm"
                        >
                          {/* Item Photo shown at every stage */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate">
                                <span className="font-mono text-[#d59a63] mr-1.5">{item.quantity}x</span>
                                {item.name}
                              </h4>
                              <button
                                onClick={() => {
                                  const nextStatus: ItemStatus = 
                                    item.itemStatus === 'pending' ? 'in_prep' : 
                                    item.itemStatus === 'in_prep' ? 'ready' : 'completed';
                                  updateItemStatus(order.id, item.cartItemId, nextStatus);
                                }}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border ${
                                  item.itemStatus === 'ready' 
                                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' 
                                    : item.itemStatus === 'in_prep' 
                                    ? 'bg-amber-600/30 text-amber-300 border-amber-500/40' 
                                    : 'bg-white/10 text-[#baa293] border-white/10 hover:text-white'
                                }`}
                              >
                                {item.itemStatus}
                              </button>
                            </div>

                            {/* Recipe & Prep Modifiers */}
                            <div className="text-[10px] text-[#baa293] space-y-0.5 pt-1">
                              {item.customization.size && <span>Size: {item.customization.size} · </span>}
                              {item.customization.milk && <span>Milk: {item.customization.milk} · </span>}
                              {item.customization.warming !== undefined && (
                                <span className="text-[#f49b42] font-semibold">
                                  {item.customization.warming ? '🔥 Deck Oven Warm' : 'Ambient'}
                                </span>
                              )}
                              {item.customization.notes && (
                                <p className="italic text-[#d59a63]">"{item.customization.notes}"</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Master Ticket Action */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#baa293]">
                        {filteredItems.length} items
                      </span>

                      <div className="flex items-center gap-2">
                        {order.overallStatus === 'received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'in_prep')}
                            className="px-4 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
                          >
                            Start Prep
                          </button>
                        )}
                        {order.overallStatus === 'in_prep' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
                          >
                            Mark Order Ready
                          </button>
                        )}
                        {order.overallStatus === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-4 py-2 rounded-xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-xs transition-all shadow-md active:scale-95"
                          >
                            Complete &amp; Serve
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ORDER READY BOARD (PUBLIC / EXPEDITOR PICKUP)     */}
        {/* ======================================================== */}
        {activeOperationsTab === 'ready_board' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d59a63] font-semibold block">
                Live Order Dispatch &amp; Pickup Screen
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Orders Status Board
              </h2>
              <p className="text-xs text-[#baa293] font-light">
                Track preparing drinks and pick up when your order number illuminates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Now Brewing / Baking */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif font-bold text-lg text-white">
                      Now Brewing &amp; Baking
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono">
                    {orders.filter(o => o.overallStatus === 'received' || o.overallStatus === 'in_prep').length} in prep
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {orders.filter(o => o.overallStatus === 'received' || o.overallStatus === 'in_prep').map(o => (
                    <div 
                      key={o.id}
                      className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 text-center space-y-1 shadow-md"
                    >
                      <span className="font-mono text-2xl font-bold text-amber-300 block">
                        #{o.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#baa293] block truncate">
                        {o.tableNumber || 'To-Go'}
                      </span>
                      <span className="text-[10px] text-[#8e7667] font-mono block">
                        {o.waiterId || 'Pickup'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Ready for Pickup / Table Dispatch */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#131d14] border border-emerald-500/30 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-serif font-bold text-lg text-white">
                      Ready for Pickup / Table
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                    {orders.filter(o => o.overallStatus === 'ready').length} ready
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {orders.filter(o => o.overallStatus === 'ready').map(o => (
                    <div 
                      key={o.id}
                      className="p-4 rounded-2xl bg-black/50 border border-emerald-500/40 text-center space-y-2 shadow-lg ring-1 ring-emerald-500/30"
                    >
                      <span className="font-mono text-3xl font-bold text-emerald-400 block animate-pulse">
                        #{o.orderNumber}
                      </span>
                      <span className="text-xs font-semibold text-white block truncate">
                        {o.tableNumber || 'Counter'}
                      </span>
                      <span className="text-[10px] text-emerald-300 font-mono block">
                        Waiter: {o.waiterId || 'Self'}
                      </span>
                      <button
                        onClick={() => updateOrderStatus(o.id, 'completed')}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all"
                      >
                        Delivered
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WAITER BILLING & SALES LEDGER                     */}
        {/* ======================================================== */}
        {activeOperationsTab === 'waiter_ledger' && (
          <div className="space-y-6">
            
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-black/50 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
                <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
                  Total Shift Revenue
                </span>
                <span className="font-mono text-2xl font-bold text-white">
                  {brandingProfile.currency}{waiterStats.totalSales.toFixed(2)}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-black/50 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
                <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
                  Total Staff Tips
                </span>
                <span className="font-mono text-2xl font-bold text-[#d59a63]">
                  {brandingProfile.currency}{waiterStats.totalTips.toFixed(2)}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-black/50 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
                <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
                  Total Completed Orders
                </span>
                <span className="font-mono text-2xl font-bold text-white">
                  {waiterStats.count} orders
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-black/50 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] space-y-1">
                <span className="text-[11px] text-[#baa293] uppercase tracking-wider block">
                  Current Waiters on Shift
                </span>
                <span className="font-mono text-2xl font-bold text-emerald-400">
                  4 Active
                </span>
              </div>
            </div>

            {/* Waiter Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-black/50 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#d59a63]" />
                <span className="text-xs font-semibold text-white">
                  Filter by Waiter ID:
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['all', 'W-01 Marcus', 'W-02 Elena', 'W-03 Sofia', 'W-04 David'].map(w => (
                  <button
                    key={w}
                    onClick={() => setLedgerWaiterFilter(w)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      ledgerWaiterFilter === w
                        ? 'bg-[#d59a63] text-[#120b08] font-bold border-[#d59a63]'
                        : 'bg-black/40 border-white/5 text-[#baa293] hover:text-white'
                    }`}
                  >
                    {w === 'all' ? 'All Staff' : w}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table with Product Thumbnails & Billing Status */}
            <div className="rounded-3xl bg-black/60 border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c110b] border-b border-white/10 text-[#baa293] uppercase tracking-wider font-mono text-[10px]">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Waiter ID</th>
                      <th className="p-4">Table / Patron</th>
                      <th className="p-4">Ordered Items</th>
                      <th className="p-4">Subtotal</th>
                      <th className="p-4">Tax</th>
                      <th className="p-4">Tip</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#faede1]">
                    {waiterStats.list.map(o => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#d59a63]">
                          #{o.orderNumber}
                        </td>
                        <td className="p-4 font-mono">
                          {o.waiterId || 'Online Web'}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block">{o.tableNumber || 'To-Go'}</span>
                          <span className="text-[10px] text-[#baa293]">{o.customerName}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {o.items.slice(0, 3).map(it => (
                              <img
                                key={it.cartItemId}
                                src={it.image}
                                alt={it.name}
                                title={`${it.quantity}x ${it.name}`}
                                className="w-7 h-7 rounded-lg object-cover bg-black/40 border border-white/10"
                              />
                            ))}
                            {o.items.length > 3 && (
                              <span className="text-[10px] font-mono text-[#baa293]">
                                +{o.items.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          {brandingProfile.currency}{o.subtotal.toFixed(2)}
                        </td>
                        <td className="p-4 font-mono text-[#baa293]">
                          {brandingProfile.currency}{o.tax.toFixed(2)}
                        </td>
                        <td className="p-4 font-mono text-emerald-400">
                          {o.tip ? `${brandingProfile.currency}${o.tip.toFixed(2)}` : '—'}
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          {brandingProfile.currency}{o.total.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            o.paymentStatus === 'paid' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {o.paymentStatus.toUpperCase()} ({o.paymentMethod || 'card'})
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.paymentStatus === 'unpaid' && (
                              <button
                                onClick={() => settleOrderBill(o.id, 2.00)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px]"
                              >
                                Settle Bill
                              </button>
                            )}
                            <button
                              onClick={() => handlePrintReceipt(o)}
                              className="p-1.5 rounded-lg bg-[#d59a63]/10 hover:bg-[#d59a63]/20 text-[#d59a63] hover:text-white transition-colors border border-[#d59a63]/30"
                              title="Print customer receipt invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInspectedReceiptOrder(o)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#baa293] hover:text-white transition-colors"
                              title="View full receipt details"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Receipt Modal */}
            {inspectedReceiptOrder && (
              <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setInspectedReceiptOrder(null)}
              >
                <div 
                  className="bg-[#180f0a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center border-b border-white/10 pb-4 space-y-1">
                    <h3 className="font-serif font-bold text-lg text-white">
                      {brandingProfile.name}
                    </h3>
                    <p className="text-xs text-[#baa293]">{brandingProfile.address}</p>
                    <p className="text-xs text-[#baa293]">{brandingProfile.phone}</p>
                    <span className="font-mono text-xs text-[#d59a63] block pt-2">
                      Order #{inspectedReceiptOrder.orderNumber} · Server: {inspectedReceiptOrder.waiterId || 'Staff'}
                    </span>
                  </div>

                  <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
                    {inspectedReceiptOrder.items.map(it => (
                      <div key={it.cartItemId} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={it.image} alt={it.name} className="w-7 h-7 rounded-md object-cover" />
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                        <span className="font-mono">{brandingProfile.currency}{(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-[#baa293]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">{brandingProfile.currency}{inspectedReceiptOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span className="font-mono text-white">{brandingProfile.currency}{inspectedReceiptOrder.tax.toFixed(2)}</span>
                    </div>
                    {inspectedReceiptOrder.tip && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Tip</span>
                        <span className="font-mono">+{brandingProfile.currency}{inspectedReceiptOrder.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-1">
                      <span>Total Paid</span>
                      <span className="font-mono text-[#d59a63]">{brandingProfile.currency}{inspectedReceiptOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handlePrintReceipt(inspectedReceiptOrder)}
                      className="flex-1 py-2.5 rounded-xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={() => setInspectedReceiptOrder(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#faede1] text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SHIFT ANALYTICS DASHBOARD                          */}
        {/* ======================================================== */}
        {activeOperationsTab === 'analytics' && (
          <AnalyticsHubTab />
        )}

        {/* ======================================================== */}
        {/* TAB 5: BRANDING PROFILE & PAYMENT GATEWAY SETTINGS       */}
        {/* ======================================================== */}
        {activeOperationsTab === 'branding_settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d59a63] font-semibold block">
                  Cafe Customization &amp; Gateways
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Editable Brand Profile &amp; Commerce
                </h2>
                <p className="text-xs text-[#baa293] font-light mt-1">
                  Changes made here update the storefront header, cart calculations, receipts, and order slips instantly.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-2 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Save &amp; Apply Live</span>
              </button>
            </div>

            {/* Saved Toast Feedback */}
            {settingsSavedToast && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Branding Profile and Payment Gateways saved and applied live across storefront!</span>
              </div>
            )}

            {/* Brand Core Fields */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-6">
              <h3 className="font-serif font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#d59a63]" />
                <span>Brand Identity &amp; Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Cafe Business Name
                  </label>
                  <input
                    type="text"
                    value={brandingForm.name}
                    onChange={(e) => setBrandingForm({ ...brandingForm, name: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Brand Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={brandingForm.tagline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={brandingForm.address}
                    onChange={(e) => setBrandingForm({ ...brandingForm, address: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    City, State, Zip
                  </label>
                  <input
                    type="text"
                    value={brandingForm.cityStateZip}
                    onChange={(e) => setBrandingForm({ ...brandingForm, cityStateZip: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Telephone Number
                  </label>
                  <input
                    type="text"
                    value={brandingForm.phone}
                    onChange={(e) => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Customer Concierge Email
                  </label>
                  <input
                    type="email"
                    value={brandingForm.email}
                    onChange={(e) => setBrandingForm({ ...brandingForm, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={brandingForm.openingHours}
                    onChange={(e) => setBrandingForm({ ...brandingForm, openingHours: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={brandingForm.currency}
                      onChange={(e) => setBrandingForm({ ...brandingForm, currency: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={brandingForm.taxRate}
                      onChange={(e) => setBrandingForm({ ...brandingForm, taxRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d59a63]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Gateways Selection */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#170e09] border border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.9)] space-y-6">
              <h3 className="font-serif font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#d59a63]" />
                <span>Payment Gateways Selection</span>
              </h3>

              <p className="text-xs text-[#baa293] font-light">
                Toggle the gateways you wish to accept during customer storefront and mobile checkout.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'stripe', label: 'Stripe Online Credit Cards', desc: 'Accept Visa, Mastercard, AMEX' },
                  { key: 'square', label: 'Square Terminal & Chip', desc: 'In-person tap and chip reader' },
                  { key: 'applePay', label: 'Apple Pay 1-Tap', desc: 'Instant iOS biometrics checkout' },
                  { key: 'googlePay', label: 'Google Pay', desc: 'Fast Chrome and Android pay' },
                  { key: 'cashOnDelivery', label: 'Cash on Counter / Delivery', desc: 'Pay cashier upon barista pickup' },
                ].map(gw => {
                  const isChecked = (gatewaysForm as any)[gw.key];
                  return (
                    <label
                      key={gw.key}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-[#2b170e] border-[#d59a63] text-white shadow-md' 
                          : 'bg-black/40 border-white/5 text-[#baa293] hover:border-white/15'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, [gw.key]: e.target.checked })}
                        className="mt-0.5 accent-[#d59a63] w-4 h-4 rounded"
                      />
                      <div>
                        <span className="font-semibold text-xs block text-white">{gw.label}</span>
                        <span className="text-[11px] text-[#baa293] font-light">{gw.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save All Brand &amp; Gateway Settings</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
