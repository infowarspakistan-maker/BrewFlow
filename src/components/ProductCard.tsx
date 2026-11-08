import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react';
import { MenuItem } from '../types';
import { ProgressiveImage } from './ProgressiveImage';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { brandingProfile, addToCart, playChime, setSelectedProductForDetail } = useApp();
  
  const images = product.images && product.images.length > 0 ? [product.image, ...product.images] : [product.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    playChime('click');
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    playChime('click');
  };

  return (
    <div className="w-full bg-[#1c1c1c] rounded-[32px] overflow-hidden flex flex-col shadow-xl border border-[#333]">
      {/* Image Carousel - Reduced height via aspect ratio */}
      <div className="relative aspect-[3/4] group">
        <ProgressiveImage
          src={images[currentImageIndex]}
          alt={product.name}
          containerClassName="absolute inset-0 w-full h-full"
          imageClassName="object-cover w-full h-full"
        />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
          <span className="text-sm font-semibold text-[#d59a63] bg-[#333] px-3 py-1 rounded-full">{brandingProfile.currency}{product.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-[#a88f7e] line-clamp-1">{product.description}</p>
        
        {/* Tags */}
        <div className="flex gap-2">
           <span className="text-[10px] text-[#a88f7e] bg-[#2a2a2a] px-2 py-0.5 rounded-full">Top Rated</span>
           <span className="text-[10px] text-[#a88f7e] bg-[#2a2a2a] px-2 py-0.5 rounded-full">5 Day Stay</span>
        </div>

        {/* Reserve Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProductForDetail(product);
          }}
          className="w-full bg-white text-black py-2 rounded-full font-bold hover:bg-gray-200 transition-colors text-sm"
        >
          Reserve
        </button>
      </div>
    </div>
  );
};
