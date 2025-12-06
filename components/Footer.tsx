import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          <p>KriptoSavasi - Kar amaci gutmeyen, topluluk odakli kripto egitim platformu</p>
          <p className="mt-2">Veriler CoinPaprika ve Binance tarafindan saglanmaktadir. AI ongoruleri Google Gemini ile guclendirilmistir.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} KriptoSavasi. Tum haklari saklidir.</p>
        </div>
      </div>
    </footer>
  );
}