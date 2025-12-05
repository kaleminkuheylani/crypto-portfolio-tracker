(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/binanceService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBinanceSymbol",
    ()=>getBinanceSymbol,
    "getHistoricalCandles",
    ()=>getHistoricalCandles,
    "subscribeToTicker",
    ()=>subscribeToTicker
]);
const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";
const BINANCE_API_BASE = "https://api.binance.com/api/v3";
const BINANCE_US_API_BASE = "https://api.binance.us/api/v3";
const getBinanceSymbol = (symbol)=>{
    let s = symbol.toUpperCase();
    if (s === 'USDT') return 'USDCUSDT';
    return `${s}USDT`;
};
const intervalToSeconds = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400
};
const generateMockCandles = (symbol, interval, count = 200)=>{
    const candles = [];
    const now = Math.floor(Date.now() / 1000);
    const intervalSecs = intervalToSeconds[interval] || 3600;
    let basePrice = symbol.toLowerCase().includes('btc') ? 96000 : symbol.toLowerCase().includes('eth') ? 3500 : symbol.toLowerCase().includes('sol') ? 180 : symbol.toLowerCase().includes('bnb') ? 600 : 100;
    let currentPrice = basePrice;
    for(let i = count - 1; i >= 0; i--){
        const time = now - i * intervalSecs;
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
            volume
        });
    }
    return candles;
};
const getHistoricalCandles = async (symbol, interval = '1h')=>{
    const pair = getBinanceSymbol(symbol);
    const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`${BINANCE_API_BASE}/klines?symbol=${pair}&interval=${interval}&limit=500`)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`${BINANCE_API_BASE}/klines?symbol=${pair}&interval=${interval}&limit=500`)}`
    ];
    for (const proxyUrl of proxyUrls){
        try {
            const response = await fetch(proxyUrl, {
                signal: AbortSignal.timeout(8000)
            });
            if (!response.ok) continue;
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data.map((d)=>({
                        time: d[0] / 1000,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4]),
                        volume: parseFloat(d[5])
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
const subscribeToTicker = (symbol, interval, callback)=>{
    const pair = getBinanceSymbol(symbol).toLowerCase();
    let mockInterval = null;
    let ws = null;
    const startMockUpdates = ()=>{
        let lastCandle = generateMockCandles(symbol, interval, 1)[0];
        mockInterval = setInterval(()=>{
            const volatility = 0.001;
            const change = (Math.random() - 0.5) * volatility;
            const newClose = lastCandle.close * (1 + change);
            lastCandle = {
                time: Math.floor(Date.now() / 1000),
                open: lastCandle.close,
                high: Math.max(lastCandle.close, newClose) * (1 + Math.random() * 0.001),
                low: Math.min(lastCandle.close, newClose) * (1 - Math.random() * 0.001),
                close: newClose,
                volume: Math.random() * 100000 + 50000
            };
            callback(lastCandle);
        }, 2000);
    };
    try {
        ws = new WebSocket(`${BINANCE_WS_BASE}/${pair}@kline_${interval}`);
        const timeout = setTimeout(()=>{
            if (ws && ws.readyState !== WebSocket.OPEN) {
                ws.close();
                console.info("WebSocket baglantisi kurulamadi, demo mod aktif");
                startMockUpdates();
            }
        }, 5000);
        ws.onopen = ()=>{
            clearTimeout(timeout);
        };
        ws.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            if (message.e === 'kline') {
                const k = message.k;
                const candle = {
                    time: k.t / 1000,
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                    volume: parseFloat(k.v)
                };
                callback(candle);
            }
        };
        ws.onerror = ()=>{
            clearTimeout(timeout);
            console.info("WebSocket hatasi, demo mod aktif");
            if (!mockInterval) {
                startMockUpdates();
            }
        };
        ws.onclose = ()=>{
            clearTimeout(timeout);
        };
    } catch (error) {
        console.info("WebSocket desteklenmiyor, demo mod aktif");
        startMockUpdates();
    }
    return {
        close: ()=>{
            if (ws) ws.close();
            if (mockInterval) clearInterval(mockInterval);
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TradingChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lightweight-charts/dist/lightweight-charts.development.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$binanceService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/binanceService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const calculateSMA = (data, period)=>{
    const result = [];
    for(let i = 0; i < data.length; i++){
        if (i < period - 1) {
            result.push(null);
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b)=>a + b, 0);
            result.push(sum / period);
        }
    }
    return result;
};
const calculateEMA = (data, period)=>{
    const result = [];
    const multiplier = 2 / (period + 1);
    for(let i = 0; i < data.length; i++){
        if (i < period - 1) {
            result.push(null);
        } else if (i === period - 1) {
            const sum = data.slice(0, period).reduce((a, b)=>a + b, 0);
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
const calculateBollingerBands = (data, period = 20, stdDev = 2)=>{
    const sma = calculateSMA(data, period);
    const upper = [];
    const lower = [];
    for(let i = 0; i < data.length; i++){
        if (sma[i] === null) {
            upper.push(null);
            lower.push(null);
        } else {
            const slice = data.slice(Math.max(0, i - period + 1), i + 1);
            const mean = sma[i];
            const variance = slice.reduce((sum, val)=>sum + Math.pow(val - mean, 2), 0) / slice.length;
            const std = Math.sqrt(variance);
            upper.push(mean + stdDev * std);
            lower.push(mean - stdDev * std);
        }
    }
    return {
        middle: sma,
        upper,
        lower
    };
};
const TradingChart = ({ symbol, coinName, onClose })=>{
    _s();
    const chartContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const volumeContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const volumeChartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mainSeriesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const volumeSeriesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const indicatorSeriesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentPrice, setCurrentPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [priceChange, setPriceChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [chartType, setChartType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('candlestick');
    const [timeframe, setTimeframe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1h');
    const [showIndicatorPanel, setShowIndicatorPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [indicators, setIndicators] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        sma20: false,
        sma50: false,
        ema12: false,
        ema26: false,
        bollinger: false,
        volume: true
    });
    const [high24h, setHigh24h] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [low24h, setLow24h] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [volume24h, setVolume24h] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rawData, setRawData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const timeframes = [
        {
            value: '1m',
            label: '1D'
        },
        {
            value: '5m',
            label: '5D'
        },
        {
            value: '15m',
            label: '15D'
        },
        {
            value: '1h',
            label: '1S'
        },
        {
            value: '4h',
            label: '4S'
        },
        {
            value: '1d',
            label: '1G'
        }
    ];
    const updateIndicators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TradingChart.useCallback[updateIndicators]": (data)=>{
            if (!chartRef.current) return;
            const closes = data.map({
                "TradingChart.useCallback[updateIndicators].closes": (d)=>d.close
            }["TradingChart.useCallback[updateIndicators].closes"]);
            const times = data.map({
                "TradingChart.useCallback[updateIndicators].times": (d)=>d.time
            }["TradingChart.useCallback[updateIndicators].times"]);
            indicatorSeriesRef.current.forEach({
                "TradingChart.useCallback[updateIndicators]": (series, key)=>{
                    try {
                        chartRef.current?.removeSeries(series);
                    } catch (e) {}
                }
            }["TradingChart.useCallback[updateIndicators]"]);
            indicatorSeriesRef.current.clear();
            if (indicators.sma20) {
                const sma20 = calculateSMA(closes, 20);
                const sma20Series = chartRef.current.addLineSeries({
                    color: '#f59e0b',
                    lineWidth: 2,
                    title: 'SMA20'
                });
                const sma20Data = times.map({
                    "TradingChart.useCallback[updateIndicators].sma20Data": (time, i)=>({
                            time: time,
                            value: sma20[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].sma20Data"]).filter({
                    "TradingChart.useCallback[updateIndicators].sma20Data": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].sma20Data"]);
                sma20Series.setData(sma20Data);
                indicatorSeriesRef.current.set('sma20', sma20Series);
            }
            if (indicators.sma50) {
                const sma50 = calculateSMA(closes, 50);
                const sma50Series = chartRef.current.addLineSeries({
                    color: '#8b5cf6',
                    lineWidth: 2,
                    title: 'SMA50'
                });
                const sma50Data = times.map({
                    "TradingChart.useCallback[updateIndicators].sma50Data": (time, i)=>({
                            time: time,
                            value: sma50[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].sma50Data"]).filter({
                    "TradingChart.useCallback[updateIndicators].sma50Data": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].sma50Data"]);
                sma50Series.setData(sma50Data);
                indicatorSeriesRef.current.set('sma50', sma50Series);
            }
            if (indicators.ema12) {
                const ema12 = calculateEMA(closes, 12);
                const ema12Series = chartRef.current.addLineSeries({
                    color: '#06b6d4',
                    lineWidth: 2,
                    title: 'EMA12'
                });
                const ema12Data = times.map({
                    "TradingChart.useCallback[updateIndicators].ema12Data": (time, i)=>({
                            time: time,
                            value: ema12[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].ema12Data"]).filter({
                    "TradingChart.useCallback[updateIndicators].ema12Data": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].ema12Data"]);
                ema12Series.setData(ema12Data);
                indicatorSeriesRef.current.set('ema12', ema12Series);
            }
            if (indicators.ema26) {
                const ema26 = calculateEMA(closes, 26);
                const ema26Series = chartRef.current.addLineSeries({
                    color: '#ec4899',
                    lineWidth: 2,
                    title: 'EMA26'
                });
                const ema26Data = times.map({
                    "TradingChart.useCallback[updateIndicators].ema26Data": (time, i)=>({
                            time: time,
                            value: ema26[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].ema26Data"]).filter({
                    "TradingChart.useCallback[updateIndicators].ema26Data": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].ema26Data"]);
                ema26Series.setData(ema26Data);
                indicatorSeriesRef.current.set('ema26', ema26Series);
            }
            if (indicators.bollinger) {
                const bb = calculateBollingerBands(closes, 20, 2);
                const upperSeries = chartRef.current.addLineSeries({
                    color: 'rgba(33, 150, 243, 0.5)',
                    lineWidth: 1,
                    lineStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineStyle"].Dashed,
                    title: 'BB Upper'
                });
                const upperData = times.map({
                    "TradingChart.useCallback[updateIndicators].upperData": (time, i)=>({
                            time: time,
                            value: bb.upper[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].upperData"]).filter({
                    "TradingChart.useCallback[updateIndicators].upperData": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].upperData"]);
                upperSeries.setData(upperData);
                indicatorSeriesRef.current.set('bb_upper', upperSeries);
                const lowerSeries = chartRef.current.addLineSeries({
                    color: 'rgba(33, 150, 243, 0.5)',
                    lineWidth: 1,
                    lineStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineStyle"].Dashed,
                    title: 'BB Lower'
                });
                const lowerData = times.map({
                    "TradingChart.useCallback[updateIndicators].lowerData": (time, i)=>({
                            time: time,
                            value: bb.lower[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].lowerData"]).filter({
                    "TradingChart.useCallback[updateIndicators].lowerData": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].lowerData"]);
                lowerSeries.setData(lowerData);
                indicatorSeriesRef.current.set('bb_lower', lowerSeries);
                const middleSeries = chartRef.current.addLineSeries({
                    color: 'rgba(33, 150, 243, 0.8)',
                    lineWidth: 1,
                    title: 'BB Middle'
                });
                const middleData = times.map({
                    "TradingChart.useCallback[updateIndicators].middleData": (time, i)=>({
                            time: time,
                            value: bb.middle[i] || 0
                        })
                }["TradingChart.useCallback[updateIndicators].middleData"]).filter({
                    "TradingChart.useCallback[updateIndicators].middleData": (d)=>d.value !== 0
                }["TradingChart.useCallback[updateIndicators].middleData"]);
                middleSeries.setData(middleData);
                indicatorSeriesRef.current.set('bb_middle', middleSeries);
            }
        }
    }["TradingChart.useCallback[updateIndicators]"], [
        indicators
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingChart.useEffect": ()=>{
            if (rawData.length > 0) {
                updateIndicators(rawData);
            }
        }
    }["TradingChart.useEffect"], [
        indicators,
        rawData,
        updateIndicators
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingChart.useEffect": ()=>{
            if (!chartContainerRef.current) return;
            let isMounted = true;
            indicatorSeriesRef.current.forEach({
                "TradingChart.useEffect": (series)=>{
                    try {
                        chartRef.current?.removeSeries(series);
                    } catch (e) {}
                }
            }["TradingChart.useEffect"]);
            indicatorSeriesRef.current.clear();
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
            if (volumeChartRef.current) {
                volumeChartRef.current.remove();
                volumeChartRef.current = null;
            }
            const chart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChart"])(chartContainerRef.current, {
                layout: {
                    background: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorType"].Solid,
                        color: '#ffffff'
                    },
                    textColor: '#6b7280'
                },
                grid: {
                    vertLines: {
                        color: '#f3f4f6'
                    },
                    horzLines: {
                        color: '#f3f4f6'
                    }
                },
                width: chartContainerRef.current.clientWidth,
                height: indicators.volume ? 400 : 500,
                crosshair: {
                    mode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrosshairMode"].Normal
                },
                rightPriceScale: {
                    borderColor: '#e5e7eb'
                },
                timeScale: {
                    borderColor: '#e5e7eb',
                    timeVisible: true
                }
            });
            chartRef.current = chart;
            let mainSeries;
            if (chartType === 'candlestick') {
                mainSeries = chart.addCandlestickSeries({
                    upColor: '#10b981',
                    downColor: '#ef4444',
                    borderVisible: false,
                    wickUpColor: '#10b981',
                    wickDownColor: '#ef4444'
                });
            } else if (chartType === 'line') {
                mainSeries = chart.addLineSeries({
                    color: '#2563eb',
                    lineWidth: 2
                });
            } else {
                mainSeries = chart.addAreaSeries({
                    topColor: 'rgba(37, 99, 235, 0.4)',
                    bottomColor: 'rgba(37, 99, 235, 0.0)',
                    lineColor: '#2563eb',
                    lineWidth: 2
                });
            }
            mainSeriesRef.current = mainSeries;
            if (indicators.volume && volumeContainerRef.current) {
                const volumeChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChart"])(volumeContainerRef.current, {
                    layout: {
                        background: {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorType"].Solid,
                            color: '#ffffff'
                        },
                        textColor: '#6b7280'
                    },
                    grid: {
                        vertLines: {
                            color: '#f3f4f6'
                        },
                        horzLines: {
                            color: '#f3f4f6'
                        }
                    },
                    width: volumeContainerRef.current.clientWidth,
                    height: 100,
                    rightPriceScale: {
                        borderColor: '#e5e7eb'
                    },
                    timeScale: {
                        visible: false
                    }
                });
                volumeChartRef.current = volumeChart;
                const volumeSeries = volumeChart.addHistogramSeries({
                    color: '#60a5fa',
                    priceFormat: {
                        type: 'volume'
                    }
                });
                volumeSeriesRef.current = volumeSeries;
                chart.timeScale().subscribeVisibleLogicalRangeChange({
                    "TradingChart.useEffect": (logicalRange)=>{
                        if (logicalRange && volumeChartRef.current) {
                            volumeChartRef.current.timeScale().setVisibleLogicalRange(logicalRange);
                        }
                    }
                }["TradingChart.useEffect"]);
            }
            const handleResize = {
                "TradingChart.useEffect.handleResize": ()=>{
                    if (chartContainerRef.current && chartRef.current) {
                        try {
                            chartRef.current.applyOptions({
                                width: chartContainerRef.current.clientWidth
                            });
                        } catch (e) {}
                    }
                    if (volumeContainerRef.current && volumeChartRef.current) {
                        try {
                            volumeChartRef.current.applyOptions({
                                width: volumeContainerRef.current.clientWidth
                            });
                        } catch (e) {}
                    }
                }
            }["TradingChart.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            const loadData = {
                "TradingChart.useEffect.loadData": async ()=>{
                    try {
                        const history = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$binanceService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHistoricalCandles"])(symbol, timeframe);
                        if (!isMounted || !mainSeriesRef.current) return;
                        if (history.length > 0) {
                            setRawData(history);
                            if (chartType === 'candlestick') {
                                const chartData = history.map({
                                    "TradingChart.useEffect.loadData.chartData": (candle)=>({
                                            time: candle.time,
                                            open: candle.open,
                                            high: candle.high,
                                            low: candle.low,
                                            close: candle.close
                                        })
                                }["TradingChart.useEffect.loadData.chartData"]);
                                mainSeriesRef.current.setData(chartData);
                            } else {
                                const chartData = history.map({
                                    "TradingChart.useEffect.loadData.chartData": (candle)=>({
                                            time: candle.time,
                                            value: candle.close
                                        })
                                }["TradingChart.useEffect.loadData.chartData"]);
                                mainSeriesRef.current.setData(chartData);
                            }
                            if (volumeSeriesRef.current) {
                                const volumeData = history.map({
                                    "TradingChart.useEffect.loadData.volumeData": (candle)=>({
                                            time: candle.time,
                                            value: candle.volume || 0,
                                            color: candle.close >= candle.open ? '#10b981' : '#ef4444'
                                        })
                                }["TradingChart.useEffect.loadData.volumeData"]);
                                volumeSeriesRef.current.setData(volumeData);
                            }
                            const last = history[history.length - 1];
                            setCurrentPrice(last.close);
                            const highs = history.map({
                                "TradingChart.useEffect.loadData.highs": (c)=>c.high
                            }["TradingChart.useEffect.loadData.highs"]);
                            const lows = history.map({
                                "TradingChart.useEffect.loadData.lows": (c)=>c.low
                            }["TradingChart.useEffect.loadData.lows"]);
                            const volumes = history.map({
                                "TradingChart.useEffect.loadData.volumes": (c)=>c.volume || 0
                            }["TradingChart.useEffect.loadData.volumes"]);
                            setHigh24h(Math.max(...highs));
                            setLow24h(Math.min(...lows));
                            setVolume24h(volumes.reduce({
                                "TradingChart.useEffect.loadData": (a, b)=>a + b
                            }["TradingChart.useEffect.loadData"], 0));
                        }
                        if (wsRef.current) wsRef.current.close();
                        wsRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$binanceService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToTicker"])(symbol, timeframe, {
                            "TradingChart.useEffect.loadData": (candle)=>{
                                if (!isMounted || !mainSeriesRef.current) return;
                                try {
                                    if (chartType === 'candlestick') {
                                        const chartCandle = {
                                            time: candle.time,
                                            open: candle.open,
                                            high: candle.high,
                                            low: candle.low,
                                            close: candle.close
                                        };
                                        mainSeriesRef.current.update(chartCandle);
                                    } else {
                                        mainSeriesRef.current.update({
                                            time: candle.time,
                                            value: candle.close
                                        });
                                    }
                                    if (volumeSeriesRef.current) {
                                        volumeSeriesRef.current.update({
                                            time: candle.time,
                                            value: candle.volume || 0,
                                            color: candle.close >= candle.open ? '#10b981' : '#ef4444'
                                        });
                                    }
                                    setCurrentPrice(candle.close);
                                    const change = (candle.close - candle.open) / candle.open * 100;
                                    setPriceChange(change);
                                } catch (error) {
                                    console.debug("Chart update error:", error);
                                }
                            }
                        }["TradingChart.useEffect.loadData"]);
                    } catch (err) {
                        console.error("Data load error:", err);
                    }
                }
            }["TradingChart.useEffect.loadData"];
            loadData();
            return ({
                "TradingChart.useEffect": ()=>{
                    isMounted = false;
                    window.removeEventListener('resize', handleResize);
                    if (wsRef.current) {
                        wsRef.current.close();
                        wsRef.current = null;
                    }
                    indicatorSeriesRef.current.forEach({
                        "TradingChart.useEffect": (series)=>{
                            try {
                                chartRef.current?.removeSeries(series);
                            } catch (e) {}
                        }
                    }["TradingChart.useEffect"]);
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
                }
            })["TradingChart.useEffect"];
        }
    }["TradingChart.useEffect"], [
        symbol,
        timeframe,
        chartType,
        indicators.volume
    ]);
    const toggleIndicator = (key)=>{
        setIndicators((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full animate-fade-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:justify-between md:items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-gray-900 flex items-center gap-2",
                                                children: [
                                                    coinName,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-normal text-gray-400",
                                                        children: "/ USDT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/TradingChart.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 44
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 489,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-900 font-mono text-lg",
                                                        children: [
                                                            "$",
                                                            currentPrice?.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 6
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/TradingChart.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    priceChange !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                                        children: [
                                                            priceChange >= 0 ? '▲' : '▼',
                                                            " ",
                                                            Math.abs(priceChange).toFixed(2),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/TradingChart.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 492,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 488,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 bg-green-50 text-green-600 text-xs rounded border border-green-200 animate-pulse",
                                        children: "CANLI"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 503,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 487,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex bg-gray-100 rounded-lg p-1",
                                        children: timeframes.map((tf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTimeframe(tf.value),
                                                className: `px-3 py-1 text-xs font-medium rounded transition-all ${timeframe === tf.value ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
                                                children: tf.label
                                            }, tf.value, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 509,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 507,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex bg-gray-100 rounded-lg p-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChartType('candlestick'),
                                                className: `px-2 py-1 rounded transition-all ${chartType === 'candlestick' ? 'bg-white shadow-sm' : ''}`,
                                                title: "Mum Grafigi",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "4",
                                                            y: "4",
                                                            width: "4",
                                                            height: "16",
                                                            rx: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/TradingChart.tsx",
                                                            lineNumber: 530,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "10",
                                                            y: "8",
                                                            width: "4",
                                                            height: "8",
                                                            rx: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/TradingChart.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "16",
                                                            y: "2",
                                                            width: "4",
                                                            height: "20",
                                                            rx: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/TradingChart.tsx",
                                                            lineNumber: 532,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/TradingChart.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 524,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChartType('line'),
                                                className: `px-2 py-1 rounded transition-all ${chartType === 'line' ? 'bg-white shadow-sm' : ''}`,
                                                title: "Cizgi Grafik",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3 12l5-5 4 4 5-5 4 4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/TradingChart.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/TradingChart.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 535,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChartType('area'),
                                                className: `px-2 py-1 rounded transition-all ${chartType === 'area' ? 'bg-white shadow-sm' : ''}`,
                                                title: "Alan Grafik",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    opacity: "0.5",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3 20V12l5-5 4 4 5-5 4 4v10H3z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/TradingChart.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/TradingChart.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 544,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 523,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowIndicatorPanel(!showIndicatorPanel),
                                        className: `px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${showIndicatorPanel ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/TradingChart.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 561,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Indikatorler"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 555,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: "text-gray-400 hover:text-gray-900 p-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 570,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/TradingChart.tsx",
                                            lineNumber: 569,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 568,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 506,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TradingChart.tsx",
                        lineNumber: 486,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    showIndicatorPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-700 mb-3",
                                children: "Teknik Indikatorler"
                            }, void 0, false, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 579,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('sma20'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.sma20 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "SMA 20"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 589,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Basit Ortalama"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 590,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 581,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('sma50'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.sma50 ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "SMA 50"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 600,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Basit Ortalama"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 601,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 592,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('ema12'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.ema12 ? 'bg-cyan-100 border-cyan-300 text-cyan-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "EMA 12"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 611,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Ustel Ortalama"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 612,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 603,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('ema26'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.ema26 ? 'bg-pink-100 border-pink-300 text-pink-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "EMA 26"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 622,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Ustel Ortalama"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 623,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 614,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('bollinger'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.bollinger ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "Bollinger"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 633,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Bant Gostergesi"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 634,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 625,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleIndicator('volume'),
                                        className: `px-3 py-2 text-xs font-medium rounded-lg border transition-all ${indicators.volume ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block font-bold",
                                                children: "Hacim"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 644,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10px] opacity-75",
                                                children: "Islem Hacmi"
                                            }, void 0, false, {
                                                fileName: "[project]/components/TradingChart.tsx",
                                                lineNumber: 645,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 636,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 580,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TradingChart.tsx",
                        lineNumber: 578,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 grid grid-cols-3 gap-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mb-1",
                                        children: "24s Yuksek"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 653,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-semibold text-green-600",
                                        children: [
                                            "$",
                                            high24h?.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 6
                                            }) || '-'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 654,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 652,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mb-1",
                                        children: "24s Dusuk"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 659,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-semibold text-red-600",
                                        children: [
                                            "$",
                                            low24h?.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 6
                                            }) || '-'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 660,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 658,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mb-1",
                                        children: "24s Hacim"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 665,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-semibold text-blue-600",
                                        children: volume24h ? `$${(volume24h / 1000000).toFixed(2)}M` : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/components/TradingChart.tsx",
                                        lineNumber: 666,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TradingChart.tsx",
                                lineNumber: 664,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TradingChart.tsx",
                        lineNumber: 651,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/TradingChart.tsx",
                lineNumber: 485,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 min-h-[400px] w-full",
                ref: chartContainerRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-4 left-4 z-10 opacity-30 pointer-events-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-5xl font-bold text-gray-200 uppercase select-none",
                        children: symbol
                    }, void 0, false, {
                        fileName: "[project]/components/TradingChart.tsx",
                        lineNumber: 675,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/TradingChart.tsx",
                    lineNumber: 674,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/TradingChart.tsx",
                lineNumber: 673,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            indicators.volume && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[100px] w-full border-t border-gray-100",
                ref: volumeContainerRef
            }, void 0, false, {
                fileName: "[project]/components/TradingChart.tsx",
                lineNumber: 680,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-2 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100",
                children: [
                    "Veriler Binance WebSocket API uzerinden gercek zamanli saglanmaktadir. •",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-blue-600",
                        children: " TradingView Lightweight Charts"
                    }, void 0, false, {
                        fileName: "[project]/components/TradingChart.tsx",
                        lineNumber: 685,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/TradingChart.tsx",
                lineNumber: 683,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/TradingChart.tsx",
        lineNumber: 484,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TradingChart, "50eh8cONlZqr5eny5wWXXJIrrmo=");
_c = TradingChart;
const __TURBOPACK__default__export__ = TradingChart;
var _c;
__turbopack_context__.k.register(_c, "TradingChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/grafik/[symbol]/ChartPageClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChartPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TradingChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TradingChart.tsx [app-client] (ecmascript)");
'use client';
;
;
;
const coinNames = {
    'btc': 'Bitcoin',
    'eth': 'Ethereum',
    'bnb': 'Binance Coin',
    'xrp': 'XRP',
    'ada': 'Cardano',
    'sol': 'Solana',
    'doge': 'Dogecoin',
    'dot': 'Polkadot',
    'matic': 'Polygon',
    'shib': 'Shiba Inu',
    'ltc': 'Litecoin',
    'avax': 'Avalanche',
    'link': 'Chainlink',
    'atom': 'Cosmos',
    'uni': 'Uniswap'
};
function ChartPageClient({ symbol }) {
    const coinName = coinNames[symbol.toLowerCase()] || symbol.toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-gray-200 sticky top-0 z-40",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-500 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/logo.png",
                                    alt: "KriptoPusula Logo",
                                    className: "w-10 h-10 object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                "KriptoPusula"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "text-gray-500 hover:text-gray-900 transition-colors text-sm",
                                    children: "Ana Sayfa"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/blog",
                                    className: "text-gray-500 hover:text-gray-900 transition-colors text-sm",
                                    children: "Blog"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-blue-600 font-medium text-sm",
                                    children: "Grafik"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex items-center gap-2 text-sm text-gray-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "hover:text-blue-600",
                                    children: "Ana Sayfa"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "hover:text-blue-600",
                                    children: "Piyasa"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-900 font-medium",
                                    children: [
                                        coinName,
                                        " Grafik"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TradingChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        symbol: symbol,
                        coinName: coinName
                    }, void 0, false, {
                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl border border-gray-200 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-blue-600",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                lineNumber: 68,
                                                columnNumber: 15
                                            }, this),
                                            "Teknik Analiz"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "SMA, EMA, Bollinger Bands gibi profesyonel teknik indikatorleri kullanarak piyasayi analiz edin."
                                    }, void 0, false, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl border border-gray-200 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-green-600",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                lineNumber: 80,
                                                columnNumber: 15
                                            }, this),
                                            "Canli Veri"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 79,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Binance WebSocket API uzerinden anlik fiyat guncellemeleri ve gercek zamanli mum grafikleri."
                                    }, void 0, false, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl border border-gray-200 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-purple-600",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this),
                                            "Coklu Zaman Dilimi"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "1 dakika ile 1 gun arasinda farkli zaman dilimlerinde grafik analizi yapin."
                                    }, void 0, false, {
                                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "bg-white border-t border-gray-200 mt-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "KriptoPusula - Yapay Zeka Destekli Kripto Takibi"
                        }, void 0, false, {
                            fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-xs",
                            children: "Veriler Binance tarafindan saglanmaktadir. Yatirim tavsiyesi degildir."
                        }, void 0, false, {
                            fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/grafik/[symbol]/ChartPageClient.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = ChartPageClient;
var _c;
__turbopack_context__.k.register(_c, "ChartPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0103ea19._.js.map