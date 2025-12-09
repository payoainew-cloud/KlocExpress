import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ArrowRight, Loader2, Truck } from 'lucide-react';
import { supabase, mapBannerFromDB } from '../lib/supabaseClient';
import { Banner } from '../types';
import { Link } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
             console.error('Error fetching banner:', error);
        }

        if (data) {
          setBanner(mapBannerFromDB(data));
        }
      } catch (err) {
        console.error('Unexpected error fetching banner:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Fallback content updated for Kloc-Express
  const content = banner || {
    subtitle: 'Ekspresowa Dostawa 24h',
    titleMain: 'Kloc-Express',
    titleHighlight: 'Buduj Szybciej',
    description: 'Największy wybór klocków LEGO® z błyskawiczną wysyłką. Zamów do 14:00, wyślemy dzisiaj! Star Wars, City, Technic i więcej.',
    imageUrl: 'https://picsum.photos/1920/1080',
    buttonText: 'Rozpocznij zakupy',
    buttonLink: '/produkty'
  };

  if (loading) {
      return (
        <div className="w-full h-[500px] md:h-[600px] bg-slate-900 flex items-center justify-center">
            <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
        </div>
      );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ 
            backgroundImage: `url('${content.imageUrl}')`,
            filter: 'brightness(0.5) saturate(1.1)'
        }}
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent opacity-95"></div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center items-start">
        {content.subtitle && (
            <span className="bg-orange-600 text-white font-black px-4 py-1.5 rounded-r-full border-l-4 border-yellow-400 mb-6 text-sm uppercase tracking-widest shadow-lg flex items-center gap-2 animate-fade-in-up">
                <Truck size={16} /> {content.subtitle}
            </span>
        )}
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight max-w-3xl drop-shadow-2xl">
          {content.titleMain} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{content.titleHighlight}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed font-medium">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={content.buttonLink}>
              <Button variant="primary" size="lg" className="shadow-orange-500/20 w-full sm:w-auto bg-yellow-400 text-slate-900 hover:bg-yellow-300">
                {content.buttonText} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </Link>
          <Link to="/produkty?filter=promo">
              <Button variant="outline" size="lg" className="text-white border-2 border-slate-600 hover:border-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
                Sprawdź Promocje
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};