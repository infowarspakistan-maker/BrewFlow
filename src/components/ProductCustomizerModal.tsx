import React, { useState, useEffect } from 'react';
import { X, Flame, Check, Sparkles, Snowflake, Milk, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomizationOptions, ServingStyle } from '../types';

export const ProductCustomizerModal: React.FC = () => {
  const { 
    selectedItemForCustomizer, 
    setSelectedItemForCustomizer, 
    addToCart, 
    playChime 
  } = useApp();

  const item = selectedItemForCustomizer;

  const [size, setSize] = useState<'Regular (12oz)' | 'Large (16oz)'>('Regular (12oz)');
  const [milk, setMilk] = useState<'Whole Milk' | 'Barista Oat Milk' | 'Roasted Almond' | 'Organic Soy Milk'>('Whole Milk');
  const [iceLevel, setIceLevel] = useState<'No Ice' | 'Light Ice' | 'Regular Ice' | 'Extra Ice'>('Regular Ice');
  const [whippedCream, setWhippedCream] = useState<'No Whip' | 'Vanilla Whipped Cream' | 'Extra Whipped Cream'>('Vanilla Whipped Cream');
  const [sweetness, setSweetness] = useState<'Unsweetened (0%)' | 'Half Sweet (50%)' | 'Standard (100%)' | 'Extra Sweet (125%)'>('Standard (100%)');
  const [shots, setShots] = useState<'Standard Shot' | 'Extra Espresso Shot (+ $1.00)' | 'Double Shot (+ $1.75)'>('Standard Shot');
  const [syrup, setSyrup] = useState<'None' | 'Madagascar Vanilla' | 'Salted Caramel' | 'Dark Mocha'>('None');
  
  // Food modifiers
  const [warming, setWarming] = useState<boolean>(true);
  const [servingStyle, setServingStyle] = useState<ServingStyle>('For Here (on slate plate)');
  const [powderedSugar, setPowderedSugar] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (item) {
      setSize('Regular (12oz)');
      setMilk(item.isColdDrink || item.category === 'hot_classics' ? 'Whole Milk' : 'Whole Milk');
      setIceLevel(item.isColdDrink ? 'Regular Ice' : 'Regular Ice');
      setWhippedCream(item.isShake ? 'Vanilla Whipped Cream' : 'No Whip');
      setSweetness('Standard (100%)');
      setShots('Standard Shot');
      setSyrup('None');
      setWarming(true);
      setServingStyle('For Here (on slate plate)');
      setPowderedSugar(false);
      setNotes('');
      setQuantity(1);
    }
  }, [item]);

  if (!item) return null;

  // Price calculation
  let calculatedUnitPrice = item.price;
  if (size === 'Large (16oz)') calculatedUnitPrice += 0.80;
  if (milk !== 'Whole Milk') calculatedUnitPrice += 0.65;
  if (shots === 'Extra Espresso Shot (+ $1.00)') calculatedUnitPrice += 1.00;
  if (shots === 'Double Shot (+ $1.75)') calculatedUnitPrice += 1.75;
  if (whippedCream === 'Extra Whipped Cream') calculatedUnitPrice += 0.50;
  if (syrup !== 'None') calculatedUnitPrice += 0.50;

  const totalCalculated = calculatedUnitPrice * quantity;

  const handleConfirm = () => {
    const custom: CustomizationOptions = {
      size: !item.isFood ? size : undefined,
      milk: !item.isFood ? milk : undefined,
      iceLevel: item.isColdDrink ? iceLevel : undefined,
      whippedCream: item.isColdDrink || item.isShake ? whippedCream : undefined,
      sweetness: !item.isFood ? sweetness : undefined,
      shots: item.category === 'hot_classics' || item.isColdDrink ? shots : undefined,
      syrup: !item.isFood ? syrup : undefined,
      warming: item.isFood ? warming : undefined,
      servingStyle: item.isFood ? servingStyle : undefined,
      powderedSugar: item.isFood ? powderedSugar : undefined,
      notes: notes.trim() || undefined,
    };

    addToCart(item, custom, quantity, true);
    setSelectedItemForCustomizer(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-[#1a100b] border border-[#3b2316] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#f4ece4]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header with image banner */}
        <div className="relative h-44 sm:h-52 bg-[#120b08] overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a100b] via-[#1a100b]/40 to-transparent" />
          
          <button
            onClick={() => setSelectedItemForCustomizer(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#120b08]/80 text-[#faede1] hover:bg-[#120b08] transition-colors border border-[#352115]"
            aria-label="Close customizer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[11px] uppercase tracking-wider text-[#d49a5b] font-medium block">
              {item.subtitle}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#faede1]">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Scrollable Modifier Options Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* FOOD PREPARATION MODIFIERS */}
          {item.isFood && (
            <div className="space-y-4">
              
              {/* "Warm it up" Toggle */}
              <div className="p-3.5 rounded-xl bg-[#23150e] border border-[#3c2214] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#e2843d]" />
                    <span className="font-semibold text-sm text-[#f5eae1]">
                      Warm it up? (45s Oven Toast)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWarming(!warming)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      warming ? 'bg-[#d49a5b]' : 'bg-[#3b2519]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#160d09] shadow-lg ring-0 transition duration-200 ease-in-out ${
                        warming ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-[#9b8373]">
                  {warming 
                    ? '🔥 Warmed in high-temp deck oven for crisp flaky layers and molten center.' 
                    : 'Served fresh at ambient counter temperature.'}
                </p>
              </div>

              {/* Serving Style: For Here vs. To-Go */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-[#d6b79f] block">
                  Serving Style (Presentation)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['For Here (on slate plate)', 'To-Go (in craft bag)'] as ServingStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setServingStyle(style)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        servingStyle === style
                          ? 'bg-[#3b2316] border-[#d49a5b] text-[#fbf1e8] font-medium'
                          : 'bg-[#21140d] border-[#341e12] text-[#9e8372] hover:border-[#4b2c1b]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{style}</span>
                        {servingStyle === style && <Check className="w-3.5 h-3.5 text-[#d49a5b]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Powdered Sugar Dusting */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#21140d] border border-[#341e12]">
                <div className="space-y-0.5">
                  <span className="font-medium text-[#faede1]">Powdered Sugar Dusting</span>
                  <p className="text-[11px] text-[#8e7667]">High-contrast artisanal confectioner sugar finish</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPowderedSugar(!powderedSugar)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    powderedSugar 
                      ? 'bg-[#d49a5b] text-[#120b08] font-bold' 
                      : 'bg-[#2f1c12] text-[#a98f7e]'
                  }`}
                >
                  {powderedSugar ? 'Included' : '+ Add Dusting'}
                </button>
              </div>

            </div>
          )}

          {/* BEVERAGE MODIFIERS (Cold Drinks, Shakes, Hot Classics) */}
          {!item.isFood && (
            <div className="space-y-5">
              
              {/* Cup Size */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-[#d6b79f] block">
                  Cup Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Regular (12oz)', label: 'Regular (12oz)', extra: null },
                    { id: 'Large (16oz)', label: 'Large (16oz)', extra: '+$0.80' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSize(sz.id as any)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        size === sz.id
                          ? 'bg-[#3b2316] border-[#d49a5b] text-[#fbf1e8] font-medium'
                          : 'bg-[#21140d] border-[#341e12] text-[#9e8372] hover:border-[#4b2c1b]'
                      }`}
                    >
                      <span>{sz.label}</span>
                      {sz.extra && <span className="text-[11px] text-[#d49a5b] font-mono">{sz.extra}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alternative Milks */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#d6b79f] font-semibold">
                  <Milk className="w-3.5 h-3.5 text-[#d49a5b]" />
                  <span>Milk Selection</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Whole Milk', label: 'Whole Milk (Standard)', extra: null },
                    { id: 'Barista Oat Milk', label: 'Barista Oat Milk', extra: '+$0.65' },
                    { id: 'Roasted Almond', label: 'Roasted Almond', extra: '+$0.65' },
                    { id: 'Organic Soy Milk', label: 'Organic Soy Milk', extra: '+$0.65' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMilk(m.id as any)}
                      className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between transition-all ${
                        milk === m.id
                          ? 'bg-[#3b2316] border-[#d49a5b] text-[#fbf1e8] font-medium'
                          : 'bg-[#21140d] border-[#341e12] text-[#9e8372] hover:border-[#4b2c1b]'
                      }`}
                    >
                      <span>{m.label}</span>
                      {m.extra && <span className="text-[10px] text-[#d49a5b] font-mono">{m.extra}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ice Level (For Chilled & Shakes) */}
              {item.isColdDrink && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#d6b79f] font-semibold">
                    <Snowflake className="w-3.5 h-3.5 text-[#7ec2ed]" />
                    <span>Ice Level</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice'].map((ice) => (
                      <button
                        key={ice}
                        type="button"
                        onClick={() => setIceLevel(ice as any)}
                        className={`py-2 px-1 text-center rounded-lg border text-[11px] transition-all ${
                          iceLevel === ice
                            ? 'bg-[#3b2316] border-[#7ec2ed] text-[#faede1] font-semibold'
                            : 'bg-[#21140d] border-[#341e12] text-[#9a8475]'
                        }`}
                      >
                        {ice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Whipped Cream (For Shakes and Chilled) */}
              {(item.isShake || item.isColdDrink) && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#d6b79f] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#d49a5b]" />
                    <span>Whipped Cream Crown</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'No Whip', label: 'No Whip' },
                      { id: 'Vanilla Whipped Cream', label: 'Vanilla Whip' },
                      { id: 'Extra Whipped Cream', label: 'Extra (+ $0.50)' },
                    ].map((whip) => (
                      <button
                        key={whip.id}
                        type="button"
                        onClick={() => setWhippedCream(whip.id as any)}
                        className={`p-2 rounded-lg border text-center text-xs transition-all ${
                          whippedCream === whip.id
                            ? 'bg-[#3b2316] border-[#d49a5b] text-[#faede1] font-medium'
                            : 'bg-[#21140d] border-[#341e12] text-[#9a8475]'
                        }`}
                      >
                        {whip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sweetness */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-[#d6b79f] block">
                  Sweetness Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'Unsweetened (0%)', label: '0%' },
                    { id: 'Half Sweet (50%)', label: '50%' },
                    { id: 'Standard (100%)', label: '100%' },
                    { id: 'Extra Sweet (125%)', label: '125%' },
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setSweetness(sw.id as any)}
                      className={`py-2 px-1 text-center rounded-lg border text-[11px] transition-all ${
                        sweetness === sw.id
                          ? 'bg-[#3b2316] border-[#d49a5b] text-[#faede1] font-semibold'
                          : 'bg-[#21140d] border-[#341e12] text-[#9a8475]'
                      }`}
                    >
                      {sw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Shots */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#d6b79f] font-semibold">
                  <Coffee className="w-3.5 h-3.5 text-[#d49a5b]" />
                  <span>Espresso Shots</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Standard Shot', label: 'Standard' },
                    { id: 'Extra Espresso Shot (+ $1.00)', label: '+1 Shot (+$1)' },
                    { id: 'Double Shot (+ $1.75)', label: '+2 Shots (+$1.75)' },
                  ].map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setShots(sh.id as any)}
                      className={`p-2 rounded-lg border text-center text-xs transition-all ${
                        shots === sh.id
                          ? 'bg-[#3b2316] border-[#d49a5b] text-[#faede1] font-medium'
                          : 'bg-[#21140d] border-[#341e12] text-[#9a8475]'
                      }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Kitchen Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-[#a98f7e] block">
              Special Instructions for Barista / Baker
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, splash of cinnamon, split in two..."
              className="w-full bg-[#130b07] border border-[#341e12] rounded-lg px-3 py-2 text-xs text-[#faede1] placeholder-[#665042] focus:ring-1 focus:ring-[#d49a5b] focus:outline-none"
            />
          </div>

        </div>

        {/* Modal Footer with quantity & Add to Order button */}
        <div className="p-4 bg-[#140c08] border-t border-[#2e1b11] flex items-center justify-between gap-4">
          
          {/* Quantity stepper */}
          <div className="flex items-center border border-[#3b2316] rounded-lg bg-[#1e120b] overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-sm font-bold text-[#c9a78e] hover:bg-[#2b1910] transition-colors"
            >
              -
            </button>
            <span className="px-3 py-2 font-mono text-xs font-semibold text-[#faede1] min-w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-sm font-bold text-[#c9a78e] hover:bg-[#2b1910] transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to order button */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#c98a4c] to-[#9c5e2d] hover:from-[#d99757] hover:to-[#ad6832] text-[#120b08] font-semibold text-xs transition-all shadow-md active:scale-98 flex items-center justify-between"
          >
            <span>Add Customized Item</span>
            <span className="font-mono font-bold">${totalCalculated.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
