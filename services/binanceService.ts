
import { CandleData } from "../types";

const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";
const BINANCE_API_BASE = "https://api.binance.com/api/v3";
// Daha kararlı proxy servisi
const PROXY_URL = 'https://corsproxy.io/?';

// CoinGecko/Paprika sembolünü Binance paritesine çevir (örn: 'bitcoin' -> 'BTCUSDT')
export const getBinanceSymbol = (symbol: string): string => {
    // USDT paritesi varsayıyoruz
    let s = symbol.toUpperCase();
    // Bazı istisnalar (Stablecoinler vs) manuel eklenebilir ama genelde Symbol+USDT çalışır
    // Tether için özel durum
    if (s === 'USDT') return 'USDCUSDT'; // USDT/USDT olmadığı için
    return `${s}USDT`;
};

// REST API: Geçmiş mum verilerini getir
export const getHistoricalCandles = async (symbol: string, interval: string = '1h'): Promise<CandleData[]> => {
    const pair = getBinanceSymbol(symbol);
    try {
        const targetUrl = `${BINANCE_API_BASE}/klines?symbol=${pair}&interval=${interval}&limit=1000`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error('Binance API hatası');
        
        const data = await response.json();
        
        // Binance response format: 
        // [Open time, Open, High, Low, Close, Volume, Close time, ...]
        return data.map((d: any[]) => ({
            time: d[0] / 1000, // Lightweight charts saniye cinsinden timestamp ister
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
        }));
    } catch (error) {
        console.warn("Tarihsel veri çekilemedi (CORS veya Sembol hatası olabilir):", error);
        return [];
    }
};

// WebSocket bağlantısı oluştur
export const subscribeToTicker = (symbol: string, interval: string, callback: (candle: CandleData) => void) => {
    const pair = getBinanceSymbol(symbol).toLowerCase();
    const ws = new WebSocket(`${BINANCE_WS_BASE}/${pair}@kline_${interval}`);

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.e === 'kline') {
            const k = message.k;
            const candle: CandleData = {
                time: k.t / 1000,
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
            };
            callback(candle);
        }
    };

    ws.onerror = (err) => {
        console.error("Binance WS Hatası:", err);
    };

    return ws; // Bağlantıyı kapatmak için geri döndür
};
