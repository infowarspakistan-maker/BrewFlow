import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  MenuItem, 
  OrderItem, 
  Order, 
  CustomizationOptions, 
  ItemStatus, 
  OrderStatus,
  BrandingProfile,
  PaymentGatewaysConfig
} from '../types';
import { MENU_ITEMS, INITIAL_ORDERS } from '../data/menuData';

interface CrossSellStats {
  promptsShown: number;
  pairingsAdded: number;
  totalPairingRevenue: number;
}

export interface ToastNotification {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
}

interface AppContextType {
  // Navigation
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  
  // Menu
  menuItems: MenuItem[];

  // Floating Toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Cart
  cart: OrderItem[];
  addToCart: (item: MenuItem, custom?: CustomizationOptions, quantity?: number, triggerCrossSell?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  
  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedItemForCustomizer: MenuItem | null;
  setSelectedItemForCustomizer: (item: MenuItem | null) => void;
  perfectMatchModal: { sourceItem: MenuItem; suggestions: MenuItem[] } | null;
  setPerfectMatchModal: (val: { sourceItem: MenuItem; suggestions: MenuItem[] } | null) => void;
  recentConfirmedOrder: Order | null;
  setRecentConfirmedOrder: (order: Order | null) => void;
  
  // Orders & Station Routing
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateItemStatus: (orderId: string, cartItemId: string, newStatus: ItemStatus) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Audio chimes
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  playChime: (type: 'order' | 'ready' | 'click') => void;
  
  // Cross-sell analytics
  crossSellStats: CrossSellStats;
  recordCrossSellEvent: (accepted: boolean, price?: number) => void;

  // Branding & Store Configuration
  brandingProfile: import('../types').BrandingProfile;
  updateBrandingProfile: (profile: Partial<import('../types').BrandingProfile>) => void;
  paymentGateways: import('../types').PaymentGatewaysConfig;
  updatePaymentGateways: (config: Partial<import('../types').PaymentGatewaysConfig>) => void;

  // Selected Product Detail Spotlight Modal (Wide lifted modal over category reels)
  selectedProductForDetail: MenuItem | null;
  setSelectedProductForDetail: (item: MenuItem | null) => void;

  // Unified Operations Hub active tab
  activeOperationsTab: 'pos' | 'kds' | 'ready_board' | 'waiter_ledger' | 'analytics' | 'branding_settings';
  setActiveOperationsTab: (tab: 'pos' | 'kds' | 'ready_board' | 'waiter_ledger' | 'analytics' | 'branding_settings') => void;

  // Settle Order Bill (for Waiter Billing & Ledger)
  settleOrderBill: (orderId: string, tip?: number) => void;

  // Staff & Admin Auth for BOH Kitchen views
  isAdminLoggedIn: boolean;
  loginAdmin: (pin?: string) => boolean;
  logoutAdmin: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Play user's attached digital click sound effect
const ATTACHED_CLICK_SOUND_URL = '/assets/aistudio/ksjsbwuil-digital-click-3-513897_b0db15d3.mp3';

function playAttachedSoundEffect() {
  try {
    const audio = new Audio(ATTACHED_CLICK_SOUND_URL);
    audio.volume = 0.7;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Suppress browser autoplay policy restriction before initial interaction
      });
    }
  } catch {
    // Silently handle audio initialization exceptions
  }
}

const DEFAULT_BRANDING: BrandingProfile = {
  name: 'BrewFlow Coffee Shop',
  tagline: 'Artisanal Roastery & Kitchen Studio',
  logoUrl: '/assets/aistudio/brew_flow_logo_a493f7b1.png',
  address: '428 Artisan Roastery Way',
  cityStateZip: 'San Francisco, CA 94107',
  phone: '+1 (415) 890-BREW',
  email: 'concierge@brewflowcoffee.com',
  openingHours: 'Mon - Sun: 6:30 AM – 7:00 PM',
  currency: '$',
  taxRate: 0.0825, // 8.25%
};

const DEFAULT_GATEWAYS: PaymentGatewaysConfig = {
  stripe: true,
  square: true,
  applePay: true,
  googlePay: true,
  cashOnDelivery: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('storefront');
  const [activeOperationsTab, setActiveOperationsTab] = useState<'pos' | 'kds' | 'ready_board' | 'waiter_ledger' | 'analytics' | 'branding_settings'>('pos');
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const addToast = (toastData: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...toastData, id };
    setToasts(prev => [newToast, ...prev].slice(0, 3));
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const [orderCounter, setOrderCounter] = useState(1044);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForCustomizer, setSelectedItemForCustomizer] = useState<MenuItem | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<MenuItem | null>(null);
  const [perfectMatchModal, setPerfectMatchModal] = useState<{ sourceItem: MenuItem; suggestions: MenuItem[] } | null>(null);
  const [recentConfirmedOrder, setRecentConfirmedOrder] = useState<Order | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Editable Branding Profile with local persistence
  const [brandingProfile, setBrandingProfile] = useState<BrandingProfile>(() => {
    try {
      const saved = localStorage.getItem('brewflow_branding_profile');
      if (saved) return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_BRANDING;
  });

  const updateBrandingProfile = (profile: Partial<BrandingProfile>) => {
    setBrandingProfile(prev => {
      const updated = { ...prev, ...profile };
      try {
        localStorage.setItem('brewflow_branding_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Payment Gateways selection with local persistence
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewaysConfig>(() => {
    try {
      const saved = localStorage.getItem('brewflow_payment_gateways');
      if (saved) return { ...DEFAULT_GATEWAYS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_GATEWAYS;
  });

  const updatePaymentGateways = (config: Partial<PaymentGatewaysConfig>) => {
    setPaymentGateways(prev => {
      const updated = { ...prev, ...config };
      try {
        localStorage.setItem('brewflow_payment_gateways', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [crossSellStats, setCrossSellStats] = useState<CrossSellStats>({
    promptsShown: 42,
    pairingsAdded: 27,
    totalPairingRevenue: 124.60,
  });

  // Admin & Staff Authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('brewflow_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const loginAdmin = (pin?: string) => {
    // Accepts "1234", "8888", "admin", or empty pin for quick demo access
    const valid = !pin || pin === '1234' || pin === '8888' || pin.toLowerCase() === 'admin';
    if (valid) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('brewflow_admin_auth', 'true');
      } catch {}
      setIsAdminLoginModalOpen(false);
      playChime('ready');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('brewflow_admin_auth');
    } catch {}
    setActiveView('storefront');
    playChime('click');
  };

  const safeSetActiveView = (view: AppView) => {
    if (view !== 'storefront' && !isAdminLoggedIn) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    setActiveView(view);
  };

  const playChime = (type: 'order' | 'ready' | 'click') => {
    if (audioEnabled) {
      playAttachedSoundEffect();
    }
  };

  const recordCrossSellEvent = (accepted: boolean, price = 0) => {
    setCrossSellStats(prev => ({
      promptsShown: prev.promptsShown + 1,
      pairingsAdded: accepted ? prev.pairingsAdded + 1 : prev.pairingsAdded,
      totalPairingRevenue: accepted ? prev.totalPairingRevenue + price : prev.totalPairingRevenue,
    }));
  };

  const addToCart = (
    item: MenuItem, 
    custom?: CustomizationOptions, 
    quantity = 1,
    triggerCrossSell = true
  ) => {
    const finalCustomization: CustomizationOptions = {
      size: custom?.size || 'Regular (12oz)',
      milk: custom?.milk || (item.isColdDrink || item.category === 'hot_classics' ? 'Whole Milk' : undefined),
      iceLevel: custom?.iceLevel || (item.isColdDrink ? 'Regular Ice' : undefined),
      whippedCream: custom?.whippedCream || (item.isShake ? 'Vanilla Whipped Cream' : undefined),
      sweetness: custom?.sweetness || 'Standard (100%)',
      shots: custom?.shots || 'Standard Shot',
      syrup: custom?.syrup || 'None',
      warming: custom?.warming !== undefined ? custom.warming : (item.isFood ? true : undefined),
      servingStyle: custom?.servingStyle || (item.isFood ? 'For Here (on slate plate)' : undefined),
      powderedSugar: custom?.powderedSugar ?? false,
      notes: custom?.notes || '',
    };

    // Calculate modifier surcharges
    let unitPrice = item.price;
    if (finalCustomization.size === 'Large (16oz)') unitPrice += 0.80;
    if (finalCustomization.milk && finalCustomization.milk !== 'Whole Milk') unitPrice += 0.65;
    if (finalCustomization.shots?.includes('Extra Espresso Shot')) unitPrice += 1.00;
    if (finalCustomization.shots?.includes('Double Shot')) unitPrice += 1.75;
    if (finalCustomization.whippedCream === 'Extra Whipped Cream') unitPrice += 0.50;
    if (finalCustomization.syrup && finalCustomization.syrup !== 'None') unitPrice += 0.50;

    const newItem: OrderItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: unitPrice,
      quantity,
      category: item.category,
      station: item.station,
      image: item.image,
      customization: finalCustomization,
      itemStatus: 'pending',
    };

    setCart(prev => [...prev, newItem]);
    playChime('click');

    addToast({
      title: item.name,
      subtitle: `${finalCustomization.size || 'Standard'} · Added to Bag`,
      price: unitPrice * quantity,
      image: item.image,
      quantity,
    });

    // Trigger "The Perfect Match" cross-selling engine if item has pairings and not disabled
    if (triggerCrossSell && item.pairings && item.pairings.length > 0) {
      const suggestions = MENU_ITEMS.filter(m => item.pairings.includes(m.id));
      if (suggestions.length > 0) {
        setPerfectMatchModal({
          sourceItem: item,
          suggestions,
        });
      }
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is OrderItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * (brandingProfile.taxRate || 0.0825);
  const cartTotal = cartSubtotal + cartTax;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const settleOrderBill = (orderId: string, tip = 0) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          tip,
          total: ord.subtotal + ord.tax + tip,
          paymentStatus: 'paid',
          overallStatus: 'completed',
          items: ord.items.map(it => ({ ...it, itemStatus: 'completed' as ItemStatus }))
        };
      })
    );
    playChime('order');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const currentNumber = orderCounter;
    setOrderCounter(prev => prev + 1);
    
    const newOrder: Order = {
      ...orderData,
      id: `BF-${currentNumber}`,
      orderNumber: currentNumber,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    playChime('order');
    return newOrder;
  };

  const updateItemStatus = (orderId: string, cartItemId: string, newStatus: ItemStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const updatedItems = ord.items.map(it => {
          if (it.cartItemId === cartItemId) {
            return { ...it, itemStatus: newStatus };
          }
          return it;
        });

        // Compute overall order status based on item statuses
        const allCompleted = updatedItems.every(i => i.itemStatus === 'completed');
        const allReady = updatedItems.every(i => i.itemStatus === 'ready' || i.itemStatus === 'completed');
        const anyInPrep = updatedItems.some(i => i.itemStatus === 'in_prep');

        let nextOverall = ord.overallStatus;
        if (allCompleted) nextOverall = 'completed';
        else if (allReady) nextOverall = 'ready';
        else if (anyInPrep) nextOverall = 'in_prep';

        return {
          ...ord,
          items: updatedItems,
          overallStatus: nextOverall,
        };
      })
    );

    if (newStatus === 'ready') {
      playChime('ready');
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        
        // Also sync items if completed or ready
        const updatedItems = ord.items.map(it => ({
          ...it,
          itemStatus: (status === 'completed' ? 'completed' : status === 'ready' ? 'ready' : it.itemStatus) as ItemStatus,
        }));

        return {
          ...ord,
          overallStatus: status,
          items: updatedItems,
        };
      })
    );

    if (status === 'ready') {
      playChime('ready');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView: safeSetActiveView,
        menuItems,
        toasts,
        addToast,
        removeToast,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        selectedItemForCustomizer,
        setSelectedItemForCustomizer,
        selectedProductForDetail,
        setSelectedProductForDetail,
        perfectMatchModal,
        setPerfectMatchModal,
        recentConfirmedOrder,
        setRecentConfirmedOrder,
        orders,
        createOrder,
        updateItemStatus,
        updateOrderStatus,
        audioEnabled,
        setAudioEnabled,
        playChime,
        crossSellStats,
        recordCrossSellEvent,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        brandingProfile,
        updateBrandingProfile,
        paymentGateways,
        updatePaymentGateways,
        activeOperationsTab,
        setActiveOperationsTab,
        settleOrderBill,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
