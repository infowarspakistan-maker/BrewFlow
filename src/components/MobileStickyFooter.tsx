import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Snowflake, 
  Croissant, 
  Sparkles, 
  Search, 
  ShoppingBag,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileStickyFooter: React.FC = () => {
  const { 
    cartItemCount, 
    setIsCartOpen, 
    playChime,
    setActiveView,
    isAdminLoggedIn,
    setIsAdminLoginModalOpen 
  } = useApp();

  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide when not interacted with for 5 seconds
  const resetTimer = () => {
    setIsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    // Start initial 5-second countdown
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    const events = ['scroll', 'touchstart', 'touchmove', 'touchend', 'click', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  const scrollToAnchor = (id: string) => {
    resetTimer();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playChime('click');
    }
  };

  return (
    <div 
      className={`fixed bottom-3 left-3 right-3 z-50 md:hidden transition-all duration-500 ease-out transform-gpu ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
          : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <nav 
        aria-label="Mobile Navigation"
        className="bg-[#140c08]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] px-2.5 py-2 flex items-center justify-between gap-1 select-none"
      >
        {/* Featured Deals button */}
        <button
          onClick={() => scrollToAnchor('hero-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#d8c5b6] active:scale-95 transition-transform"
          aria-label="Featured deals"
        >
          <Sparkles className="w-4 h-4 text-[#d59a63]" />
          <span className="text-[9px] font-medium tracking-tight mt-0.5">Deals</span>
        </button>

        {/* Espresso button */}
        <button
          onClick={() => scrollToAnchor('espresso-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#d8c5b6] active:scale-95 transition-transform"
          aria-label="Espresso Classics"
        >
          <Coffee className="w-4 h-4 text-[#d59a63]" />
          <span className="text-[9px] font-medium tracking-tight mt-0.5">Espresso</span>
        </button>

        {/* Chilled button */}
        <button
          onClick={() => scrollToAnchor('chilled-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#d8c5b6] active:scale-95 transition-transform"
          aria-label="Chilled drinks"
        >
          <Snowflake className="w-4 h-4 text-[#7ec2ed]" />
          <span className="text-[9px] font-medium tracking-tight mt-0.5">Chilled</span>
        </button>

        {/* Bakery button */}
        <button
          onClick={() => scrollToAnchor('bakery-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#d8c5b6] active:scale-95 transition-transform"
          aria-label="Bakery & sweets"
        >
          <Croissant className="w-4 h-4 text-[#e5b686]" />
          <span className="text-[9px] font-medium tracking-tight mt-0.5">Bakery</span>
        </button>

        {/* Cart / Order Bag button with live badge */}
        <button
          onClick={() => {
            resetTimer();
            setIsCartOpen(true);
            playChime('click');
          }}
          className="relative px-3.5 py-1.5 rounded-xl bg-[#d59a63] text-[#120b08] font-bold shadow-[0_0_15px_rgba(213,154,99,0.5)] active:scale-95 transition-transform flex items-center gap-1"
          aria-label="Open Cart Bag"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Bag</span>
          {cartItemCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#120b08] text-[#ffffff] font-mono text-[9px] font-bold flex items-center justify-center ml-0.5">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Account / Staff button */}
        <button
          onClick={() => {
            resetTimer();
            if (isAdminLoggedIn) {
              setActiveView('operations_hub');
            } else {
              setIsAdminLoginModalOpen(true);
            }
            playChime('click');
          }}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#baa293] active:scale-95 transition-transform"
          aria-label="Account profile"
        >
          <User className="w-4 h-4 text-[#baa293]" />
          <span className="text-[9px] font-medium tracking-tight mt-0.5">Account</span>
        </button>
      </nav>
    </div>
  );
};
