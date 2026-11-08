import React from 'react';
import { Plus } from 'lucide-react';
import { ProgressiveImage } from './ProgressiveImage';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../data/menuData';

export const FeaturedDeals: React.FC = () => {
  const { brandingProfile, addToCart, playChime } = useApp();

  // Selected deals from menuData
  const deals = [
    { ...MENU_ITEMS.find(m => m.id === 'latte')!, name: 'Evening Special Deal', price: 7.99 },
    { ...MENU_ITEMS.find(m => m.id === 'cappuccino')!, name: 'Brunch Special', price: 7.99 },
    { ...MENU_ITEMS.find(m => m.id === 'iced_coffee')!, name: 'Artisan Hazelnut Flow', price: 4.25 },
    { ...MENU_ITEMS.find(m => m.id === 'brownie')!, name: 'Morning Brunch Deal', price: 7.99 },
    // $6.99 deal for relevant time
    { 
        id: 'deal-699', 
        name: 'Relevant Time Special', 
        price: 6.99, 
        image: '/assets/aistudio/Cafe_banner_advertising_brunch_s__6bc91fc2_1e67ba30.jpg',
        category: 'hot_classics',
        station: 'barista',
        description: 'A special deal for relevant time.',
        subtitle: 'Relevant Time Deal',
        tag: 'Special'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
      {deals.map(deal => (
        <div key={deal.id} className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group shadow-lg">
          <ProgressiveImage
            src={deal.image}
            alt={deal.name}
            containerClassName="w-full aspect-video"
            imageClassName="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
            <h4 className="text-white font-serif text-sm font-bold truncate">{deal.name}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-amber-300 font-mono text-xs font-bold">{brandingProfile.currency}{deal.price.toFixed(2)}</span>
              <button 
                onClick={() => {
                  playChime('click');
                  // Quick add logic
                  addToCart(deal as any, undefined, 1, false);
                }}
                className="w-7 h-7 rounded-full bg-[#d59a63] flex items-center justify-center text-[#120b08]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
