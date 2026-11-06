import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Flame, 
  Coffee, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  User, 
  UtensilsCrossed,
  SlidersHorizontal,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, ProductCategory, ServingStyle, CustomizationOptions } from '../types';

export const POSOrderBooker: React.FC = () => {
  const { 
    menuItems, 
    createOrder, 
    playChime,
    setActiveView 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-In Guest');
  const [selectedTable, setSelectedTable] = useState('Table 2');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [activeItemForMod, setActiveItemForMod] = useState<OrderItem | null>(null);

  // Quick default modifiers preset for fast cashier booking
  const [defaultWarming, setDefaultWarming] = useState(true);
  const [defaultServingStyle, setDefaultServingStyle] = useState<ServingStyle>('For Here (on slate plate)');

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(m => m.category === activeCategory);

  const handleAddItem = (item: MenuItem) => {
    const custom: CustomizationOptions = {
      size: item.isFood ? undefined : 'Regular (12oz)',
      milk: item.isColdDrink || item.category === 'hot_classics' ? 'Whole Milk' : undefined,
      iceLevel: item.isColdDrink ? 'Regular Ice' : undefined,
      whippedCream: item.isShake ? 'Vanilla Whipped Cream' : undefined,
      sweetness: 'Standard (100%)',
      shots: 'Standard Shot',
      syrup: 'None',
      warming: item.isFood ? defaultWarming : undefined,
      servingStyle: item.isFood ? defaultServingStyle : undefined,
      notes: '',
    };

    const newCartItem: OrderItem = {
      cartItemId: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category,
      station: item.station,
      image: item.image,
      customization: custom,
      itemStatus: 'pending',
    };

    setPosCart(prev => [...prev, newCartItem]);
    playChime('click');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setPosCart(prev =>
      prev
        .map(i => {
          if (i.cartItemId === cartItemId) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter((i): i is OrderItem => i !== null)
    );
  };

  const removeItem = (cartItemId: string) => {
    setPosCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const toggleItemWarming = (cartItemId: string) => {
    setPosCart(prev =>
      prev.map(i => {
        if (i.cartItemId === cartItemId && i.customization.warming !== undefined) {
          return {
            ...i,
            customization: {
              ...i.customization,
              warming: !i.customization.warming,
            },
          };
        }
        return i;
      })
    );
  };

  const toggleItemServingStyle = (cartItemId: string) => {
    setPosCart(prev =>
      prev.map(i => {
        if (i.cartItemId === cartItemId && i.customization.servingStyle) {
          const nextStyle: ServingStyle = i.customization.servingStyle === 'For Here (on slate plate)'
            ? 'To-Go (in craft bag)'
            : 'For Here (on slate plate)';
          return {
            ...i,
            customization: {
              ...i.customization,
              servingStyle: nextStyle,
            },
          };
        }
        return i;
      })
    );
  };

  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleTender = (method: 'card' | 'cash' | 'apple_pay') => {
    if (posCart.length === 0) return;

    createOrder({
      customerName: customerName.trim() || 'Counter Customer',
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : undefined,
      items: posCart,
      subtotal,
      tax,
      total,
      paymentStatus: 'paid',
      paymentMethod: method,
      overallStatus: 'received',
      notes: 'Booked via POS Order Terminal',
    });

    setPosCart([]);
    playChime('order');
  };

  return (
    <div className="bg-[#120b08] min-h-[calc(100vh-4rem)] p-4 sm:p-6 text-[#f4ece4]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CENTER: MENU CATALOG (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* POS Terminal Top Bar */}
          <div className="p-4 rounded-xl bg-[#19100a] border border-[#2d1b11] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#d49a5b] font-mono">
                Terminal #01 · Cashier Mode
              </span>
              <h2 className="font-serif text-lg font-bold text-[#faede1]">
                Quick Order Booker
              </h2>
            </div>

            {/* Food modifiers preset bar for fast cashier entry */}
            <div className="flex items-center gap-2 bg-[#22140d] p-1.5 rounded-lg border border-[#382215] text-xs">
              <span className="text-[11px] text-[#9a8272] pl-1">Food Defaults:</span>
              <button
                onClick={() => setDefaultWarming(!defaultWarming)}
                className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  defaultWarming ? 'bg-[#d49a5b] text-[#120b08] font-bold' : 'bg-[#2d1a10] text-[#8e7667]'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>{defaultWarming ? 'Auto Warm' : 'Ambient'}</span>
              </button>

              <button
                onClick={() => setDefaultServingStyle(defaultServingStyle.includes('Here') ? 'To-Go (in craft bag)' : 'For Here (on slate plate)')}
                className="px-2 py-1 rounded text-[11px] font-medium bg-[#2d1a10] hover:bg-[#392114] text-[#faede1] transition-colors"
              >
                {defaultServingStyle.includes('Here') ? '🍽️ For Here' : '🛍️ To-Go'}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'bakery', label: 'The Bakery / Sweets' },
              { id: 'chilled', label: 'Chilled & Blended' },
              { id: 'hot_classics', label: 'Espresso & Hot Classics' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#3b2316] text-[#faede1] border border-[#d49a5b] font-semibold'
                    : 'bg-[#1b1009] text-[#9b8374] border border-[#2d1b11] hover:text-[#faede1]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* POS Product Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="p-3 rounded-xl bg-[#1a100a] border border-[#2e1c12] hover:border-[#4d2f1f] hover:bg-[#22150e] transition-all text-left flex flex-col justify-between group h-32 active:scale-95 shadow-sm"
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="font-serif text-xs sm:text-sm font-bold text-[#faede1] group-hover:text-[#e4b281] line-clamp-2 leading-tight">
                    {item.name}
                  </span>
                  {item.isFood ? (
                    <Flame className="w-3.5 h-3.5 text-[#e2843d] shrink-0" />
                  ) : (
                    <Coffee className="w-3.5 h-3.5 text-[#d49a5b] shrink-0" />
                  )}
                </div>

                <div className="flex items-end justify-between w-full pt-2">
                  <span className="text-[10px] text-[#8e7667] uppercase font-mono">
                    {item.station}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#f7e5d2]">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT: ACTIVE TICKET & TENDER (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#19100a] border border-[#2e1c12] p-4 sm:p-5 flex flex-col justify-between shadow-2xl min-h-[580px]">
            
            {/* Ticket Header & Destination Controls */}
            <div className="space-y-3 pb-3 border-b border-[#2b1910]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#d49a5b] font-bold">
                  NEW TICKET
                </span>
                <span className="text-xs text-[#8c7465]">
                  {posCart.length} lines
                </span>
              </div>

              {/* Order destination toggle */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setOrderType('dine_in')}
                  className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                    orderType === 'dine_in'
                      ? 'bg-[#3b2316] border-[#d49a5b] text-[#faede1]'
                      : 'bg-[#20130c] border-[#311d13] text-[#8e7667]'
                  }`}
                >
                  Dine-In (Table)
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                    orderType === 'takeaway'
                      ? 'bg-[#3b2316] border-[#d49a5b] text-[#faede1]'
                      : 'bg-[#20130c] border-[#311d13] text-[#8e7667]'
                  }`}
                >
                  To-Go (Takeaway)
                </button>
              </div>

              {/* Customer & Table Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-[#816b5c] block mb-0.5">Guest Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#130b07] border border-[#311d13] rounded-lg px-2.5 py-1.5 text-xs text-[#faede1] focus:outline-none focus:border-[#d49a5b]"
                  />
                </div>
                {orderType === 'dine_in' ? (
                  <div>
                    <label className="text-[10px] text-[#816b5c] block mb-0.5">Table Station</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-[#130b07] border border-[#311d13] rounded-lg px-2 py-1.5 text-xs text-[#faede1] focus:outline-none focus:border-[#d49a5b]"
                    >
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Counter Bar'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-[#816b5c] block mb-0.5">Packaging</label>
                    <div className="px-2 py-1.5 text-[11px] text-[#a98f7e] bg-[#140b07] border border-[#311d13] rounded-lg">
                      Craft Paper Bag
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Items Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 max-h-72 my-1">
              {posCart.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-center text-[#7e6758] space-y-2">
                  <UtensilsCrossed className="w-6 h-6 opacity-40" />
                  <p className="text-xs">Tap items to book ticket</p>
                </div>
              ) : (
                posCart.map(item => (
                  <div
                    key={item.cartItemId}
                    className="p-2.5 rounded-lg bg-[#20130c] border border-[#301c12] space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-medium text-[#faede1]">
                        {item.quantity}x {item.name}
                      </div>
                      <span className="font-mono font-bold text-[#faede1]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quick Food Modifier Buttons on Ticket */}
                    {item.station === 'bakery' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => toggleItemWarming(item.cartItemId)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1 transition-colors ${
                            item.customization.warming
                              ? 'bg-[#3b2112] border-[#e2843d] text-[#f49b42]'
                              : 'bg-[#180f0a] border-[#311d13] text-[#7d6758]'
                          }`}
                        >
                          <Flame className="w-2.5 h-2.5" />
                          <span>{item.customization.warming ? '🔥 Heated' : 'Room Temp'}</span>
                        </button>

                        <button
                          onClick={() => toggleItemServingStyle(item.cartItemId)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#180f0a] border border-[#311d13] text-[#a98f7e] hover:text-[#faede1]"
                        >
                          {item.customization.servingStyle?.includes('Here') ? '🍽️ Slate' : '🛍️ Bag'}
                        </button>
                      </div>
                    )}

                    {/* Drink Modifiers */}
                    {item.station === 'barista' && (
                      <div className="text-[10px] text-[#8e7667]">
                        {item.customization.milk || 'Whole Milk'} · {item.customization.iceLevel || 'Standard'}
                      </div>
                    )}

                    {/* Quantity Controls & Delete */}
                    <div className="pt-1.5 flex items-center justify-between border-t border-[#29170e]">
                      <span className="text-[10px] font-mono text-[#8a7263]">
                        Routes to: {item.station.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-5 h-5 rounded bg-[#180f0a] text-center text-[#9b8374] hover:text-[#faede1] flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono text-[11px] text-[#faede1]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-5 h-5 rounded bg-[#180f0a] text-center text-[#9b8374] hover:text-[#faede1] flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="ml-2 text-[#7d6353] hover:text-rose-400 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Tender Buttons */}
            <div className="space-y-3 pt-3 border-t border-[#2b1910]">
              <div className="space-y-1 text-xs text-[#9a8272]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#faede1]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span className="font-mono text-[#faede1]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#faede1] pt-1">
                  <span>Total Due</span>
                  <span className="font-mono text-[#d49a5b] text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Instant Tender Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleTender('card')}
                  disabled={posCart.length === 0}
                  className="py-2.5 px-2 rounded-lg bg-[#3b2316] hover:bg-[#4b2d1c] disabled:opacity-40 text-[#faede1] font-semibold text-xs border border-[#4d2e1b] transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-[#d49a5b]" />
                  <span>Card Tap</span>
                </button>

                <button
                  onClick={() => handleTender('apple_pay')}
                  disabled={posCart.length === 0}
                  className="py-2.5 px-2 rounded-lg bg-[#3b2316] hover:bg-[#4b2d1c] disabled:opacity-40 text-[#faede1] font-semibold text-xs border border-[#4d2e1b] transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                >
                  <Smartphone className="w-4 h-4 text-[#d49a5b]" />
                  <span>Apple Pay</span>
                </button>

                <button
                  onClick={() => handleTender('cash')}
                  disabled={posCart.length === 0}
                  className="py-2.5 px-2 rounded-lg bg-gradient-to-r from-[#c98a4c] to-[#a05f2c] hover:from-[#d99757] hover:to-[#b76e33] disabled:opacity-40 text-[#120b08] font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 active:scale-95 shadow-md"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash Exact</span>
                </button>
              </div>

              {/* Station routing notification banner */}
              <div className="text-[10px] text-center text-[#8e7667]">
                ⚡ Instantly sends tickets to Barista &amp; Bakery screens upon tender
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
