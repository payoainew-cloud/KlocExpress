
import { createClient } from '@supabase/supabase-js';

// Dane wyciągnięte z dostarczonego tokena JWT
const PROJECT_REF = 'ltlgorpvkmeleaowzcge';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGdvcnB2a21lbGVhb3d6Y2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDcyMjUsImV4cCI6MjA4MDc4MzIyNX0.g1AxsOLNQysJiSyzgD-gaASxy-hW-MeDPR1LeRFy5dc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper do mapowania nazw kolumn z bazy (snake_case) na aplikację (camelCase)
export const mapProductFromDB = (dbProduct: any) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: Number(dbProduct.price),
  previousPrice: dbProduct.previous_price ? Number(dbProduct.previous_price) : undefined,
  image: dbProduct.image,
  category: dbProduct.category,
  isNew: dbProduct.is_new,
  isPromo: dbProduct.is_promo,
  isBlackWeek: dbProduct.is_black_week,
  description: dbProduct.description
});

export const mapBannerFromDB = (dbBanner: any) => ({
  id: dbBanner.id,
  subtitle: dbBanner.subtitle || '',
  titleMain: dbBanner.title_main || '',
  titleHighlight: dbBanner.title_highlight || '',
  description: dbBanner.description || '',
  imageUrl: dbBanner.image_url || '',
  buttonText: dbBanner.button_text || 'Sprawdź',
  buttonLink: dbBanner.button_link || '/produkty'
});
