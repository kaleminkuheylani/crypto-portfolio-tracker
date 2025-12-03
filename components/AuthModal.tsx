
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Simülasyon için
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
      setIsLoading(true);
      setError('');
      try {
          // Google girişini simüle et
          setTimeout(async () => {
              const mockGoogleUser = {
                  email: `user_${Math.floor(Math.random() * 1000)}@gmail.com`,
                  name: 'Google Kullanıcısı',
                  avatar: 'https://lh3.googleusercontent.com/a/default-user'
              };
              const user = await AuthService.loginWithGoogle(mockGoogleUser.email, mockGoogleUser.name, mockGoogleUser.avatar);
              onLoginSuccess(user);
          }, 1000);
      } catch (err: any) {
          setError(err.message);
          setIsLoading(false);
      }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
          if (activeTab === 'register') {
              if (!name || !email || !password) throw new Error("Tüm alanları doldurun.");
              const user = await AuthService.registerWithEmail(email, name);
              onLoginSuccess(user);
          } else {
              if (!email || !password) throw new Error("Email ve şifre gerekli.");
              const user = await AuthService.loginWithEmail(email);
              onLoginSuccess(user);
          }
      } catch (err: any) {
          setError(err.message || "Bir hata oluştu.");
          setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {activeTab === 'login' ? 'KriptoPusula\'ya Giriş Yap' : 'Hesap Oluştur'}
            </h2>

            {/* Google Login Button */}
            <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white text-gray-900 font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-6"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Devam Et
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-700 flex-1"></div>
                <span className="text-gray-500 text-sm">veya e-posta ile</span>
                <div className="h-px bg-gray-700 flex-1"></div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
                {activeTab === 'register' && (
                    <div>
                        <input 
                            type="text" 
                            placeholder="Ad Soyad"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                )}
                <div>
                    <input 
                        type="email" 
                        placeholder="E-posta adresi"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Şifre"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'İşleniyor...' : (activeTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                {activeTab === 'login' ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
                <button 
                    onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                >
                    {activeTab === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
