import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Menu as MenuIcon, 
  Bell, 
  Plus, 
  Sparkles,
  User,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressiveImage } from './ProgressiveImage';
import { FeaturedDeals } from './FeaturedDeals';
import { MobileStickyFooter } from './MobileStickyFooter';
import { MenuItem } from '../types';

export const MobileAppView: React.FC = () => {
  const { 
    menuItems, 
    addToCart, 
    setSelectedProductForDetail, 
    playChime,
    brandingProfile 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const hotScrollRef = useRef<HTMLDivElement | null>(null);
  const chilledScrollRef = useRef<HTMLDivElement | null>(null);
  const bakeryScrollRef = useRef<HTMLDivElement | null>(null);

  // Hero auto-slider
  const heroItems = menuItems.slice(0, 3);
  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  // All categories auto-slide loop every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Hot Classics reel auto-slide
      if (hotScrollRef.current) {
        const el = hotScrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 145, behavior: 'smooth' });
        }
      }

      // Chilled reel auto-slide
      if (chilledScrollRef.current) {
        const el = chilledScrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 145, behavior: 'smooth' });
        }
      }

      // Bakery reel auto-slide
      if (bakeryScrollRef.current) {
        const el = bakeryScrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 145, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAdd = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(item, undefined, 1, true);
    setJustAddedId(item.id);
    playChime('click');
    setTimeout(() => setJustAddedId(null), 1400);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playChime('click');
    }
  };

  // Categories filtered
  const hotItems = menuItems.filter(i => i.category === 'hot_classics');
  const chilledItems = menuItems.filter(i => i.category === 'chilled');
  const bakeryItems = menuItems.filter(i => i.category === 'bakery');

  const currentHero = heroItems[heroIndex] || menuItems[0];

  return (
    <div className="block md:hidden min-h-screen bg-[#120b08]/75 backdrop-blur-[2px] text-[#faede1] pb-32 pt-2 px-3 select-none font-sans relative overflow-x-hidden">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#120b08]/90 backdrop-blur-md pt-2 pb-3 mb-3 border-b border-white/10 flex items-center justify-between gap-2.5">
        <button 
          onClick={() => playChime('click')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#faede1] active:scale-95 shrink-0"
          aria-label="Menu"
        >
          <MenuIcon className="w-4 h-4" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 shadow-inner">
          <Search className="w-3.5 h-3.5 text-[#d59a63]" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coffee, pastries..."
            className="w-full bg-transparent text-xs text-white placeholder-[#a88f7e] focus:outline-none"
          />
        </div>

        <button 
          onClick={() => playChime('click')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#faede1] active:scale-95 relative shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d59a63]" />
        </button>

        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#d59a63]/40 bg-gradient-to-br from-[#d59a63] to-[#8e5a2b] shrink-0 flex items-center justify-center">
          <User className="w-4 h-4 text-[#120b08]" />
        </div>
      </header>

      {/* Hero Section: Full screen auto slider */}
      <section id="hero-section" className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#26150b] via-[#3a2012] to-[#1a0e08] p-4 mb-5 border border-white/15 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex-1 space-y-2 text-left">
            <h2 className="font-serif text-base font-bold text-white leading-tight line-clamp-1">
              {currentHero?.name || 'Artisan Cascara Cold Coffee'}
            </h2>
            <p className="text-[11px] text-[#baa293] font-light line-clamp-2">
              {currentHero?.description || 'Single-estate roasts pulled to golden tiger crema perfection.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-mono text-xs font-bold text-amber-300">
                {brandingProfile.currency}{currentHero?.price ? currentHero.price.toFixed(2) : '5.60'}
              </span>
              <button
                onClick={() => currentHero && handleQuickAdd(currentHero)}
                className="px-3.5 py-1.5 rounded-full bg-[#faede1] text-[#120b08] font-bold text-[10px] tracking-wide uppercase shadow-md active:scale-95 flex items-center gap-1"
              >
                <span>Add to Bag</span>
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div 
            onClick={() => currentHero && setSelectedProductForDetail(currentHero)}
            className="w-28 h-28 rounded-xl overflow-hidden shadow-xl shrink-0 cursor-pointer relative group"
          >
            <ProgressiveImage
              src={currentHero?.image || ''}
              alt={currentHero?.name || 'Coffee'}
              containerClassName="absolute inset-0 w-full h-full"
              imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Hero Slider Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative z-10">
          {heroItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-1 rounded-full transition-all ${
                heroIndex === idx ? 'w-5 bg-[#d59a63]' : 'w-1.5 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <div className="mb-5">
        <h3 className="font-serif font-bold text-sm text-white mb-2.5">Featured Deals</h3>
        <FeaturedDeals />
      </div>

      {/* Categories: Small circular images, 1 line */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-serif font-bold text-sm text-white">Categories</h3>
          <span className="text-[11px] text-[#d59a63] font-medium">1-line reel</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#d59a63] to-[#8e5a2b] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#180e0a] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#d59a63]" />
              </div>
            </div>
            <span className="font-serif text-[11px] text-[#faede1] tracking-tight whitespace-nowrap">Deals</span>
          </button>

          <button
            onClick={() => scrollToSection('espresso-section')}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#d59a63] to-[#8e5a2b] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src={menuItems[1]?.image || ''} 
                alt="Espresso" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-serif text-[11px] text-[#faede1] tracking-tight whitespace-nowrap">Espresso</span>
          </button>

          <button
            onClick={() => scrollToSection('chilled-section')}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#7ec2ed] to-[#3b82f6] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src={menuItems[4]?.image || ''} 
                alt="Chilled" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-serif text-[11px] text-[#faede1] tracking-tight whitespace-nowrap">Chilled</span>
          </button>

          <button
            onClick={() => scrollToSection('bakery-section')}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#e5b686] to-[#b45309] shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src={menuItems[8]?.image || ''} 
                alt="Bakery" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-serif text-[11px] text-[#faede1] tracking-tight whitespace-nowrap">Bakery</span>
          </button>
        </div>
      </div>

      {/* Category 1: Espresso & Hot Classics */}
      <section id="espresso-section" className="mb-6 scroll-mt-20">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-serif font-bold text-sm text-white">Espresso & Hot Classics</h3>
        </div>

        <div ref={hotScrollRef} className="flex items-center gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
          {hotItems.map((item) => {
            const isAdded = justAddedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProductForDetail(item);
                  playChime('click');
                }}
                className="w-[125px] sm:w-[140px] rounded-2xl bg-[#180e0a]/85 backdrop-blur-md border border-white/10 overflow-hidden shrink-0 snap-start shadow-lg cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative w-full h-28">
                  <ProgressiveImage
                    src={item.image}
                    alt={item.name}
                    containerClassName="absolute inset-0 w-full h-full"
                    imageClassName="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-[#d59a63]">
                    {brandingProfile.currency}{item.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 space-y-1.5 bg-[#180e0a]">
                  <h4 className="font-serif font-bold text-[11px] text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-[#baa293] font-light line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-mono font-bold text-amber-300">
                      {brandingProfile.currency}{item.price.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08]'
                      }`}
                      aria-label="Add item"
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category 2: Chilled & Blended */}
      <section id="chilled-section" className="mb-6 scroll-mt-20">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-serif font-bold text-sm text-white">Chilled & Blended</h3>
        </div>

        <div ref={chilledScrollRef} className="flex items-center gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
          {chilledItems.map((item) => {
            const isAdded = justAddedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProductForDetail(item);
                  playChime('click');
                }}
                className="w-[125px] sm:w-[140px] rounded-2xl bg-[#180e0a]/85 backdrop-blur-md border border-white/10 overflow-hidden shrink-0 snap-start shadow-lg cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative w-full h-28">
                  <ProgressiveImage
                    src={item.image}
                    alt={item.name}
                    containerClassName="absolute inset-0 w-full h-full"
                    imageClassName="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-[#7ec2ed]">
                    {brandingProfile.currency}{item.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 space-y-1.5 bg-[#180e0a]">
                  <h4 className="font-serif font-bold text-[11px] text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-[#baa293] font-light line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-mono font-bold text-[#7ec2ed]">
                      {brandingProfile.currency}{item.price.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#7ec2ed] hover:bg-[#93c5fd] text-[#120b08]'
                      }`}
                      aria-label="Add item"
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category 3: Bakery & Sweets */}
      <section id="bakery-section" className="mb-6 scroll-mt-20">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-serif font-bold text-sm text-white">The Bakery & Sweets</h3>
        </div>

        <div ref={bakeryScrollRef} className="flex items-center gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
          {bakeryItems.map((item) => {
            const isAdded = justAddedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProductForDetail(item);
                  playChime('click');
                }}
                className="w-[125px] sm:w-[140px] rounded-2xl bg-[#180e0a]/85 backdrop-blur-md border border-white/10 overflow-hidden shrink-0 snap-start shadow-lg cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative w-full h-28">
                  <ProgressiveImage
                    src={item.image}
                    alt={item.name}
                    containerClassName="absolute inset-0 w-full h-full"
                    imageClassName="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-[#e5b686]">
                    {brandingProfile.currency}{item.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 space-y-1.5 bg-[#180e0a]">
                  <h4 className="font-serif font-bold text-[11px] text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-[#baa293] font-light line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-mono font-bold text-[#e5b686]">
                      {brandingProfile.currency}{item.price.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#e5b686] hover:bg-[#fde68a] text-[#120b08]'
                      }`}
                      aria-label="Add item"
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky Bottom Footer Menu (Permanently sticky, no auto-hide, 50% transparent dark glass, filled icons) */}
      <MobileStickyFooter />

    </div>
  );
};
