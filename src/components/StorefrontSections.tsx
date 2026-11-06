import React, { useState, useRef, useCallback } from 'react';
import { 
  Plus, 
  SlidersHorizontal, 
  Flame, 
  Snowflake, 
  Check, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, ProductCategory } from '../types';

interface SectionProps {
  id: string;
  category: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  stationName: string;
  checklist: string[];
}

export const CurvedProductScrollerSection: React.FC<SectionProps> = ({
  id,
  category,
  title,
  subtitle,
  description,
  stationName,
  checklist,
}) => {
  const { 
    menuItems, 
    addToCart, 
    setSelectedProductForDetail, 
    setIsCartOpen, 
    playChime,
    brandingProfile 
  } = useApp();
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(4); // Center item among 9 products (index 4)
  const [cardTilt, setCardTilt] = useState<{ id: string; rx: number; ry: number } | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const items = menuItems.filter(item => item.category === category);

  const handleQuickAdd = useCallback((item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(item, undefined, 1, true);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1400);
  }, [addToCart]);

  const handleOpenDetailModal = useCallback((item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProductForDetail(item);
    playChime('click');
  }, [setSelectedProductForDetail, playChime]);

  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % items.length);
    playChime('click');
  };

  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + items.length) % items.length);
    playChime('click');
  };

  // Touch and mouse drag handlers for seamless horizontal scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diff = e.changedTouches[0].clientX - startXRef.current;
    if (diff > 20) prevSlide(); // More sensitive
    else if (diff < -20) nextSlide(); // More sensitive
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diff = e.clientX - startXRef.current;
    if (diff > 45) prevSlide();
    else if (diff < -45) nextSlide();
  };

  const activeItem = items[activeIndex] || items[0];

  return (
    <section 
      id={id} 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 flex flex-col justify-between select-none scroll-mt-20 overflow-hidden bg-transparent border-0"
    >
      {/* Single Unified Section Header Card with 10% Background Opacity */}
      <div className="w-full bg-black/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] mb-4 sm:mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 items-stretch">
          
          {/* Left Column (40% width): Section Title, Selected Product Brief Details, Description & Checklist */}
          <div className="lg:col-span-4 p-5 sm:p-7 lg:p-8 space-y-4 text-left flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="space-y-1">
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#d59a63] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d59a63]" />
                  <span>{subtitle} · 9 Curated Selections</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#faede1] tracking-tight drop-shadow-md">
                  {title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(true);
                  playChime('click');
                }}
                title="Open Order Bag"
                className="w-9 h-9 rounded-full bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] flex items-center justify-center shadow-[0_10px_25px_rgba(213,154,99,0.4)] transition-transform hover:scale-105 active:scale-95 shrink-0"
              >
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>
            </div>

            {/* Selected Product Brief Details Box (Directly Under Section Title) */}
            {activeItem && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#d59a63] font-bold uppercase tracking-wider">
                    // Spotlight #{String(activeIndex + 1).padStart(2, '0')} · {activeItem.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {brandingProfile.currency}{activeItem.price.toFixed(2)}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                  {activeItem.name}
                </h4>

                <p className="text-xs text-[#baa293] font-light line-clamp-2">
                  {activeItem.description}
                </p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#baa293] tracking-wide font-light leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#cfb7a5]">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (60% width): Full Height Product Photo (No top, bottom, or left padding) */}
          {activeItem && (
            <div className="lg:col-span-6 relative w-full min-h-[300px] sm:min-h-[360px] lg:h-full p-0 overflow-hidden bg-black/40 group">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-[#d59a63] shadow-md">
                  {activeItem.station === 'barista' ? 'Barista Station' : 'Bakery Oven'}
                </span>

                {activeItem.tag && (
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#faede1]">
                    {activeItem.tag}
                  </span>
                )}
              </div>

              {/* Bottom Overlay Action Bar with Glowing Shadow Add to Cart Button */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <button
                  onClick={(e) => handleOpenDetailModal(activeItem, e)}
                  className="px-3.5 py-2 rounded-full bg-black/80 hover:bg-black backdrop-blur-md text-[#faede1] text-xs font-medium border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                  title="Customize recipe"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#d59a63]" />
                  <span>Customize</span>
                </button>

                <button
                  onClick={(e) => handleQuickAdd(activeItem, e)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                    justAddedId === activeItem.id
                      ? 'bg-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)]'
                      : 'bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] shadow-[0_0_25px_rgba(213,154,99,0.65)] hover:shadow-[0_0_35px_rgba(213,154,99,0.85)]'
                  }`}
                >
                  {justAddedId === activeItem.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3D Cylindrical Curved Perspective Scroller (9 Products) matching reference image */}
      <div 
        className="relative w-full py-4 perspective-[1600px] overflow-visible cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Lifted Navigation Arrow Controls */}
        <div className="absolute top-1/2 left-0 sm:left-2 -translate-y-1/2 z-40 pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[#faede1] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all hover:scale-110 active:scale-95"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 right-0 sm:right-2 -translate-y-1/2 z-40 pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[#faede1] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all hover:scale-110 active:scale-95"
            aria-label="Next product"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 3D Cylindrical Panoramic Arc Track (Scaled 25% for sleeker presence) */}
        <div className="relative w-full h-[285px] sm:h-[315px] flex items-center justify-center transform-style-preserve-3d">
          {items.map((item, index) => {
            const isJustAdded = justAddedId === item.id;
            const diff = index - activeIndex;
            
            // Only render cards within a visible 3D horizon (up to 3 positions away on each side)
            const isVisible = Math.abs(diff) <= 3;
            if (!isVisible) return null;

            // Mathematical cylindrical curve mapping with interactive mouse tilt (scaled 25%):
            const isTilted = cardTilt?.id === item.id;
            const tiltRx = isTilted ? cardTilt.rx : 0;
            const tiltRy = isTilted ? cardTilt.ry : 0;

            const rotateY = diff * 13 + tiltRy;
            const rotateX = tiltRx;
            const translateX = diff * 160; // Horizontal offset in px (reduced 25% from 210)
            const translateZ = -Math.abs(diff) * 35 + (isTilted ? 18 : 0); // Curved depth recession + lift on hover
            const scale = Math.max(0.78, 1 - Math.abs(diff) * 0.08) * (isTilted ? 1.04 : 1);
            const zIndex = 30 - Math.abs(diff) * 5 + (isTilted ? 10 : 0);
            const opacity = Math.max(0.4, 1 - Math.abs(diff) * 0.2);

            const isCurrentActive = diff === 0;

            return (
              <div
                key={item.id}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  const rx = -(y / (rect.height / 2)) * 12; // 12 deg tilt
                  const ry = (x / (rect.width / 2)) * 12;
                  setCardTilt({ id: item.id, rx, ry });
                }}
                onMouseLeave={() => setCardTilt(null)}
                onClick={() => {
                  if (isCurrentActive) {
                    handleOpenDetailModal(item);
                  } else {
                    setActiveIndex(index);
                    playChime('click');
                  }
                }}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: isTilted 
                    ? 'transform 0.08s ease-out, opacity 0.3s ease, box-shadow 0.3s ease' 
                    : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease, box-shadow 0.4s ease',
                }}
                className={`absolute w-48 sm:w-56 aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.9)] border ${
                  isCurrentActive 
                    ? 'border-[#d59a63] ring-2 ring-[#d59a63]/50 shadow-[0_25px_60px_rgba(213,154,99,0.35)]' 
                    : 'border-white/10 hover:border-white/30'
                } bg-[#140c08]/90 backdrop-blur-md flex flex-col justify-between transform-gpu will-change-transform`}
              >
                {/* Full-bleed Product Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 transform-gpu"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />
                </div>

                {/* Top Pill Tags & Station Badges */}
                <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between pointer-events-none">
                  {item.tag ? (
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#e5b686] shadow-md">
                      {item.tag}
                    </span>
                  ) : <span />}

                  {item.isFood ? (
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[#f49b42] text-[10px] font-medium flex items-center gap-1 shadow-md">
                      <Flame className="w-2.5 h-2.5" />
                      <span>Warm</span>
                    </span>
                  ) : item.isColdDrink ? (
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[#7ec2ed] text-[10px] font-medium flex items-center gap-1 shadow-md">
                      <Snowflake className="w-2.5 h-2.5" />
                      <span>Chilled</span>
                    </span>
                  ) : null}
                </div>

                {/* Bottom Product Details & Interactive Actions on Card */}
                <div className="relative z-10 p-4 sm:p-5 space-y-2 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d59a63] font-medium block">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#ffffff] leading-tight group-hover:text-[#e4ad6f] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#baa293] block">
                        Price
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#faede1]">
                        {brandingProfile.currency}{item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <button
                        onClick={(e) => handleOpenDetailModal(item, e)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-[#d4ba9f] hover:text-[#fff] transition-colors shadow-md"
                        title="View details & recipe options"
                        aria-label={`View details for ${item.name}`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleQuickAdd(item, e)}
                        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all shadow-md active:scale-90 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08]'
                        }`}
                        title="Quick add to bag"
                        aria-label={`Add ${item.name} to order`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Lifted Value Checklist & Quick Order Now Banner */}
      <div className="pt-6 max-w-5xl mx-auto w-full">
        <div className="bg-black/50 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-5 text-[#cfb7a5]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-xs font-light">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setIsCartOpen(true);
              playChime('click');
            }}
            className="px-7 py-3 rounded-full bg-[#d59a63]/90 hover:bg-[#e4ad6f] text-[#120b08] font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_10px_25px_rgba(213,154,99,0.3)] active:scale-95 flex items-center gap-2 shrink-0"
          >
            <span>Order From {title.split(' ')[0]}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </section>
  );
};

export const StorefrontSections: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-10 py-2">
      
      {/* 1. ESPRESSO & HOT CLASSICS SECTION (9-Product 3D Cylindrical Scroller) */}
      <CurvedProductScrollerSection
        id="espresso-section"
        category="hot_classics"
        title="Espresso & Hot Classics"
        subtitle="Single-Origin 9-Bar Extractions"
        description="Single-estate Brazilian Bourbon and washed Yirgacheffe roasts, pulled to golden tiger crema perfection with velvety steamed microfoam."
        stationName="Main Barista Station"
        checklist={[
          'Highest quality beans',
          'Personalized milk options',
          'Atmosphere created for coffee',
          'Professional barista craft'
        ]}
      />

      {/* 2. CHILLED & BLENDED SECTION (9-Product 3D Cylindrical Scroller) */}
      <CurvedProductScrollerSection
        id="chilled-section"
        category="chilled"
        title="Chilled & Blended Drinks"
        subtitle="Slow-Steeped Cold Brews & Gelato Shakes"
        description="Slow cold-extracted Ethiopian roasts poured over crystalline ice cubes, cascading nitro cascara body, and decadent cream gelato cookie shakes."
        stationName="Chilled Barista Station"
        checklist={[
          'Nitro cascading crema',
          'Speculoos & Oreo swirls',
          'Custom ice & sweetness',
          'Double espresso booster'
        ]}
      />

      {/* 3. THE BAKERY / SWEETS SECTION (9-Product 3D Cylindrical Scroller) */}
      <CurvedProductScrollerSection
        id="bakery-section"
        category="bakery"
        title="The Bakery & Sweets"
        subtitle="Laminated French Pastries & Molten Cocoa"
        description="Handcrafted daily with 100% French butter, rich Belgian dark chocolate filling, toasted Piedmont hazelnuts, and warm deck-oven service."
        stationName="Artisan Bakery Station"
        checklist={[
          '100% French butter',
          '45s oven deck toast',
          'Belgian dark cocoa ganache',
          'Dark slate presentation'
        ]}
      />

    </div>
  );
};
