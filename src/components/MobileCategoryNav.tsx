import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileCategoryNav: React.FC = () => {
  const { playChime } = useApp();

  const categories = [
    {
      id: 'hero-section',
      name: 'Deals',
      image: '/assets/aistudio/Artisan_Caf__Latte_shown_in_740f85f0_f1983c98.jpg',
    },
    {
      id: 'espresso-section',
      name: 'Espresso',
      image: '/assets/aistudio/Double_Origin_Espresso_Served_51490978_bd3b110a.jpg',
    },
    {
      id: 'chilled-section',
      name: 'Chilled',
      image: '/assets/aistudio/Signature_iced_coffee_in_cups_ae7bb218_5ffddb3e.jpg',
    },
    {
      id: 'bakery-section',
      name: 'Bakery',
      image: '/assets/aistudio/Chocolate_croissant_on_slate_plate_7219759e_d9ddf906.jpg',
    },
  ];

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playChime('click');
    }
  };

  return (
    <div className="w-full py-3 px-4 md:hidden bg-black/40 backdrop-blur-md border-b border-white/10 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between gap-4 min-w-max mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToAnchor(cat.id)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-[#d59a63] to-[#8e5a2b] shadow-[0_0_15px_rgba(213,154,99,0.3)] group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-serif text-xs text-[#faede1] font-medium tracking-wide">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
