
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Cpu, ChevronRight, Loader2 } from 'lucide-react';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';

export const AppleZonePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppleProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', 'LEGO x Apple');

                if (error) throw error;

                if (data) {
                    setProducts(data.map(mapProductFromDB));
                }
            } catch (err) {
                console.error('Error fetching Apple products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppleProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500 w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pb-20">
            
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50"></div>
                
                <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 text-gray-400 font-medium mb-6 tracking-wide">
                        <span>Zaprojektowane w Kalifornii</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>Zbudowane w Danii</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 text-white">
                        Pro. <br/>
                        <span className="text-gray-500">Beyond.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        Przedstawiamy wynik współpracy dwóch gigantów designu.
                        Kolekcja, która zmienia definicję tego, co można zbudować.
                    </p>

                    <div className="flex justify-center gap-6 text-sm font-bold text-blue-400">
                        <button className="flex items-center hover:underline">Obejrzyj film <ChevronRight size={16} /></button>
                        <button className="flex items-center hover:underline">O wydarzeniu <ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-3xl font-bold tracking-tight">Dostępne Modele</h2>
                    <span className="text-gray-500">Limitowana seria</span>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        Brak produktów w kolekcji Apple x LEGO.
                    </div>
                )}

                <div className="mt-20 p-12 bg-gray-900 rounded-3xl text-center border border-gray-800 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     <Cpu size={48} className="mx-auto text-gray-400 mb-6 relative z-10" />
                     <h3 className="text-4xl font-bold mb-4 relative z-10">LEGO Silicon.</h3>
                     <p className="text-gray-400 max-w-lg mx-auto relative z-10">
                        Każdy zestaw zawiera unikalny, kolekcjonerski klocek z grawerem czipu A19 Pro.
                        Dostępne tylko w oficjalnej dystrybucji Kloc-Express.
                     </p>
                </div>
            </div>

            {/* Footer Minimal */}
            <div className="max-w-7xl mx-auto px-4 mt-20 text-center text-gray-600 text-xs">
                <p>Copyright © 2025 Apple Inc. & LEGO Group. Wszystkie prawa zastrzeżone.</p>
                <p className="mt-2">iBrick, MacBrick, Vision Brick są znakami towarowymi wyobraźni naszych projektantów.</p>
            </div>
        </div>
    );
};