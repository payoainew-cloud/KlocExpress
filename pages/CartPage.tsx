import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, ArrowRight, TrendingDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  // Obliczanie oszczędności
  const totalSavings = items.reduce((acc, item) => {
    if (item.previousPrice && item.previousPrice > item.price) {
      return acc + ((item.previousPrice - item.price) * item.quantity);
    }
    return acc;
  }, 0);

  const regularPriceTotal = cartTotal + totalSavings;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-50 rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Twój koszyk jest pusty</h2>
            <p className="text-gray-600 mb-8">Wygląda na to, że nie dodałeś jeszcze żadnych klocków.</p>
            <Button onClick={() => navigate('/produkty')}>
                Rozpocznij zakupy
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Twój Koszyk</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="flex-1 space-y-4">
          {items.map((item) => {
             const hasItemDiscount = item.previousPrice && item.previousPrice > item.price;
             return (
            <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden">
              {hasItemDiscount && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                      PROMOCJA
                  </div>
              )}
              <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                        <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    {hasItemDiscount && (
                        <p className="text-xs text-gray-400 line-through">
                            {(item.previousPrice! * item.quantity).toFixed(2)} zł
                        </p>
                    )}
                    <p className={`font-black text-lg ${hasItemDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                        {(item.price * item.quantity).toFixed(2)} zł
                    </p>
                    {hasItemDiscount ? (
                         <p className="text-xs text-red-500 font-bold">
                            Oszczędzasz {((item.previousPrice! - item.price) * item.quantity).toFixed(2)} zł
                         </p>
                    ) : (
                        <p className="text-xs text-gray-500">{item.price.toFixed(2)} zł / szt.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
            <div className="bg-gray-50 p-6 rounded-xl sticky top-24 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Podsumowanie</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Wartość produktów</span>
                        <span className={totalSavings > 0 ? "line-through text-gray-400" : ""}>
                            {regularPriceTotal.toFixed(2)} zł
                        </span>
                    </div>
                    
                    {totalSavings > 0 && (
                        <div className="flex justify-between text-red-600 font-bold bg-red-100/50 p-2 rounded-lg items-center">
                            <span className="flex items-center gap-1"><TrendingDown size={16}/> Oszczędzasz</span>
                            <span>-{totalSavings.toFixed(2)} zł</span>
                        </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                        <span>Dostawa</span>
                        <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                </div>

                <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-4 mb-8">
                    <span>Do zapłaty</span>
                    <span>{cartTotal.toFixed(2)} zł</span>
                </div>

                <Link to="/checkout" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2" size="lg">
                        Przejdź do dostawy <ArrowRight size={20} />
                    </Button>
                </Link>
                
                <p className="mt-4 text-xs text-center text-gray-500">
                    Bezpieczne płatności SSL. 30 dni na zwrot.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};