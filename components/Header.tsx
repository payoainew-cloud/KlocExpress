import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Truck, Zap, Heart } from 'lucide-react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const NAV_ITEMS = [
  { label: 'Kategorie', path: '/produkty' },
  { label: 'Nowości', path: '/produkty?filter=new' },
  { label: 'Promocje', path: '/produkty?filter=promo' },
  { label: 'Black Week', path: '/black-week', special: true },
  { label: 'Kontakt', path: '/kontakt' },
  { label: 'O nas', path: '/o-nas' }
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produkty?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-orange-600 text-white shadow-xl shadow-orange-900/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
             <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center rounded-lg shadow-md transform group-hover:-skew-x-12 transition-transform duration-300">
                <Truck className="text-orange-700" size={24} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col leading-none">
                <span className="font-black text-2xl tracking-tighter drop-shadow-sm italic">Kloc-Express</span>
                <span className="text-[10px] font-bold text-yellow-300 tracking-widest uppercase opacity-90">Szybka dostawa</span>
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all uppercase tracking-wide flex items-center gap-1 
                  ${item.special 
                    ? 'bg-slate-900 text-yellow-400 hover:bg-black shadow-md border border-yellow-500/30' 
                    : 'hover:bg-white/20 text-white'
                  }`}
              >
                {item.special && <Zap size={14} fill="currentColor" />}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group mr-2 h-10">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Znajdź zestaw..." 
                className="h-full w-56 bg-white text-slate-900 placeholder-slate-400 border-2 border-transparent rounded-full pl-4 pr-10 focus:border-yellow-400 focus:outline-none focus:w-64 transition-all duration-300 shadow-sm font-bold text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Wishlist Icon - Changed to Link */}
            <Link to="/ulubione" className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group hidden sm:block">
              <Heart size={24} className={wishlistCount > 0 ? "fill-white" : ""} />
              {wishlistCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-orange-900 text-xs font-black rounded-full flex items-center justify-center shadow-md">
                   {wishlistCount}
                 </span>
              )}
            </Link>

            <Link to="/koszyk" className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group">
              <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-orange-900 text-xs font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="p-2.5 hover:bg-white/20 rounded-full transition-colors hidden sm:block">
              <User size={24} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-600 border-t border-orange-500 absolute w-full shadow-2xl">
          <div className="px-4 py-6 space-y-4">
             {/* Search - Mobile */}
             <form onSubmit={handleSearch} className="relative mb-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..." 
                className="w-full h-12 bg-white text-slate-900 border-none rounded-xl pl-4 pr-12 shadow-sm font-bold"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  className={`block px-4 py-3 text-lg font-bold rounded-xl flex items-center gap-3 transition-colors ${
                    item.special 
                      ? 'bg-slate-900 text-yellow-400 border border-yellow-500/20' 
                      : 'hover:bg-orange-700 text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.special && <Zap size={20} />}
                  {item.label}
                </Link>
              ))}
               <Link 
                  to="/ulubione" 
                  className="block px-4 py-3 text-lg font-bold rounded-xl flex items-center gap-3 transition-colors hover:bg-orange-700 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={20} />
                  Ulubione ({wishlistCount})
                </Link>
            </div>
            
            <div className="pt-6 mt-4 border-t border-orange-500/30">
                <Button variant="secondary" className="w-full justify-center bg-white text-orange-600 hover:bg-orange-50 border-none shadow-md font-black">
                    Strefa Klienta
                </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};