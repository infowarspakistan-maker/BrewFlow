import React from 'react';
import { Plus } from 'lucide-react';
import { ProgressiveImage } from './ProgressiveImage';
import { useApp } from '../context/AppContext';

export const FeaturedDeals: React.FC = () => {
  const { brandingProfile, addToCart, playChime } = useApp();

  const deals = [
    { id: 'deal-1', name: 'Evening Special Deal', price: 7.99, image: '/assets/aistudio/Cafe_evening_special_banner_adve__5b53fbb6_52fe5d2b.jpg' },
    { id: 'deal-2', name: 'Brunch Special', price: 7.99, image: '/assets/aistudio/Cafe_banner_advertising_brunch_s__6bc91fc2_1e67ba30.jpg' },
    { id: 'deal-3', name: 'Artisan Hazelnut Flow', price: 4.25, image: '/assets/aistudio/Cafe_advertisement_banner_with_c__e6c2507a_719f7322.jpg' },
    { id: 'deal-4', name: 'Morning Brunch Deal', price: 7.99, image: '/assets/aistudio/Cafe_morning_brunch_advertisemen__a83219fd_3fb6ecc1.jpg' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {deals.map(deal => (
        <div key={deal.id} className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group shadow-lg">
          <ProgressiveImage
            src={deal.image}
            alt={deal.name}
            containerClassName="w-full aspect-video"
            imageClassName="object-contain"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
            <h4 className="text-white font-serif text-sm font-bold truncate">{deal.name}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-amber-300 font-mono text-xs font-bold">{brandingProfile.currency}{deal.price.toFixed(2)}</span>
              <button 
                onClick={() => {
                  playChime('click');
                  // Quick add logic would go here, requires passing a proper MenuItem structure
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
