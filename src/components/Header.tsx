import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu as MenuIcon, 
  X, 
  Coffee, 
  UtensilsCrossed, 
  Flame, 
  LayoutGrid, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Lock, 
  LogOut,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  DollarSign,
  Settings,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartItemCount, 
    setIsCartOpen,
    orders,
    audioEnabled,
    setAudioEnabled,
    playChime,
    isAdminLoggedIn,
    logoutAdmin,
    setIsAdminLoginModalOpen,
    menuItems,
    setSelectedItemForCustomizer,
    brandingProfile,
    setActiveOperationsTab
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active kitchen tickets memoized
  const activeOrders = useMemo(() => orders.filter(o => o.overallStatus !== 'completed'), [orders]);
  
  const baristaActiveCount = useMemo(() => activeOrders.filter(o => 
    o.items.some(i => i.station === 'barista' && i.itemStatus !== 'completed')
  ).length, [activeOrders]);

  const bakeryActiveCount = useMemo(() => activeOrders.filter(o => 
    o.items.some(i => i.station === 'bakery' && i.itemStatus !== 'completed')
  ).length, [activeOrders]);

  const scrollToAnchor = useCallback((id: string) => {
    setIsMobileMenuOpen(false);
    if (activeView !== 'storefront') {
      setActiveView('storefront');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    playChime('click');
  }, [activeView, setActiveView, playChime]);

  const filteredSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery, menuItems]);

  return (
    <>
      {/* 80% Transparent Sticky Header with 80% Reduced Size on Scroll */}
      <header 
        className={`sticky top-0 z-[999] backdrop-blur-md border-b border-white/10 select-none transition-all duration-300 shadow-xl ${
          isScrolled ? 'py-0' : 'py-0'
        }`}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.70)' : 'rgba(0, 0, 0, 0.20)' 
        }}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300 ${
          isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
        }`}>
          
          {/* Brand Logo & Emblem Badge in sticky header */}
          <div className="shrink-0">
            <button 
              onClick={() => { setActiveView('storefront'); playChime('click'); }}
              className="text-left group focus-visible:outline-none flex items-center gap-2.5 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 group-hover:scale-102 transition-transform">
                <div className={`rounded-xl bg-[#f5ebe1] p-0.5 flex items-center justify-center border border-[#d59a63]/40 shadow-[0_0_20px_rgba(213,154,99,0.35)] overflow-hidden shrink-0 transition-all duration-300 ${
                  isScrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'
                }`}>
                  <img 
                    src="/assets/aistudio/brew_flow_favicon_e6544dbd.jpg" 
                    alt={brandingProfile.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`font-serif font-bold tracking-tight text-[#ffffff] group-hover:text-[#d59a63] transition-colors leading-none ${
                    isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                  }`}>
                    {brandingProfile.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-[#d59a63] font-mono uppercase mt-0.5">
                    COFFEE SHOP
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Pointing Directly to Actual Page Sections */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] font-normal tracking-wide text-[#d2beaf]">
            
            {/* Special Deals & Featured */}
            <button
              onClick={() => scrollToAnchor('hero-section')}
              className="relative text-[#ffffff] font-medium py-1 cursor-pointer transition-colors hover:text-[#d59a63] group"
            >
              <span>Featured Deals</span>
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d59a63] block" />
            </button>

            {/* Espresso Classics */}
            <button
              onClick={() => scrollToAnchor('espresso-section')}
              className="py-1 cursor-pointer transition-colors hover:text-[#ffffff]"
            >
              Espresso Classics
            </button>

            {/* Chilled & Nitro */}
            <button
              onClick={() => scrollToAnchor('chilled-section')}
              className="py-1 cursor-pointer transition-colors hover:text-[#ffffff]"
            >
              Chilled &amp; Nitro
            </button>

            {/* Bakery & Sweets */}
            <button
              onClick={() => scrollToAnchor('bakery-section')}
              className="py-1 cursor-pointer transition-colors hover:text-[#ffffff]"
            >
              Bakery &amp; Sweets
            </button>
          </nav>

          {/* Right Action Icons (Audio, Search, Bag, User Profile Logo, Hamburger) */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            
            {/* Audio chime toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Mute Kitchen Audio Chimes' : 'Enable Kitchen Audio Chimes'}
              className="text-[#baa293] hover:text-[#ffffff] transition-colors p-1"
              aria-label="Toggle audio"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-[#d59a63]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#756052]" />
              )}
            </button>

            {/* Search Icon */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                playChime('click');
              }}
              title="Search coffee & patisserie"
              className="text-[#d8c5b6] hover:text-[#ffffff] transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* User Profile / Account Logo Button */}
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setActiveView('operations_hub');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
                playChime('click');
              }}
              title={isAdminLoggedIn ? "Staff Account Active" : "User Profile Sign In"}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-[#d59a63] flex items-center justify-center transition-all shadow-md active:scale-95"
              aria-label="User profile account"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Shopping Bag Icon with counter badge */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                playChime('click');
              }}
              title="Open order bag"
              className="relative text-[#d8c5b6] hover:text-[#ffffff] transition-colors p-1"
              aria-label="Order bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#ffffff] text-[#120b08] font-mono text-[9px] font-bold flex items-center justify-center shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Menu / Hamburger Icon */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(true);
                playChime('click');
              }}
              title="Open menu & staff portal"
              className="text-[#d8c5b6] hover:text-[#ffffff] transition-colors p-1"
              aria-label="Navigation menu"
            >
              <MenuIcon className="w-5 h-5 stroke-[1.8]" />
            </button>

          </div>

        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#180e0a]/95 border border-[#3b2316] rounded-2xl shadow-2xl p-5 text-[#faede1]">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#2d1b11]">
              <div className="flex items-center gap-2.5 flex-1">
                <Search className="w-4 h-4 text-[#d59a63]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search espresso, nitro brew, croissant, brownies..."
                  autoFocus
                  className="w-full bg-transparent text-sm text-[#faede1] placeholder-[#8e7667] focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-[#9e8372] hover:text-[#ffffff] hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results list */}
            <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemForCustomizer(item);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      playChime('click');
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-serif text-sm font-semibold text-[#faede1] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#9e8372] block">
                          ${item.price.toFixed(2)} · {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#d59a63]" />
                  </div>
                ))
              ) : searchQuery.trim() ? (
                <p className="text-xs text-[#8e7667] py-6 text-center">
                  No matching items found for "{searchQuery}".
                </p>
              ) : (
                <div className="py-2 text-xs text-[#8e7667] space-y-1">
                  <span className="block text-[10px] uppercase tracking-wider text-[#d59a63] font-medium">Quick Suggestions:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Double Origin Espresso', 'Signature Iced Coffee', 'Chocolate Croissant', 'Biscoff Caramel Shake'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchQuery(s)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-[#cfb7a5]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side Slide-Over Navigation & Staff BOH Portal Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#160d09]/98 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-[#2e1a10]">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2e1a10]">
                <span className="font-sans text-xl font-bold tracking-[0.25em] text-[#ffffff] uppercase">
                  B R E W .
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-[#baa293] hover:text-[#ffffff] hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="space-y-3 text-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#8e7667] font-semibold block">
                  Storefront Navigation
                </span>
                <button
                  onClick={() => scrollToAnchor('hero-section')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-[#faede1] flex items-center justify-between"
                >
                  <span>Home</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8e7667]" />
                </button>
                <button
                  onClick={() => scrollToAnchor('espresso-section')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-[#faede1] flex items-center justify-between"
                >
                  <span>Shop Espresso &amp; Hot Classics</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8e7667]" />
                </button>
                <button
                  onClick={() => scrollToAnchor('chilled-section')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-[#faede1] flex items-center justify-between"
                >
                  <span>Chilled Nitro &amp; Gelato Shakes</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8e7667]" />
                </button>
                <button
                  onClick={() => scrollToAnchor('bakery-section')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-[#faede1] flex items-center justify-between"
                >
                  <span>French Butter Bakery &amp; Treats</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8e7667]" />
                </button>
              </div>

              {/* BOH Operations Section: Hidden if logged out, unlocked if logged in */}
              <div className="pt-6 border-t border-[#2e1a10] space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-[#d59a63] font-semibold block">
                  Kitchen &amp; Operations (BOH)
                </span>

                {isAdminLoggedIn ? (
                  <div className="space-y-2 text-xs">
                    {/* Unified Hub Button */}
                    <button
                      onClick={() => {
                        setActiveView('operations_hub');
                        setActiveOperationsTab('pos');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between py-3 px-3.5 rounded-2xl bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08] font-bold shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Unified Operations Hub</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setActiveView('operations_hub');
                          setActiveOperationsTab('pos');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-[11px] text-[#faede1] flex items-center gap-1.5"
                      >
                        <UtensilsCrossed className="w-3 h-3 text-[#d59a63]" />
                        <span>Waiter POS</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveView('operations_hub');
                          setActiveOperationsTab('kds');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-[11px] text-[#faede1] flex items-center gap-1.5"
                      >
                        <Coffee className="w-3 h-3 text-[#d59a63]" />
                        <span>Kitchen KDS</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveView('operations_hub');
                          setActiveOperationsTab('ready_board');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-[11px] text-[#faede1] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Ready Board</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveView('operations_hub');
                          setActiveOperationsTab('waiter_ledger');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-[11px] text-[#faede1] flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3 h-3 text-[#d59a63]" />
                        <span>Waiter Ledger</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('operations_hub');
                        setActiveOperationsTab('branding_settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#faede1] text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-[#d59a63]" />
                        <span>Edit Brand Profile &amp; Gateways</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#8e7667]" />
                    </button>

                    <button
                      onClick={() => {
                        logoutAdmin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 py-2 px-3 rounded-xl text-rose-300 hover:bg-rose-500/10 mt-1 text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock &amp; Sign Out BOH</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-[#301c12] space-y-2.5">
                    <p className="text-xs text-[#a88f7e] leading-relaxed">
                      Kitchen display stations and POS terminals are restricted to authorized crew.
                    </p>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAdminLoginModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-[#faede1] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#d59a63]" />
                      <span>Staff Sign In (PIN)</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            <div className="pt-6 border-t border-[#2e1a10] text-[11px] text-[#715c4f] flex items-center justify-between">
              <span>B R E W . Roasters</span>
              <span>100% Arabica Extractions</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
