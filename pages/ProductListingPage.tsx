
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { SlidersHorizontal, X, Loader2, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '../components/Button';

export const ProductListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category');
  const filterType = searchParams.get('filter'); // 'new' or 'promo'

  // Data State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  
  // Category UI State
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) {
          setAllProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Initialize filters from URL
  useEffect(() => {
    if (categorySlug) {
      const cat = CATEGORIES.find(c => c.slug === categorySlug);
      if (cat) setSelectedCategories([cat.name]);
    } else {
        setSelectedCategories([]);
    }
  }, [categorySlug]);

  // Derive unique categories dynamically from the database products
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    // Add categories from constants first to ensure order/presence
    CATEGORIES.forEach(c => categories.add(c.name));
    // Add any extra categories found in DB
    allProducts.forEach(p => categories.add(p.category));
    return Array.from(categories).sort();
  }, [allProducts]);

  const displayedCategories = showAllCategories ? uniqueCategories : uniqueCategories.slice(0, 5);

  const filteredProducts = allProducts.filter(product => {
    // Text Search
    if (query && !product.name.toLowerCase().includes(query.toLowerCase()) && !product.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    // Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Special Filters (New/Promo)
    if (filterType === 'new' && !product.isNew) return false;
    if (filterType === 'promo' && !product.isPromo) return false;

    // Price Filter
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
            {query ? `Wyniki wyszukiwania: "${query}"` : 'Wszystkie Produkty'}
            </h1>
            <p className="text-gray-500 font-medium">
                {loading ? 'Ładowanie...' : `Znaleziono ${filteredProducts.length} produktów`}
            </p>
        </div>

        {/* Sorting Toolbar */}
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-bold hidden sm:block">Sortuj:</span>
            <div className="relative">
                <select 
                    className="appearance-none bg-gray-100 border-none text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-yellow-400 focus:bg-white block w-full p-2.5 pr-8 font-bold cursor-pointer transition-colors"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                >
                    <option value="default">Domyślnie</option>
                    <option value="asc">Cena: rosnąco</option>
                    <option value="desc">Cena: malejąco</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Button */}
        <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-lg font-bold shadow-md active:scale-95 transition-transform"
            onClick={() => setShowMobileFilters(true)}
        >
            <SlidersHorizontal size={20} /> Filtruj produkty
        </button>

        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-[60] bg-white p-6 overflow-y-auto transition-transform duration-300 lg:relative lg:inset-auto lg:translate-x-0 lg:w-72 lg:block lg:p-0 lg:z-0 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-black flex items-center gap-2"><Filter size={20}/> Filtry</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
          </div>

          <div className="space-y-8 pr-4 lg:border-r lg:border-gray-100 h-full">
            {/* Categories */}
            <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Kategorie</h3>
                <div className="space-y-3">
                    {displayedCategories.map(catName => (
                        <label key={catName} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors -ml-2">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(catName)}
                                    onChange={() => handleCategoryChange(catName)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-yellow-400 checked:bg-yellow-400 hover:border-yellow-400"
                                />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(catName) ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{catName}</span>
                        </label>
                    ))}
                    
                    {uniqueCategories.length > 5 && (
                        <button 
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 p-2"
                        >
                            {showAllCategories ? (
                                <>Pokaż mniej <ChevronUp size={16} /></>
                            ) : (
                                <>Pokaż wszystkie ({uniqueCategories.length}) <ChevronDown size={16} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Cena (PLN)</h3>
                <div className="flex items-center gap-2 mb-4">
                    <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                        className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-yellow-400 focus:outline-none transition-colors"
                        placeholder="Od"
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                        className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-yellow-400 focus:outline-none transition-colors"
                        placeholder="Do"
                    />
                </div>
                <input 
                    type="range" 
                    min="0" max="5000" step="50"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="flex justify-between text-xs text-gray-500 font-bold mt-2">
                    <span>0 zł</span>
                    <span>5000+ zł</span>
                </div>
            </div>
            
            <Button className="w-full lg:hidden bg-yellow-400 text-black font-black" onClick={() => setShowMobileFilters(false)}>
                Zastosuj filtry
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-red-600 w-10 h-10" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-500 font-bold mb-2">Nie znaleziono klocków</p>
                    <p className="text-gray-400 mb-6">Spróbuj zmienić kryteria wyszukiwania.</p>
                    <Button variant="outline" onClick={() => {
                        setPriceRange({min: 0, max: 5000});
                        setSelectedCategories([]);
                    }}>
                        Wyczyść filtry
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
