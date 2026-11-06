import React from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';

export const PerfectMatchModal: React.FC = () => {
  const { 
    perfectMatchModal, 
    setPerfectMatchModal, 
    addToCart, 
    playChime,
    recordCrossSellEvent,
    setIsCartOpen 
  } = useApp();

  if (!perfectMatchModal) return null;

  const { sourceItem, suggestions } = perfectMatchModal;

  const handleAddPairing = (pairingItem: MenuItem) => {
    // Add pairing without triggering nested cross-sell prompt
    addToCart(pairingItem, undefined, 1, false);
    recordCrossSellEvent(true, pairingItem.price);
    playChime('order');
    setPerfectMatchModal(null);
  };

  const handleDismiss = () => {
    recordCrossSellEvent(false, 0);
    setPerfectMatchModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#1a100b] border border-[#3d2417] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#f4ece4]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Subtle decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-[#8c5027] via-[#d49a5b] to-[#8c5027]" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#d49a5b] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-wider">The Perfect Match</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#faede1]">
              Elevate Your Extraction
            </h3>
            <p className="text-xs text-[#a98f7e] max-w-sm">
              {sourceItem.pairingPitch || `Hand-selected artisanal pairings crafted to complement your ${sourceItem.name}.`}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-[#886e5f] hover:text-[#faede1] hover:bg-[#251710] transition-colors"
            aria-label="Close pairings dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Cards Container */}
        <div className="p-5 pt-2 space-y-3 overflow-y-auto max-h-[60vh]">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#22150e] border border-[#341e12] hover:border-[#4d2c1b] transition-all flex items-center gap-3.5 group"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#120b08] shrink-0 border border-[#2b170e]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] text-[#cba075] uppercase tracking-wider block font-medium truncate">
                  {item.subtitle}
                </span>
                <h4 className="font-serif text-sm font-bold text-[#faede1] truncate">
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#9a8475] line-clamp-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-xs font-bold text-[#faede1]">
                    +${item.price.toFixed(2)}
                  </span>
                  {item.isFood && (
                    <span className="text-[10px] text-[#e2843d] flex items-center gap-0.5 font-medium">
                      🔥 Served Warm
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Add Pairing Button */}
              <button
                onClick={() => handleAddPairing(item)}
                className="px-3 py-2 rounded-lg bg-[#d49a5b] hover:bg-[#e4ad6f] text-[#120b08] font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pair It</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer Dismiss / Continue Action */}
        <div className="p-4 bg-[#140c08] border-t border-[#2a180e] flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleDismiss}
            className="text-[#8e7667] hover:text-[#faede1] transition-colors py-1 px-2"
          >
            No thanks, keep it simple
          </button>
          
          <button
            onClick={() => {
              handleDismiss();
              setIsCartOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-[#251710] hover:bg-[#342016] text-[#faede1] border border-[#3b2317] font-medium transition-colors"
          >
            Review Bag
          </button>
        </div>

      </div>
    </div>
  );
};
