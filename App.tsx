import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlackWeekPage } from './pages/BlackWeekPage';

// Scroll to top on route change wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-200 selection:text-red-900 flex flex-col">
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
              {/* Fallback for other pages */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;