
import React from 'react';

interface PremiumSectionProps {
  onSubscribe: () => void;
  isPremium: boolean;
}

const PremiumSection: React.FC<PremiumSectionProps> = ({ onSubscribe, isPremium }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
          Yatırımlarınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Profesyonel</span> Araçlarla Yönetin
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto relative z-10">
          KriptoPusula Premium ile yapay zeka destekli analizlere, sınırsız alarmlara ve gelişmiş portföy araçlarına erişin.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4">
        {/* Free Plan */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 flex flex-col hover:border-gray-600 transition-colors relative overflow-hidden group">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-300 mb-2">Başlangıç</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">0</span>
              <span className="text-xl text-gray-400">TL / Ay</span>
            </div>
            <p className="text-gray-500 mt-4">Kripto dünyasına yeni başlayanlar için temel özellikler.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Canlı Piyasa Verileri
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Temel Portföy Takibi (Max 5 Varlık)
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Günlük Blog Tahminleri
            </li>
            <li className="flex items-center gap-3 text-gray-500 line-through decoration-gray-600">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Fiyat Alarmları
            </li>
            <li className="flex items-center gap-3 text-gray-500 line-through decoration-gray-600">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Gemini AI Detaylı Analiz
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl border border-gray-600 text-gray-300 font-medium hover:bg-gray-700 hover:text-white transition-all cursor-default">
            Mevcut Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-800 rounded-2xl border border-yellow-500/50 p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-yellow-500/10 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
            ÖNERİLEN
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-yellow-400 mb-2">Premium</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">99.90</span>
              <span className="text-xl text-gray-400">TL / Ay</span>
            </div>
            <p className="text-gray-400 mt-4">Profesyonel yatırımcılar için sınırsız erişim.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white">
              <div className="bg-yellow-500/20 p-1 rounded-full"><svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <span className="font-medium">Sınırsız Portföy Varlığı</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="bg-yellow-500/20 p-1 rounded-full"><svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <span className="font-medium">Sınırsız Fiyat Alarmı (Push Bildirim)</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="bg-yellow-500/20 p-1 rounded-full"><svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <span className="font-medium">Gemini AI Destekli Gelişmiş Analizler (Yakında)</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="bg-yellow-500/20 p-1 rounded-full"><svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <span className="font-medium">Pro Grafik & Teknik Göstergeler</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="bg-yellow-500/20 p-1 rounded-full"><svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <span className="font-medium">Öncelikli Destek</span>
            </li>
          </ul>

          <button 
            onClick={onSubscribe}
            disabled={isPremium}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              isPremium 
              ? 'bg-green-600 text-white cursor-default' 
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-yellow-500/20'
            }`}
          >
            {isPremium ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Şu Anki Planınız
              </>
            ) : (
              'Premium\'a Geç'
            )}
          </button>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-16">
          <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white text-center">Özellik Karşılaştırması</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-900/50">
                          <th className="p-4 text-gray-400 font-medium border-b border-gray-700 w-1/2">Özellik</th>
                          <th className="p-4 text-gray-400 font-medium border-b border-gray-700 text-center w-1/4">Başlangıç</th>
                          <th className="p-4 text-yellow-500 font-bold border-b border-gray-700 text-center w-1/4">Premium</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                      <tr>
                          <td className="p-4 text-gray-300">Piyasa Verileri</td>
                          <td className="p-4 text-center text-gray-400">Gecikmeli</td>
                          <td className="p-4 text-center text-green-400 font-medium">Canlı (Websocket)</td>
                      </tr>
                      <tr>
                          <td className="p-4 text-gray-300">Portföy Varlıkları</td>
                          <td className="p-4 text-center text-gray-400">Limitli (5 Adet)</td>
                          <td className="p-4 text-center text-green-400 font-medium">Sınırsız</td>
                      </tr>
                      <tr>
                          <td className="p-4 text-gray-300">Fiyat Alarmları</td>
                          <td className="p-4 text-center text-gray-500">-</td>
                          <td className="p-4 text-center text-green-400 font-medium">Sınırsız</td>
                      </tr>
                      <tr>
                          <td className="p-4 text-gray-300">Yapay Zeka (Gemini) Analizi</td>
                          <td className="p-4 text-center text-gray-500">-</td>
                          <td className="p-4 text-center text-yellow-400 font-medium">Yakında</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Sıkça Sorulan Sorular</h3>
          <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h4 className="font-bold text-white mb-2">İstediğim zaman iptal edebilir miyim?</h4>
                  <p className="text-gray-400 text-sm">Evet, Premium üyeliğinizi dilediğiniz zaman hesap ayarlarınızdan iptal edebilirsiniz. İptal ettiğinizde dönem sonuna kadar özelliklerden faydalanmaya devam edersiniz.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h4 className="font-bold text-white mb-2">Ödeme yöntemleri nelerdir?</h4>
                  <p className="text-gray-400 text-sm">Tüm kredi kartları (Visa, Mastercard, Amex) ve banka kartları ile güvenli ödeme yapabilirsiniz. Ödemeler iyzico güvencesiyle işlenir.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h4 className="font-bold text-white mb-2">AI Analizleri ne kadar güvenilir?</h4>
                  <p className="text-gray-400 text-sm">Gemini AI, piyasa verilerini ve trendleri analiz ederek öngörüler sunar. Ancak kripto piyasası volatildir ve bu analizler yatırım tavsiyesi niteliği taşımaz, sadece yardımcı araçlardır.</p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default PremiumSection;
