import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, Time } from 'lightweight-charts';
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

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let isMounted = true;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#6b7280',
            },
            grid: {
                vertLines: { color: '#f3f4f6' },
                horzLines: { color: '#f3f4f6' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#e5e7eb',
            },
            timeScale: {
                borderColor: '#e5e7eb',
                timeVisible: true,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                try {
                    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
                } catch (e) {
                }
            }
        };
        window.addEventListener('resize', handleResize);

        const loadData = async () => {
            try {
                const history = await getHistoricalCandles(symbol, '1h');
                
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
                    const last = history[history.length - 1];
                    setCurrentPrice(last.close);
                }

                if (wsRef.current) wsRef.current.close();
                
                wsRef.current = subscribeToTicker(symbol, '1h', (candle) => {
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
                        
                        const change = ((candle.close - candle.open) / candle.open) * 100;
                        setPriceChange(change);
                    } catch (error) {
                        console.debug("Chart update error (likely disposed):", error);
                    }
                });
            } catch (err) {
                console.error("Data load error:", err);
            }
        };

        loadData();

        return () => {
            isMounted = false;
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {coinName} <span className="text-sm font-normal text-gray-400">/ USDT</span>
                        </h2>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-900 font-mono text-lg">
                                ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                            {priceChange !== 0 && (
                                <span className={`${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded border border-blue-200">CANLI</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">1s</span>
                </div>
                {onClose && (
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>

            <div className="relative flex-1 min-h-[500px] w-full" ref={chartContainerRef}>
                <div className="absolute top-4 left-4 z-10 opacity-50 pointer-events-none">
                    <p className="text-6xl font-bold text-gray-200 uppercase select-none">{symbol}</p>
                </div>
            </div>
            
            <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
                Veriler Binance WebSocket API uzerinden gercek zamanli saglanmaktadir. TradingView Lightweight Charts kullanilmaktadir.
            </div>
        </div>
    );
};

export default TradingChart;
