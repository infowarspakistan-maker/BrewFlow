import React from 'react';
import { Coffee, MapPin, Clock, Phone, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StorefrontFooter: React.FC = () => {
  const { setActiveView, playChime, isAdminLoggedIn, setIsAdminLoginModalOpen, brandingProfile } = useApp();

  return (
    <footer className="hidden md:block bg-transparent text-[#bda393] text-xs pb-16 select-none border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column matching Image 2 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ebe1] p-0.5 flex items-center justify-center border border-[#d59a63]/40 shadow-md overflow-hidden shrink-0">
                {brandingProfile.logoUrl ? (
                  <img 
                    src={brandingProfile.logoUrl} 
                    alt={brandingProfile.name} 
                    className="w-full h-full object-cover object-left scale-150 transform translate-x-1" 
                  />
                ) : (
                  <Coffee className="w-5 h-5 text-[#3d2214]" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-[#f5ebd9] leading-none">
                  {brandingProfile.name}
                </span>
                <span className="text-[10px] tracking-widest text-[#d59a63] font-mono uppercase mt-0.5">
                  COFFEE SHOP
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#aa9384] leading-relaxed font-light">
              {brandingProfile.tagline || 'Discover the premium coffee experience. Single-origin extractions, handcrafted gelato shakes, and artisanal French baking.'}
            </p>
          </div>

          {/* Location & Hours */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#faede1]">
              Roastery &amp; Bar
            </h4>
            <div className="space-y-1.5 text-[11px] text-[#b8a192] font-light">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d49a5b] shrink-0 mt-0.5" />
                <span>{brandingProfile.address}, {brandingProfile.cityStateZip}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d49a5b] shrink-0" />
                <span>{brandingProfile.openingHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d49a5b] shrink-0" />
                <span>{brandingProfile.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d49a5b] shrink-0" />
                <span>{brandingProfile.email}</span>
              </div>
            </div>
          </div>

          {/* Menu Sections Anchor Links */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#faede1]">
              Menu Sections
            </h4>
            <ul className="space-y-1 text-[11px] text-[#b8a192] font-light">
              <li>
                <a href="#espresso-section" className="hover:text-[#faede1] transition-colors">
                  • Espresso &amp; Hot Classics (9-Bar Pulls)
                </a>
              </li>
              <li>
                <a href="#chilled-section" className="hover:text-[#faede1] transition-colors">
                  • Chilled &amp; Blended (Nitro &amp; Shakes)
                </a>
              </li>
              <li>
                <a href="#bakery-section" className="hover:text-[#faede1] transition-colors">
                  • The Bakery &amp; Sweets (Fresh Daily)
                </a>
              </li>
              <li>
                <span className="text-[#8e7667]">• Synchronized Multi-Station Kitchen</span>
              </li>
            </ul>
          </div>

          {/* Staff & Admin Security Access (Hidden Behind Login) */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#faede1]">
              Authorized Operations
            </h4>
            <div className="space-y-2 text-[11px]">
              {isAdminLoggedIn ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Staff Session Authenticated</span>
                  </div>
                  <button
                    onClick={() => { setActiveView('operations_hub'); playChime('click'); }}
                    className="block text-[#d6b79f] hover:text-[#faede1] transition-colors font-medium"
                  >
                    → Open Unified Operations Hub
                  </button>
                  <button
                    onClick={() => { setActiveView('operations_hub'); playChime('click'); }}
                    className="block text-[#baa293] hover:text-[#faede1] transition-colors"
                  >
                    • Waiter POS &amp; Table Orders
                  </button>
                  <button
                    onClick={() => { setActiveView('operations_hub'); playChime('click'); }}
                    className="block text-[#baa293] hover:text-[#faede1] transition-colors"
                  >
                    • Kitchen KDS &amp; Ready Board
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[#8e7667] font-light leading-relaxed">
                    Back of House POS and KDS screens are restricted to authorized personnel.
                  </p>
                  <button
                    onClick={() => { setIsAdminLoginModalOpen(true); playChime('click'); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[#d4ba9f] hover:text-[#faede1] transition-colors font-medium text-[11px]"
                  >
                    <Lock className="w-3 h-3 text-[#d49a5b]" />
                    <span>Staff &amp; Admin Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Quiet copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9c8476] gap-2 border-0">
          <span>&copy; {new Date().getFullYear()} BODREN Specialty Coffee &amp; Patisserie. All rights reserved.</span>
          <div className="flex items-center gap-3 font-light">
            <span>Specialty Grade Extraction</span>
            <span>·</span>
            <span>Zero Slop Artisanal Design</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
