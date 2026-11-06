export type ProductCategory = 'bakery' | 'chilled' | 'hot_classics';
export type StationType = 'barista' | 'bakery';
export type ItemStatus = 'pending' | 'in_prep' | 'ready' | 'completed';
export type OrderStatus = 'received' | 'in_prep' | 'ready' | 'completed';
export type OrderType = 'dine_in' | 'takeaway' | 'mobile_pickup';
export type ServingStyle = 'For Here (on slate plate)' | 'To-Go (in craft bag)';

export interface CustomizationOptions {
  size?: 'Regular (12oz)' | 'Large (16oz)';
  milk?: 'Whole Milk' | 'Barista Oat Milk' | 'Roasted Almond' | 'Organic Soy Milk';
  iceLevel?: 'No Ice' | 'Light Ice' | 'Regular Ice' | 'Extra Ice';
  whippedCream?: 'No Whip' | 'Vanilla Whipped Cream' | 'Extra Whipped Cream';
  sweetness?: 'Unsweetened (0%)' | 'Half Sweet (50%)' | 'Standard (100%)' | 'Extra Sweet (125%)';
  shots?: 'Standard Shot' | 'Extra Espresso Shot (+ $1.00)' | 'Double Shot (+ $1.75)';
  syrup?: 'None' | 'Madagascar Vanilla' | 'Salted Caramel' | 'Dark Mocha';
  warming?: boolean; // Food modifier: "Warm it up"
  servingStyle?: ServingStyle; // Food modifier: "For Here vs. To-Go"
  powderedSugar?: boolean;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  category: ProductCategory;
  station: StationType;
  image: string;
  tag?: string;
  calories?: string;
  pairings: string[]; // IDs of items to suggest in "The Perfect Match"
  pairingPitch: string;
  isColdDrink?: boolean;
  isShake?: boolean;
  isFood?: boolean;
}

export interface OrderItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  station: StationType;
  image: string;
  customization: CustomizationOptions;
  itemStatus: ItemStatus;
}

export interface BrandingProfile {
  name: string;
  tagline: string;
  logoUrl: string;
  address: string;
  cityStateZip: string;
  phone: string;
  email: string;
  openingHours: string;
  currency: string;
  taxRate: number;
}

export interface PaymentGatewaysConfig {
  stripe: boolean;
  square: boolean;
  applePay: boolean;
  googlePay: boolean;
  cashOnDelivery: boolean;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string; // ISO string
  customerName: string;
  orderType: OrderType;
  tableNumber?: string;
  waiterId?: string; // e.g. 'W-01 Marcus'
  waiterName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentStatus: 'paid' | 'unpaid';
  paymentMethod?: 'card' | 'apple_pay' | 'google_pay' | 'cash';
  overallStatus: OrderStatus;
  notes?: string;
}

export type AppView = 
  | 'storefront'
  | 'operations_hub'
  | 'pos'
  | 'kds_barista'
  | 'kds_bakery'
  | 'kds_expeditor'
  | 'analytics';
