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
Configure in `.env.local` (copy from `.env.example`):
```
NEXT_PUBLIC_ADMIN_SECRET=your_secret
ADMIN_PASSWORD=your_password
GEMINI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
```

**Security Notes:**
- `NEXT_PUBLIC_ADMIN_SECRET`: Exposed in URL (acceptable for obfuscation layer)
- `ADMIN_PASSWORD`: Server-side only - DO NOT use `NEXT_PUBLIC_` prefix
- Password validation happens via `/api/admin/auth` endpoint on server
- Never commit `.env.local` to git (it's in `.gitignore`)

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

## API: Admin Authentication
```
POST /api/admin/auth
Body: {
  "password": "your_password",
  "secret": "your_secret"
}
Response: { "success": true }
```

## Security

⚠️ **Important:**
- Admin credentials are stored in `.env.local`
- Never commit `.env.local` to git (already in `.gitignore`)
- Change credentials from defaults in production
- Use environment variables for all secrets
- Password validation happens server-side (not client-side)
- Use `.env.example` as a template for setup

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
