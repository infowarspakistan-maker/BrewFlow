import React, { useEffect } from 'react';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ToastNotification } from '../context/AppContext';

export const QuickOrderToastItem: React.FC<{ toast: ToastNotification }> = ({ toast }) => {
  const { removeToast, setIsCartOpen, brandingProfile } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4500); // 4.5 seconds auto dismiss
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div 
      className="p-3 sm:p-4 rounded-2xl bg-[#170e09]/95 backdrop-blur-md border border-[#d59a63]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3 text-white max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300 transform-gpu relative overflow-hidden group"
    >
      {/* Progress timer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d59a63]/20">
        <div className="h-full bg-gradient-to-r from-[#d59a63] to-[#e4ad6f] animate-toast-progress" />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
          <img 
            src={toast.image} 
            alt={toast.title} 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow">
            ✓
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-[#d59a63] font-mono font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Added To Order Bag</span>
          </div>

          <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate leading-snug">
            {toast.quantity}x {toast.title}
          </h4>

          <span className="font-mono text-xs font-bold text-[#e4ad6f] block">
            {brandingProfile.currency}{toast.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            setIsCartOpen(true);
            removeToast(toast.id);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold text-[11px] transition-all shadow-md active:scale-95 flex items-center gap-1"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Bag</span>
        </button>

        <button
          onClick={() => removeToast(toast.id)}
          className="p-1 rounded-lg text-[#baa293] hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const QuickOrderToastStack: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto">
      {toasts.map(toast => (
        <QuickOrderToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
