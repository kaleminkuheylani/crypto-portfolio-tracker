
import { CandleData } from "../types";

const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";
const BINANCE_API_BASE = "https://api.binance.com/api/v3";
const BINANCE_US_API_BASE = "https://api.binance.us/api/v3";

export const getBinanceSymbol = (symbol: string): string => {
    let s = symbol.toUpperCase();
    if (s === 'USDT') return 'USDCUSDT';
    return `${s}USDT`;
};

const intervalToSeconds: Record<string, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
};

const generateMockCandles = (symbol: string, interval: string, count: number = 200): CandleData[] => {
    const candles: CandleData[] = [];
    const now = Math.floor(Date.now() / 1000);
    const intervalSecs = intervalToSeconds[interval] || 3600;
    
    let basePrice = symbol.toLowerCase().includes('btc') ? 96000 : 
                    symbol.toLowerCase().includes('eth') ? 3500 :
                    symbol.toLowerCase().includes('sol') ? 180 :
                    symbol.toLowerCase().includes('bnb') ? 600 : 100;
    
    let currentPrice = basePrice;
    
    for (let i = count - 1; i >= 0; i--) {
        const time = now - (i * intervalSecs);
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility;
        
        currentPrice = currentPrice * (1 + change);
        
        const open = currentPrice;
        const closeChange = (Math.random() - 0.5) * volatility;
        const close = open * (1 + closeChange);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const volume = Math.random() * 10000000 + 1000000;
        
        candles.push({
            time,
            open,
            high,
            low,
            close,
            volume,
        });
    }
    
    return candles;
};

export const getHistoricalCandles = async (symbol: string, interval: string = '1h'): Promise<CandleData[]> => {
    const pair = getBinanceSymbol(symbol);
    
    const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`${BINANCE_API_BASE}/klines?symbol=${pair}&interval=${interval}&limit=500`)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`${BINANCE_API_BASE}/klines?symbol=${pair}&interval=${interval}&limit=500`)}`,
    ];
    
    for (const proxyUrl of proxyUrls) {
        try {
            const response = await fetch(proxyUrl, { 
                signal: AbortSignal.timeout(8000)
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                return data.map((d: any[]) => ({
                    time: d[0] / 1000,
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                    volume: parseFloat(d[5]),
                }));
            }
        } catch (error) {
            console.debug("Proxy denemesi basarisiz:", error);
            continue;
        }
    }
    
    console.info("Canli veri alinamadi, demo veriler gosteriliyor");
    return generateMockCandles(symbol, interval);
};

export const subscribeToTicker = (symbol: string, interval: string, callback: (candle: CandleData) => void) => {
    const pair = getBinanceSymbol(symbol).toLowerCase();
    
    let mockInterval: NodeJS.Timeout | null = null;
    let ws: WebSocket | null = null;
    
    const startMockUpdates = () => {
        let lastCandle = generateMockCandles(symbol, interval, 1)[0];
        
        mockInterval = setInterval(() => {
            const volatility = 0.001;
            const change = (Math.random() - 0.5) * volatility;
            const newClose = lastCandle.close * (1 + change);
            
            lastCandle = {
                time: Math.floor(Date.now() / 1000),
                open: lastCandle.close,
                high: Math.max(lastCandle.close, newClose) * (1 + Math.random() * 0.001),
                low: Math.min(lastCandle.close, newClose) * (1 - Math.random() * 0.001),
                close: newClose,
                volume: Math.random() * 100000 + 50000,
            };
            
            callback(lastCandle);
        }, 2000);
    };
    
    try {
        ws = new WebSocket(`${BINANCE_WS_BASE}/${pair}@kline_${interval}`);
        
        const timeout = setTimeout(() => {
            if (ws && ws.readyState !== WebSocket.OPEN) {
                ws.close();
                console.info("WebSocket baglantisi kurulamadi, demo mod aktif");
                startMockUpdates();
            }
        }, 5000);

        ws.onopen = () => {
            clearTimeout(timeout);
        };

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
                    volume: parseFloat(k.v),
                };
                callback(candle);
            }
        };

        ws.onerror = () => {
            clearTimeout(timeout);
            console.info("WebSocket hatasi, demo mod aktif");
            if (!mockInterval) {
                startMockUpdates();
            }
        };
        
        ws.onclose = () => {
            clearTimeout(timeout);
        };
    } catch (error) {
        console.info("WebSocket desteklenmiyor, demo mod aktif");
        startMockUpdates();
    }

    return {
        close: () => {
            if (ws) ws.close();
            if (mockInterval) clearInterval(mockInterval);
        }
    } as WebSocket;
};
