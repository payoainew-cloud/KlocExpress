import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Check, Truck, ShieldCheck, RefreshCcw, Loader2, ArrowLeft, Star, Box, Ruler, Info, Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: prodData, error: prodError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (prodError) throw prodError;
        
        const mappedProduct = mapProductFromDB(prodData);
        setProduct(mappedProduct);

        const { data: relData } = await supabase
            .from('products')
            .select('*')
            .eq('category', mappedProduct.category)
            .neq('id', id)
            .limit(4);
        
        if (relData) {
            setRelatedProducts(relData.map(mapProductFromDB));
        }

      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-white">
            <Loader2 className="animate-spin text-orange-600 w-12 h-12" />
        </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black mb-6 text-slate-900">Nie znaleziono produktu</h2>
        <Button onClick={() => navigate('/produkty')}>Wróć do sklepu</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const hasDiscount = product.previousPrice && product.previousPrice > product.price;
  const isBlackWeek = product.isBlackWeek;
  const isLiked = isInWishlist(product.id);

  return (
    <div className="bg-white min-h-screen pb-20 selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation Bar */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-sm">
            <Link to="/produkty" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold">
                <ArrowLeft size={16} /> Sklep
            </Link>
            <span className="text-slate-300">/</span>
            <Link to={`/produkty?category=${product.category}`} className="text-slate-500 hover:text-slate-900 transition-colors font-semibold">
                {product.category}
            </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
            
            {/* --- Left: Immersive Image Section --- */}
            <div className="lg:col-span-7 sticky top-40">
                <div className={`relative aspect-square rounded-[2.5rem] overflow-hidden flex items-center justify-center group shadow-2xl shadow-slate-200/50 ${isBlackWeek ? 'bg-slate-900 border-4 border-slate-800' : 'bg-white border border-slate-100'}`}>
                    
                    {/* Background Radial Gradient - Studio Light Effect */}
                    <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isBlackWeek ? 'from-slate-800 via-slate-900 to-black opacity-80' : 'from-gray-50 via-white to-white opacity-100'}`}></div>
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-8 left-8 bg-black text-white text-lg font-black px-5 py-2.5 rounded-full z-10 shadow-xl">
                            -{Math.round(((product.previousPrice! - product.price) / product.previousPrice!) * 100)}%
                        </div>
                    )}
                    
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className={`relative w-4/5 h-4/5 object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 ${!isBlackWeek && 'mix-blend-multiply'}`}
                    />

                    {/* Zoom Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/5 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20">
                        Przybliż zdjęcie
                    </div>
                </div>
            </div>

            {/* --- Right: Editorial Details --- */}
            <div className="lg:col-span-5 flex flex-col pt-4">
                <div className="flex items-center gap-3 mb-6">
                    <Link to={`/produkty?category=${product.category}`} className="text-slate-500 font-bold text-xs uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
                        {product.category}
                    </Link>
                    {product.isNew && <span className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"><Star size={12} fill="currentColor" /> Nowość</span>}
                    {isBlackWeek && <span className="text-yellow-600 font-bold text-xs uppercase tracking-widest bg-yellow-100 px-3 py-1.5 rounded-full">Black Week</span>}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
                    {product.name}
                </h1>

                <div className="flex flex-col gap-2 mb-10 pb-10 border-b border-slate-100">
                    <div className="flex items-baseline gap-4">
                        <span className={`text-6xl font-black tracking-tighter ${isBlackWeek ? 'text-yellow-500' : 'text-slate-900'}`}>
                            {product.price.toFixed(0)}<span className="text-3xl">.{(product.price % 1).toFixed(2).substring(2)}</span> <span className="text-2xl font-bold text-slate-400">zł</span>
                        </span>
                    </div>
                    {hasDiscount && (
                        <div className="text-lg text-slate-400 font-medium flex items-center gap-2">
                            <span className="line-through">{product.previousPrice!.toFixed(2)} zł</span>
                            <span className="text-red-500 font-bold">Najniższa cena z 30 dni</span>
                        </div>
                    )}
                </div>

                <div className="space-y-6 mb-12">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">O produkcie</h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        {product.description}
                    </p>
                    
                    {/* Mock Specs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <Box className="text-slate-400 mt-1" size={20} />
                            <div>
                                <div className="font-bold text-slate-900">~1200 elementów</div>
                                <div className="text-xs text-slate-500">Duży zestaw</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <Ruler className="text-slate-400 mt-1" size={20} />
                            <div>
                                <div className="font-bold text-slate-900">Wiek 9+</div>
                                <div className="text-xs text-slate-500">Dla starszych</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto space-y-6">
                    <div className="flex gap-4">
                        <Button 
                            size="lg" 
                            className={`flex-1 h-16 text-xl rounded-full shadow-xl transition-all duration-300 transform active:scale-95 ${
                                isAdded 
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
                                : 'bg-slate-900 hover:bg-orange-600 text-white shadow-slate-900/20 hover:shadow-orange-600/30'
                            }`}
                            onClick={handleAddToCart}
                        >
                            {isAdded ? (
                                <span className="flex items-center gap-3"><Check size={28} strokeWidth={3} /> Dodano</span>
                            ) : (
                                <span className="flex items-center gap-3"><ShoppingCart size={28} /> Dodaj do koszyka</span>
                            )}
                        </Button>

                        <button 
                            className={`h-16 w-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isLiked 
                                ? 'border-red-200 bg-red-50 text-red-500' 
                                : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                            onClick={() => toggleWishlist(product.id)}
                            title={isLiked ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                        >
                            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-4">
                         <span className="flex items-center gap-2"><Truck size={16} className="text-green-500"/> Wysyłka 24h</span>
                         <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> Gwarancja oryginału</span>
                         <span className="flex items-center gap-2"><RefreshCcw size={16} className="text-orange-500"/> 30 dni na zwrot</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-100 my-24"></div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="space-y-12">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Zobacz również</h3>
                        <p className="text-slate-500 font-medium">Inne zestawy z kategorii {product.category}</p>
                    </div>
                    <Link to={`/produkty?category=${product.category}`} className="hidden sm:block text-slate-900 font-bold hover:text-orange-600 transition-colors">
                        Wszystkie produkty
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
