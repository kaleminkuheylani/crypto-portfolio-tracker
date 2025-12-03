module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/crypto/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const API_BASE = 'https://api.coinpaprika.com/v1';
const IMAGE_BASE = 'https://static.coinpaprika.com/coin';
const mapPaprikaToCoinData = (coin)=>{
    const usdData = coin.quotes?.USD || {};
    return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: `${IMAGE_BASE}/${coin.id}/logo.png`,
        current_price: usdData.price || 0,
        market_cap: usdData.market_cap || 0,
        market_cap_rank: coin.rank,
        fully_diluted_valuation: usdData.fully_diluted_market_cap || null,
        total_volume: usdData.volume_24h || 0,
        high_24h: usdData.ath_price || 0,
        low_24h: 0,
        price_change_24h: 0,
        price_change_percentage_24h: usdData.percent_change_24h || 0,
        market_cap_change_24h: usdData.market_cap_change_24h || 0,
        market_cap_change_percentage_24h: usdData.percent_change_24h || 0,
        circulating_supply: coin.circulating_supply || 0,
        total_supply: coin.total_supply || 0,
        max_supply: coin.max_supply || 0,
        ath: usdData.ath_price || 0,
        ath_change_percentage: usdData.percent_from_price_ath || 0,
        ath_date: usdData.ath_date || '',
        atl: 0,
        atl_change_percentage: 0,
        atl_date: '',
        roi: null,
        last_updated: new Date().toISOString(),
        sparkline_in_7d: {
            price: []
        }
    };
};
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    try {
        if (action === 'tickers') {
            const response = await fetch(`${API_BASE}/tickers?quotes=USD`, {
                headers: {
                    'Accept': 'application/json'
                },
                next: {
                    revalidate: 30
                }
            });
            if (!response.ok) {
                throw new Error('CoinPaprika API Error');
            }
            const json = await response.json();
            const coins = json.slice(0, 100).map(mapPaprikaToCoinData);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(coins);
        }
        if (action === 'search') {
            const query = searchParams.get('q');
            if (!query) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
            }
            const response = await fetch(`${API_BASE}/search?q=${query}&c=currencies&limit=20`);
            if (!response.ok) {
                throw new Error('CoinPaprika Search Error');
            }
            const json = await response.json();
            if (json.currencies && json.currencies.length > 0) {
                const coinId = json.currencies[0].id;
                const tickerResponse = await fetch(`${API_BASE}/tickers/${coinId}`);
                if (tickerResponse.ok) {
                    const coinDetail = await tickerResponse.json();
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([
                        mapPaprikaToCoinData(coinDetail)
                    ]);
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
        }
        if (action === 'feargreed') {
            const response = await fetch('https://api.alternative.me/fng/', {
                next: {
                    revalidate: 300
                }
            });
            if (!response.ok) {
                throw new Error('F&G API Error');
            }
            const json = await response.json();
            if (json.data && json.data.length > 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(json.data[0]);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(null);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Crypto API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch data'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3747af30._.js.map