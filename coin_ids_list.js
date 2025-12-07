/**
 * Script to fetch and display all coin IDs that are included in the sitemap
 * This helps visualize what coin detail and chart pages are being generated
 */

async function fetchAllCoinIds() {
  try {
    // Fetch coin data from the API (same as used in sitemap)
    const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins from CoinPaprika API');
    }

    const jsonData = await response.json();
    
    // Take top 200 coins (as used in sitemap)
    const coins = jsonData.slice(0, 200).map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name
    }));

    // Generate the content for the file
    let content = '# Coin URLs for Sitemap\n\n';
    content += '## Coin Detail Pages (/piyasa/[coin-id])\n';
    coins.forEach((coin, index) => {
      content += `${index + 1}. https://kriptosavasi.com/piyasa/${coin.id} - ${coin.name} (${coin.symbol.toUpperCase()})\n`;
    });
    
    content += '\n## Chart Pages (/grafik/[coin-symbol])\n';
    coins.forEach((coin, index) => {
      content += `${index + 1}. https://kriptosavasi.com/grafik/${coin.symbol.toLowerCase()} - ${coin.name}\n`;
    });
    
    content += `\n\nTotal coins included in sitemap: ${coins.length}`;
    
    // Save to a file for easy reference
    const fs = require('fs');
    const outputPath = './coin_urls.txt';
    fs.writeFileSync(outputPath, content);
    
    console.log('Coin URLs have been saved to coin_urls.txt');
    console.log(`Total coins included in sitemap: ${coins.length}`);
    
    // Also save a simplified list of just the IDs and symbols
    let simpleList = 'Coin IDs and Symbols List\n========================\n\n';
    simpleList += 'Coin Detail Page IDs:\n';
    coins.forEach((coin, index) => {
      simpleList += `${index + 1}. ${coin.id}\n`;
    });
    
    simpleList += '\nChart Page Symbols:\n';
    coins.forEach((coin, index) => {
      simpleList += `${index + 1}. ${coin.symbol.toLowerCase()}\n`;
    });
    
    fs.writeFileSync('./coin_ids_and_symbols.txt', simpleList);
    console.log('Simple list saved to coin_ids_and_symbols.txt');
    
  } catch (error) {
    console.error('Error fetching coin data:', error.message);
    
    // Fallback to manual list (same as in sitemap)
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
    
    let fallbackContent = '# Fallback Coin URLs\n\n';
    fallbackContent += '## Coin Detail Pages:\n';
    fallbackCoins.forEach(coin => {
      fallbackContent += `- https://kriptosavasi.com/piyasa/${coin.id} - ${coin.name}\n`;
    });
    
    fallbackContent += '\n## Chart Pages:\n';
    fallbackCoins.forEach(coin => {
      fallbackContent += `- https://kriptosavasi.com/grafik/${coin.symbol} - ${coin.name}\n`;
    });
    
    const fs = require('fs');
    fs.writeFileSync('./fallback_coin_urls.txt', fallbackContent);
    console.log('Fallback URLs saved to fallback_coin_urls.txt');
  }
}

// Run the function
fetchAllCoinIds().catch(console.error);