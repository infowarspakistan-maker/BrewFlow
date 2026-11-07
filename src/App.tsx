import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StorefrontHero } from './components/StorefrontHero';
import { FeaturedDeals } from './components/FeaturedDeals';
import { StorefrontSections } from './components/StorefrontSections';
import { StorefrontFooter } from './components/StorefrontFooter';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { PerfectMatchModal } from './components/PerfectMatchModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { POSOrderBooker } from './components/POSOrderBooker';
import { KDSStationView } from './components/KDSStationView';
import { AnalyticsView } from './components/AnalyticsView';
import { OperationsHub } from './components/OperationsHub';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BackgroundScrollAnimation } from './components/BackgroundScrollAnimation';
import { QuickOrderToastStack } from './components/QuickOrderToast';
import { MobileStickyFooter } from './components/MobileStickyFooter';
import { MobileAppView } from './components/MobileAppView';

const MainContent: React.FC = () => {
  const { activeView, isAdminLoggedIn } = useApp();

  return (
    <div className="min-h-screen bg-transparent text-[#f4ece4] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background smooth scroll animation using 300 frames */}
      {activeView === 'storefront' && <BackgroundScrollAnimation />}

      <Header />

      <main className="flex-1 relative z-10">
        {activeView === 'storefront' && (
          <div className="relative z-10 flex flex-col min-h-screen">
            <div className="block md:hidden">
              <MobileAppView />
            </div>
            <div className="hidden md:block">
              <StorefrontHero />
              <FeaturedDeals />
              <StorefrontSections />
              <StorefrontFooter />
            </div>
          </div>
        )}

        {/* Back of House screens protected behind admin authentication */}
        {isAdminLoggedIn ? (
          <>
            {activeView === 'operations_hub' && <OperationsHub />}
            {activeView === 'pos' && <OperationsHub />}
            {activeView === 'kds_barista' && <KDSStationView stationMode="barista" />}
            {activeView === 'kds_bakery' && <KDSStationView stationMode="bakery" />}
            {activeView === 'kds_expeditor' && <KDSStationView stationMode="expeditor" />}
            {activeView === 'analytics' && <AnalyticsView />}
          </>
        ) : (
          activeView !== 'storefront' && (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
              <div className="text-center space-y-4 max-w-sm p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-[#3b2316]">
                <h3 className="font-serif text-lg font-bold text-[#faede1]">
                  Staff Authentication Required
                </h3>
                <p className="text-xs text-[#a88f7e]">
                  Please sign in to access Kitchen Display Systems, Waiter POS, and Cafe Management.
                </p>
              </div>
            </div>
          )
        )}
      </main>

      {/* Global Modals, Drawers & Toast Overlays */}
      <ProductDetailModal />
      <ProductCustomizerModal />
      <PerfectMatchModal />
      <CartDrawer />
      <OrderConfirmationModal />
      <AdminLoginModal />
      <QuickOrderToastStack />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
