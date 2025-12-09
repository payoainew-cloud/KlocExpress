
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'LEGO Star Wars', slug: 'star-wars' },
  { id: '2', name: 'LEGO City', slug: 'city' },
  { id: '3', name: 'LEGO Technic', slug: 'technic' },
  { id: '4', name: 'LEGO Icons', slug: 'icons' },
  { id: '5', name: 'LEGO x Apple', slug: 'lego-apple' },
];

export const MOCK_PRODUCTS: Product[] = [
  // Star Wars
  {
    id: 'sw-1',
    name: 'Sokół Millennium',
    price: 3499.99,
    image: 'https://picsum.photos/id/101/600/600',
    category: 'LEGO Star Wars',
    isNew: true,
    description: 'Najbardziej kultowy statek w galaktyce.'
  },
  {
    id: 'sw-2',
    name: 'X-Wing Fighter',
    price: 239.99,
    image: 'https://picsum.photos/id/102/600/600',
    category: 'LEGO Star Wars',
    isPromo: true,
    description: 'Klasyczny myśliwiec Rebeliantów.'
  },
  {
    id: 'sw-3',
    name: 'Maszyna krocząca AT-AT',
    price: 799.99,
    image: 'https://picsum.photos/id/103/600/600',
    category: 'LEGO Star Wars',
    description: 'Potężna maszyna Imperium.'
  },
  // City
  {
    id: 'city-1',
    name: 'Posterunek Policji',
    price: 299.99,
    image: 'https://picsum.photos/id/104/600/600',
    category: 'LEGO City',
    isNew: true,
    description: 'Utrzymuj porządek w mieście.'
  },
  {
    id: 'city-2',
    name: 'Pociąg Pasażerski',
    price: 649.99,
    image: 'https://picsum.photos/id/106/600/600',
    category: 'LEGO City',
    description: 'Szybka podróż po mieście LEGO.'
  },
  {
    id: 'city-3',
    name: 'Remiza Strażacka',
    price: 349.99,
    image: 'https://picsum.photos/id/107/600/600',
    category: 'LEGO City',
    isPromo: true,
    description: 'Bądź gotowy na każdą akcję ratunkową.'
  },
  // Technic
  {
    id: 'tech-1',
    name: 'Ferrari Daytona SP3',
    price: 1899.99,
    image: 'https://picsum.photos/id/111/600/600',
    category: 'LEGO Technic',
    isNew: true,
    description: 'Supersamochód w skali 1:8.'
  },
  {
    id: 'tech-2',
    name: 'Buldożer Cat D11',
    price: 2199.99,
    image: 'https://picsum.photos/id/112/600/600',
    category: 'LEGO Technic',
    description: 'Zdalnie sterowany kolos budowlany.'
  },
  {
    id: 'tech-3',
    name: 'Ford Mustang Shelby',
    price: 229.99,
    image: 'https://picsum.photos/id/133/600/600',
    category: 'LEGO Technic',
    isPromo: true,
    description: 'Legenda amerykańskiej motoryzacji.'
  },
];