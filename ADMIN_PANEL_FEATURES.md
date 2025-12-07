# Admin Panel Features

## Access
- **URL**: `http://localhost:3001/admin/{ADMIN_SECRET}`
- **Password**: Stored in `.env.local`
- **Credentials**: Stored in `.env.local`

## Features

### 1. Create Blog Posts Manually
- Enter title, content, category (Haber/Analiz/Tahmin)
- Add custom image URL
- Auto-generate slug from title
- Direct database storage

### 2. Generate Content with Gemini AI
- Input a prompt describing the blog post
- Gemini AI automatically generates:
  - Blog title
  - Blog content
  - Formatted text ready to publish
- Auto-populates title and content fields
- Click "Oluştur" (Create) to generate

**Example Prompts:**
- "Bitcoin fiyatı hakkında analitik bir yazı yaz"
- "Ethereum'un geleceği konusunda teknik analiz yaz"
- "Kripto para piyasasındaki son gelişmeler hakkında haber yaz"

### 3. Manage Blog Posts
- View all published posts
- Delete any post with confirmation
- See post metadata (category, date)
- Real-time list updates

### 4. Environment Variables
Configure in `.env.local`:
```
NEXT_PUBLIC_ADMIN_SECRET=your_secret
NEXT_PUBLIC_ADMIN_PASSWORD=your_password
GEMINI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
```

## API Endpoints

### Create Post
```
POST /api/blogs
```

### Get Posts
```
GET /api/blogs
GET /api/blogs?limit=50
GET /api/blogs?category=analiz
GET /api/blogs?slug=post-slug
```

### Delete Post
```
DELETE /api/blogs?id=blog_id
```

### Generate with Gemini
```
POST /api/gemini/chat
Body: {
  "message": "prompt text",
  "context": "optional context"
}
```

## Security

⚠️ **Important:**
- Admin secret and password are stored in `.env.local`
- Never commit `.env.local` to git
- Change credentials from defaults in production
- Use environment variables for all secrets

## Workflow

1. **Option A: Manual Entry**
   - Fill in title, content, category
   - Click "Yayınla" (Publish)

2. **Option B: AI Generation**
   - Type a prompt in "Gemini AI ile Oluştur"
   - Click "Oluştur" (Create)
   - Review generated content
   - Adjust if needed
   - Click "Yayınla" (Publish)

3. **Manage Posts**
   - View all posts in the right panel
   - Click "Sil" (Delete) to remove posts
   - List updates automatically
