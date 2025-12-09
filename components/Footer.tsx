import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-600 flex items-center justify-center rounded-lg">
                    <Truck className="text-white" size={18} />
                </div>
                <span className="font-black text-xl tracking-tight text-white italic">Kloc-Express</span>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
               Twoje centrum logistyczne klocków LEGO. Oferujemy najszybszą dostawę w Polsce i profesjonalną obsługę każdego zamówienia.
             </p>
             <div className="flex gap-4 pt-2">
                <a href="#" className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-orange-600 transition-all"><Facebook size={18} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-orange-600 transition-all"><Instagram size={18} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-orange-600 transition-all"><Twitter size={18} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-orange-600 transition-all"><Youtube size={18} /></a>
             </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Oferta</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Nowości</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Bestellery</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Promocje</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Outlet</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Pomoc</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Status zamówienia</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Czas i koszt dostawy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Zwroty i reklamacje</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Regulamin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Centrala</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex gap-2"><span className="text-orange-500">Infolinia:</span> 800 123 456</li>
              <li className="flex gap-2"><span className="text-orange-500">Email:</span> bok@klocexpress.pl</li>
              <li className="pt-2 opacity-80">ul. Logistyczna 1<br/>Centrum Dystrybucyjne<br/>00-001 Warszawa</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>&copy; 2024 Kloc-Express. Wszystkie prawa zastrzeżone.</p>
          <p>LEGO® jest znakiem towarowym Grupy LEGO.</p>
        </div>
      </div>
    </footer>
  );
};