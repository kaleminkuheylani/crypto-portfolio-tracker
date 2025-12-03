
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  price: string;
  onOpenPrivacy: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, price, onOpenPrivacy }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ödeme işlemini simüle et (2 saniye bekle)
    setTimeout(() => {
        setLoading(false);
        onSuccess();
    }, 2000);
  };

  // Basit formatlama
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.replace(/(.{4})/g, '$1 ').trim();
      setCardNumber(val.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      setExpiry(val.substring(0, 5));
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Ödeme Yap</h2>
                <div className="text-xl font-bold text-yellow-500">{price} ₺</div>
            </div>

            <div className="flex gap-2 mb-6">
                <div className="bg-gray-700 h-8 w-12 rounded flex items-center justify-center text-xs font-bold text-gray-400">VISA</div>
                <div className="bg-gray-700 h-8 w-12 rounded flex items-center justify-center text-xs font-bold text-gray-400">MC</div>
                <div className="bg-gray-700 h-8 w-12 rounded flex items-center justify-center text-xs font-bold text-gray-400">AMEX</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Kart Sahibi</label>
                    <input 
                        type="text" 
                        placeholder="Ad Soyad"
                        value={holderName}
                        onChange={e => setHolderName(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Kart Numarası</label>
                    <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 font-mono"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">SKT</label>
                        <input 
                            type="text" 
                            placeholder="AA/YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 text-center"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">CVV</label>
                        <input 
                            type="text" 
                            placeholder="123"
                            maxLength={4}
                            value={cvv}
                            onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 text-center"
                            required
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                İşleniyor...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                {price} ₺ Öde
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center mt-4">
                    <button type="button" onClick={onOpenPrivacy} className="text-xs text-gray-500 hover:text-gray-300 underline">
                        Gizlilik Politikası ve Güvenli Ödeme
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
