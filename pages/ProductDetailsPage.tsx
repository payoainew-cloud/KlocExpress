
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check, Truck, ShieldCheck, RefreshCcw, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch current product
        const { data: prodData, error: prodError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (prodError) throw prodError;
        
        const mappedProduct = mapProductFromDB(prodData);
        setProduct(mappedProduct);

        // Fetch related products (same category)
        const { data: relData } = await supabase
            .from('products')
            .select('*')
            .eq('category', mappedProduct.category)
            .neq('id', id)
            .limit(3);
        
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
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-red-600 w-12 h-12" />
        </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Nie znaleziono produktu</h2>
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Główna</Link>
        <span className="mx-2">/</span>
        <Link to={`/produkty?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Image */}
        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-100 relative">
            {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    -{Math.round(((product.previousPrice! - product.price) / product.previousPrice!) * 100)}%
                </div>
            )}
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto max-h-[600px] object-contain transform hover:scale-105 transition-transform duration-500"
            />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
            <div className="mb-4">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">{product.category}</span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
                
                <div className="flex gap-2">
                    {product.isNew && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOWOŚĆ</span>
                    )}
                    {product.isPromo && (
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">PROMOCJA</span>
                    )}
                </div>
            </div>

            <div className="mb-6">
                {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through decoration-red-500 decoration-2 mr-3">
                        {product.previousPrice!.toFixed(2)} zł
                    </span>
                )}
                <span className={`text-4xl font-black ${product.isBlackWeek ? 'text-yellow-500' : 'text-gray-900'}`}>
                    {product.price.toFixed(2)} zł
                </span>
            </div>

            <div className="prose text-gray-600 mb-8">
                <p className="text-lg leading-relaxed">{product.description}</p>
                <p className="mt-4">
                    Zestaw idealny dla fanów klocków LEGO. Gwarantuje godziny kreatywnej zabawy i satysfakcję z budowania. 
                    Wszystkie elementy wykonane są z najwyższą precyzją, co jest znakiem rozpoznawczym marki.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-200">
                <Button 
                    size="lg" 
                    className={`flex-1 flex items-center justify-center gap-2 text-lg ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={handleAddToCart}
                >
                    {isAdded ? (
                        <>
                            <Check size={24} /> Dodano do koszyka
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={24} /> Dodaj do koszyka
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-3">
                    <Truck className="text-blue-600" size={24} />
                    <span>Darmowa dostawa od 200 zł</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-blue-600" size={24} />
                    <span>Gwarancja oryginalności</span>
                </div>
                <div className="flex items-center gap-3">
                    <RefreshCcw className="text-blue-600" size={24} />
                    <span>30 dni na zwrot</span>
                </div>
            </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Zobacz również</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
      )}
    </div>
  );
};
