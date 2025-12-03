
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto text-gray-300 pb-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden mb-8">
            <div className="h-48 bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">Hakkımızda</h2>
                    <p className="text-blue-400">Akıllı Veri, Doğru Yatırım</p>
                </div>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
                
                {/* Misyon */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </span>
                        Vizyonumuz
                    </h3>
                    <p className="leading-relaxed">
                        KriptoPusula, bireysel yatırımcıların en büyük sorunu olan "pahalı ve karmaşık veri" engelini aşmak için tasarlandı. Amacımız, aylık yüzlerce dolar ödenen kurumsal veri terminallerinin sunduğu kaliteyi, herkesin erişebileceği bir formatta sunmaktır.
                    </p>
                </section>

                {/* API ve Veri Altyapısı Karşılaştırması (GÜNCELLENDİ) */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 36v-3m-6 6h6m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </span>
                        Maliyet & Performans Analizi
                    </h3>
                    <p className="mb-6 text-gray-400">
                        Piyasadaki popüler ücretli API servislerini analiz ettik. KriptoPusula'nın kullandığı <strong>CoinPaprika + Binance</strong> mimarisi, aylık $12 altındaki tüm ücretli seçeneklerden daha kapsamlı veri sunar.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Coinlayer */}
                        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl relative">
                            <div className="text-sm font-bold text-gray-400 mb-2">Coinlayer (Standart)</div>
                            <div className="text-xl font-bold text-white mb-4">$9.99<span className="text-xs text-gray-500 font-normal">/ay</span></div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-yellow-500">
                                    <span>⚠</span> Orta seviye hız
                                </li>
                                <li className="flex items-center gap-2 text-gray-400">
                                    <span>•</span> 385 Coin desteği
                                </li>
                                <li className="flex items-center gap-2 text-red-400">
                                    <span>✕</span> Sınırlı geçmiş veri
                                </li>
                            </ul>
                        </div>

                        {/* CoinMarketCap */}
                        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl">
                            <div className="text-sm font-bold text-gray-400 mb-2">CMC (Hobbyist)</div>
                            <div className="text-xl font-bold text-white mb-4">$29.00<span className="text-xs text-gray-500 font-normal">/ay</span></div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-yellow-500">
                                    <span>⚠</span> Katı limitler
                                </li>
                                <li className="flex items-center gap-2 text-gray-400">
                                    <span>•</span> Ticari kullanım kısıtlı
                                </li>
                                <li className="flex items-center gap-2 text-red-400">
                                    <span>✕</span> Bütçe dostu değil
                                </li>
                            </ul>
                        </div>

                        {/* KriptoPusula */}
                        <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-xl relative overflow-hidden shadow-lg shadow-blue-500/10">
                            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-2 py-1 rounded-bl text-white">SEÇİMİMİZ</div>
                            <div className="text-sm font-bold text-blue-300 mb-2">KriptoPusula Motoru</div>
                            <div className="text-xl font-bold text-white mb-4">Ücretsiz<span className="text-xs text-gray-500 font-normal"> (Pro Kalite)</span></div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-green-400">
                                    <span>✓</span> <strong>25.000+</strong> Coin Desteği
                                </li>
                                <li className="flex items-center gap-2 text-green-400">
                                    <span>✓</span> <strong>CoinPaprika</strong> Pro Verisi
                                </li>
                                <li className="flex items-center gap-2 text-green-400">
                                    <span>✓</span> <strong>Binance</strong> Canlı Soket
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Teknoloji */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </span>
                        Kullandığımız Teknolojiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <h4 className="font-bold text-white mb-2">CoinPaprika API</h4>
                            <p className="text-sm text-gray-400">Genellikle kurumsal analiz firmalarının kullandığı derinlikteki piyasa verilerini, KriptoPusula kullanıcılarına ücretsiz olarak sunuyoruz.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <h4 className="font-bold text-white mb-2">Google Gemini 2.5</h4>
                            <p className="text-sm text-gray-400">Fiyat hareketlerini sadece matematiksel değil, semantik olarak da analiz eden en yeni nesil yapay zeka modelimiz.</p>
                        </div>
                    </div>
                </section>
                
                <section className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-sm text-gray-500">
                        KriptoPusula &copy; {new Date().getFullYear()}. Veriler CoinPaprika ve Binance tarafından sağlanmaktadır.
                    </p>
                </section>
            </div>
        </div>
    </div>
  );
};

export default AboutSection;
