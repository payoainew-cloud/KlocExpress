
export interface Product {
  id: string;
  name: string;
  price: number;
  previousPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isPromo?: boolean;
  isBlackWeek?: boolean;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Banner {
  id: string;
  subtitle: string;
  titleMain: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
