/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: 'coinpaprika.com' },
      { protocol: 'https', hostname: 'static.coinpaprika.com' },
    ],
    unoptimized: true,
  },
  allowedDevOrigins: [
    'c7e04f8a-9889-4bb2-a83e-7351a27b0f83-00-rsefz2g8jdly.sisko.replit.dev',
    '127.0.0.1',
    'localhost',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
