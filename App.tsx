
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlackWeekPage } from './pages/BlackWeekPage';
import { WishlistPage } from './pages/WishlistPage';
import { AppleZonePage } from './pages/AppleZonePage';
import { AdventCalendarPage } from './pages/AdventCalendarPage';

// Scroll to top on route change wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useLayoutEffect(() => {
    // Wymuszamy natychmiastowy skok do góry, pomijając animacje smooth-scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-yellow-200 selection:text-orange-900 flex flex-col">
            <ScrollToTop />
            <Header />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/produkty" element={<ProductListingPage />} />
                <Route path="/produkt/:id" element={<ProductDetailsPage />} />
                <Route path="/koszyk" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/black-week" element={<BlackWeekPage />} />
                <Route path="/ulubione" element={<WishlistPage />} />
                <Route path="/apple-zone" element={<AppleZonePage />} />
                <Route path="/kalendarz" element={<AdventCalendarPage />} />
                {/* Fallback for other pages */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;