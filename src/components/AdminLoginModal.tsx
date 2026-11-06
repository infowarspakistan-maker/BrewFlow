import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, ArrowRight, UtensilsCrossed, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    loginAdmin, 
    playChime,
    setActiveView
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pin);
    if (success) {
      setError(false);
      setPin('');
      setActiveView('operations_hub');
    } else {
      setError(true);
      playChime('click');
    }
  };

  const handleQuickDemo = (tab?: string) => {
    loginAdmin('1234');
    setError(false);
    setPin('');
    setActiveView('operations_hub');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#160d09]/95 border border-[#3b2316] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faede1] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Warm ambient radial backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d49a5b]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => {
            setIsAdminLoginModalOpen(false);
            setError(false);
            setPin('');
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#c9a78e] hover:text-[#fff] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#d49a5b] to-[#8c5027] text-[#160d09] shadow-lg mb-1">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#faede1]">
            Staff &amp; Admin Sign In
          </h3>
          <p className="text-xs text-[#a88f7e] max-w-xs mx-auto">
            Authorized access to POS Cashier, Barista KDS, Bakery KDS, Expeditor &amp; Analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#d4ba9f]">
              Staff PIN or Master Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e7667]" />
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN (e.g. 1234)"
                autoFocus
                className={`w-full bg-black/60 border ${
                  error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#3b2316] focus:border-[#d49a5b]'
                } rounded-xl pl-10 pr-4 py-3 text-sm text-[#faede1] placeholder-[#665042] focus:outline-none transition-colors tracking-widest`}
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 font-medium">
                Invalid PIN. Use default staff PIN: <span className="font-mono font-bold">1234</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c98a4c] to-[#9c5e2d] hover:from-[#d99757] hover:to-[#ad6832] text-[#120b08] font-semibold text-xs tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Sign In to Kitchen Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="mt-6 pt-5 border-t border-[#2e1b12] space-y-2.5">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e7667] block text-center">
            One-Click Demo Staff Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('expeditor')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-[#d6b79f] text-center font-medium transition-colors"
            >
              Expeditor KDS
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('barista')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-[#d6b79f] text-center font-medium transition-colors"
            >
              Barista Bar
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('pos')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-[#d6b79f] text-center font-medium transition-colors"
            >
              POS Cashier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
