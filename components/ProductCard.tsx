
import React from 'react';
import { ShoppingCart, Heart, Check, Zap, Sparkles, Flame, Snowflake } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = React.useState(false);
  
  const isBlackWeek = product.isBlackWeek;
  const hasDiscount = product.previousPrice && product.previousPrice > product.price;
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  // --- Styles Configuration ---
  
  // Container: Standard vs Black Week
  const containerClasses = isBlackWeek
    ? "bg-slate-900 border border-slate-700 shadow-xl shadow-black/40 hover:shadow-blue-900/20"
    : "bg-white border border-gray-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:border-gray-200";

  // Typography Colors
  const titleColor = isBlackWeek ? "text-white" : "text-slate-900";
  const categoryColor = isBlackWeek ? "text-blue-300" : "text-slate-500";
  const priceColor = isBlackWeek ? "text-yellow-400" : "text-slate-900";
  
  // Image Container & Winter Frame Logic
  const imageContainerBase = "relative aspect-[4/3] w-full overflow-hidden transition-all duration-500 block";
  const imageContainerStyle = isBlackWeek 
    ? "bg-slate-800 border-2 md:border-4 border-blue-200/20 shadow-[inset_0_0_20px_rgba(147,197,253,0.1)] rounded-t-2xl md:rounded-t-3xl" // Winter Frame
    : "bg-gray-50 rounded-t-2xl md:rounded-t-3xl"; // Standard

  return (
    <div className={`group relative rounded-2xl md:rounded-3xl flex flex-col h-full transition-all duration-500 hover:-translate-y-1.5 ${containerClasses}`}>
      
      {/* --- Image Section --- */}
      <div className="relative">
        <Link to={`/produkt/${product.id}`} className={imageContainerBase}>
            <div className={`w-full h-full p-4 md:p-6 flex items-center justify-center ${imageContainerStyle}`}>
                {/* Winter Decoration for Black Week */}
                {isBlackWeek && (
                    <>
                        <div className="absolute top-0 right-0 p-2 md:p-3 opacity-30 text-blue-200"><Snowflake size={16} className="md:w-6 md:h-6" /></div>
                        <div className="absolute inset-0 border border-white/10 rounded-[1rem] md:rounded-[1.2rem] pointer-events-none"></div>
                    </>
                )}
                
                <img
                    src={product.image}
                    alt={product.name}
                    className={`
                        w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-110
                        ${isBlackWeek ? 'drop-shadow-2xl' : 'mix-blend-multiply'} 
                    `}
                    loading="lazy"
                />
            </div>
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1.5 md:gap-2 items-start pointer-events-none">
          {isBlackWeek && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-black text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-lg shadow-yellow-400/20 border border-yellow-300">
              <Zap size={8} className="md:w-2.5 md:h-2.5" fill="currentColor" /> <span className="hidden xs:inline">Black Week</span>
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/80 backdrop-blur-md text-blue-600 border border-blue-100/50 text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={8} className="md:w-2.5 md:h-2.5" /> Nowość
            </span>
          )}
          {product.isPromo && !isBlackWeek && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/80 backdrop-blur-md text-orange-600 border border-orange-100/50 text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Flame size={8} className="md:w-2.5 md:h-2.5" /> Promocja
            </span>
          )}
        </div>

        {/* Wishlist Action */}
        <button 
          className={`
            absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 md:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm
            ${isLiked 
                ? 'bg-red-50 text-red-500 opacity-100 translate-x-0' 
                : 'bg-white/80 text-slate-400 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 hover:text-red-500 hover:bg-white'
            }
          `}
          onClick={handleToggleWishlist}
          title={isLiked ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        >
          <Heart size={14} className="md:w-4 md:h-4" fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* --- Content Section --- */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <Link 
            to={`/produkty?category=${product.category}`} 
            className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 transition-colors hover:opacity-80 truncate ${categoryColor}`}
        >
          {product.category}
        </Link>
        
        <Link to={`/produkt/${product.id}`} className="block mb-auto">
          <h3 className={`text-sm md:text-base font-bold leading-tight line-clamp-2 transition-colors ${titleColor}`}>
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="mt-3 md:mt-5 flex items-end justify-between gap-2">
          <div className="flex flex-col leading-none">
             {hasDiscount && (
                <span className={`text-[10px] md:text-xs font-bold line-through mb-0.5 md:mb-1 ${isBlackWeek ? 'text-slate-500' : 'text-slate-300'}`}>
                  {product.previousPrice?.toFixed(2)} zł
                </span>
             )}
             <div className={`text-base md:text-xl font-black tracking-tighter ${priceColor}`}>
               {product.price.toFixed(0)}<span className="text-xs md:text-sm">.{(product.price % 1).toFixed(2).substring(2)}</span> <span className="text-[10px] md:text-xs font-bold opacity-60">zł</span>
             </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`
                h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-md hover:scale-110 active:scale-95 shrink-0
                ${isAdded 
                    ? 'bg-green-500 text-white shadow-green-500/30' 
                    : isBlackWeek 
                        ? 'bg-yellow-400 text-black hover:bg-white hover:text-black shadow-yellow-500/20' 
                        : 'bg-slate-900 text-white hover:bg-orange-600 shadow-slate-900/20'
                }
            `}
          >
            {isAdded ? <Check size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3} /> : <ShoppingCart size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
};
