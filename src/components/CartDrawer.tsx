import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Coffee, 
  Flame, 
  CreditCard,
  Banknote,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderType } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartTax, 
    cartTotal,
    clearCart,
    createOrder,
    setRecentConfirmedOrder,
    playChime,
    brandingProfile,
    paymentGateways
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const tipAmount = selectedTip > 0 ? (cartSubtotal * selectedTip) : 0;
  const finalPayableTotal = cartTotal + tipAmount;

  // Filter available payment gateways
  const availableGateways = [
    { id: 'card', name: 'Credit Card / Stripe', enabled: paymentGateways.stripe || paymentGateways.square, icon: CreditCard },
    { id: 'apple_pay', name: 'Apple Pay', enabled: paymentGateways.applePay, icon: Smartphone },
    { id: 'google_pay', name: 'Google Pay', enabled: paymentGateways.googlePay, icon: Smartphone },
    { id: 'cash', name: 'Cash on Counter', enabled: paymentGateways.cashOnDelivery, icon: Banknote },
  ].filter(g => g.enabled);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: customerName.trim() || 'Guest Patron',
        orderType,
        tableNumber: orderType === 'dine_in' ? (tableNumber || 'Bar Counter') : undefined,
        items: [...cart],
        subtotal: cartSubtotal,
        tax: cartTax,
        tip: tipAmount,
        total: finalPayableTotal,
        paymentStatus: 'paid',
        paymentMethod,
        overallStatus: 'received',
      });

      clearCart();
      setIsSubmitting(false);
      setIsCartOpen(false);
      setRecentConfirmedOrder(order);
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-[#0a0604]/90 backdrop-blur-2xl border-l border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col text-[#faede1] transition-all duration-300 ease-out animate-in slide-in-from-right relative"
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(213,154,99,0.05),transparent_70%)] pointer-events-none" />
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#22140c] flex items-center justify-center border border-[#d59a63]/30 shadow-md">
                <ShoppingBag className="w-4 h-4 text-[#d59a63]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white tracking-wide">
                  Your Order Bag
                </h3>
                <span className="text-[11px] text-[#baa293] block">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} · {brandingProfile.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-[#baa293] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Sleek 1-Line Item Cart List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 scrollbar-none">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-inner">
                  <Coffee className="w-8 h-8 text-[#8e7667]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-semibold text-[#faede1]">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-[#baa293] max-w-xs font-light">
                    Select an espresso classic, chilled draft, or oven-warm bakery sweet to begin.
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="group p-2.5 sm:p-3 rounded-2xl bg-black/50 border border-white/5 hover:border-white/15 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2.5"
                >
                  {/* Left: Thumbnail & Title in 1 line */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover bg-black/50 shrink-0 border border-white/10 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-serif font-bold text-xs sm:text-sm text-white truncate">
                          {item.name}
                        </span>
                        {item.customization.size && (
                          <span className="text-[10px] text-[#d59a63] font-mono shrink-0">
                            ({item.customization.size.includes('Large') ? '16oz' : '12oz'})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#baa293] font-mono block truncate">
                        {item.station === 'barista' ? 'Barista' : 'Bakery'} · {brandingProfile.currency}{item.price.toFixed(2)} ea
                      </span>
                    </div>
                  </div>

                  {/* Center: Compact Quantity Stepper */}
                  <div className="flex items-center border border-white/10 rounded-xl bg-black/60 overflow-hidden shrink-0 shadow-sm">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="px-2 py-1 text-xs text-[#baa293] hover:text-white hover:bg-white/10 transition-colors font-bold"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-mono text-xs font-semibold text-[#faede1]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      className="px-2 py-1 text-xs text-[#baa293] hover:text-white hover:bg-white/10 transition-colors font-bold"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Right: Total Price & Quick Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#faede1] min-w-[50px] text-right">
                      {brandingProfile.currency}{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1 rounded-lg text-[#6e584a] hover:text-rose-400 transition-colors"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. Sticky Bottom Checkout & Order Configuration */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-black/70 backdrop-blur-md border-t border-white/10 space-y-3.5 shadow-[0_-15px_30px_rgba(0,0,0,0.8)]">
              
              {/* Order Type Selector */}
              <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                {[
                  { id: 'dine_in', label: 'For Here' },
                  { id: 'takeaway', label: 'To-Go' },
                  { id: 'mobile_pickup', label: 'Pickup' },
                ].map((ot) => (
                  <button
                    key={ot.id}
                    onClick={() => setOrderType(ot.id as OrderType)}
                    className={`py-1.5 text-center rounded-lg text-xs font-medium transition-all ${
                      orderType === ot.id
                        ? 'bg-[#2b170e] text-[#d59a63] font-semibold border border-[#d59a63]/40 shadow-sm'
                        : 'text-[#baa293] hover:text-white'
                    }`}
                  >
                    {ot.label}
                  </button>
                ))}
              </div>

              {/* Table / Name Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Patron Name (Optional)"
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#faede1] placeholder-[#7d6758] focus:outline-none focus:border-[#d59a63]"
                />
                {orderType === 'dine_in' ? (
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table # (e.g. Table 4)"
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#faede1] placeholder-[#7d6758] focus:outline-none focus:border-[#d59a63]"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-black/30 border border-white/5 rounded-xl text-[11px] text-[#baa293]">
                    Packaged in craft bag
                  </div>
                )}
              </div>

              {/* Tip Selection */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#baa293]">
                  <span>Barista &amp; Bakery Staff Tip</span>
                  {selectedTip > 0 && (
                    <span className="font-mono text-[#d59a63]">
                      +{brandingProfile.currency}{tipAmount.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 0.15, 0.18, 0.20].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTip(t)}
                      className={`py-1 rounded-lg text-[11px] font-mono transition-all border ${
                        selectedTip === t
                          ? 'bg-[#2b170e] border-[#d59a63] text-white font-bold'
                          : 'bg-black/40 border-white/5 text-[#baa293] hover:border-white/20'
                      }`}
                    >
                      {t === 0 ? 'None' : `${Math.round(t * 100)}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Gateway Selector */}
              {availableGateways.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] text-[#baa293] block">
                    Payment Gateway Selection
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableGateways.map((gw) => {
                      const Icon = gw.icon;
                      const isSelected = paymentMethod === (gw.id as any);
                      return (
                        <button
                          key={gw.id}
                          onClick={() => setPaymentMethod(gw.id as any)}
                          className={`p-2 rounded-xl text-left border text-[11px] flex items-center gap-1.5 transition-all truncate ${
                            isSelected
                              ? 'bg-[#2b170e] border-[#d59a63] text-white font-semibold shadow-sm'
                              : 'bg-black/40 border-white/5 text-[#baa293] hover:border-white/20'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                          <span className="truncate">{gw.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1 pt-1 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-[#baa293]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
                    {brandingProfile.currency}{cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#baa293]">
                  <span>Sales Tax ({((brandingProfile.taxRate || 0.0825) * 100).toFixed(2)}%)</span>
                  <span className="font-mono text-white">
                    {brandingProfile.currency}{cartTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white pt-1">
                  <span>Payable Total</span>
                  <span className="font-mono text-[#d59a63] text-base">
                    {brandingProfile.currency}{finalPayableTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Final Order CTA */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-between disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? 'Routing to Kitchen Bar...' : 'Confirm & Send to Kitchen'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm">
                    {brandingProfile.currency}{finalPayableTotal.toFixed(2)}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
