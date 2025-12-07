/**
 * Script to fetch and display all coin IDs that are included in the sitemap
 * This helps visualize what coin detail and chart pages are being generated
 */

interface CoinData {
  id: string;
  symbol: string;
  name: string;
}

async function fetchAllCoinIds() {
  try {
    // Fetch coin data from the API (same as used in sitemap)
    const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins from CoinPaprika API');
    }

    const jsonData = await response.json();
    
    // Take top 200 coins (as used in sitemap)
    const coins: CoinData[] = jsonData.slice(0, 200).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name
    }));

    // Display the coin information
    console.log('=== Coin Detail Pages (/piyasa/[coin-id]) ===');
    coins.forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) - ID: ${coin.id}`);
    });

    console.log('\n=== Chart Pages (/grafik/[coin-symbol]) ===');
    coins.forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} - Symbol: ${coin.symbol.toLowerCase()}`);
    });

    console.log(`\nTotal coins included in sitemap: ${coins.length}`);

    // Save to a file for easy reference
    const fs = require('fs');
    const outputPath = './coin_urls.txt';
    
    let content = '# Coin URLs for Sitemap\n\n';
    content += '## Coin Detail Pages (/piyasa/[coin-id])\n';
    coins.forEach((coin, index) => {
      content += `${index + 1}. https://kriptosavasi.com/piyasa/${coin.id}\n`;
    });
    
    content += '\n## Chart Pages (/grafik/[coin-symbol])\n';
    coins.forEach((coin, index) => {
      content += `${index + 1}. https://kriptosavasi.com/grafik/${coin.symbol.toLowerCase()}\n`;
    });
    
    fs.writeFileSync(outputPath, content);
    console.log(`\nURLs saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error fetching coin data:', error);
    
    // Fallback to manual list (same as in sitemap)
    console.log('\n=== Fallback Popular Coins ===');
    const fallbackCoins = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
      { id: 'binance-coin', symbol: 'bnb', name: 'Binance Coin' },
      { id: 'solana', symbol: 'sol', name: 'Solana' },
      { id: 'ripple', symbol: 'xrp', name: 'Ripple' },
      { id: 'cardano', symbol: 'ada', name: 'Cardano' },
      { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
      { id: 'polygon', symbol: 'matic', name: 'Polygon' },
      { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
      { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' }
    ];
    
    console.log('\nCoin Detail Pages:');
    fallbackCoins.forEach(coin => {
      console.log(`- https://kriptosavasi.com/piyasa/${coin.id}`);
    });
    
    console.log('\nChart Pages:');
    fallbackCoins.forEach(coin => {
      console.log(`- https://kriptosavasi.com/grafik/${coin.symbol}`);
    });
  }
}

// Run the function
fetchAllCoinIds();