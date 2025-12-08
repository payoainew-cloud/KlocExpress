import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { supabase, mapProductFromDB } from '../lib/supabaseClient';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  // Inicjalizacja sesji i ładowanie koszyka
  useEffect(() => {
    let storedSession = localStorage.getItem('lego_store_session_id');
    if (!storedSession) {
      storedSession = crypto.randomUUID();
      localStorage.setItem('lego_store_session_id', storedSession);
    }
    setSessionId(storedSession);
    fetchCart(storedSession);
  }, []);

  const fetchCart = async (sid: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          product:products (*)
        `)
        .eq('session_id', sid);

      if (error) throw error;

      if (data) {
        const mappedItems: CartItem[] = data.map((item: any) => ({
          ...mapProductFromDB(item.product),
          quantity: item.quantity
        }));
        setItems(mappedItems);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    // Optimistic update
    const existing = items.find(item => item.id === product.id);
    let newItems;
    if (existing) {
        newItems = items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
        newItems = [...items, { ...product, quantity: 1 }];
    }
    setItems(newItems);

    // DB Update
    try {
        const { error } = await supabase
            .from('cart_items')
            .upsert({
                session_id: sessionId,
                product_id: product.id,
                quantity: existing ? existing.quantity + 1 : 1
            }, { onConflict: 'session_id, product_id' });
        
        if (error) throw error;
    } catch (err) {
        console.error("Error adding to cart:", err);
        // Revert on error could be implemented here
    }
  };

  const removeFromCart = async (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
    
    try {
        await supabase
            .from('cart_items')
            .delete()
            .eq('session_id', sessionId)
            .eq('product_id', productId);
    } catch (err) {
        console.error("Error removing from cart", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));

    try {
        await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('session_id', sessionId)
            .eq('product_id', productId);
    } catch (err) {
        console.error("Error updating quantity", err);
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
        await supabase
            .from('cart_items')
            .delete()
            .eq('session_id', sessionId);
    } catch (err) {
        console.error("Error clearing cart", err);
    }
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};