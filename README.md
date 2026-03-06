# Nastaleeq Quran API

Public API that serves your uploaded Nastaleeq Quran page images from Cloudinary.

## 1) Configure

Copy `.env.example` to `.env` and set:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3000
```

## 2) Prepare images

Convert your Quran PDF into page images and place in:

`uploads/images/page_001.jpg` ... `uploads/images/page_604.jpg`

## 3) Upload to Cloudinary

```bash
npm install
npm run upload
```

This creates `meta/pages.json` with page-to-URL mapping.

## 4) Run locally

```bash
npm run dev
```

## 5) Deploy to Vercel

```bash
vercel
```

Then add environment variables in Vercel project settings:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Endpoints

- `GET /health`
- `GET /api/pages` (all pages metadata)
- `GET /api/pages/:pageNumber` (single page metadata)
- `GET /api/pages/:pageNumber/image` (302 redirect to image, best for mobile image rendering)
- `GET /api/pages/:pageNumber?format=url` (plain URL text)

## Mobile usage

Use this URL pattern in your app:

`https://YOUR-VERCEL-APP.vercel.app/api/pages/{page}/image`
