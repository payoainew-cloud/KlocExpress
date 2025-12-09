
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Smartphone, Zap, Laptop, Tablet } from 'lucide-react';
import { Button } from './Button';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';

export const AppleSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeasers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'LEGO x Apple')
          .limit(3);

        if (error) throw error;
        if (data) {
          setProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error("Error fetching apple teasers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeasers();
  }, []);

  // Helper to get icon based on name
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes('mac') || name.toLowerCase().includes('book')) return <Laptop className="w-12 h-12 text-gray-500 mb-6 group-hover:text-white transition-colors" />;
    if (name.toLowerCase().includes('ipad')) return <Tablet className="w-12 h-12 text-gray-500 mb-6 group-hover:text-white transition-colors" />;
    if (name.toLowerCase().includes('vision')) return <Zap className="w-12 h-12 text-gray-500 mb-6 group-hover:text-white transition-colors" />;
    return <Smartphone className="w-12 h-12 text-gray-500 mb-6 group-hover:text-white transition-colors" />;
  };

  return (
    <section className="relative w-full bg-black text-white overflow-hidden py-20 md:py-32">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo / Badge */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <Cpu size={32} className="text-gray-400" />
            <span className="text-2xl md:text-3xl font-medium tracking-tight text-gray-200">
              LEGO <span className="mx-2 text-gray-600">x</span> Apple
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 text-transparent bg-clip-text drop-shadow-sm">
            Think Brick.
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed">
            Ikoniczny design spotyka nieskończoną kreatywność. <br/>
            Przedstawiamy limitowaną kolekcję dla wizjonerów.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link to="/apple-zone">
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-lg font-medium tracking-wide">
                Zobacz kolekcję
              </Button>
            </Link>
            <Link to="/apple-zone" className="flex items-center justify-center px-8 py-4 text-lg text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Poznaj szczegóły <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Product Teasers (Fetched from DB) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {loading ? (
                // Simple skeleton loading
                [1, 2, 3].map(i => (
                    <div key={i} className="h-96 bg-gray-900/50 rounded-3xl animate-pulse"></div>
                ))
            ) : products.length > 0 ? (
                products.map((product) => (
                    <Link to={`/produkt/${product.id}`} key={product.id} className="group relative bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:bg-gray-900 transition-all duration-500 overflow-hidden text-left block">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {getIcon(product.name)}
                        
                        <h3 className="text-2xl font-bold mb-2 truncate">{product.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                        <div className="mt-8 relative h-40 flex items-center justify-center">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full object-contain mix-blend-screen opacity-80 group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                            />
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-3 text-gray-500">Wkrótce w sprzedaży...</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};