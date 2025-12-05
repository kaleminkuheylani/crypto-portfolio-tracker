import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, Time, LineStyle } from 'lightweight-charts';
import { getHistoricalCandles, subscribeToTicker } from '../services/binanceService';

interface TradingChartProps {
    symbol: string;
    coinName: string;
    onClose?: () => void;
}

type ChartType = 'candlestick' | 'line' | 'area';
type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

interface IndicatorSettings {
    sma20: boolean;
    sma50: boolean;
    ema12: boolean;
    ema26: boolean;
    bollinger: boolean;
    volume: boolean;
}

const calculateSMA = (data: number[], period: number): (number | null)[] => {
    const result: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null);
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        }
    }
    return result;
};

const calculateEMA = (data: number[], period: number): (number | null)[] => {
    const result: (number | null)[] = [];
    const multiplier = 2 / (period + 1);
    
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null);
        } else if (i === period - 1) {
            const sum = data.slice(0, period).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        } else {
            const prevEMA = result[i - 1];
            if (prevEMA !== null) {
                result.push((data[i] - prevEMA) * multiplier + prevEMA);
            } else {
                result.push(null);
            }
        }
    }
    return result;
};

const calculateBollingerBands = (data: number[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(data, period);
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];
    
    for (let i = 0; i < data.length; i++) {
        if (sma[i] === null) {
            upper.push(null);
            lower.push(null);
        } else {
            const slice = data.slice(Math.max(0, i - period + 1), i + 1);
            const mean = sma[i]!;
            const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / slice.length;
            const std = Math.sqrt(variance);
            upper.push(mean + stdDev * std);
            lower.push(mean - stdDev * std);
        }
    }
    
    return { middle: sma, upper, lower };
};

const TradingChart: React.FC<TradingChartProps> = ({ symbol, coinName, onClose }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const volumeContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const volumeChartRef = useRef<IChartApi | null>(null);
    const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | ISeriesApi<"Area"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const indicatorSeriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());
    const wsRef = useRef<WebSocket | null>(null);
    
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [chartType, setChartType] = useState<ChartType>('candlestick');
    const [timeframe, setTimeframe] = useState<Timeframe>('1h');
    const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
    const [indicators, setIndicators] = useState<IndicatorSettings>({
        sma20: false,
        sma50: false,
        ema12: false,
        ema26: false,
        bollinger: false,
        volume: true,
    });
    const [high24h, setHigh24h] = useState<number | null>(null);
    const [low24h, setLow24h] = useState<number | null>(null);
    const [volume24h, setVolume24h] = useState<number | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);

    const timeframes: { value: Timeframe; label: string }[] = [
        { value: '1m', label: '1D' },
        { value: '5m', label: '5D' },
        { value: '15m', label: '15D' },
        { value: '1h', label: '1S' },
        { value: '4h', label: '4S' },
        { value: '1d', label: '1G' },
    ];

    const updateIndicators = useCallback((data: any[]) => {
        if (!chartRef.current) return;
        
        const closes = data.map(d => d.close);
        const times = data.map(d => d.time);

        indicatorSeriesRef.current.forEach((series, key) => {
            try {
                chartRef.current?.removeSeries(series);
            } catch (e) {}
        });
        indicatorSeriesRef.current.clear();

        if (indicators.sma20) {
            const sma20 = calculateSMA(closes, 20);
            const sma20Series = chartRef.current.addLineSeries({
                color: '#f59e0b',
                lineWidth: 2,
                title: 'SMA20',
            });
            const sma20Data = times.map((time, i) => ({
                time: time as Time,
                value: sma20[i] || 0,
            })).filter(d => d.value !== 0);
            sma20Series.setData(sma20Data);
            indicatorSeriesRef.current.set('sma20', sma20Series);
        }

        if (indicators.sma50) {
            const sma50 = calculateSMA(closes, 50);
            const sma50Series = chartRef.current.addLineSeries({
                color: '#8b5cf6',
                lineWidth: 2,
                title: 'SMA50',
            });
            const sma50Data = times.map((time, i) => ({
                time: time as Time,
                value: sma50[i] || 0,
            })).filter(d => d.value !== 0);
            sma50Series.setData(sma50Data);
            indicatorSeriesRef.current.set('sma50', sma50Series);
        }

        if (indicators.ema12) {
            const ema12 = calculateEMA(closes, 12);
            const ema12Series = chartRef.current.addLineSeries({
                color: '#06b6d4',
                lineWidth: 2,
                title: 'EMA12',
            });
            const ema12Data = times.map((time, i) => ({
                time: time as Time,
                value: ema12[i] || 0,
            })).filter(d => d.value !== 0);
            ema12Series.setData(ema12Data);
            indicatorSeriesRef.current.set('ema12', ema12Series);
        }

        if (indicators.ema26) {
            const ema26 = calculateEMA(closes, 26);
            const ema26Series = chartRef.current.addLineSeries({
                color: '#ec4899',
                lineWidth: 2,
                title: 'EMA26',
            });
            const ema26Data = times.map((time, i) => ({
                time: time as Time,
                value: ema26[i] || 0,
            })).filter(d => d.value !== 0);
            ema26Series.setData(ema26Data);
            indicatorSeriesRef.current.set('ema26', ema26Series);
        }

        if (indicators.bollinger) {
            const bb = calculateBollingerBands(closes, 20, 2);
            
            const upperSeries = chartRef.current.addLineSeries({
                color: 'rgba(33, 150, 243, 0.5)',
                lineWidth: 1,
                lineStyle: LineStyle.Dashed,
                title: 'BB Upper',
            });
            const upperData = times.map((time, i) => ({
                time: time as Time,
                value: bb.upper[i] || 0,
            })).filter(d => d.value !== 0);
            upperSeries.setData(upperData);
            indicatorSeriesRef.current.set('bb_upper', upperSeries);

            const lowerSeries = chartRef.current.addLineSeries({
                color: 'rgba(33, 150, 243, 0.5)',
                lineWidth: 1,
                lineStyle: LineStyle.Dashed,
                title: 'BB Lower',
            });
            const lowerData = times.map((time, i) => ({
                time: time as Time,
                value: bb.lower[i] || 0,
            })).filter(d => d.value !== 0);
            lowerSeries.setData(lowerData);
            indicatorSeriesRef.current.set('bb_lower', lowerSeries);

            const middleSeries = chartRef.current.addLineSeries({
                color: 'rgba(33, 150, 243, 0.8)',
                lineWidth: 1,
                title: 'BB Middle',
            });
            const middleData = times.map((time, i) => ({
                time: time as Time,
                value: bb.middle[i] || 0,
            })).filter(d => d.value !== 0);
            middleSeries.setData(middleData);
            indicatorSeriesRef.current.set('bb_middle', middleSeries);
        }
    }, [indicators]);

    useEffect(() => {
        if (rawData.length > 0) {
            updateIndicators(rawData);
        }
    }, [indicators, rawData, updateIndicators]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let isMounted = true;

        indicatorSeriesRef.current.forEach((series) => {
            try {
                chartRef.current?.removeSeries(series);
            } catch (e) {}
        });
        indicatorSeriesRef.current.clear();

        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }
        if (volumeChartRef.current) {
            volumeChartRef.current.remove();
            volumeChartRef.current = null;
        }

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
            height: indicators.volume ? 400 : 500,
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

        chartRef.current = chart;

        let mainSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | ISeriesApi<"Area">;
        
        if (chartType === 'candlestick') {
            mainSeries = chart.addCandlestickSeries({
                upColor: '#10b981',
                downColor: '#ef4444',
                borderVisible: false,
                wickUpColor: '#10b981',
                wickDownColor: '#ef4444',
            });
        } else if (chartType === 'line') {
            mainSeries = chart.addLineSeries({
                color: '#2563eb',
                lineWidth: 2,
            });
        } else {
            mainSeries = chart.addAreaSeries({
                topColor: 'rgba(37, 99, 235, 0.4)',
                bottomColor: 'rgba(37, 99, 235, 0.0)',
                lineColor: '#2563eb',
                lineWidth: 2,
            });
        }

        mainSeriesRef.current = mainSeries;

        if (indicators.volume && volumeContainerRef.current) {
            const volumeChart = createChart(volumeContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: '#ffffff' },
                    textColor: '#6b7280',
                },
                grid: {
                    vertLines: { color: '#f3f4f6' },
                    horzLines: { color: '#f3f4f6' },
                },
                width: volumeContainerRef.current.clientWidth,
                height: 100,
                rightPriceScale: {
                    borderColor: '#e5e7eb',
                },
                timeScale: {
                    visible: false,
                },
            });
            
            volumeChartRef.current = volumeChart;
            
            const volumeSeries = volumeChart.addHistogramSeries({
                color: '#60a5fa',
                priceFormat: {
                    type: 'volume',
                },
            });
            volumeSeriesRef.current = volumeSeries;

            chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
                if (logicalRange && volumeChartRef.current) {
                    volumeChartRef.current.timeScale().setVisibleLogicalRange(logicalRange);
                }
            });
        }

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                try {
                    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
                } catch (e) {}
            }
            if (volumeContainerRef.current && volumeChartRef.current) {
                try {
                    volumeChartRef.current.applyOptions({ width: volumeContainerRef.current.clientWidth });
                } catch (e) {}
            }
        };
        window.addEventListener('resize', handleResize);

        const loadData = async () => {
            try {
                const history = await getHistoricalCandles(symbol, timeframe);
                
                if (!isMounted || !mainSeriesRef.current) return;

                if (history.length > 0) {
                    setRawData(history);
                    
                    if (chartType === 'candlestick') {
                        const chartData = history.map(candle => ({
                            time: candle.time as Time,
                            open: candle.open,
                            high: candle.high,
                            low: candle.low,
                            close: candle.close,
                        }));
                        (mainSeriesRef.current as ISeriesApi<"Candlestick">).setData(chartData);
                    } else {
                        const chartData = history.map(candle => ({
                            time: candle.time as Time,
                            value: candle.close,
                        }));
                        (mainSeriesRef.current as ISeriesApi<"Line"> | ISeriesApi<"Area">).setData(chartData);
                    }

                    if (volumeSeriesRef.current) {
                        const volumeData = history.map(candle => ({
                            time: candle.time as Time,
                            value: candle.volume || 0,
                            color: candle.close >= candle.open ? '#10b981' : '#ef4444',
                        }));
                        volumeSeriesRef.current.setData(volumeData);
                    }

                    const last = history[history.length - 1];
                    setCurrentPrice(last.close);
                    
                    const highs = history.map(c => c.high);
                    const lows = history.map(c => c.low);
                    const volumes = history.map(c => c.volume || 0);
                    setHigh24h(Math.max(...highs));
                    setLow24h(Math.min(...lows));
                    setVolume24h(volumes.reduce((a, b) => a + b, 0));
                }

                if (wsRef.current) wsRef.current.close();
                
                wsRef.current = subscribeToTicker(symbol, timeframe, (candle) => {
                    if (!isMounted || !mainSeriesRef.current) return;
                    
                    try {
                        if (chartType === 'candlestick') {
                            const chartCandle = {
                                time: candle.time as Time,
                                open: candle.open,
                                high: candle.high,
                                low: candle.low,
                                close: candle.close,
                            };
                            (mainSeriesRef.current as ISeriesApi<"Candlestick">).update(chartCandle);
                        } else {
                            (mainSeriesRef.current as ISeriesApi<"Line"> | ISeriesApi<"Area">).update({
                                time: candle.time as Time,
                                value: candle.close,
                            });
                        }

                        if (volumeSeriesRef.current) {
                            volumeSeriesRef.current.update({
                                time: candle.time as Time,
                                value: candle.volume || 0,
                                color: candle.close >= candle.open ? '#10b981' : '#ef4444',
                            });
                        }

                        setCurrentPrice(candle.close);
                        
                        const change = ((candle.close - candle.open) / candle.open) * 100;
                        setPriceChange(change);
                    } catch (error) {
                        console.debug("Chart update error:", error);
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
            indicatorSeriesRef.current.forEach((series) => {
                try {
                    chartRef.current?.removeSeries(series);
                } catch (e) {}
            });
            indicatorSeriesRef.current.clear();
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
            if (volumeChartRef.current) {
                volumeChartRef.current.remove();
                volumeChartRef.current = null;
            }
            mainSeriesRef.current = null;
            volumeSeriesRef.current = null;
        };
    }, [symbol, timeframe, chartType, indicators.volume]);

    const toggleIndicator = (key: keyof IndicatorSettings) => {
        setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded border border-green-200 animate-pulse">CANLI</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {timeframes.map(tf => (
                                <button
                                    key={tf.value}
                                    onClick={() => setTimeframe(tf.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                                        timeframe === tf.value 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setChartType('candlestick')}
                                className={`px-2 py-1 rounded transition-all ${chartType === 'candlestick' ? 'bg-white shadow-sm' : ''}`}
                                title="Mum Grafigi"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="4" y="4" width="4" height="16" rx="1" />
                                    <rect x="10" y="8" width="4" height="8" rx="1" />
                                    <rect x="16" y="2" width="4" height="20" rx="1" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`px-2 py-1 rounded transition-all ${chartType === 'line' ? 'bg-white shadow-sm' : ''}`}
                                title="Cizgi Grafik"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12l5-5 4 4 5-5 4 4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setChartType('area')}
                                className={`px-2 py-1 rounded transition-all ${chartType === 'area' ? 'bg-white shadow-sm' : ''}`}
                                title="Alan Grafik"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                                    <path d="M3 20V12l5-5 4 4 5-5 4 4v10H3z" />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${
                                showIndicatorPanel ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Indikatorler
                        </button>

                        {onClose && (
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {showIndicatorPanel && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Teknik Indikatorler</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            <button
                                onClick={() => toggleIndicator('sma20')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.sma20 
                                        ? 'bg-amber-100 border-amber-300 text-amber-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">SMA 20</span>
                                <span className="block text-[10px] opacity-75">Basit Ortalama</span>
                            </button>
                            <button
                                onClick={() => toggleIndicator('sma50')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.sma50 
                                        ? 'bg-violet-100 border-violet-300 text-violet-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">SMA 50</span>
                                <span className="block text-[10px] opacity-75">Basit Ortalama</span>
                            </button>
                            <button
                                onClick={() => toggleIndicator('ema12')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.ema12 
                                        ? 'bg-cyan-100 border-cyan-300 text-cyan-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">EMA 12</span>
                                <span className="block text-[10px] opacity-75">Ustel Ortalama</span>
                            </button>
                            <button
                                onClick={() => toggleIndicator('ema26')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.ema26 
                                        ? 'bg-pink-100 border-pink-300 text-pink-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">EMA 26</span>
                                <span className="block text-[10px] opacity-75">Ustel Ortalama</span>
                            </button>
                            <button
                                onClick={() => toggleIndicator('bollinger')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.bollinger 
                                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">Bollinger</span>
                                <span className="block text-[10px] opacity-75">Bant Gostergesi</span>
                            </button>
                            <button
                                onClick={() => toggleIndicator('volume')}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                                    indicators.volume 
                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="block font-bold">Hacim</span>
                                <span className="block text-[10px] opacity-75">Islem Hacmi</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">24s Yuksek</div>
                        <div className="text-sm font-semibold text-green-600">
                            ${high24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">24s Dusuk</div>
                        <div className="text-sm font-semibold text-red-600">
                            ${low24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">24s Hacim</div>
                        <div className="text-sm font-semibold text-blue-600">
                            {volume24h ? `$${(volume24h / 1000000).toFixed(2)}M` : '-'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex-1 min-h-[400px] w-full" ref={chartContainerRef}>
                <div className="absolute top-4 left-4 z-10 opacity-30 pointer-events-none">
                    <p className="text-5xl font-bold text-gray-200 uppercase select-none">{symbol}</p>
                </div>
            </div>

            {indicators.volume && (
                <div className="h-[100px] w-full border-t border-gray-100" ref={volumeContainerRef}></div>
            )}
            
            <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
                Veriler Binance WebSocket API uzerinden gercek zamanli saglanmaktadir. • 
                <span className="text-blue-600"> TradingView Lightweight Charts</span>
            </div>
        </div>
    );
};

export default TradingChart;
