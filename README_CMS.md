# Blog CMS Özelliği

Bu proje hem AI tarafından oluşturulan hem de manuel olarak eklenen blog yazılarını desteklemektedir.

## Özellikler

### 1. AI Üretimi Blog Yazıları
- Otomatik olarak her gün üretilir
- Kripto para piyasası verilerine dayanır
- Günün saatine göre farklı içerik türleri üretir:
  - Pazartesi-Cuma: Fiyat tahminleri
  - Cumartesi: Teknik analizler
  - Pazar: Piyasa haberleri

### 2. Manuel Blog Yazıları
- Sağ alt köşedeki "+" butonu ile erişilen admin paneli üzerinden eklenebilir
- Tamamen özgür biçimde yazı oluşturulabilir
- Başlık, kategori, görsel ve içerik alanları mevcuttur

## Kullanım

### Manuel Yazı Ekleme
1. Blog sayfasında sağ alt köşedeki "+" butonuna tıklayın
2. Açılan formda gerekli alanları doldurun:
   - **Başlık**: Yazı başlığı
   - **Kategori**: Haber, Analiz veya Tahmin
   - **Görsel URL**: Yazıya özel görsel (isteğe bağlı)
   - **İçerik**: Yazı içeriği
3. "Yayınla" butonuna tıklayın

### Yazıları Görüntüleme
- Manuel yazılar "Manuel" etiketiyle görüntülenir
- AI yazılar "AI" etiketiyle görüntülenir
- Okuyucular için içerik kaynağını gösterir

## Teknik Detaylar

### Dosyalar
- `components/AdminPanel.tsx`: Manuel yazı ekleme arayüzü
- `services/blogService.ts`: Blog sistemini yöneten servis
- `services/sanityService.ts`: CMS entegrasyonu için placeholder servis
- `app/blog/page.tsx`: Blog sayfası bileşeni

### Veri Saklama
- Yazılar tarayıcıda localStorage'da saklanır
- AI yazıları ile manuel yazılar aynı yapıda tutulur
- Yeni yazılar mevcut listeye eklenir

## Gelecek Geliştirmeler
Detaylı bilgi için `SETUP_CMS.md` dosyasına bakınız.