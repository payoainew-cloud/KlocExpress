
import React, { useEffect, useState, useRef } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Cpu, ChevronRight, Loader2, Smartphone, Monitor, ShoppingBag, Layers, Aperture } from 'lucide-react';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const AppleZonePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchAppleProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', 'LEGO x Apple');

                if (error) throw error;
                if (data) setProducts(data.map(mapProductFromDB));
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
        <div className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
            
            {/* --- Sticky Sub-Nav --- */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between text-xs md:text-sm">
                    <span className="font-bold text-gray-200">Apple x LEGO</span>
                    <div className="flex gap-4 md:gap-8 text-gray-400">
                        <a href="#overview" className="hover:text-white transition-colors">Przegląd</a>
                        <a href="#tech-specs" className="hover:text-white transition-colors">Dane techniczne</a>
                        <a href="#shop" className="text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-500 transition-colors">Kup teraz</a>
                    </div>
                </div>
            </div>

            {/* --- Hero Section --- */}
            <section id="overview" className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-900/20 via-purple-900/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 text-center space-y-6 animate-fade-in-up">
                    <div className="inline-block">
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-gradient-to-b from-gray-100 via-gray-300 to-gray-600 text-transparent bg-clip-text pb-2">
                            Titanium.
                        </h1>
                    </div>
                    <p className="text-2xl md:text-4xl font-medium text-gray-400 tracking-tight">
                        Tak silny. Tak lekki. Tak kanciasty.
                    </p>
                    <div className="pt-8 flex justify-center gap-4">
                        <Link to="#shop" className="text-blue-500 hover:text-blue-400 text-lg md:text-xl font-medium flex items-center gap-1 group">
                            Kup produkt <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>

                {/* Simulated Device Image */}
                <div className="mt-20 relative w-full max-w-4xl mx-auto aspect-[16/9] bg-gradient-to-b from-gray-900 to-black rounded-t-[3rem] border-t border-x border-gray-800 flex items-center justify-center overflow-hidden shadow-[0_-20px_60px_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <Cpu size={120} className="text-gray-800 animate-pulse" />
                </div>
            </section>

            {/* --- Feature 1: The Chip --- */}
            <section id="tech-specs" className="py-32 px-4 bg-zinc-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="w-64 h-64 md:w-96 md:h-96 mx-auto bg-black rounded-[2rem] border border-gray-800 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <Cpu size={120} className="text-gray-200 relative z-10" strokeWidth={1} />
                            <span className="absolute bottom-6 font-mono text-gray-500 text-sm">A19 BIONIC BRICK</span>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-100">
                            Czip A19 Pro. <br/>
                            <span className="text-gray-500">Potwór w klockach.</span>
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Najszybszy czip, jaki kiedykolwiek trafił do klocka LEGO.
                            Zapewnia wydajność nowej generacji w grach, renderowaniu instrukcji i łączeniu elementów.
                            Dzięki sprzętowemu wsparciu dla ray tracingu, klocki błyszczą jak nigdy dotąd.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Feature 2: Vision --- */}
            <section className="py-32 px-4 bg-black relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md text-white">
                        <Aperture size={40} />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Vision Brick.
                    </h2>
                    <p className="text-2xl md:text-3xl text-gray-400 font-medium max-w-3xl mx-auto">
                        Witamy w erze budowania przestrzennego.
                    </p>
                    <p className="mt-8 text-lg text-gray-500 max-w-2xl mx-auto">
                        Vision Brick łączy cyfrowe instrukcje z Twoim fizycznym biurkiem.
                        Nawiguj wzrokiem, łącz klocki gestami dłoni i używaj głosu, by znaleźć zagubiony element.
                    </p>
                </div>
                {/* Background effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 blur-[120px] pointer-events-none"></div>
            </section>

            {/* --- Shop Section --- */}
            <section id="shop" className="py-32 bg-zinc-900 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Który zestaw jest dla Ciebie?</h2>
                        <p className="text-xl text-gray-400">Porównaj modele i wybierz swój idealny iBrick.</p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {products.map(product => (
                                <div key={product.id} className="bg-black rounded-[2rem] p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 group flex flex-col">
                                    <div className="mb-8 relative aspect-square flex items-center justify-center bg-zinc-900/50 rounded-2xl overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-3/4 h-3/4 object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-300">New</span>
                                            {product.name.includes('Pro') && <span className="text-gray-500 text-xs font-bold">Pro Edition</span>}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <Cpu size={16} /> <span>Czip A19 Bionic Brick</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <Layers size={16} /> <span>Konstrukcja tytanowa</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <Smartphone size={16} /> <span>Dynamic Island (2x4)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-800">
                                        <span className="text-xl font-bold text-white">{product.price} zł</span>
                                        <Link to={`/produkt/${product.id}`}>
                                            <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6">
                                                Kup
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            Wszystkie zestawy wyprzedane. Sprawdź dostępność wkrótce.
                        </div>
                    )}
                </div>
            </section>

             {/* --- Footer Minimal --- */}
             <div className="py-12 bg-black text-center text-gray-600 text-xs border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 space-y-4">
                    <p>
                        1. 1 GB = 1 miliard bajtów; faktyczna pojemność sformatowanego nośnika jest mniejsza. 
                        Wydajność klocków zależy od wyobraźni użytkownika.
                    </p>
                    <p>
                        Ekran ma zaokrąglone rogi, które wpisują się w kształt regularnego prostokąta i podkreślają niezwykły design klocka. 
                    </p>
                    <p className="pt-4">Copyright © 2025 Kloc-Express & Apple Inc. Wszystkie prawa zastrzeżone.</p>
                </div>
            </div>
        </div>
    );
};
