
import React, { useState, useEffect } from 'react';
import { SnowEffect } from '../components/SnowEffect';
import { Gift, Star, Snowflake, X, Copy, Check, Lock, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface OpenedDoor {
  day: number;
  discount: number;
  code: string;
}

export const AdventCalendarPage: React.FC = () => {
  const [openedDoors, setOpenedDoors] = useState<OpenedDoor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<OpenedDoor | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Logic: Get current date. 
  // For demo purposes, we use the current day of any month. 
  // In production, you would check: new Date().getMonth() === 11 (December)
  const todayDate = new Date().getDate(); 

  // Load state
  useEffect(() => {
    const saved = localStorage.getItem('lego_advent_state');
    if (saved) {
      setOpenedDoors(JSON.parse(saved));
    }
  }, []);

  const handleOpenDoor = (day: number) => {
    // 1. Check if locked (Future date)
    if (day > todayDate) {
        return; // Locked
    }

    // 2. Check if already opened
    const existing = openedDoors.find(d => d.day === day);
    if (existing) {
      setCurrentPrize(existing);
      setModalOpen(true);
      return;
    }

    // 3. Generate New Prize
    const discount = Math.floor(Math.random() * (90 - 50 + 1)) + 50; // 50% - 90%
    const codes = ['LEGO', 'XMAS', 'SANTA', 'GIFT', 'STAR', 'WINTER', 'ELF'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${randomCode}-${day}-${uniqueSuffix}`;

    const prize = { day, discount, code };
    
    // 4. Update State & Storage
    const updated = [...openedDoors, prize];
    setOpenedDoors(updated);
    localStorage.setItem('lego_advent_state', JSON.stringify(updated));

    // 5. Show Modal
    setCurrentPrize(prize);
    setModalOpen(true);
  };

  const copyToClipboard = () => {
    if (currentPrize) {
      navigator.clipboard.writeText(currentPrize.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const useInCart = () => {
      if (currentPrize) {
          // Set a temporary flag for the cart to auto-apply
          localStorage.setItem('auto_apply_promo', currentPrize.code);
          navigate('/koszyk');
      }
  };

  return (
    <div className="min-h-screen bg-[#0B1026] relative overflow-x-hidden font-sans selection:bg-yellow-500 selection:text-black">
      {/* Custom Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a2342] via-[#0B1026] to-black pointer-events-none"></div>
      
      <SnowEffect />

      {/* --- Header Section --- */}
      <div className="relative pt-12 pb-8 text-center z-10 px-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black px-6 py-2 rounded-full text-xs md:text-sm uppercase mb-8 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-fade-in-up transform hover:scale-105 transition-transform cursor-default border border-yellow-300">
            <Gift size={18} />
            <span>Wielkie Świąteczne Rozdanie</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
            ADVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600">CALENDAR</span>
        </h1>
        
        <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-8">
            Codziennie nowe rabaty! Odkryj magiczne okienka i zgarnij zniżki <br className="hidden md:block"/>
            <span className="text-yellow-400 font-bold border-b-2 border-yellow-400">od 50% do nawet 90%</span> na zestawy LEGO®.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl">
             <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Twój Postęp
                </span>
                <span className="text-yellow-400 font-black text-lg">{openedDoors.length} <span className="text-slate-500 text-sm">/ 24</span></span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 relative overflow-hidden transition-all duration-1000 ease-out"
                    style={{ width: `${(openedDoors.length / 24) * 100}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        </div>
      </div>

      {/* --- Grid Section --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10 pb-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 perspective-container">
            {Array.from({ length: 24 }, (_, i) => i + 1).map((day) => {
                const isOpened = openedDoors.some(d => d.day === day);
                const isLocked = day > todayDate && !isOpened; // Lock logic
                const prize = openedDoors.find(d => d.day === day);

                return (
                    <div 
                        key={day}
                        onClick={() => !isLocked && handleOpenDoor(day)}
                        className={`
                            group relative aspect-[4/5] perspective-1000
                            ${isLocked ? 'cursor-not-allowed opacity-80 grayscale-[0.5]' : 'cursor-pointer'}
                        `}
                    >
                        <div 
                            className={`
                                relative w-full h-full transition-transform duration-700 transform-style-3d 
                                ${isOpened ? 'rotate-y-180' : isLocked ? '' : 'group-hover:scale-[1.02]'}
                            `}
                        >
                            {/* === FRONT SIDE (Closed Door) === */}
                            <div 
                                className={`
                                    absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xl border-2
                                    ${isLocked 
                                        ? 'bg-slate-800 border-slate-700' 
                                        : 'bg-gradient-to-b from-red-700 to-red-900 border-red-500 shadow-red-900/40'}
                                `}
                            >
                                {/* Texture/Pattern */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                
                                {/* Ribbon Horizontal */}
                                {!isLocked && <div className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 shadow-sm opacity-90"></div>}
                                {/* Ribbon Vertical */}
                                {!isLocked && <div className="absolute top-0 left-1/2 h-full w-8 -translate-x-1/2 bg-gradient-to-b from-yellow-600 via-yellow-400 to-yellow-600 shadow-sm opacity-90"></div>}

                                {/* Number Badge */}
                                <div className={`
                                    relative z-20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-serif text-2xl md:text-4xl font-black shadow-lg border-2
                                    ${isLocked 
                                        ? 'bg-slate-700 text-slate-500 border-slate-600' 
                                        : 'bg-white text-red-800 border-yellow-400'}
                                `}>
                                    {isLocked ? <Lock size={20} /> : day}
                                </div>

                                {/* Bottom Decoration */}
                                {!isLocked && (
                                    <div className="absolute bottom-3 text-yellow-200/50 text-[10px] uppercase tracking-widest font-bold">
                                        Kliknij
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute bottom-3 text-slate-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                                        Zablokowane
                                    </div>
                                )}
                            </div>

                            {/* === BACK SIDE (Opened Prize) === */}
                            <div 
                                className="absolute inset-0 backface-hidden bg-[#1a2342] rounded-2xl border-2 border-yellow-500/50 flex flex-col items-center justify-center rotate-y-180 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
                                
                                <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl mb-3 shadow-lg transform group-hover:scale-110 transition-transform relative z-10">
                                    <Gift size={28} className="text-white" />
                                </div>
                                
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Twój rabat</span>
                                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                    -{prize?.discount}%
                                </span>
                                
                                <div className="mt-4 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-yellow-400 font-mono text-xs font-bold tracking-wider opacity-80">
                                    {prize?.code.split('-')[0]}...
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* --- Prize Modal --- */}
      {modalOpen && currentPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300" onClick={() => setModalOpen(false)}></div>
            
            {/* Content */}
            <div className="relative bg-[#0F172A] rounded-[2rem] p-8 md:p-10 max-w-md w-full text-center shadow-2xl animate-scale-in border border-slate-700 overflow-hidden">
                {/* Glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-yellow-500/10 blur-[80px] pointer-events-none"></div>

                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20">
                    <X size={20} />
                </button>
                
                <div className="relative z-10">
                    <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(251,191,36,0.3)] rotate-3">
                         <Gift size={56} className="text-white drop-shadow-md" />
                         <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-[#0F172A] transform rotate-6 uppercase tracking-wider">
                            Dzień {currentPrize.day}
                         </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Gratulacje!</h2>
                    <p className="text-slate-400 mb-8 font-medium leading-relaxed">
                        Mikołaj jest hojny! Otrzymujesz potężny rabat na całe zamówienie LEGO®.
                    </p>

                    {/* Code Box */}
                    <div className="bg-black/40 border border-slate-700/50 rounded-2xl p-6 mb-8 relative group hover:border-yellow-500/30 transition-colors">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kod promocyjny</div>
                        <div className="flex items-end justify-center gap-2 mb-4">
                             <span className="text-6xl font-black text-white tracking-tighter">-{currentPrize.discount}</span>
                             <span className="text-2xl font-bold text-yellow-500 mb-2">%</span>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1 pr-2 border border-slate-700">
                            <div className="flex-1 font-mono font-bold text-lg text-yellow-400 tracking-wide py-2 text-center border-r border-slate-700">
                                {currentPrize.code}
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                                title="Skopiuj kod"
                            >
                                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={useInCart} className="w-full h-14 text-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 border-none shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            Użyj w koszyku <ArrowRight className="ml-2" />
                        </Button>
                        <button onClick={() => setModalOpen(false)} className="text-slate-500 font-bold text-sm hover:text-white transition-colors py-2">
                            Otwórz kolejne okienka
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};
