import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductSection } from '../components/ProductSection';
import { BlackWeekSection } from '../components/BlackWeekSection';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { Loader2, Truck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) {
          setProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const blackWeekProducts = products.filter(p => p.isBlackWeek);
  const starWarsProducts = products.filter(p => p.category === 'LEGO Star Wars' && !p.isBlackWeek);
  const cityProducts = products.filter(p => p.category === 'LEGO City' && !p.isBlackWeek);
  const technicProducts = products.filter(p => p.category === 'LEGO Technic' && !p.isBlackWeek);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="animate-spin text-orange-600 w-12 h-12" />
          </div>
      );
  }

  return (
    <main>
      <HeroBanner />
      
      {/* Black Week Section */}
      {blackWeekProducts.length > 0 && <BlackWeekSection products={blackWeekProducts} />}

      <div className="bg-white space-y-12 pb-16 pt-8">
        {starWarsProducts.length > 0 && (
            <>
                <ProductSection 
                title="LEGO Star Wars" 
                products={starWarsProducts} 
                categorySlug="star-wars"
                />
            </>
        )}

        <div className="max-w-7xl mx-auto px-4"><div className="h-px bg-slate-100"></div></div>

        {cityProducts.length > 0 && (
            <>
                <ProductSection 
                title="LEGO City" 
                products={cityProducts} 
                categorySlug="city"
                />
            </>
        )}

        <div className="max-w-7xl mx-auto px-4"><div className="h-px bg-slate-100"></div></div>

        {technicProducts.length > 0 && (
            <ProductSection 
            title="LEGO Technic" 
            products={technicProducts} 
            categorySlug="technic"
            />
        )}
      </div>

      {/* Newsletter Banner - Updated to Dark Theme */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-6">
                <Truck className="text-orange-500" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Dołącz do Kloc-Express VIP</h2>
            <p className="mb-8 text-slate-300 text-lg max-w-xl mx-auto">
                Bądź na bieżąco z premierami. Zapisz się do newslettera i odbierz <strong>darmową dostawę</strong> na pierwsze zamówienie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
               <input 
                  type="email" 
                  placeholder="Twój adres email" 
                  className="flex-1 px-5 py-3.5 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/50 placeholder-slate-400"
               />
               <button className="bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                  Zapisz się
               </button>
            </div>
         </div>
      </div>
    </main>
  );
};