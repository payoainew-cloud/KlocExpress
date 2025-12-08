import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { ProductCard } from '../components/ProductCard';
import { SnowEffect } from '../components/SnowEffect';
import { Loader2, Gift, Star } from 'lucide-react';

export const BlackWeekPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBWProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_black_week', true);

        if (error) throw error;
        if (data) {
          setProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error('Error fetching BW products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBWProducts();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400 w-12 h-12" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <SnowEffect />
      
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 px-4 text-center z-10 bg-gradient-to-b from-black to-gray-900">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            BLACK WEEK <br />
            <span className="text-yellow-400">KUMULACJA 2025</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Ekskluzywna oferta na wybrane zestawy LEGO®. Tylko teraz w specjalnych cenach i z limitowanym designem.
        </p>
        <div className="flex justify-center gap-8 text-yellow-500">
            <div className="flex flex-col items-center">
                <Gift size={32} className="mb-2" />
                <span className="text-sm font-bold">Idealne na prezent</span>
            </div>
            <div className="flex flex-col items-center">
                <Star size={32} className="mb-2" />
                <span className="text-sm font-bold">Limitowana edycja</span>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
        {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-400 py-20">
                <p>Przygotowujemy dla Ciebie najlepsze oferty. Wróć za chwilę!</p>
            </div>
        )}
      </div>
      
      {/* Footer Note */}
      <div className="text-center pb-16 pt-8 text-gray-500 text-sm relative z-10">
        * Promocja Kumulacja trwa do wyczerpania zapasów.
      </div>
    </div>
  );
};
