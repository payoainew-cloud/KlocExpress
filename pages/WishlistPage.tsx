import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Loader2, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      // If no items in wishlist, just clear products and stop loading
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);

        if (error) throw error;

        if (data) {
          // Sort products to match the order in wishlist (newest added first if we reversed it, 
          // but here just keeping DB order or simple map)
          // For now, simple mapping is sufficient.
          setProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error('Error fetching wishlist products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-orange-600 w-12 h-12" />
        </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 rounded-2xl p-10 max-w-md mx-auto flex flex-col items-center shadow-sm border border-red-100">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Heart className="text-red-400" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Twój schowek jest pusty</h2>
            <p className="text-slate-600 mb-8 font-medium">Dodaj produkty do ulubionych, aby wrócić do nich później i śledzić ich cenę.</p>
            <Button onClick={() => navigate('/produkty')} className="w-full justify-center">
                Przeglądaj produkty
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-100 rounded-2xl text-red-600">
            <Heart className="fill-red-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Ulubione produkty</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">Zapisane zestawy ({products.length})</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};