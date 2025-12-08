import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Snowflake, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SnowEffect } from './SnowEffect';

interface BlackWeekSectionProps {
  products: Product[];
}

export const BlackWeekSection: React.FC<BlackWeekSectionProps> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <SnowEffect />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black font-black px-4 py-1 rounded-full text-sm uppercase mb-4 animate-pulse">
                <Snowflake size={16} /> Edycja Zimowa 2025
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                BLACK WEEK <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">KUMULACJA</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Największe hity w najlepszych cenach. Poczuj magię świąt i zgarnij limitowane zestawy przed wszystkimi.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
            <Link to="/black-week">
                <button className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-black transition-all duration-200 bg-yellow-400 rounded-lg hover:bg-yellow-300 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-yellow-400">
                    <Gift className="mr-2" size={24} />
                    ZOBACZ PEŁNĄ OFERTĘ
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
        </div>
      </div>
    </section>
  );
};
