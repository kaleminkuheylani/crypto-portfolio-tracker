# KriptoPusula - Crypto Portfolio Tracker

## Overview
KriptoPusula is a cryptocurrency portfolio tracking application built with Next.js. It provides real-time market data, portfolio management, AI-powered investment insights, technical charts, price alerts, and an AI-generated blog section.

## Recent Changes
- **2025-12-03**: Converted from Vite to Next.js App Router (v16)
- **2025-12-03**: Created server-side API routes for secure API key handling
- **2025-12-03**: Fixed CORS issues with CoinPaprika and Alternative.me APIs

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router with Turbopack)
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: lightweight-charts (TradingView), Recharts
- **AI**: Google Gemini API (via @google/genai)

### Project Structure
```
kriptopusula/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main app entry (client component)
│   └── api/               # API Routes (server-side)
│       ├── crypto/        # Crypto data proxy (CoinPaprika, F&G)
│       ├── gemini/        # Gemini AI endpoints
│       │   └── analyze/   # Portfolio analysis
│       └── blog/          # AI-generated blog posts
├── components/            # React components
├── services/              # API service functions
├── contexts/              # React Context providers
├── types.ts               # TypeScript type definitions
└── next.config.js         # Next.js configuration
```

### API Routes
All external API calls are proxied through Next.js API routes to:
1. Keep GEMINI_API_KEY secure on server-side
2. Handle CORS issues with third-party APIs

| Route | Purpose |
|-------|---------|
| `/api/crypto?action=tickers` | Get top 100 coins from CoinPaprika |
| `/api/crypto?action=search&q=` | Search coins |
| `/api/crypto?action=feargreed` | Get Fear & Greed index |
| `/api/gemini/analyze` | AI portfolio analysis |
| `/api/blog/generate` | Generate AI blog posts |

### Data Sources
- **Market Data**: CoinPaprika API (no API key required)
- **Fear & Greed Index**: Alternative.me API
- **Charts**: Binance public klines API
- **AI Insights**: Google Gemini 1.5 Flash

## Environment Variables
- `GEMINI_API_KEY` - Required for AI features (stored as secret)

## Development
The app runs on port 5000 to work with Replit's webview system.

```bash
npm run dev
```

## User Preferences
- Dark theme with Turkish language
- Premium features are client-side gated (5 asset limit for free users)

## Key Features
1. **Portfolio Panel**: Track up to 5 crypto assets (free) or unlimited (premium)
2. **Live Market (Canli Piyasa)**: Real-time prices for top 100 cryptocurrencies
3. **Pro Charts (Pro Grafik)**: TradingView-style candlestick charts with Binance data
4. **Alarms (Alarmlar)**: Price alert notifications (premium feature)
5. **Blog & News**: AI-generated crypto analysis articles
6. **Gemini AI Advisor**: Portfolio analysis and recommendations
