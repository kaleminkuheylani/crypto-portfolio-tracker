
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, CandlestickData, Time } from 'lightweight-charts';
import { getHistoricalCandles, subscribeToTicker } from '../services/binanceService';

interface TradingChartProps {
    symbol: string;
    coinName: string;
    onClose?: () => void;
}

const TradingChart: React.FC<TradingChartProps> = ({ symbol, coinName, onClose }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);

    // Grafik Oluşturma ve Ayarları
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Bileşen hala ekranda mı kontrolü için bayrak
        let isMounted = true;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#111827' }, // gray-900
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: '#1f2937' },
                horzLines: { color: '#1f2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#374151',
            },
            timeScale: {
                borderColor: '#374151',
                timeVisible: true,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981', // green-500
            downColor: '#ef4444', // red-500
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // Resize handler
        const handleResize = () => {
            // isMounted kontrolü burada çok kritik değil ama chartRef'in null olup olmadığı önemli
            if (chartContainerRef.current && chartRef.current) {
                // Chart dispose edildiyse try-catch ile hatayı yutalım
                try {
                    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
                } catch (e) {
                    // ignore
                }
            }
        };
        window.addEventListener('resize', handleResize);

        // Veri Yükleme
        const loadData = async () => {
            try {
                // 1. Önce geçmiş veriyi yükle
                const history = await getHistoricalCandles(symbol, '1h');
                
                // Eğer veri gelene kadar bileşen silindiyse işlem yapma
                if (!isMounted || !seriesRef.current) return;

                if (history.length > 0) {
                    const chartData = history.map(candle => ({
                        time: candle.time as Time,
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                    }));
                    seriesRef.current.setData(chartData);
                    // Son fiyatı ayarla
                    const last = history[history.length - 1];
                    setCurrentPrice(last.close);
                }

                // 2. Canlı veriye abone ol
                if (wsRef.current) wsRef.current.close();
                
                wsRef.current = subscribeToTicker(symbol, '1h', (candle) => {
                    // WebSocket mesajı geldiğinde bileşen silinmişse işlem yapma
                    if (!isMounted || !seriesRef.current) return;
                    
                    try {
                        const chartCandle = {
                            time: candle.time as Time,
                            open: candle.open,
                            high: candle.high,
                            low: candle.low,
                            close: candle.close,
                        };
                        seriesRef.current.update(chartCandle);
                        setCurrentPrice(candle.close);
                        
                        // Basit bir değişim hesaplaması (Mum açılışına göre)
                        const change = ((candle.close - candle.open) / candle.open) * 100;
                        setPriceChange(change);
                    } catch (error) {
                        // Olası dispose hatalarını yakala
                        console.debug("Chart update error (likely disposed):", error);
                    }
                });
            } catch (err) {
                console.error("Data load error:", err);
            }
        };

        loadData();

        return () => {
            isMounted = false; // Bileşenin silindiğini işaretle
            window.removeEventListener('resize', handleResize);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
            seriesRef.current = null;
        };
    }, [symbol]);

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {coinName} <span className="text-sm font-normal text-gray-400">/ USDT</span>
                        </h2>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-white font-mono text-lg">
                                ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                            {priceChange !== 0 && (
                                <span className={`${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30">CANLI</span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">1s</span>
                </div>
                {onClose && (
                     <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>

            {/* Chart Area */}
            <div className="relative flex-1 min-h-[500px] w-full" ref={chartContainerRef}>
                <div className="absolute top-4 left-4 z-10 opacity-50 pointer-events-none">
                    <p className="text-6xl font-bold text-gray-700/20 uppercase select-none">{symbol}</p>
                </div>
            </div>
            
            <div className="p-2 bg-gray-900/80 text-center text-xs text-gray-500 border-t border-gray-700">
                Veriler Binance WebSocket API üzerinden gerçek zamanlı sağlanmaktadır. TradingView Lightweight Charts kullanılmaktadır.
            </div>
        </div>
    );
};

export default TradingChart;
