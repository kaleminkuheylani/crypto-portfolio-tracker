
import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-gray-800 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-gray-700 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 rounded-t-2xl z-10">
            <h2 className="text-xl font-bold text-white">Gizlilik Politikası ve KVKK</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <div className="p-8 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4">
            <p><strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            
            <h3 className="text-lg font-bold text-white mt-4">1. Veri Sorumlusu</h3>
            <p>KriptoPusula olarak, kişisel verilerinizin güvenliğine önem veriyoruz. Bu metin, verilerinizin nasıl işlendiğini açıklamaktadır.</p>

            <h3 className="text-lg font-bold text-white mt-4">2. Toplanan Veriler</h3>
            <p>Hizmetimizi kullanırken şu bilgileri toplayabiliriz: E-posta adresi, Ad Soyad, Ödeme Bilgileri (Ödeme işleyicisi tarafından şifrelenmiş olarak), Kullanım verileri.</p>

            <h3 className="text-lg font-bold text-white mt-4">3. Verilerin Kullanımı</h3>
            <p>Toplanan veriler; hizmetin sağlanması, ödemelerin işlenmesi, yasal yükümlülüklerin yerine getirilmesi ve müşteri desteği sağlamak amacıyla kullanılır.</p>

            <h3 className="text-lg font-bold text-white mt-4">4. Ödeme Güvenliği</h3>
            <p>Kredi kartı bilgileriniz sunucularımızda saklanmaz. Ödemeler, PCI-DSS uyumlu güvenli ödeme altyapıları üzerinden işlenir.</p>

            <h3 className="text-lg font-bold text-white mt-4">5. Çerezler</h3>
            <p>Kullanıcı deneyimini artırmak için çerezler (cookies) kullanmaktayız.</p>

            <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 mt-6">
                Bu bir demo uygulamasıdır. Gerçek kredi kartı bilgilerinizi girmeyiniz.
            </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800 rounded-b-2xl">
            <button 
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
                Okudum, Anladım
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
