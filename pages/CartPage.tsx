
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, ArrowRight, TrendingDown, Gift, Truck, Tag, ShieldCheck, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // --- Local State for New Features ---
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- Constants ---
  const FREE_SHIPPING_THRESHOLD = 500;
  const GIFT_WRAP_PRICE = 19.99;
  const SHIPPING_COST = 15.00;

  // --- Calculations ---
  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const missingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const shippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  
  const finalTotal = Math.max(0, cartTotal + (isGiftWrapped ? GIFT_WRAP_PRICE : 0) + shippingCost - appliedDiscount);

  // --- Effects ---
  // Auto-apply code from Advent Calendar or other sources
  useEffect(() => {
    const autoCode = localStorage.getItem('auto_apply_promo');
    if (autoCode) {
        setPromoCode(autoCode);
        validatePromoCode(autoCode);
        localStorage.removeItem('auto_apply_promo'); // Clear after applying
    }
  }, [cartTotal]); // Re-run if cart total changes (to recalculate % based discount)

  // --- Handlers ---
  const validatePromoCode = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    setPromoError('');
    setSuccessMsg('');
    setAppliedDiscount(0);

    // 1. Standard Static Codes
    if (normalizedCode === 'LEGO') {
        setAppliedDiscount(cartTotal * 0.1); // 10% off
        setSuccessMsg('Kod LEGO aktywny: -10%');
        return;
    }

    // 2. Advent Calendar Dynamic Codes
    const adventState = localStorage.getItem('lego_advent_state');
    if (adventState) {
        try {
            const unlockedPrizes = JSON.parse(adventState);
            // Find if the code exists in the user's unlocked prizes
            const validPrize = unlockedPrizes.find((p: any) => p.code === normalizedCode || p.code === code); // Check both cases
            
            if (validPrize) {
                const discountAmount = cartTotal * (validPrize.discount / 100);
                setAppliedDiscount(discountAmount);
                setSuccessMsg(`Kod z Kalendarza (${normalizedCode}): -${validPrize.discount}%`);
                return;
            }
        } catch (e) {
            console.error("Error parsing advent state", e);
        }
    }

    // Invalid
    setPromoError('Nieprawidłowy kod rabatowy lub kod wygasł.');
  };

  const handleApplyPromo = () => {
      validatePromoCode(promoCode);
  };

  const handleMoveToWishlist = (product: any) => {
    if (!isInWishlist(product.id)) {
        toggleWishlist(product.id);
    }
    removeFromCart(product.id);
  };

  // --- Empty State ---
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Truck className="text-slate-300" size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Twój koszyk jest pusty</h2>
            <p className="text-slate-500 mb-8 font-medium">Nie wybrałeś jeszcze żadnych zestawów. Sprawdź nasze nowości i promocje!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={() => navigate('/produkty?filter=new')} variant="primary">
                    Zobacz Nowości
                </Button>
                <Button onClick={() => navigate('/produkty?filter=promo')} variant="outline">
                    Przeglądaj Promocje
                </Button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">Twój Koszyk <span className="text-slate-400 text-lg font-bold ml-2">({items.length} prod.)</span></h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-start">
            
            {/* --- LEFT COLUMN: Items & Options --- */}
            <div className="flex-1 w-full space-y-4 md:space-y-6">
                
                {/* 1. Free Shipping Progress Bar */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                            <div className="flex items-center gap-3 text-green-600 mb-2">
                                <div className="p-1.5 bg-green-100 rounded-full"><CheckCircle2 size={18} /></div>
                                <span className="font-bold text-sm uppercase tracking-wide">Darmowa dostawa odblokowana!</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-slate-600">
                                    Brakuje <span className="text-slate-900 font-black">{missingForFreeShipping.toFixed(2)} zł</span> do darmowej dostawy
                                </span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Próg: {FREE_SHIPPING_THRESHOLD} zł</span>
                            </div>
                        )}
                        
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${cartTotal >= FREE_SHIPPING_THRESHOLD ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
                                style={{ width: `${shippingProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 2. Cart Items List */}
                <div className="space-y-3 md:space-y-4">
                    {items.map((item) => {
                        const hasDiscount = item.previousPrice && item.previousPrice > item.price;
                        return (
                            <div key={item.id} className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* Image */}
                                <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center p-2 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{item.category}</span>
                                                {item.quantity >= 3 && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Bestseller</span>}
                                            </div>
                                            <Link to={`/produkt/${item.id}`} className="font-black text-lg text-slate-900 leading-tight hover:text-orange-600 transition-colors">
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-green-600">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Dostępny - wysyłka 24h
                                            </div>
                                        </div>
                                        
                                        {/* Price Single (Hidden on Mobile) */}
                                        <div className="hidden sm:block text-right">
                                            {hasDiscount && <div className="text-xs text-slate-400 line-through font-medium">{item.previousPrice?.toFixed(2)} zł</div>}
                                            <div className="font-bold text-slate-900">{item.price.toFixed(2)} zł</div>
                                        </div>
                                    </div>

                                    {/* Controls Row */}
                                    <div className="flex items-center justify-between mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                                        <div className="flex items-center gap-4">
                                            {/* Qty Stepper */}
                                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 shadow-sm hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>
                                                <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 shadow-sm hover:bg-green-50 hover:text-green-500 transition-colors"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                            
                                            {/* Secondary Actions */}
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => handleMoveToWishlist(item)}
                                                    className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                                                    title="Przenieś do ulubionych"
                                                >
                                                    <Heart size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Usuń z koszyka"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Price for Item */}
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 font-bold block sm:hidden mb-0.5">Suma:</span>
                                            <span className="font-black text-lg md:text-xl text-slate-900">{(item.price * item.quantity).toFixed(2)} zł</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Link to="/produkty" className="inline-flex items-center font-bold text-slate-500 hover:text-slate-900 transition-colors mt-4">
                    <ArrowLeft size={18} className="mr-2" /> Kontynuuj zakupy
                </Link>
            </div>

            {/* --- RIGHT COLUMN: Summary Sidebar --- */}
            <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-32 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h3 className="font-black text-xl text-slate-900 mb-6">Podsumowanie</h3>

                    {/* Promo Code */}
                    <div className="mb-6">
                        <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wide">Kod rabatowy</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Np. LEGO"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-yellow-400 transition-colors uppercase placeholder:normal-case"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                />
                            </div>
                            <button 
                                onClick={handleApplyPromo}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                            >
                                Użyj
                            </button>
                        </div>
                        {successMsg && <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1 animate-fade-in"><CheckCircle2 size={12}/> {successMsg}</p>}
                        {promoError && <p className="text-xs text-red-500 font-bold mt-2 animate-pulse">{promoError}</p>}
                    </div>

                    {/* Gift Option */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-6 cursor-pointer hover:border-yellow-300 transition-colors" onClick={() => setIsGiftWrapped(!isGiftWrapped)}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isGiftWrapped ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-400'}`}>
                                <Gift size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">Zapakuj na prezent</p>
                                <p className="text-xs text-slate-500">+ {GIFT_WRAP_PRICE} zł</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isGiftWrapped ? 'bg-green-500' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${isGiftWrapped ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    {/* Costs Breakdown */}
                    <div className="space-y-3 pb-6 border-b border-slate-100 mb-6">
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>Wartość produktów</span>
                            <span className="font-bold">{cartTotal.toFixed(2)} zł</span>
                        </div>
                        {isGiftWrapped && (
                             <div className="flex justify-between text-slate-600 text-sm">
                                <span>Pakowanie na prezent</span>
                                <span className="font-bold">{GIFT_WRAP_PRICE} zł</span>
                            </div>
                        )}
                        {appliedDiscount > 0 && (
                             <div className="flex justify-between text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                                <span className="font-bold">Rabat</span>
                                <span className="font-bold">-{appliedDiscount.toFixed(2)} zł</span>
                            </div>
                        )}
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>Koszt dostawy</span>
                            {shippingCost === 0 ? (
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Gratis</span>
                            ) : (
                                <span className="font-bold">{shippingCost.toFixed(2)} zł</span>
                            )}
                        </div>
                    </div>

                    {/* Total & Action */}
                    <div className="flex justify-between items-baseline mb-6">
                        <span className="text-lg font-bold text-slate-900">Do zapłaty</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tight">{finalTotal.toFixed(2)} <span className="text-base text-slate-400 font-bold">zł</span></span>
                    </div>

                    <Button onClick={() => navigate('/checkout')} className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-yellow-400/20" variant="primary">
                        Przejdź do dostawy <ArrowRight size={24} className="ml-2" />
                    </Button>

                    <p className="text-center text-xs text-slate-400 font-medium mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={14} /> Bezpieczne płatności SSL
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
