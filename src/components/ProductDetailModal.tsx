import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  Coffee, 
  Flame, 
  Snowflake, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  SlidersHorizontal 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomizationOptions } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    addToCart, 
    playChime,
    brandingProfile 
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<'Regular (12oz)' | 'Large (16oz)'>('Regular (12oz)');
  const [selectedMilk, setSelectedMilk] = useState<'Whole Milk' | 'Barista Oat Milk' | 'Roasted Almond' | 'Organic Soy Milk'>('Whole Milk');
  const [selectedIce, setSelectedIce] = useState<'No Ice' | 'Light Ice' | 'Regular Ice' | 'Extra Ice'>('Regular Ice');
  const [selectedSweetness, setSelectedSweetness] = useState<'Unsweetened (0%)' | 'Half Sweet (50%)' | 'Standard (100%)' | 'Extra Sweet (125%)'>('Standard (100%)');
  const [selectedShots, setSelectedShots] = useState<'Standard Shot' | 'Extra Espresso Shot (+ $1.00)' | 'Double Shot (+ $1.75)'>('Standard Shot');
  const [warming, setWarming] = useState(true);
  const [servingStyle, setServingStyle] = useState<'For Here (on slate plate)' | 'To-Go (in craft bag)'>('For Here (on slate plate)');
  const [powderedSugar, setPowderedSugar] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (selectedProductForDetail) {
      setSelectedSize('Regular (12oz)');
      setSelectedMilk('Whole Milk');
      setSelectedIce('Regular Ice');
      setSelectedSweetness('Standard (100%)');
      setSelectedShots('Standard Shot');
      setWarming(Boolean(selectedProductForDetail.isFood));
      setServingStyle(selectedProductForDetail.isFood ? 'For Here (on slate plate)' : 'For Here (on slate plate)');
      setPowderedSugar(false);
      setSpecialInstructions('');
      setJustAdded(false);
    }
  }, [selectedProductForDetail]);

  if (!selectedProductForDetail) return null;

  const item = selectedProductForDetail;

  // Compute calculated price dynamically
  let dynamicPrice = item.price;
  if (selectedSize === 'Large (16oz)') dynamicPrice += 0.80;
  if (selectedMilk !== 'Whole Milk' && !item.isFood) dynamicPrice += 0.65;
  if (selectedShots.includes('Extra Espresso Shot')) dynamicPrice += 1.00;
  if (selectedShots.includes('Double Shot')) dynamicPrice += 1.75;

  const handleAdd = () => {
    const custom: CustomizationOptions = {
      size: !item.isFood ? selectedSize : undefined,
      milk: (!item.isFood && item.category !== 'bakery') ? selectedMilk : undefined,
      iceLevel: item.isColdDrink ? selectedIce : undefined,
      sweetness: selectedSweetness,
      shots: item.category === 'hot_classics' || item.isColdDrink ? selectedShots : undefined,
      warming: item.isFood ? warming : undefined,
      servingStyle: item.isFood ? servingStyle : undefined,
      powderedSugar: item.isFood ? powderedSugar : undefined,
      notes: specialInstructions.trim() || undefined,
    };

    addToCart(item, custom, 1, true);
    setJustAdded(true);
    playChime('click');
    setTimeout(() => {
      setJustAdded(false);
      setSelectedProductForDetail(null);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ease-out animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#140c08] border border-white/10 rounded-3xl shadow-[0_35px_100px_rgba(0,0,0,0.95)] overflow-hidden text-[#faede1] grid grid-cols-1 md:grid-cols-12 transition-all duration-300 ease-out animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#d4ba9f] hover:text-white transition-all shadow-md active:scale-95 border border-white/10"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Showcase & Tasting Profile */}
        <div className="md:col-span-5 relative flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#1c110b] to-[#120a06] border-b md:border-b-0 md:border-r border-white/10 min-h-[300px] md:min-h-[540px]">
          {/* Main Photo with soft ambient halo */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/10 group mb-6">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 transform-gpu"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Tag chip */}
            {item.tag && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#d59a63]">
                {item.tag}
              </span>
            )}

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
              <span className="font-mono text-[11px] text-[#baa293]">
                {item.calories || 'Crafted Fresh'}
              </span>
              <span className="font-mono font-bold text-[#faede1]">
                {brandingProfile.currency}{item.price.toFixed(2)} base
              </span>
            </div>
          </div>

          {/* Tasting Notes & Sensory Highlights */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#d59a63] font-semibold block">
              Sensory Profile &amp; Preparation
            </span>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#d8c5b6]">
                <Sparkles className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                <span>{item.subtitle}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#baa293]">
                <Scale className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                <span>
                  {item.category === 'hot_classics' ? '9-Bar Extracted · Micro-Textured Steaming' : 
                   item.category === 'chilled' ? 'Triple Cold-Filtered · Nitrogen Body' : 
                   '100% French Butter · High Deck Oven'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#baa293]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d59a63] shrink-0" />
                <span>Direct trade organic beans &amp; pure ingredients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Storytelling & Recipe Configuration */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#d59a63] font-medium block">
                {item.category === 'hot_classics' ? 'Espresso & Hot Classics' : item.category === 'chilled' ? 'Chilled & Blended Drinks' : 'Artisan Bakery & Sweets'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {item.name}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#baa293] leading-relaxed font-light">
              {item.description}
            </p>

            {/* Customization Options */}
            <div className="space-y-4 pt-2">
              
              {/* Size Selector for drinks */}
              {!item.isFood && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Cup Volume &amp; Proportion
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Regular (12oz)', 'Large (16oz)'] as const).map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                          selectedSize === size
                            ? 'bg-[#2b170e] border-[#d59a63] text-white shadow-md'
                            : 'bg-black/30 border-white/5 text-[#baa293] hover:border-white/20'
                        }`}
                      >
                        <span className="font-medium block">{size}</span>
                        <span className="text-[10px] text-[#8e7667]">
                          {size.includes('Large') ? '+$0.80' : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Option for hot/chilled drinks */}
              {!item.isFood && item.category !== 'bakery' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                    Milk Texture &amp; Craft
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Whole Milk', 'Barista Oat Milk', 'Roasted Almond', 'Organic Soy Milk'] as const).map(milk => (
                      <button
                        key={milk}
                        type="button"
                        onClick={() => setSelectedMilk(milk)}
                        className={`p-2 rounded-xl text-left border text-[11px] transition-all truncate ${
                          selectedMilk === milk
                            ? 'bg-[#2b170e] border-[#d59a63] text-white shadow-md'
                            : 'bg-black/30 border-white/5 text-[#baa293] hover:border-white/20'
                        }`}
                      >
                        <span className="font-medium block truncate">{milk.split(' ')[0]}</span>
                        <span className="text-[10px] text-[#8e7667]">
                          {milk === 'Whole Milk' ? 'Std' : '+$0.65'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Modifiers (Warming & Presentation) */}
              {item.isFood && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                      Oven Warming
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWarming(true)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs text-center transition-all ${
                          warming 
                            ? 'bg-[#3b2012] border-[#f49b42] text-[#f49b42] font-semibold shadow-md' 
                            : 'bg-black/30 border-white/5 text-[#baa293]'
                        }`}
                      >
                        Deck Warmed (45s)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWarming(false)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs text-center transition-all ${
                          !warming 
                            ? 'bg-[#2b170e] border-[#d59a63] text-white font-semibold' 
                            : 'bg-black/30 border-white/5 text-[#baa293]'
                        }`}
                      >
                        Ambient Temp
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                      Serving Style
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setServingStyle('For Here (on slate plate)')}
                        className={`flex-1 py-2 px-2.5 rounded-xl border text-[11px] text-center transition-all truncate ${
                          servingStyle.includes('slate')
                            ? 'bg-[#2b170e] border-[#d59a63] text-white font-semibold'
                            : 'bg-black/30 border-white/5 text-[#baa293]'
                        }`}
                      >
                        For Here (Slate)
                      </button>
                      <button
                        type="button"
                        onClick={() => setServingStyle('To-Go (in craft bag)')}
                        className={`flex-1 py-2 px-2.5 rounded-xl border text-[11px] text-center transition-all truncate ${
                          servingStyle.includes('craft')
                            ? 'bg-[#2b170e] border-[#d59a63] text-white font-semibold'
                            : 'bg-black/30 border-white/5 text-[#baa293]'
                        }`}
                      >
                        To-Go (Craft)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Extra instructions */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#baa293] uppercase tracking-wider block">
                  Barista &amp; Kitchen Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra hot, light foam, separate bag..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#faede1] placeholder-[#7d6758] focus:outline-none focus:border-[#d59a63]"
                />
              </div>

            </div>
          </div>

          {/* Bottom Action Footer with Dynamic Pricing & 1-Click Add */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#baa293] block">
                Total Custom Price
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#faede1]">
                {brandingProfile.currency}{dynamicPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={justAdded}
              className={`px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#d59a63] hover:bg-[#e4ad6f] text-[#120b08]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Order Bag</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
