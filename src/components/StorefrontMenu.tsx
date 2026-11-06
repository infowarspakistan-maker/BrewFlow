import React, { useState } from 'react';
import { 
  Plus, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  Snowflake, 
  Coffee,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, ProductCategory } from '../types';

export const StorefrontMenu: React.FC = () => {
  const { 
    menuItems, 
    addToCart, 
    setSelectedItemForCustomizer,
    playChime 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('bakery');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories: { id: ProductCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'bakery', 
      label: 'The Bakery / Sweets', 
      icon: <Flame className="w-3.5 h-3.5" />,
      desc: 'Handmade daily with French butter, warm options & dark slate presentation'
    },
    { 
      id: 'chilled', 
      label: 'Chilled & Blended', 
      icon: <Snowflake className="w-3.5 h-3.5" />,
      desc: 'Nitro drafts, slow-steeped iced cold brews & artisan gelato shakes'
    },
    { 
      id: 'hot_classics', 
      label: 'Espresso & Hot Classics', 
      icon: <Coffee className="w-3.5 h-3.5" />,
      desc: 'Single-estate 9-bar espresso, velvety steamed microfoams & Valrhona dark ganache'
    },
  ];

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const handleQuickAdd = (item: MenuItem) => {
    // If it's a customizable drink or food, open customizer modal for best UX or quick-add with defaults
    // For quick add button:
    addToCart(item, undefined, 1, true);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  return (
    <section id="menu-section" className="py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-[#cba075] font-semibold">
              Curated Roastery &amp; Patisserie
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#faede1] tracking-tight drop-shadow-sm">
              Our Artisanal Menu Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#d6c1b3] max-w-xl">
              Organized into specialized preparation zones for perfect quality and rapid kitchen synchronization.
            </p>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    playChime('click');
                  }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-[#faede1] shadow-sm font-semibold'
                      : 'text-[#baa294] hover:text-[#faede1] hover:bg-white/5'
                  }`}
                >
                  <span className={isSelected ? 'text-[#d49a5b]' : 'text-[#8e7565]'}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="px-4 py-3 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-between text-xs text-[#d0bbb0]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d49a5b] shrink-0" />
            <span>
              {categories.find(c => c.id === selectedCategory)?.desc}
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-[#a89081]">
            Station: {selectedCategory === 'bakery' ? 'Bakery & Warming' : 'Main Barista Bar'}
          </span>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const isJustAdded = justAddedId === item.id;

            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-black/40 backdrop-blur-md hover:bg-black/55 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xl hover:-translate-y-1"
              >
                {/* Media Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full bg-black/20 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle dark gradient scrim at bottom for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {item.tag ? (
                      <span className="bg-black/75 backdrop-blur-md text-[#e5b686] text-[10px] font-medium px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                    ) : <span />}

                    {item.isFood ? (
                      <span className="bg-black/75 backdrop-blur-md text-[#f49b42] text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" />
                        <span>Warm Available</span>
                      </span>
                    ) : item.isColdDrink ? (
                      <span className="bg-black/75 backdrop-blur-md text-[#7ec2ed] text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Snowflake className="w-2.5 h-2.5" />
                        <span>Chilled Blend</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-1.5">
                    {/* Unboxed Category Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-[#aa9282]">
                      <span className="uppercase tracking-wider font-medium text-[#cba075]">
                        {item.subtitle}
                      </span>
                      {item.calories && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{item.calories}</span>
                        </>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-lg font-bold text-[#faede1] group-hover:text-[#e4b281] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#c9b4a7] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing and Actions Row */}
                  <div className="pt-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#a48e80] block uppercase">Price</span>
                      <span className="font-mono text-base font-bold text-[#f7e4d0]">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Customize button */}
                      <button
                        onClick={() => {
                          setSelectedItemForCustomizer(item);
                          playChime('click');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#faede1] text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        title="Customize ingredients & preparation"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-[#d49a5b]" />
                        <span>Customize</span>
                      </button>

                      {/* Quick Add Button */}
                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`p-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center shrink-0 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#d49a5b] hover:bg-[#e4ad6f] text-[#120b08] active:scale-90 shadow-sm'
                        }`}
                        title="Quick add to order"
                        aria-label={`Add ${item.name} to order`}
                      >
                        {isJustAdded ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
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
    </section>
  );
};
