import React from 'react';
import { User } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'market' | 'blog' | 'chart' | 'alerts' | 'about';
  setActiveTab: (tab: 'dashboard' | 'market' | 'blog' | 'chart' | 'alerts' | 'about') => void;
  user: User | null;
  isLoading: boolean;
  isSearching: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  user,
  isLoading,
  isSearching,
  onLoginClick,
  onLogout
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <img src="/logo.png" alt="KriptoSavasi Logo" className="w-10 h-10 object-contain" />
            KriptoSavasi
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Panel
            </button>
            <button 
              onClick={() => setActiveTab('market')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Canli Piyasa
            </button>
            <button 
              onClick={() => setActiveTab('chart')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Pro Grafik
            </button>
            <button 
              onClick={() => setActiveTab('alerts')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Alarmlar
            </button>
            <button 
              onClick={() => setActiveTab('blog')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setActiveTab('about')} 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Hakkimizda
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></span>
              <span className="text-xs font-medium text-gray-600">{isLoading || isSearching ? 'Guncelleniyor...' : 'Canli'}</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                <button onClick={onLogout} className="text-gray-500 hover:text-red-500" title="Cikis Yap">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Giris Yap
              </button>
            )}
          </div>
        </div>

        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Panel
          </button>
          <button 
            onClick={() => setActiveTab('market')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Piyasa
          </button>
          <button 
            onClick={() => setActiveTab('chart')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Grafik
          </button>
          <button 
            onClick={() => setActiveTab('alerts')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Alarmlar
          </button>
          <button 
            onClick={() => setActiveTab('blog')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Blog
          </button>
          <button 
            onClick={() => setActiveTab('about')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Hakkimizda
          </button>
        </div>
      </div>
    </header>
  );
}