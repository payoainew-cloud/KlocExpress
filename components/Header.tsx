
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Truck, ShieldCheck, Clock, Zap, Heart, ChevronDown, Package, LayoutGrid, ArrowRight, Layers } from 'lucide-react';
import { Button } from './Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATEGORIES } from '../constants';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();

  // Reset menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
  }, [location.pathname]);

  // Scroll Listener & State Management
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        // Close menu when switching modes to prevent UI glitches
        setIsMobileMenuOpen(false); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produkty?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  // --- MENU CONTENT COMPONENT (Reused in both modes) ---
  const MenuContent = () => (
    <div className="flex flex-col gap-2 p-5">
        {/* Search Mobile */}
        <form onSubmit={handleSearch} className="relative md:hidden mb-4">
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..." 
                className="w-full h-12 bg-slate-100 border-none rounded-2xl pl-4 pr-12 text-slate-900 font-bold focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-600 transition-colors">
                <Search size={20} />
            </button>
        </form>

        {/* Categories Accordion */}
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
            <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between p-4 font-black text-slate-900 uppercase tracking-wide hover:bg-slate-50 transition-colors"
            >
                <span className="flex items-center gap-3"><Package size={20} className="text-orange-600"/> Kategorie</span>
                <ChevronDown size={20} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-300 overflow-hidden ${isCategoryOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4 space-y-1">
                    {CATEGORIES.map(cat => (
                        <Link 
                            key={cat.id}
                            to={`/produkty?category=${cat.slug}`}
                            className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl text-sm font-bold text-slate-600 active:scale-95 transition-all hover:bg-yellow-50 hover:text-slate-900"
                        >
                            {cat.name}
                            <ArrowRight size={14} className="text-slate-300" />
                        </Link>
                    ))}
                    <Link 
                        to="/produkty"
                        className="flex items-center justify-between p-3 mt-2 bg-slate-900 text-white rounded-xl text-sm font-bold active:scale-95 transition-all hover:bg-slate-800"
                    >
                        Wszystkie kategorie
                        <Layers size={14} />
                    </Link>
                </div>
            </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mt-2">
            <Link to="/produkty?filter=new" className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50/80 hover:bg-blue-100 rounded-2xl transition-colors text-blue-700 font-black uppercase text-xs tracking-wide">
                <span className="text-xl">✨</span> Nowości
            </Link>
            <Link to="/produkty?filter=promo" className="flex flex-col items-center justify-center gap-2 p-4 bg-red-50/80 hover:bg-red-100 rounded-2xl transition-colors text-red-700 font-black uppercase text-xs tracking-wide">
                <span className="text-xl">🔥</span> Promocje
            </Link>
        </div>

        <Link to="/black-week" className="group flex items-center justify-center gap-2 p-4 mt-2 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wide hover:bg-black transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">
            <Zap size={18} className="text-yellow-400 fill-yellow-400 group-hover:animate-pulse" /> Black Week
        </Link>
        
        {/* User Actions Mobile */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
             <Link to="/ulubione" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                <Heart size={18} /> Ulubione
             </Link>
             <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                <User size={18} /> Konto
             </button>
        </div>
    </div>
  );

  return (
    <>
      {/* ================= STICKY HEADER (CLEAN CAPSULE) ================= */}
      <div className={`fixed top-4 left-0 right-0 z-[60] flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div 
            className={`
                bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto
                w-[94%] max-w-5xl mx-auto overflow-hidden
                rounded-[28px] 
                transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
                ${isMobileMenuOpen ? 'shadow-2xl' : ''}
            `}
        >
            {/* Capsule Bar Header */}
            <div className="flex items-center justify-between px-2 py-2 min-h-[64px]">
                {/* Left */}
                <div className="flex items-center gap-2 pl-1">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`
                            relative w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200
                            ${isMobileMenuOpen ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white hover:bg-slate-800'}
                        `}
                    >
                        {isMobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <LayoutGrid size={20} strokeWidth={2} />}
                    </button>
                    
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-lg shadow-sm">
                            <Truck className="text-slate-900" size={16} strokeWidth={2.5} />
                        </div>
                        {/* Hidden on small screens to fit icons */}
                        <span className="font-black text-sm italic tracking-tight text-slate-900 hidden sm:block">Kloc-Express</span>
                    </Link>
                </div>

                {/* Center (Desktop Search) - Hides on mobile */}
                <form 
                    onSubmit={handleSearch} 
                    className="flex-1 max-w-md mx-4 hidden md:block"
                >
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Szukaj..." 
                            className="w-full h-10 bg-slate-100/50 border border-slate-200/50 rounded-full pl-10 pr-4 text-sm font-medium focus:bg-white focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/10 transition-all"
                        />
                        <Search className="absolute left-3.5 top-2.5 text-slate-400 group-hover:text-yellow-500 transition-colors" size={16} />
                    </div>
                </form>

                {/* Right */}
                <div className="flex items-center gap-1 pr-1">
                    <Link to="/ulubione" className="w-11 h-11 flex items-center justify-center hover:bg-red-50 rounded-full text-slate-500 hover:text-red-500 transition-all relative">
                        <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} strokeWidth={2.5} />
                        {wishlistCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                    </Link>
                    
                    <Link to="/koszyk" className="h-11 px-3 hover:bg-yellow-50 rounded-full text-slate-900 hover:text-yellow-700 transition-all relative flex items-center gap-2 group">
                        <div className="relative">
                            <ShoppingBag size={20} strokeWidth={2.5} />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-[10px] font-black flex items-center justify-center rounded-full text-black shadow-sm">{cartCount}</span>}
                        </div>
                        {cartTotal > 0 && <span className="text-xs font-black hidden sm:block">{cartTotal.toFixed(0)} zł</span>}
                    </Link>
                </div>
            </div>

            {/* Expandable Menu Content (Vertical Drop) */}
            <div 
                className={`
                    transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
                    ${isMobileMenuOpen ? 'max-h-[85vh] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
                    <MenuContent />
                </div>
            </div>
        </div>
      </div>


      {/* ================= STANDARD HEADER ================= */}
      <header className={`w-full relative z-50 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none absolute' : 'translate-y-0 opacity-100'}`}>
        
        {/* 1. TOP BAR */}
        <div className="bg-slate-900 text-slate-300 text-[11px] md:text-xs font-bold py-2.5 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
              <div className="flex gap-4 sm:gap-6">
                  <span className="flex items-center gap-1.5"><Truck size={14} className="text-yellow-400"/> Wysyłka w 24h</span>
                  <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-400"/> Gwarancja oryginalności</span>
                  <span className="hidden md:flex items-center gap-1.5"><Clock size={14} className="text-blue-400"/> 30 dni na zwrot</span>
              </div>
              <div className="flex gap-4">
                  <Link to="/kontakt" className="hover:text-white transition-colors">Centrum Pomocy</Link>
                  <Link to="/status" className="hover:text-white transition-colors">Status Zamówienia</Link>
              </div>
          </div>
        </div>

        {/* 2. MAIN HEADER */}
        <div className="bg-white py-4 md:py-6 relative z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4 md:gap-8">
              
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 flex items-center justify-center rounded-xl shadow-[0_4px_14px_rgba(250,204,21,0.4)] transform group-hover:-skew-x-12 group-hover:scale-105 transition-all duration-300">
                      <Truck className="text-slate-900" size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col leading-none">
                      <span className="font-black text-xl md:text-2xl tracking-tighter italic text-slate-900">Kloc-Express</span>
                      <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">Najszybsze klocki</span>
                  </div>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden lg:block flex-1 max-w-2xl">
                  <form onSubmit={handleSearch} className="relative group">
                      <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Czego szukasz? np. Star Wars, Porsche..." 
                          className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-full pl-5 pr-14 text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all"
                      />
                      <button type="submit" className="absolute right-2 top-1.5 h-9 w-9 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all">
                          <Search size={18} />
                      </button>
                  </form>
              </div>

              {/* Actions Icons */}
              <div className="flex items-center gap-1 sm:gap-4">
                  <Link to="/ulubione" className="hidden sm:flex flex-col items-center gap-1 group">
                      <div className="relative p-2 rounded-full group-hover:bg-red-50 transition-colors">
                          <Heart size={24} className={`transition-colors ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-slate-700 group-hover:text-red-500'}`} />
                          {wishlistCount > 0 && (
                              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                  {wishlistCount}
                              </span>
                          )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-red-600">Ulubione</span>
                  </Link>

                  <button className="hidden sm:flex flex-col items-center gap-1 group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                          <User size={24} className="text-slate-700 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-blue-600">Konto</span>
                  </button>

                  <Link to="/koszyk" className="flex flex-col items-center gap-1 group ml-1">
                      <div className="relative p-2 rounded-full group-hover:bg-yellow-50 transition-colors">
                          <ShoppingBag size={24} className="text-slate-700 group-hover:text-yellow-600 transition-colors" />
                          {cartCount > 0 && (
                              <span className="absolute top-0 right-0 w-5 h-5 bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                  {cartCount}
                              </span>
                          )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-yellow-600">
                          {cartTotal > 0 ? `${cartTotal.toFixed(0)} zł` : 'Koszyk'}
                      </span>
                  </Link>

                  {/* Mobile Menu Trigger (Standard) */}
                  <button 
                      className="md:hidden ml-2 p-2 text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                      {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
              </div>
          </div>

            {/* Standard Mobile Menu Dropdown (Inline) */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <MenuContent />
            </div>
        </div>

        {/* 3. NAVIGATION BAR (Desktop Only) */}
        <div className="hidden md:block bg-white border-b border-slate-100 relative z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              <nav className="flex items-center gap-8 text-sm font-bold tracking-wide">
                  <div className="group relative py-4">
                      <Link to="/produkty" className="flex items-center gap-1.5 text-slate-900 hover:text-orange-600 transition-colors uppercase">
                          <Package size={18} /> Kategorie <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300"/>
                      </Link>
                      
                      {/* Desktop Mega Menu */}
                      <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-2xl border border-slate-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 overflow-hidden">
                          <div className="p-2">
                              {CATEGORIES.map(cat => (
                                  <Link 
                                      key={cat.id} 
                                      to={`/produkty?category=${cat.slug}`} 
                                      className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                                  >
                                      {cat.name}
                                  </Link>
                              ))}
                              <div className="h-px bg-slate-100 my-2"></div>
                              <Link to="/produkty?filter=new" className="block px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-black">
                                  ✨ Nowości
                              </Link>
                              <Link to="/produkty?filter=promo" className="block px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-black">
                                  🔥 Promocje
                              </Link>
                              <Link to="/produkty" className="block px-4 py-3 bg-slate-50 text-slate-900 rounded-xl transition-colors font-bold mt-1 text-center border border-slate-100 hover:bg-slate-100">
                                  Wszystkie kategorie
                              </Link>
                          </div>
                      </div>
                  </div>

                  <Link to="/produkty?filter=new" className="text-slate-600 hover:text-slate-900 transition-colors py-4 uppercase relative group">
                    Nowości
                    <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link to="/produkty?filter=promo" className="text-slate-600 hover:text-red-600 transition-colors py-4 uppercase relative group">
                    Promocje
                    <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  
                  <Link to="/black-week" className="flex items-center gap-2 text-white bg-slate-900 px-5 py-2 rounded-full hover:bg-black hover:shadow-lg hover:shadow-yellow-400/20 transition-all uppercase text-xs ml-auto active:scale-95">
                      <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" /> Black Week
                  </Link>
              </nav>
          </div>
        </div>
      </header>
    </>
  );
};
