import React from 'react';
import { 
  Coffee, 
  Snowflake, 
  Croissant, 
  Sparkles, 
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileStickyFooter: React.FC = () => {
  const { 
    cartItemCount, 
    setIsCartOpen, 
    playChime
  } = useApp();

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playChime('click');
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <nav 
        aria-label="Mobile Navigation Footer"
        className="bg-black/50 backdrop-blur-md border border-white/25 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.85)] px-3 py-2.5 flex items-center justify-around gap-2 select-none"
      >
        {/* Deals */}
        <button
          onClick={() => scrollToAnchor('hero-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#faede1] active:scale-95 transition-transform"
          aria-label="Deals"
        >
          <Sparkles className="w-4 h-4 text-[#d59a63] fill-[#d59a63]/30 stroke-[2]" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Deals</span>
        </button>

        {/* Espresso */}
        <button
          onClick={() => scrollToAnchor('espresso-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#faede1] active:scale-95 transition-transform"
          aria-label="Espresso"
        >
          <Coffee className="w-4 h-4 text-[#d59a63] fill-[#d59a63]/30 stroke-[2]" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Espresso</span>
        </button>

        {/* Chilled */}
        <button
          onClick={() => scrollToAnchor('chilled-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#faede1] active:scale-95 transition-transform"
          aria-label="Chilled"
        >
          <Snowflake className="w-4 h-4 text-[#7ec2ed] fill-[#7ec2ed]/30 stroke-[2]" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Chilled</span>
        </button>

        {/* Bakery */}
        <button
          onClick={() => scrollToAnchor('bakery-section')}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-[#faede1] active:scale-95 transition-transform"
          aria-label="Bakery"
        >
          <Croissant className="w-4 h-4 text-[#e5b686] fill-[#e5b686]/30 stroke-[2]" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Bakery</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => {
            setIsCartOpen(true);
            playChime('click');
          }}
          className="relative px-3.5 py-1.5 rounded-xl bg-[#d59a63] text-[#120b08] font-bold shadow-[0_0_20px_rgba(213,154,99,0.7)] active:scale-95 transition-transform flex items-center gap-1.5"
          aria-label="Bag"
        >
          <ShoppingBag className="w-4 h-4 fill-[#120b08]/20 stroke-[2.2]" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Bag</span>
          {cartItemCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#120b08] text-[#ffffff] font-mono text-[9px] font-bold flex items-center justify-center ml-0.5">
              {cartItemCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};
