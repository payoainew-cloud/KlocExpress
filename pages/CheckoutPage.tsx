import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { CheckCircle2, ShieldCheck, Loader2, ArrowLeft, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CheckoutStep = 'details' | 'payment' | 'processing' | 'success';

export const CheckoutPage: React.FC = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [blikCode, setBlikCode] = useState('');
  
  // Simulation States
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleBlikPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blikCode.length !== 6) return;

    setStep('processing');
    
    // Simulate API call and Bank Confirmation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearCart();
    setStep('success');
  };

  if (step === 'success') {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Płatność przyjęta!</h2>
                <p className="text-slate-600 mb-8 font-medium">Dziękujemy za zakupy w Kloc-Express. Twoje zamówienie #KE-9921 zostało przekazane do magazynu.</p>
                <Button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Wróć do sklepu
                </Button>
            </div>
        </div>
    );
  }

  // Common input styles
  const inputClasses = "w-full p-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-yellow-400 focus:outline-none transition-colors text-slate-900 font-medium placeholder-slate-400";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/koszyk')} className="flex items-center text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Wróć do koszyka
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Forms */}
        <div>
           <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {step === 'details' ? 'Adres dostawy' : 'Bezpieczna płatność'}
                </h1>
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'details' ? 'bg-orange-600 text-white' : 'bg-green-500 text-white'}`}>1</span>
                    <div className="h-1 w-8 bg-slate-200"></div>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' || step === 'processing' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                </div>
           </div>

           {step === 'details' ? (
             <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1 tracking-wide">Imię i Nazwisko</label>
                        <input 
                            required
                            placeholder="np. Jan Kowalski" 
                            className={inputClasses}
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1 tracking-wide">Adres Email</label>
                        <input 
                            required
                            type="email"
                            placeholder="np. jan@example.com" 
                            className={inputClasses}
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1 tracking-wide">Ulica i numer</label>
                        <input 
                            required
                            placeholder="Adres dostawy" 
                            className={inputClasses}
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1 tracking-wide">Kod pocztowy</label>
                        <input 
                            required
                            placeholder="00-000" 
                            className={inputClasses}
                            value={formData.zip}
                            onChange={e => setFormData({...formData, zip: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1 tracking-wide">Miasto</label>
                        <input 
                            required
                            placeholder="Miasto" 
                            className={inputClasses}
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg" size="lg">Dalej: Płatność</Button>
             </form>
           ) : (
             <div className="space-y-6">
                {/* BLIK Option */}
                <div className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${step === 'processing' ? 'opacity-50 pointer-events-none' : 'border-slate-800 bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                                <span className="font-black text-slate-900 text-lg">BLIK</span>
                            </div>
                            <div className="font-bold text-slate-900">Szybki przelew</div>
                        </div>
                        <ShieldCheck className="text-green-600" size={28} />
                    </div>
                    
                    {step === 'processing' ? (
                        <div className="flex flex-col items-center justify-center py-8">
                             <Loader2 className="animate-spin w-12 h-12 text-orange-600 mb-4" />
                             <p className="font-bold text-slate-900">Potwierdź w aplikacji banku</p>
                             <p className="text-sm text-slate-500">Czekamy na sygnał z Twojego banku...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBlikPayment}>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide text-center">Wpisz kod BLIK</label>
                            <input 
                                autoFocus
                                type="text" 
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength={6}
                                placeholder="000 000"
                                className="w-full text-center text-4xl tracking-[0.2em] font-mono p-4 bg-white border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none mb-6 text-slate-900 transition-colors placeholder-slate-200"
                                value={blikCode}
                                onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, ''))}
                            />
                            <Button 
                                type="submit" 
                                className="w-full bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20" 
                                size="lg"
                                disabled={blikCode.length !== 6}
                            >
                                Zapłać {cartTotal.toFixed(2)} zł
                            </Button>
                        </form>
                    )}
                </div>
                
                <button 
                    onClick={() => setStep('details')}
                    className="text-sm font-medium text-slate-500 hover:text-orange-600 hover:underline w-full text-center transition-colors"
                    disabled={step === 'processing'}
                >
                    Zmień adres dostawy
                </button>
             </div>
           )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-slate-50 p-8 rounded-3xl h-fit border border-slate-200/60 sticky top-24">
            <h3 className="font-black text-xl mb-6 text-slate-900">Podsumowanie</h3>
            <div className="flex justify-between items-center py-4 border-b border-slate-200 border-dashed">
                <span className="text-slate-600 font-medium">Suma koszyka</span>
                <span className="font-bold text-slate-900">{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-slate-200 border-dashed">
                <span className="text-slate-600 font-medium">Kurier Express</span>
                <span className="text-green-600 font-black bg-green-100 px-2 py-1 rounded text-xs tracking-wide uppercase">GRATIS</span>
            </div>
            <div className="flex justify-between items-center py-6">
                <span className="text-xl font-black text-slate-900">Do zapłaty</span>
                <span className="text-3xl font-black text-orange-600">{cartTotal.toFixed(2)} zł</span>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-2xl text-sm text-yellow-900 border border-yellow-200 shadow-sm">
                <p className="flex items-start gap-3">
                    <Truck className="shrink-0 text-orange-600" size={20} />
                    <span className="leading-snug">Gwarancja <strong>Kloc-Express</strong>: Zamówienie opłacone teraz wyjedzie z magazynu w ciągu 2 godzin.</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};