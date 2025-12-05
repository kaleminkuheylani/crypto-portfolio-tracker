import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">Hakkimizda</h2>
                    <p className="text-blue-100">Kar Amaci Gutmeyen Egitim Platformu</p>
                </div>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
                
                <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Kar Amaci Gutmuyoruz</h3>
                            <p className="text-gray-600 leading-relaxed">
                                KriptoPusula, topluluk tarafindan topluluk icin olusturulmus bir egitim platformudur. 
                                Hicbir ucretli uyelik, reklam geliri veya ticari amacimiz bulunmamaktadir. 
                                Tek amacimiz kripto para dunyasini herkes icin daha anlasilir ve eriselebilir kilmaktir.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </span>
                        Misyonumuz
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        Kripto para piyasasi karmasik ve gozda korkutucu gorunebilir. KriptoPusula olarak, bu karmasikligi 
                        ortadan kaldirmak ve herkesin bilgiye esit erisimini saglamak icin calismaktayiz. Yapay zeka 
                        destekli analiz araclarimiz, piyasa verilerimiz ve egitim iceriklerimiz tamamen ucretsizdir.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </span>
                        Topluluk Odakli Yaklasim
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="text-3xl font-bold text-blue-600 mb-1">%100</div>
                            <div className="text-sm text-gray-600">Ucretsiz Erisim</div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                            <div className="text-sm text-gray-600">Reklam & Sponsorluk</div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="text-3xl font-bold text-purple-600 mb-1">Acik</div>
                            <div className="text-sm text-gray-600">Kaynak Kod</div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </span>
                        Degerlerimiz
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-green-500 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Seffaflik</h4>
                                <p className="text-sm text-gray-600">Tum verilerimiz ve kaynaklarimiz aciktir.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-green-500 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Egitim Odakli</h4>
                                <p className="text-sm text-gray-600">Yatirim tavsiyesi degil, bilgi paylasimi.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-green-500 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Bagimsizlik</h4>
                                <p className="text-sm text-gray-600">Hicbir borsaya veya projeye bagli degiliz.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-green-500 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Eriselebilirlik</h4>
                                <p className="text-sm text-gray-600">Herkes icin ucretsiz ve acik platform.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </span>
                        Kullandigimiz Teknolojiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">CoinPaprika API</h4>
                            <p className="text-sm text-gray-600">Guncel ve guvenilir piyasa verileri icin kullandigimiz ucretsiz API servisi.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Google Gemini AI</h4>
                            <p className="text-sm text-gray-600">Yapay zeka destekli analiz ve tahmin ozelliklerimizi guclendiren ileri seviye dil modeli.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Binance WebSocket</h4>
                            <p className="text-sm text-gray-600">Canli fiyat grafikleri icin kullanilan gercek zamanli veri akisi.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Fear & Greed Index</h4>
                            <p className="text-sm text-gray-600">Piyasa duyarliligi olcumu icin kullanilan korku ve acgozluluk endeksi.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Onemli Uyari</h3>
                            <p className="text-gray-600 leading-relaxed">
                                KriptoPusula tarafindan saglanan bilgiler sadece egitim amacldir ve yatirim tavsiyesi niteliginde degildir. 
                                Kripto para piyasalari yuksek risk icerir. Yatirim kararlari almadan once kendi arastirmanizi yapin 
                                ve gerekirse profesyonel finansal danismanlik alin.
                            </p>
                        </div>
                    </div>
                </section>
                
                <section className="border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-500">
                        KriptoPusula &copy; {new Date().getFullYear()}. Kar amaci gutmeyen topluluk projesi.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Veriler CoinPaprika ve Binance tarafindan saglanmaktadir.
                    </p>
                </section>
            </div>
        </div>
    </div>
  );
};

export default AboutSection;
