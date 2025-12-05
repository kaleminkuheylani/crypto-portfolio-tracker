# KriptoPusula - Crypto Portfolio Tracker

## Overview
KriptoPusula is a cryptocurrency portfolio tracking application built with Next.js. It provides real-time market data, portfolio management, AI-powered investment insights, technical charts, price alerts, and an AI-generated blog section. The application operates as a non-profit initiative focused on crypto education.

## Recent Changes
- **2025-12-05**: Enhanced Binance service with multiple proxy fallbacks and mock data generation for regional blocking
- **2025-12-05**: Added metadataBase for proper SEO image resolution
- **2025-12-05**: Removed Tailwind CDN in favor of PostCSS build
- **2025-12-05**: Created dynamic routing: /blog/[slug], /grafik/[symbol], /piyasa/[coin], /hakkimizda
- **2025-12-05**: Enhanced TradingChart with timeframes (1m-1w), indicators (MA, EMA, RSI, MACD, Bollinger Bands), volume display
- **2025-12-05**: Added SEO: robots.txt, manifest.json, structured data, meta tags
- **2025-12-05**: Converted entire UI from dark theme to white/light theme
- **2025-12-05**: Removed sidebar, implemented horizontal top navigation bar
- **2025-12-05**: Removed all premium/paid features (PremiumModal, PaymentModal, portfolio limits)
- **2025-12-05**: Added Market Sentiment Panel with 3 sources (Reddit, Sentcrypt, Fear & Greed)
- **2025-12-05**: Added monthly prediction feature with Gemini AI (1 prediction per user per asset per month)
- **2025-12-05**: Redesigned About page as non-profit organization
- **2025-12-03**: Converted from Vite to Next.js App Router (v16)
- **2025-12-03**: Created server-side API routes for secure API key handling
- **2025-12-03**: Fixed CORS issues with CoinPaprika and Alternative.me APIs

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router with Turbopack)
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with white/light theme
- **Charts**: lightweight-charts (TradingView), Recharts
- **AI**: Google Gemini API (via @google/genai)

### Project Structure
```
kriptopusula/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Main app entry (client component)
│   ├── blog/[slug]/       # Dynamic blog pages with SEO
│   ├── grafik/[symbol]/   # Dynamic chart pages with indicators
│   ├── piyasa/[coin]/     # Dynamic market detail pages
│   ├── hakkimizda/        # About page
│   └── api/               # API Routes (server-side)
│       ├── crypto/        # Crypto data proxy (CoinPaprika, F&G, Sentiment)
│       ├── gemini/        # Gemini AI endpoints
│       │   ├── analyze/   # Portfolio analysis
│       │   └── predict/   # Monthly predictions
│       └── blog/          # AI-generated blog posts
├── components/            # React components
│   ├── MarketSentimentPanel.tsx  # 3-source sentiment analysis
│   ├── GeminiAdvisor.tsx         # AI predictions (monthly limit per asset)
│   ├── AboutSection.tsx          # Non-profit organization info
│   ├── PortfolioSection.tsx      # Portfolio management
│   ├── MarketTable.tsx           # Live market data
│   ├── TradingChart.tsx          # Candlestick charts
│   ├── BlogSection.tsx           # AI-generated articles
│   └── AuthModal.tsx             # User authentication
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
| `/api/crypto?action=sentiment` | Get aggregated sentiment from 3 sources |
| `/api/gemini/analyze` | AI portfolio analysis |
| `/api/gemini/predict` | Monthly AI predictions (per user per asset) |
| `/api/blog/generate` | Generate AI blog posts |

### Data Sources
- **Market Data**: CoinPaprika API (no API key required)
- **Fear & Greed Index**: Alternative.me API
- **Charts**: Binance public klines API
- **AI Insights**: Google Gemini 2.0 Flash

## Environment Variables
- `GEMINI_API_KEY` - Required for AI features (stored as secret)

## Development
The app runs on port 5000 to work with Replit's webview system.

```bash
npm run dev
```

## User Preferences
- White/light theme with Turkish language
- No premium features - all features available to all users
- Non-profit organization branding

## Key Features
1. **Portfolio Panel**: Track unlimited crypto assets (no restrictions)
2. **Market Sentiment**: Real-time sentiment from Reddit, Sentcrypt AI, Fear & Greed
3. **Live Market (Canli Piyasa)**: Real-time prices for top 100 cryptocurrencies
4. **Pro Charts (Pro Grafik)**: TradingView-style candlestick charts with Binance data
5. **Alarms (Alarmlar)**: Price alert notifications
6. **Blog & News**: AI-generated crypto analysis articles
7. **Gemini AI Advisor**: Monthly predictions per asset with bull/bear indicators
8. **About (Hakkimizda)**: Non-profit organization mission and team
