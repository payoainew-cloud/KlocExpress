import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { BlackWeekSection } from '../components/BlackWeekSection';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';
import { Product } from '../types';
import { Loader2, Truck, ShieldCheck, RefreshCw, ArrowRight, Package, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) {
          setProducts(data.map(mapProductFromDB));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const blackWeekProducts = products.filter(p => p.isBlackWeek);
  const starWarsProducts = products.filter(p => p.category === 'LEGO Star Wars' && !p.isBlackWeek);
  const cityProducts = products.filter(p => p.category === 'LEGO City' && !p.isBlackWeek);
  const technicProducts = products.filter(p => p.category === 'LEGO Technic' && !p.isBlackWeek);
  const newProducts = products.filter(p => p.isNew && !p.isBlackWeek).slice(0, 4);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="animate-spin text-orange-600 w-12 h-12" />
          </div>
      );
  }

  return (
    <main className="bg-slate-50/50">
      <HeroBanner />
      
      {/* Trust Badges Strip */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start group">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Wysyłka w 24h</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-[200px]">Zamów do 14:00, wyślemy dzisiaj.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Autoryzowany Sklep</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-[200px]">100% oryginalne zestawy LEGO®.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RefreshCw size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">30 dni na zwrot</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-[200px]">Bezproblemowy zwrot towaru.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Black Week Section */}
      {blackWeekProducts.length > 0 && <BlackWeekSection products={blackWeekProducts} />}

      {/* Category Visual Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 text-center tracking-tight">Odkryj światy LEGO®</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
             {[
                { name: 'Star Wars', slug: 'star-wars', color: 'bg-slate-900', img: 'https://picsum.photos/id/101/400/400' },
                { name: 'City', slug: 'city', color: 'bg-blue-600', img: 'https://picsum.photos/id/104/400/400' },
                { name: 'Technic', slug: 'technic', color: 'bg-orange-600', img: 'https://picsum.photos/id/111/400/400' },
                { name: 'Icons', slug: 'icons', color: 'bg-pink-600', img: 'https://picsum.photos/id/102/400/400' },
             ].map((cat) => (
                <Link key={cat.slug} to={`/produkty?category=${cat.slug}`} className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gray-200">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80`}></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="font-black text-2xl uppercase tracking-wider mb-1">{cat.name}</h3>
                        <span className="text-sm font-bold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                            Zobacz produkty <ArrowRight size={16} />
                        </span>
                    </div>
                </Link>
             ))}
        </div>
      </section>

      {/* New Arrivals Horizontal Scroll */}
      <section className="py-12 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Star className="text-yellow-400 fill-yellow-400" /> Nowości w ofercie
                    </h2>
                  </div>
                  <Link to="/produkty?filter=new" className="text-slate-500 font-bold hover:text-slate-900 flex items-center gap-1 transition-colors">
                      Wszystkie nowości <ArrowRight size={18} />
                  </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
          </div>
      </section>

      {/* Featured Sections (Split Layouts) */}
      <div className="space-y-0">
        
        {/* Star Wars Section */}
        {starWarsProducts.length > 0 && (
            <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                        {/* Description Side */}
                        <div className="lg:w-1/3 lg:sticky lg:top-32">
                            <span className="text-blue-400 font-black uppercase tracking-widest text-sm mb-4 block">Bestsellery</span>
                            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-none">
                                Galaktyka <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Star Wars™</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Przeżyj na nowo kultowe sceny z sagi Gwiezdnych Wojen. Od Sokoła Millennium po imperialne niszczyciele. Niech Moc będzie z Tobą.
                            </p>
                            <Link to="/produkty?category=star-wars">
                                <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wide hover:bg-blue-400 hover:text-white transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 group">
                                    Przeglądaj Serię <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                        {/* Products Grid Side */}
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {starWarsProducts.slice(0, 4).map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* City Section */}
        {cityProducts.length > 0 && (
            <section className="py-20 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-start">
                         {/* Description Side */}
                         <div className="lg:w-1/3 lg:sticky lg:top-32 text-right lg:text-right">
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4 block">Dla konstruktorów</span>
                            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-none text-slate-900">
                                Twoje Miasto <br/><span className="text-blue-600">LEGO® City</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed ml-auto">
                                Buduj, ratuj i odkrywaj. Seria City to nieskończone możliwości tworzenia własnych historii w tętniącej życiem metropolii.
                            </p>
                            <Link to="/produkty?category=city" className="inline-block">
                                <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-wide hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 group ml-auto">
                                    Zbuduj Miasto <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                        {/* Products Grid Side */}
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cityProducts.slice(0, 4).map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )}

         {/* Technic Section */}
         {technicProducts.length > 0 && (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                         {/* Description Side */}
                         <div className="lg:w-1/3 lg:sticky lg:top-32">
                            <span className="text-orange-600 font-black uppercase tracking-widest text-sm mb-4 block">Inżynieria</span>
                            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-none text-slate-900">
                                Zaawansowane <br/><span className="text-orange-500">Technic</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Modele z prawdziwymi mechanizmami. Skrzynie biegów, silniki, pneumatyka. Wyzwanie dla prawdziwych fanów motoryzacji.
                            </p>
                            <Link to="/produkty?category=technic">
                                <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                                    Uruchom Silniki <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                        {/* Products Grid Side */}
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {technicProducts.slice(0, 4).map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )}
      </div>

      {/* Newsletter Banner - Updated to fit theme */}
      <div className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden mt-8">
         <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl mb-8 shadow-lg">
                <Zap className="text-yellow-400 fill-yellow-400" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Dołącz do Kloc-Express VIP</h2>
            <p className="mb-10 text-slate-300 text-lg leading-relaxed">
                Bądź na bieżąco z premierami i promocjami. Zapisz się do newslettera i odbierz <strong>kod na darmową dostawę</strong> przy pierwszym zamówieniu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
               <input 
                  type="email" 
                  placeholder="Twój adres email..." 
                  className="flex-1 px-6 py-4 rounded-xl bg-transparent text-white font-medium focus:outline-none placeholder-slate-400"
               />
               <button className="bg-yellow-400 text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg active:scale-95 whitespace-nowrap">
                  Odbierz Kod
               </button>
            </div>
         </div>
      </div>
    </main>
  );
};