import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Rocket } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-sm">
                    <Rocket className="text-red-600" size={20} />
                </div>
                <span className="font-black text-xl tracking-tight">KlockiŚwiat</span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
               Najlepszy sklep z klockami LEGO w Polsce. Pasja, kreatywność i zabawa dla małych i dużych.
             </p>
             <div className="flex gap-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
             </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-400">Sklep</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Nowości</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bestellery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Promocje</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karty podarunkowe</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-400">Informacje</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">O nas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dostawa i płatność</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zwroty i reklamacje</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Regulamin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Polityka prywatności</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-400">Kontakt</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>infolinia: 800 123 456</li>
              <li>pn-pt: 8:00 - 18:00</li>
              <li>email: kontakt@klockiswiat.pl</li>
              <li className="pt-2">ul. Klockowa 12/4<br/>00-999 Warszawa</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; 2024 KlockiŚwiat. Wszelkie prawa zastrzeżone.</p>
          <p>LEGO® jest znakiem towarowym Grupy LEGO.</p>
        </div>
      </div>
    </footer>
  );
};
