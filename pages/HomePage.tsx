import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductSection } from '../components/ProductSection';
import { BlackWeekSection } from '../components/BlackWeekSection';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

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
              <Loader2 className="animate-spin text-red-600 w-12 h-12" />
          </div>
      );
  }

  return (
    <main>
      <HeroBanner />
      
      {/* Black Week Section */}
      {blackWeekProducts.length > 0 && <BlackWeekSection products={blackWeekProducts} />}

      <div className="bg-yellow-50/50 space-y-8 pb-12">
        {starWarsProducts.length > 0 && (
            <>
                <ProductSection 
                title="LEGO Star Wars" 
                products={starWarsProducts} 
                categorySlug="star-wars"
                />
                <div className="max-w-7xl mx-auto px-4"><div className="h-px bg-gray-200"></div></div>
            </>
        )}

        {cityProducts.length > 0 && (
            <>
                <ProductSection 
                title="LEGO City" 
                products={cityProducts} 
                categorySlug="city"
                />
                <div className="max-w-7xl mx-auto px-4"><div className="h-px bg-gray-200"></div></div>
            </>
        )}

        {technicProducts.length > 0 && (
            <ProductSection 
            title="LEGO Technic" 
            products={technicProducts} 
            categorySlug="technic"
            />
        )}
      </div>

      {/* Newsletter Banner */}
      <div className="bg-blue-600 text-white py-16 px-4">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Dołącz do KlockoKlubu!</h2>
            <p className="mb-8 text-blue-100 text-lg">Zapisz się do newslettera i odbierz 10% rabatu na pierwsze zamówienie.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
               <input 
                  type="email" 
                  placeholder="Twój adres email" 
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-400"
               />
               <button className="bg-yellow-400 text-red-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                  Zapisz się
               </button>
            </div>
         </div>
      </div>
    </main>
  );
};
