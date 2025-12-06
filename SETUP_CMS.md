# Sanity CMS Kurulumu

Bu proje hem AI tarafından oluşturulan hem de manuel olarak eklenen blog yazılarını desteklemektedir. Şu anda basit bir arayüz üzerinden manuel yazı ekleme imkanı sunulmaktadır. Daha gelişmiş bir CMS çözümü için Sanity entegrasyonu yapılabilir.

## Mevcut Durum

Projede şu anda iki tür blog yazısı bulunmaktadır:
1. **AI Üretimi**: Günlük otomatik olarak üretilen kripto analiz, tahmin ve haber içerikleri
2. **Manuel Yazılar**: Admin paneli üzerinden eklenen içerikler

## Gelecekte Sanity CMS Entegrasyonu

Projede Sanity CMS entegrasyonu için aşağıdaki adımlar izlenebilir:

### 1. Sanity Projesi Oluşturma

```bash
npm create sanity@latest -- --template clean --visibility public --dataset production --project-name kriptosavasi-cms
```

### 2. Gerekli Paketlerin Kurulumu

```bash
npm install @sanity/client @sanity/image-url
```

### 3. Schema Tanımları

`schemas/blogPost.js` dosyası:

```javascript
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}]
    }
  ]
}
```

### 4. Sanity Client Konfigürasyonu

`services/sanityClient.js` dosyası:

```javascript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export default client
```

### 5. Blog Servisinde Kullanım

`services/sanityService.ts` dosyasının güncellenmesi:

```typescript
import client from './sanityClient'
import { SanityBlogPost } from '../types'

export const fetchSanityBlogPosts = async (): Promise<SanityBlogPost[]> => {
  const query = `*[_type == "blogPost"]{
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    body,
    mainImage,
    publishedAt,
    author->{
      name
    },
    categories[]->{
      title
    }
  }`
  
  return await client.fetch(query)
}
```

## Şu Anda Kullanılabilir Özellikler

1. **Admin Paneli**: Sayfanın sağ alt köşesindeki "+" butonu ile erişilebilir
2. **Manuel Yazı Ekleme**: Başlık, kategori, görsel ve içerik girilerek yeni yazı eklenebilir
3. **Otomatik AI Yazılar**: Sistem her gün belirlenen saatte otomatik olarak yeni yazı üretir

## Geliştirme Önerileri

1. **Kullanıcı Yetkilendirme**: Admin paneline giriş sistemi eklenmesi
2. **Düzenleme Özelliği**: Mevcut yazıların düzenlenmesi imkanı
3. **Silme Özelliği**: Yazıların silinebilmesi
4. **Taslak Kaydetme**: Yazıların taslak olarak kaydedilip daha sonra yayınlanabilmesi