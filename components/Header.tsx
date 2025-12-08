
import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Rocket, Zap } from 'lucide-react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produkty?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-red-600 text-white shadow-xl shadow-red-900/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
             <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center rounded-lg shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                <Rocket className="text-red-600" size={24} />
             </div>
             <span className="font-black text-2xl tracking-tight hidden sm:block drop-shadow-sm">KlockiŚwiat</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide flex items-center gap-1 
                  ${item.special 
                    ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300 shadow-sm' 
                    : 'hover:bg-white/10 text-white'
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
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group mr-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..." 
                className="h-10 w-48 bg-white text-gray-900 placeholder-gray-400 border-2 border-transparent rounded-full pl-4 pr-10 focus:border-yellow-400 focus:outline-none focus:w-64 transition-all duration-300 shadow-sm font-medium"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>

            <Link to="/koszyk" className="p-2 hover:bg-white/10 rounded-full transition-colors relative group">
              <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-red-600 text-xs font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <User size={24} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-red-600 border-t border-red-500 absolute w-full shadow-2xl">
          <div className="px-4 py-6 space-y-4">
             {/* Search - Mobile */}
             <form onSubmit={handleSearch} className="relative mb-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj zestawów..." 
                className="w-full h-12 bg-white text-gray-900 border-none rounded-lg pl-4 pr-12 shadow-sm font-medium"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                      ? 'bg-yellow-400 text-red-800' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.special && <Zap size={20} />}
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 mt-4 border-t border-red-500/30">
                <Button variant="secondary" className="w-full justify-center bg-white text-red-600 hover:bg-gray-100 border-none shadow-md font-black">
                    Zaloguj się
                </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
