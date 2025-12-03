
import { User } from '../types';

// Veritabanı Tablo İsimleri (LocalStorage Keys)
const DB_TABLE_GOOGLE = 'kriptopusula_db_google_users';
const DB_TABLE_EMAIL = 'kriptopusula_db_email_users';
const SESSION_KEY = 'kriptopusula_session_user';

// Yardımcı: Tabloyu oku
const getTable = (tableName: string): User[] => {
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : [];
};

// Yardımcı: Tabloya kaydet
const saveTable = (tableName: string, data: User[]) => {
    localStorage.setItem(tableName, JSON.stringify(data));
};

export const AuthService = {
    // Oturumdaki kullanıcıyı getir
    getCurrentUser: (): User | null => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // Çıkış yap
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // Google ile Giriş/Kayıt (Simüle)
    loginWithGoogle: async (email: string, name: string, avatar: string): Promise<User> => {
        // DB'den oku
        const users = getTable(DB_TABLE_GOOGLE);
        
        // Kullanıcı var mı kontrol et
        let user = users.find(u => u.email === email);

        if (!user) {
            // Yoksa Kaydet (Register)
            user = {
                id: crypto.randomUUID(),
                email,
                name,
                avatar,
                provider: 'google',
                createdAt: new Date().toISOString()
            };
            users.push(user);
            saveTable(DB_TABLE_GOOGLE, users);
            console.log("Yeni Google kullanıcısı DB'ye kaydedildi:", user);
        } else {
            console.log("Google kullanıcısı giriş yaptı:", user);
        }

        // Oturumu başlat
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    },

    // Email ile Kayıt
    registerWithEmail: async (email: string, name: string): Promise<User> => {
        const users = getTable(DB_TABLE_EMAIL);
        
        if (users.find(u => u.email === email)) {
            throw new Error("Bu e-posta adresi zaten kayıtlı.");
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            name,
            provider: 'email',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveTable(DB_TABLE_EMAIL, users);
        
        // Otomatik giriş yap
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        return newUser;
    },

    // Email ile Giriş
    loginWithEmail: async (email: string): Promise<User> => {
        const users = getTable(DB_TABLE_EMAIL);
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error("Kullanıcı bulunamadı.");
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    }
};
