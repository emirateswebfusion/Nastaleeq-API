# Nastaleeq Quran API

Convert and serve Nastaleeq Quran pages via Cloudinary - free public API

## Setup

### 1. Environment Variables

Create a `.env` file:

```
CLOUDINARY_CLOUD_NAME=df2b1hvbj
CLOUDINARY_API_KEY=384493437157766
CLOUDINARY_API_SECRET=LPd6g0CusOGw1f3oBDGuugzZCX4
PORT=3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Nastaleeq Quran PDF

- Download from: **King Fahd Glorious Qur'an Printing Complex (KFGQPC)**
  - https://quran.ksu.edu.sa/ or official KFGQPC sources
- Place PDF at: `./uploads/nastaleeq.pdf`

### 4. Convert & Upload to Cloudinary

This processes your local PDF, converts all pages to images, and uploads to Cloudinary:

```bash
npm run upload
```

This will:
- Extract 604 pages from PDF
- Convert each to JPEG
- Upload to Cloudinary folder `quran/nastaleeq/`
- Save metadata to `./meta/pages.json`

### 5. Run Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

### 6. API Endpoints

#### Get Page Image URL
```
GET /api/pages/:pageNumber
```

Response:
```json
{
  "page": 1,
  "url": "https://res.cloudinary.com/df2b1hvbj/image/upload/v1234567890/quran/nastaleeq/page_001.jpg",
  "thumb": "https://res.cloudinary.com/df2b1hvbj/image/upload/c_scale,w_300/v1234567890/quran/nastaleeq/page_001.jpg"
}
```

#### Get All Pages Metadata
```
GET /api/pages
```

#### Health Check
```
GET /api/health
```

### 7. Deploy to Vercel

```bash
vercel
```

Set environment variables in Vercel dashboard:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Public API URL

After deployment:
```
https://your-vercel-app.vercel.app/api/pages/1
```

## Mobile App Integration

Update `QuranScreen.tsx`:

```typescript
if (readerMode === 'nastaleeq') {
  return `https://your-vercel-app.vercel.app/api/pages/${pageNumber}?format=url`;
}
```

## Notes

- Pages are cached after first upload
- Images are optimized and hosted via Cloudinary CDN globally
- No rate limiting (add if needed for production)
- CORS enabled for all origins
