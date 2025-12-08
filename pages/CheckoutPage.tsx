import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { CheckCircle2, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Płatność przyjęta!</h2>
                <p className="text-gray-600 mb-8">Dziękujemy za zakupy w KlockiŚwiat. Twoje zamówienie #L12345 zostało przekazane do realizacji.</p>
                <Button onClick={() => navigate('/')} className="w-full">
                    Wróć do sklepu
                </Button>
            </div>
        </div>
    );
  }

  // Common input styles
  const inputClasses = "w-full p-3 bg-gray-100 border-2 border-transparent rounded-xl focus:bg-white focus:border-yellow-400 focus:outline-none transition-colors text-gray-900 font-medium placeholder-gray-400";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/koszyk')} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 font-bold transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Wróć do koszyka
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Forms */}
        <div>
           <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                    {step === 'details' ? 'Dane dostawy' : 'Płatność'}
                </h1>
                <p className="text-gray-500 font-medium">Krok {step === 'details' ? '1' : '2'} z 2</p>
           </div>

           {step === 'details' ? (
             <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Imię i Nazwisko</label>
                        <input 
                            required
                            placeholder="np. Jan Kowalski" 
                            className={inputClasses}
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Adres Email</label>
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
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Adres dostawy</label>
                        <input 
                            required
                            placeholder="Ulica i numer" 
                            className={inputClasses}
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Kod pocztowy</label>
                        <input 
                            required
                            placeholder="00-000" 
                            className={inputClasses}
                            value={formData.zip}
                            onChange={e => setFormData({...formData, zip: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Miasto</label>
                        <input 
                            required
                            placeholder="Miasto" 
                            className={inputClasses}
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full mt-6 shadow-lg shadow-yellow-400/20" size="lg">Przejdź do płatności</Button>
             </form>
           ) : (
             <div className="space-y-6">
                {/* BLIK Option */}
                <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${step === 'processing' ? 'opacity-50 pointer-events-none' : 'border-blue-600 bg-blue-50/50'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <span className="font-black text-gray-900 text-lg">BLIK</span>
                            </div>
                            <div className="font-bold text-gray-900">Szybka płatność</div>
                        </div>
                        <ShieldCheck className="text-blue-600" size={28} />
                    </div>
                    
                    {step === 'processing' ? (
                        <div className="flex flex-col items-center justify-center py-8">
                             <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
                             <p className="font-bold text-gray-900">Potwierdź w aplikacji banku</p>
                             <p className="text-sm text-gray-500">Czekamy na potwierdzenie płatności...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBlikPayment}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Wpisz kod BLIK</label>
                            <input 
                                autoFocus
                                type="text" 
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength={6}
                                placeholder="000 000"
                                className="w-full text-center text-3xl tracking-[0.5em] font-mono p-4 bg-white border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:outline-none mb-4 text-gray-900 transition-colors placeholder-gray-300"
                                value={blikCode}
                                onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, ''))}
                            />
                            <Button 
                                type="submit" 
                                className="w-full" 
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
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline w-full text-center transition-colors"
                    disabled={step === 'processing'}
                >
                    Zmień dane dostawy
                </button>
             </div>
           )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-gray-50 p-8 rounded-2xl h-fit border border-gray-100">
            <h3 className="font-black text-xl mb-6">Twoje zamówienie</h3>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Suma częściowa</span>
                <span className="font-bold">{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Dostawa</span>
                <span className="text-green-600 font-black bg-green-100 px-2 py-1 rounded text-sm">GRATIS</span>
            </div>
            <div className="flex justify-between items-center py-6">
                <span className="text-xl font-black">Razem</span>
                <span className="text-2xl font-black text-gray-900">{cartTotal.toFixed(2)} zł</span>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-100 rounded-xl text-sm text-yellow-900 border border-yellow-200 shadow-sm">
                <p className="flex items-center gap-2">
                    <span className="text-xl">⚡️</span>
                    <span>Zamów w ciągu <strong>2 godz. 15 min</strong>, a wyślemy dzisiaj!</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};