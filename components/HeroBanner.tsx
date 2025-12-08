
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ArrowRight, Loader2 } from 'lucide-react';
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

  // Fallback content if DB is empty or loading failed (prevents empty white box)
  const content = banner || {
    subtitle: 'Nowa Kolekcja 2024',
    titleMain: 'Zbuduj Swoje',
    titleHighlight: 'Marzenia',
    description: 'Odkryj najnowsze zestawy LEGO® Star Wars™, City i Technic. Rozwiń swoją kreatywność bez granic.',
    imageUrl: 'https://picsum.photos/1920/1080',
    buttonText: 'Odkryj Nowości',
    buttonLink: '/produkty'
  };

  if (loading) {
      return (
        <div className="w-full h-[500px] md:h-[600px] bg-gray-900 flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400 w-12 h-12" />
        </div>
      );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ 
            backgroundImage: `url('${content.imageUrl}')`,
            filter: 'brightness(0.6)'
        }}
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center items-start">
        {content.subtitle && (
            <span className="bg-yellow-400 text-red-900 font-bold px-4 py-1 rounded-full mb-6 text-sm uppercase tracking-widest shadow-lg transform -rotate-2 animate-fade-in-up">
                {content.subtitle}
            </span>
        )}
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight max-w-3xl drop-shadow-lg">
          {content.titleMain} <br/>
          <span className="text-yellow-400">{content.titleHighlight}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={content.buttonLink}>
              <Button variant="primary" size="lg" className="shadow-yellow-500/20 w-full sm:w-auto">
                {content.buttonText} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </Link>
          <Link to="/produkty?filter=promo">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900 w-full sm:w-auto">
                Sprawdź Promocje
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
