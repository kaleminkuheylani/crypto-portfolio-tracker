import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hakkimizda | KriptoPusula',
  description: 'KriptoPusula, yapay zeka destekli kripto para takip ve analiz platformudur. Misyonumuz ve vizyonumuz hakkinda bilgi edinin.',
  keywords: ['kripto pusula', 'hakkimizda', 'kripto analiz', 'yapay zeka', 'kripto takip'],
  openGraph: {
    title: 'Hakkimizda | KriptoPusula',
    description: 'KriptoPusula, yapay zeka destekli kripto para takip ve analiz platformudur.',
    type: 'website',
    siteName: 'KriptoPusula',
  },
  robots: 'index, follow',
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-500 transition-colors">
            <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
            KriptoPusula
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              Ana Sayfa
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              Blog
            </Link>
            <span className="text-blue-600 font-medium text-sm">Hakkimizda</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <img src="/logo.png" alt="KriptoPusula Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">KriptoPusula</h1>
          <p className="text-xl text-gray-600">
            Yapay Zeka Destekli Kripto Takip ve Analiz Platformu
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Misyonumuz
            </h2>
            <p className="text-gray-600 leading-relaxed">
              KriptoPusula olarak misyonumuz, kripto para piyasasini herkes icin erisilebilir ve 
              anlasilir kilmaktir. Yapay zeka destekli analizlerimiz ve kullanici dostu arayuzumuz 
              ile hem yeni baslayanlara hem de deneyimli yatirimcilara deger katmayi hedefliyoruz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
              Vizyonumuz
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Turkiye'nin ve dunyanin en guvenilir kripto para bilgi kaynaklarindan biri olmak. 
              Teknolojinin gucunu kullanarak finansal okuryazarligi artirmak ve kullanicilarimizin 
              bilinçli kararlar almasina yardimci olmak istiyoruz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Ozelliklerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Canli Piyasa Verileri</h3>
                <p className="text-gray-600 text-sm">
                  CoinPaprika ve Binance kaynaklarindan anlik fiyat guncellemeleri
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Yapay Zeka Analizleri</h3>
                <p className="text-gray-600 text-sm">
                  Google Gemini AI tarafindan desteklenen piyasa analizleri
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Pro Grafik Araclari</h3>
                <p className="text-gray-600 text-sm">
                  TradingView altyapisiyla profesyonel teknik analiz araclari
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Portfoy Yonetimi</h3>
                <p className="text-gray-600 text-sm">
                  Varliklarinizi takip edin, kar/zarar durumunuzu anlik gorun
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              Yasal Uyari
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                KriptoPusula'da paylasilan tum icerikler yalnizca bilgilendirme amaçlidir ve 
                yatirim tavsiyesi niteligi tasimaz. Kripto para piyasasi yuksek volatiliteye 
                sahiptir ve ciddi finansal kayiplara yol acabilir. Yatirim kararlari almadan 
                once kendi arastirmanizi yapin ve gerekirse profesyonel finansal danismanlik alin.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Iletisim
            </h2>
            <p className="text-gray-600">
              Sorulariniz veya onerileriniz icin bizimle iletisime gecebilirsiniz.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>KriptoPusula - Kar amaci gutmeyen, topluluk odakli kripto egitim platformu</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} KriptoPusula. Tum haklari saklidir.</p>
        </div>
      </footer>
    </div>
  );
}
