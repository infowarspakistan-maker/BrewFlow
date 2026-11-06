import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowRight, 
  Coffee, 
  Check, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressiveImage } from './ProgressiveImage';

export interface HeroProductSlide {
  id: string;
  number: string;
  category: 'hot_classics' | 'chilled' | 'bakery';
  name: string;
  kicker: string;
  headlineWord: string;
  price: number;
  sizeLabels: string;
  calories: string;
  tag: string;
  notes: string;
  image: string;
  sectionId: string;
}

// 7 exact products corresponding to the uploaded images
const HERO_PRODUCTS: HeroProductSlide[] = [
  {
    id: 'latte',
    number: '01',
    category: 'hot_classics',
    name: 'Artisan Café Latte',
    kicker: 'ARTISAN STEAMED MICROFOAM',
    headlineWord: 'Silky Mornings.',
    price: 5.15,
    sizeLabels: '12oz Regular $5.15 · 16oz Large $5.95',
    calories: '160 kcal',
    tag: 'Latte Art Pour',
    notes: 'Double espresso pulled over eight ounces of silky micro-textured steamed milk with delicate pour art.',
    image: '/assets/aistudio/Artisan_Caf__Latte_shown_in_740f85f0_f1983c98.jpg',
    sectionId: 'espresso-section',
  },
  {
    id: 'cappuccino',
    number: '02',
    category: 'hot_classics',
    name: 'Velvet Microfoam Cappuccino',
    kicker: 'GOLDEN CREMA & DUSTED COCOA',
    headlineWord: 'Brighter Days.',
    price: 4.85,
    sizeLabels: '12oz Regular $4.85 · 16oz Large $5.65',
    calories: '130 kcal',
    tag: 'Classic Italian',
    notes: 'One-third rich espresso, one-third steamed microfoam milk, and a dusting of fine Valrhona cocoa.',
    image: '/assets/aistudio/Velvet_Microfoam_Cappuccino_shown_in_737297a9_84b12f71.jpg',
    sectionId: 'espresso-section',
  },
  {
    id: 'mocha',
    number: '03',
    category: 'hot_classics',
    name: 'Valrhona Dark Ganache Mocha',
    kicker: '70% HOUSE-MELTED VALRHONA',
    headlineWord: 'Velvet Indulgence.',
    price: 5.65,
    sizeLabels: '12oz Regular $5.65 · 16oz Large $6.45',
    calories: '280 kcal',
    tag: 'House Specialty',
    notes: 'Double shot espresso melted into house-made 70% bittersweet dark chocolate ganache with chocolate curls.',
    image: '/assets/aistudio/Valrhona_dark_ganache_mocha_cups_298b6b9b_348eb11a.jpg',
    sectionId: 'espresso-section',
  },
  {
    id: 'iced_coffee',
    number: '04',
    category: 'chilled',
    name: 'Signature Iced Coffee',
    kicker: '18-HOUR COLD EXTRACTION',
    headlineWord: 'Smoother Sips.',
    price: 5.25,
    sizeLabels: '12oz Regular $5.25 · 16oz Large $6.05',
    calories: '110 kcal',
    tag: 'Top Chilled Seller',
    notes: 'Slow cold-extracted Ethiopian & Colombian beans poured over crystalline ice cubes with a velvety cream swirl.',
    image: '/assets/aistudio/Signature_iced_coffee_in_cups_ae7bb218_5ffddb3e.jpg',
    sectionId: 'chilled-section',
  },
  {
    id: 'cold_coffee',
    number: '05',
    category: 'chilled',
    name: 'Draft Cascara Cold Coffee',
    kicker: 'CHARGED NITRO CASCADE',
    headlineWord: 'Crisp Draft.',
    price: 5.60,
    sizeLabels: '12oz Regular $5.60 · 16oz Large $6.40',
    calories: '140 kcal',
    tag: 'Nitro Cold Brew',
    notes: 'Infused with coffee fruit cascara delivering a cascading Guinness-like crema top and velvety finish.',
    image: '/assets/aistudio/Cascara_cold_coffee_in_cups_31bfc9ba_1f7603c2.jpg',
    sectionId: 'chilled-section',
  },
  {
    id: 'brownie',
    number: '06',
    category: 'bakery',
    name: 'Triple Fudge Brownie',
    kicker: 'MOLTEN COCOA & FLEUR DE SEL',
    headlineWord: 'Fudgy Bliss.',
    price: 4.50,
    sizeLabels: 'Portion $4.50 · 410 kcal',
    calories: '410 kcal',
    tag: 'Warm Available',
    notes: 'Decadent dark chocolate brownie with glossy cracked crust, fudgy center, and Maldon sea salt.',
    image: '/assets/aistudio/Triple_Fudge_Brownie_on_plate_454bd059_21cce69b.jpg',
    sectionId: 'bakery-section',
  },
  {
    id: 'cupcake',
    number: '07',
    category: 'bakery',
    name: 'Velvet Cocoa Cupcake',
    kicker: 'WHIPPED GANACHE BUTTERCREAM',
    headlineWord: 'Sweet Craft.',
    price: 4.65,
    sizeLabels: 'Portion $4.65 · 390 kcal',
    calories: '390 kcal',
    tag: 'Artisan Crafted',
    notes: 'Dark cocoa crumb sponge topped with tall ribbons of whipped chocolate ganache buttercream and pastry box.',
    image: '/assets/aistudio/Chocolate_cupcake_on_cafe_counter_0e45eda5_f7425add.jpg',
    sectionId: 'bakery-section',
  },
];

const SLIDE_DURATION_MS = 7000; // 7000ms (7 seconds) per slide

export const StorefrontHero: React.FC = () => {
  const { 
    playChime, 
    addToCart, 
    setSelectedProductForDetail, 
    menuItems,
    brandingProfile 
  } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const activeProduct = HERO_PRODUCTS[currentIdx];
  const realMenuItem = useMemo(() => {
    return menuItems.find(m => m.id === activeProduct.id) || menuItems[0];
  }, [menuItems, activeProduct.id]);

  // High-performance 600ms slide rotation with easy-ease bounce
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setCurrentIdx(curr => (curr + 1) % HERO_PRODUCTS.length);
      setSlideKey(prev => prev + 1);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isPaused, currentIdx]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIdx(index);
    setSlideKey(prev => prev + 1);
    playChime('click');
  }, [playChime]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIdx + 1) % HERO_PRODUCTS.length);
  }, [goToSlide, currentIdx]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIdx - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length);
  }, [goToSlide, currentIdx]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playChime('click');
    }
  }, [playChime]);

  const handleQuickAdd = useCallback(() => {
    if (realMenuItem) {
      addToCart(realMenuItem, undefined, 1, true);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  }, [realMenuItem, addToCart]);

  return (
    <section 
      id="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 lg:py-16 flex flex-col justify-between h-[90vh] lg:min-h-[680px] bg-transparent border-0 select-none transform-gpu"
    >
      <style>{`
        @keyframes easyEaseBounceLeft {
          0% {
            transform: translateX(180px) scale(0.92);
            opacity: 0;
          }
          65% {
            transform: translateX(-18px) scale(1.03);
            opacity: 0.95;
          }
          85% {
            transform: translateX(6px) scale(0.99);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-easy-bounce-left {
          animation: easyEaseBounceLeft 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Main Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Typography & Dynamic Kicker */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7 z-10">
          
          {/* Dynamic Kicker matching active slide product */}
          <div className="flex items-center gap-3 text-xs tracking-widest text-[#cfb7a5] uppercase font-light">
            <span className="w-8 h-[1px] bg-[#d59a63]" />
            <span className="text-[#d59a63] font-semibold tracking-[0.2em]">
              {activeProduct.kicker}
            </span>
            <span className="hidden sm:inline text-[#8e7667]">·</span>
            <span className="hidden sm:inline text-[#baa293] font-mono text-[11px]">
              {activeProduct.tag}
            </span>
          </div>

          {/* Grand Headline with smooth transition */}
          <div className="space-y-1 transition-all duration-300">
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-[#ffffff] leading-[1.04] tracking-tight">
              Good<br />
              Coffee<br />
              <span className="text-[#d59a63] font-serif italic font-normal">
                {activeProduct.headlineWord}
              </span>
            </h1>
          </div>

          {/* Subtext description & specific notes */}
          <p className="text-sm sm:text-base text-[#baa293] max-w-md sm:max-w-lg leading-relaxed font-light">
            {activeProduct.notes} Handcrafted in our artisanal roastery and bakery with connected kitchen synchronization.
          </p>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-4 sm:gap-5">
            {/* White pill button: Shop Category */}
            <button
              onClick={() => scrollToSection(activeProduct.sectionId)}
              className="px-7 py-3.5 rounded-full bg-[#ffffff] hover:bg-[#f2e6dc] text-[#120b08] font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center gap-2.5 group"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4 text-[#120b08] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Right Column: Hero Product Visual with Easy-Ease Bounce Left Transition */}
        <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
          
          <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden">
            
            {/* Celestial warm backlight halo */}
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(213,154,99,0.25),transparent_70%)] pointer-events-none animate-pulse duration-1000" />
            
            {/* Ambient shadow base */}
            <div className="absolute bottom-6 w-3/4 h-16 bg-black/45 rounded-full blur-2xl pointer-events-none" />

            {/* Featured Product Slide Container with Easy-Ease Bounce Left Transition */}
            <div 
              key={`${activeProduct.id}-${slideKey}`}
              className="relative z-10 w-full h-full flex flex-col items-center justify-center p-3 animate-easy-bounce-left transform-gpu will-change-transform"
            >
              {/* Product preview photo with subtle rounded frame & glass shadow */}
              <div 
                onClick={() => {
                  if (realMenuItem) setSelectedProductForDetail(realMenuItem);
                  playChime('click');
                }}
                className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl group cursor-pointer border border-white/5"
              >
                <ProgressiveImage
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  containerClassName="w-full h-full"
                  imageClassName="object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 transform-gpu"
                />

                {/* Ambient dark gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Portion & Price Pill in image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#faede1] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d59a63] animate-ping" />
                    <span>{activeProduct.sizeLabels}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] text-[#baa293]">
                    {activeProduct.calories}
                  </span>
                </div>
              </div>

              {/* Title & 1-Click Order Button Bar */}
              <div className="w-full mt-3 px-1 flex items-center justify-between gap-3">
                <div className="text-left">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#faede1] leading-tight">
                    {activeProduct.name}
                  </h3>
                  <span className="text-[11px] text-[#baa293] font-light">
                    {brandingProfile.currency}{activeProduct.price.toFixed(2)} starting price
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Prev Slide button */}
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#baa293] hover:text-[#faede1] transition-colors"
                    title="Previous product"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Add to Order button */}
                  <button
                    onClick={handleQuickAdd}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Bag</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Next Slide button */}
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#baa293] hover:text-[#faede1] transition-colors"
                    title="Next product"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Horizontal Thumbnail Slider Ribbon (All 7 Products) */}
      <div className="mt-8 pt-6 border-t border-[#3b2316]/40 max-w-5xl mx-auto w-full z-10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {HERO_PRODUCTS.map((prod, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={prod.id}
                onClick={() => goToSlide(idx)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl transition-all cursor-pointer shrink-0 border ${
                  isActive 
                    ? 'bg-white/10 border-[#d59a63] shadow-lg scale-102' 
                    : 'bg-black/30 border-transparent hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-left">
                  <span className={`block font-serif text-xs leading-tight font-medium ${
                    isActive ? 'text-[#d59a63]' : 'text-[#faede1]'
                  }`}>
                    {prod.name.split(' ')[0]} {prod.name.split(' ')[1] || ''}
                  </span>
                  <span className="text-[10px] text-[#8e7667] font-mono">
                    {brandingProfile.currency}{prod.price.toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom 3-Feature Bar */}
      <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full z-10 text-[#d8c5b6]">
        
        {/* Feature 1 */}
        <div className="flex items-center gap-3.5 sm:gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
            <svg 
              className="w-4 h-4 text-[#d59a63]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-[#ffffff] block leading-snug">
              100% Arabica Beans
            </span>
            <span className="text-xs text-[#baa293] block font-light">
              Ethically sourced harvests
            </span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-3.5 sm:gap-4 text-left md:border-l md:border-[#3b2316]/40 md:pl-8">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
            <svg 
              className="w-4 h-4 text-[#d59a63]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
            >
              <ellipse cx="12" cy="12" rx="8" ry="6" transform="rotate(-30 12 12)" />
              <path d="M9 16c2-1 4-5 6-8" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-[#ffffff] block leading-snug">
              Expertly Roasted
            </span>
            <span className="text-xs text-[#baa293] block font-light">
              For bold, smooth flavour
            </span>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-3.5 sm:gap-4 text-left md:border-l md:border-[#3b2316]/40 md:pl-8">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4 text-[#d59a63]" />
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-[#ffffff] block leading-snug">
              Better Mornings
            </span>
            <span className="text-xs text-[#baa293] block font-light">
              One cup at a time
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
