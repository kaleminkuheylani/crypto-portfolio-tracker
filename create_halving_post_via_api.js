// Script to create Bitcoin Halving Controversy post via API
const bitcoinHalvingContent = {
  title: "Bitcoin Halving Tartışması: 2024'de Fiyat Patlaması mı Yoksa Düşüş mü?",
  slug: "bitcoin-halving-tartismasi-2024",
  metaDescription: "Bitcoin halving etkinliği hakkında uzman görüşleri, fiyat tahminleri ve tartışmalı konular. 2024 halving'inin piyasaya etkileri analiz ediliyor.",
  summary: "Bitcoin'in dört yılda bir gerçekleşen halving etkinliği piyasa tarafından büyük ilgi görüyor. Uzmanlar arasında bu etkinliğin fiyat üzerindeki etkisi konusunda farklı görüşler var. Bu yazımızda tüm detayları inceliyoruz.",
  htmlContent: `
    <h2>Bitcoin Halving Nedir?</h2>
    <p>Bitcoin halving, Bitcoin protokolünün temel özelliklerinden biridir. Her 210.000 blokta bir (yaklaşık dört yılda bir) madencilerin blok ödülü yarıya indirilir. Bu mekanizma, Bitcoin'in enflasyonunu kontrol altında tutmak için tasarlanmıştır.</p>
    
    <h2>2024 Halving Etkileri</h2>
    <p>Mayıs 2024'te gerçekleşen son halving etkinliğinde madenci ödülü 6.25 BTC'den 3.125 BTC'ye düştü. Bu azalma, piyasa tarafından talep artışı yaratırken arz azalmasına neden oldu.</p>
    
    <h2>Uzman Görüşleri Arasındaki Bölünme</h2>
    <ul>
      <li><strong>Bull Kampı:</strong> Arz azalmasının doğal sonucu olarak fiyatların yükselmeye devam edeceği görüşünde</li>
      <li><strong>Bear Kampı:</strong> Makro ekonomik faktörlerin etkisiyle fiyatların önce düşebileceğini savunanlar</li>
      <li><strong>Nötr Yaklaşım:</strong> Halving'in tek başına fiyatı belirlemediğini, birçok faktörün bir araya geldiğini ifade eden analistler</li>
    </ul>
    
    <h2>Tarihsel Veriler ve Tahminler</h2>
    <p>Önceki halving dönemlerinde fiyatların uzun vadede artış gösterdiği gözlemlense de kısa vadeli volatilite oldukça yüksek oldu. 2012 ve 2016 halving'lerinden sonra fiyatlar önemli yükselişler yaşadı ancak bu süreçte ciddi düzeltmeler de görüldü.</p>
    
    <h2>Sonuç</h2>
    <p>Bitcoin halving tartışması, yalnızca teknik bir konu değil aynı zamanda yatırım stratejilerini de doğrudan etkileyen önemli bir mesele. Her yatırımcı kendi risk toleransına göre bu gelişmeleri değerlendirmeli ve kararlarını vermelidir.</p>
    
    <p><em>Bu analiz yatırım tavsiyesi değildir. Kripto para yatırımları yüksek risk taşımaktadır.</em></p>
  `,
  content: "Bitcoin Halving Nedir?\nBitcoin halving, Bitcoin protokolünün temel özelliklerinden biridir. Her 210.000 blokta bir (yaklaşık dört yılda bir) madencilerin blok ödülü yarıya indirilir. Bu mekanizma, Bitcoin'in enflasyonunu kontrol altında tutmak için tasarlanmıştır.\n\n2024 Halving Etkileri\nMayıs 2024'te gerçekleşen son halving etkinliğinde madenci ödülü 6.25 BTC'den 3.125 BTC'ye düştü. Bu azalma, piyasa tarafından talep artışı yaratırken arz azalmasına neden oldu.\n\nUzman Görüşleri Arasındaki Bölünme\n- Bull Kampı: Arz azalmasının doğal sonucu olarak fiyatların yükselmeye devam edeceği görüşünde\n- Bear Kampı: Makro ekonomik faktörlerin etkisiyle fiyatların önce düşebileceğini savunanlar\n- Nötr Yaklaşım: Halving'in tek başına fiyatı belirlemediğini, birçok faktörün bir araya geldiğini ifade eden analistler\n\nTarihsel Veriler ve Tahminler\nÖnceki halving dönemlerinde fiyatların uzun vadede artış gösterdiği gözlemlense de kısa vadeli volatilite oldukça yüksek oldu. 2012 ve 2016 halving'lerinden sonra fiyatlar önemli yükselişler yaşadı ancak bu süreçte ciddi düzeltmeler de görüldü.\n\nSonuç\nBitcoin halving tartışması, yalnızca teknik bir konu değil aynı zamanda yatırım stratejilerini de doğrudan etkileyen önemli bir mesele. Her yatırımcı kendi risk toleransına göre bu gelişmeleri değerlendirmeli ve kararlarını vermelidir.\n\nBu analiz yatırım tavsiyesi değildir. Kripto para yatırımları yüksek risk taşımaktadır.",
  author: "KriptoSavasi AI",
  date: new Date().toISOString().split('T')[0],
  readTime: "6 dk",
  imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
  tags: ["Bitcoin", "Halving", "Kripto Analiz", "Piyasa Tahmini"],
  keywords: ["bitcoin halving", "kripto para", "btc fiyatı", "madencilik", "kripto analiz"],
  category: "analiz",
  isPublished: true,
  views: 0
};

console.log("Bitcoin Halving Controversy post content prepared.");
console.log("To save this post, you can:");
console.log("1. Start your development server: npx next dev");
console.log("2. Use a tool like Postman or curl to send a POST request to http://localhost:3000/api/blogs with the following JSON data:");
console.log(JSON.stringify(bitcoinHalvingContent, null, 2));

console.log("\nAlternatively, you can manually insert this data into your MongoDB database in the 'blogs' collection.");