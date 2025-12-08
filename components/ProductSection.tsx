import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductSectionProps {
  title: string;
  products: Product[];
  categorySlug?: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ title, products, categorySlug }) => {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-sans">
          {title}
        </h2>
        <Link 
          to={`/produkty?category=${categorySlug}`} 
          className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors group"
        >
          Zobacz wszystkie
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid Requirement: 3 products per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link 
          to={`/produkty?category=${categorySlug}`} 
          className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors"
        >
          Zobacz wszystkie {title}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};
