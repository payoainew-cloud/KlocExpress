
import React from 'react';
import { ShoppingCart, Heart, Check, Zap } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);
  const isBlackWeek = product.isBlackWeek;
  const hasDiscount = product.previousPrice && product.previousPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicked on button
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Base classes changes based on variant
  const cardClasses = isBlackWeek 
    ? "bg-gray-900 border-yellow-500/30 text-white hover:border-yellow-400 hover:shadow-yellow-500/20 shadow-lg"
    : "bg-white border-gray-200 text-gray-900 hover:shadow-xl";

  const textClasses = isBlackWeek ? "text-gray-100" : "text-gray-900";
  const subTextClasses = isBlackWeek ? "text-gray-400" : "text-gray-500";
  const priceClasses = isBlackWeek ? "text-yellow-400" : "text-gray-900";

  return (
    <div className={`group relative border rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col h-full ${cardClasses}`}>
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {isBlackWeek && (
            <span className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Zap size={12} fill="currentColor" /> Kumulacja
            </span>
        )}
        {product.isNew && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider w-fit">
            Nowość
          </span>
        )}
        {product.isPromo && !isBlackWeek && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider w-fit">
            Promocja
          </span>
        )}
      </div>

      {/* Image Container - Link to details */}
      <Link to={`/produkt/${product.id}`} className={`relative aspect-square overflow-hidden p-6 block ${isBlackWeek ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button 
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20 ${isBlackWeek ? 'bg-gray-900/80 text-gray-300 hover:text-red-500 hover:bg-gray-800' : 'bg-white/80 text-gray-400 hover:text-red-600 hover:bg-white'}`}
            onClick={(e) => e.preventDefault()}
        >
          <Heart size={20} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/produkty?category=${product.category}`} className={`text-sm mb-1 hover:text-blue-600 w-fit ${subTextClasses}`}>
            {product.category}
        </Link>
        <Link to={`/produkt/${product.id}`} className="block mb-2">
            <h3 className={`text-lg font-bold leading-tight group-hover:text-blue-600 transition-colors ${textClasses}`}>
            {product.name}
            </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className={`text-xs ${subTextClasses}`}>Cena</span>
            <div className="flex flex-wrap items-baseline gap-x-2">
              {hasDiscount && (
                <span className={`text-sm line-through decoration-red-500 decoration-1 ${isBlackWeek ? 'text-gray-500' : 'text-gray-400'}`}>
                  {product.previousPrice?.toFixed(2)} zł
                </span>
              )}
              <span className={`text-xl font-black ${priceClasses}`}>
                {product.price.toFixed(2)} zł
              </span>
            </div>
          </div>
          <Button 
            variant={isAdded ? "secondary" : "primary"} 
            size="sm" 
            className={`rounded-full !px-3 transition-all duration-300 ${isBlackWeek ? 'bg-yellow-400 text-black hover:bg-yellow-300' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};
