# 🕌 Nastaleeq Quran API

> **A free, public API serving all 604 pages of the Holy Quran in beautiful Nastaleeq (نستعلیق) script**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emirateswebfusion/Nastaleeq-API)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.x-brightgreen)](package.json)

> **📢 Note:** Pages 1-5 (intro/cover pages) are automatically skipped. **Page 1 = Al-Fatiha** (standard Quran numbering).

---

## 📖 What is this?

**Nastaleeq Quran API** is a **free REST API** that provides high-quality images of all 604 Quran pages in the **Nastaleeq (Urdu/Persian) script**. Since no reliable public CDN exists for Nastaleeq Quran pages, this project fills that gap by:

- 🖼️ Hosting all 604 pages on **Cloudinary** (fast, reliable CDN)
- 🚀 Providing a **serverless API** deployed on **Vercel** (globally distributed)
- 📱 Optimized for **mobile apps** with 302 redirects for fast image loading
- 🆓 **Completely free** and open-source for the Muslim community

### 🎯 Use Cases

- **Mobile Quran Apps** (React Native, Flutter, Swift, Kotlin)
- **Web Quran Readers** (React, Vue, Next.js, vanilla JS)
- **Islamic Educational Platforms**
- **Hifz/Memorization Apps**
- **Quran Study Tools**

---

## 🌐 Live API

**Production Endpoint:**  
`https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app`

### Quick Test

Try these URLs in your browser:

- **Health Check:** [/health](https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app/health)
- **Page 1 (Al-Fatiha):** [/api/pages/1/image](https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app/api/pages/1/image)
- **All Pages Metadata:** [/api/pages](https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app/api/pages)

---

## 🚀 Quick Start for Developers

### For Mobile/Web Apps (Just Use It!)

No installation needed! Just make HTTP requests:

**React Native Example:**
```tsx
import { Image } from 'react-native';

const QuranPage = ({ pageNumber }: { pageNumber: number }) => {
  const API_BASE = 'https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app';
  
  return (
    <Image
      source={{ uri: `${API_BASE}/api/pages/${pageNumber}/image` }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />
  );
};
```

**JavaScript/Web Example:**
```javascript
const pageNumber = 1;
const API_BASE = 'https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app';

// Get image URL
fetch(`${API_BASE}/api/pages/${pageNumber}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.url); // Direct Cloudinary URL
    document.querySelector('#quran-page').src = data.url;
  });

// OR directly use the redirect endpoint (recommended for mobile)
document.querySelector('#quran-page').src = 
  `${API_BASE}/api/pages/${pageNumber}/image`;
```

---

## 📚 API Documentation

### Base URL

```
https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app
```

### Endpoints

#### 1. Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T08:45:23.123Z",
  "service": "Nastaleeq Quran API"
}
```

---

#### 2. Get All Pages Metadata

```
GET /api/pages
```

**Response:**
```json
{
  "total": 604,
  "pages": [
    {
      "page": 1,
      "url": "https://res.cloudinary.com/df2b1hvbj/image/upload/...",
      "thumb": "https://res.cloudinary.com/df2b1hvbj/image/upload/c_thumb,w_200/...",
      "secure_url": "https://res.cloudinary.com/df2b1hvbj/image/upload/...",
      "uploaded_at": "2026-03-06T08:30:15.123Z"
    }
    // ... 603 more pages
  ]
}
```

---

#### 3. Get Single Page Metadata

```
GET /api/pages/:pageNumber
```

**Parameters:**
- `pageNumber` (required) - Integer between 1 and 604

**Example:** `/api/pages/1`

**Response:**
```json
{
  "page": 1,
  "url": "https://res.cloudinary.com/df2b1hvbj/image/upload/v1234567890/quran-nastaleeq/page_001.jpg",
  "thumb": "https://res.cloudinary.com/df2b1hvbj/image/upload/c_thumb,w_200/v1234567890/quran-nastaleeq/page_001.jpg",
  "secure_url": "https://res.cloudinary.com/df2b1hvbj/image/upload/v1234567890/quran-nastaleeq/page_001.jpg",
  "uploaded_at": "2026-03-06T08:30:15.123Z"
}
```

**Error Response (404):**
```json
{
  "error": "Page not found",
  "page": 999,
  "validRange": "1-604"
}
```

---

#### 4. Get Page Image (Redirect) ⭐ **Recommended for Mobile**

```
GET /api/pages/:pageNumber/image
```

**Response:** HTTP 302 redirect to Cloudinary image URL

**Why use this?**
- ✅ Simpler implementation (just set image source)
- ✅ Cloudinary handles caching/optimization
- ✅ No JSON parsing needed
- ✅ Works directly in `<img>` tags and React Native `<Image>`

**Example:** `/api/pages/1/image` → Redirects to Cloudinary

---

#### 5. Get Plain Image URL (Query Parameter)

```
GET /api/pages/:pageNumber?format=url
```

**Response:** Plain text URL (no JSON)

**Example:** `/api/pages/1?format=url`

Response body:
```
https://res.cloudinary.com/df2b1hvbj/image/upload/v1234567890/quran-nastaleeq/page_001.jpg
```

---

## 🛠️ Deploy Your Own Instance

Want to host your own API? Follow these steps:

### Prerequisites

- **Node.js** 22.x or higher
- **Cloudinary Account** (free tier: [cloudinary.com](https://cloudinary.com))
- **Vercel Account** (free tier: [vercel.com](https://vercel.com))
- **Git** installed

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/emirateswebfusion/Nastaleeq-API.git
cd Nastaleeq-API
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

Get your credentials from [Cloudinary Dashboard](https://cloudinary.com/console).

---

### Step 4: Prepare Quran Images

You need 604 JPG files (one for each Quran page).

#### Option A: Download Pre-converted Images
- Download Nastaleeq Quran PDF from [quran.ksu.edu.sa](https://quran.ksu.edu.sa)
- Use a PDF-to-JPG converter (see below)

#### Option B: Use ImageMagick (Recommended)

```bash
# Install ImageMagick from imagemagick.org
magick convert -density 300 nastaleeq.pdf -quality 90 uploads/images/page_%03d.jpg
```

#### Option C: Online Converters
- [ilovepdf.com/pdf_to_jpg](https://www.ilovepdf.com/pdf_to_jpg)
- [pdf2jpg.net](https://pdf2jpg.net)

**Important:** Rename files to match this format:
- `page_001.jpg` (Page 1)
- `page_002.jpg` (Page 2)
- ...
- `page_604.jpg` (Page 604)

Place all files in: `uploads/images/`

---

### Step 5: Upload Images to Cloudinary

```bash
npm run upload
```

This will:
- Upload all images to Cloudinary (including the 5 intro pages)
- Take ~15-30 minutes depending on your connection

**Then run the offset fix:**

```bash
npm run fix-offset
```

This will:
- Fetch all uploaded images from Cloudinary
- Skip the first 5 intro/cover pages
- Remap the API so **page 1 = Al-Fatiha** (standard Quran numbering)
- Generate `meta/pages.json` with the correct mapping
- Result: 619 total API pages (624 images - 5 intro pages)

---

### Step 6: Test Locally

```bash
npm run dev
```

Visit: http://localhost:3000/health

Test an image: http://localhost:3000/api/pages/1/image

---

### Step 7: Deploy to Vercel

#### Method A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Method B: GitHub Integration

1. Push code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Deploy!

---

### Step 8: Test Your Deployment

Your API will be live at: `https://your-project-name.vercel.app`

Test endpoints:
- `/health` - Should return `{"status":"ok"}`
- `/api/pages/1/image` - Should show Quran page 1

---

## 📱 Mobile App Integration

### React Native (TypeScript)

```tsx
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

const API_BASE = 'https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app';

export default function QuranReader() {
  return (
    <PagerView style={styles.container} initialPage={0}>
      {Array.from({ length: 604 }, (_, i) => i + 1).map((pageNum) => (
        <View key={pageNum} style={styles.page}>
          <Image
            source={{ uri: `${API_BASE}/api/pages/${pageNum}/image` }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
});
```

### Flutter (Dart)

```dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class QuranPage extends StatelessWidget {
  final int pageNumber;
  static const String apiBase = 
    'https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app';

  QuranPage({required this.pageNumber});

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: '$apiBase/api/pages/$pageNumber/image',
      placeholder: (context, url) => CircularProgressIndicator(),
      errorWidget: (context, url, error) => Icon(Icons.error),
      fit: BoxFit.contain,
    );
  }
}
```

### iOS (Swift + SwiftUI)

```swift
import SwiftUI

struct QuranPageView: View {
    let pageNumber: Int
    let apiBase = "https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app"
    
    var body: some View {
        AsyncImage(url: URL(string: "\(apiBase)/api/pages/\(pageNumber)/image")) { image in
            image.resizable()
                .aspectRatio(contentMode: .fit)
        } placeholder: {
            ProgressView()
        }
    }
}
```

### Android (Kotlin + Jetpack Compose)

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import coil.compose.AsyncImage

@Composable
fun QuranPage(pageNumber: Int) {
    val apiBase = "https://nastaleeq-96tfns9u9-suhaibaramam-gmailcoms-projects.vercel.app"
    
    AsyncImage(
        model = "$apiBase/api/pages/$pageNumber/image",
        contentDescription = "Quran Page $pageNumber",
        contentScale = ContentScale.Fit
    )
}
```

---

## 🏗️ Project Structure

```
Nastaleeq-API/
├── src/
│   ├── index.ts              # Main Express server
│   ├── routes/
│   │   └── pages.ts          # API route handlers
│   ├── config/
│   │   └── cloudinary.ts     # Cloudinary SDK config
│   └── scripts/
│       ├── batch-upload.ts   # Upload 604 pages to Cloudinary
│       └── upload.ts         # Single file uploader
├── meta/
│   ├── pages.json            # Generated metadata (page → URL mapping)
│   └── pages.json.example    # Example structure
├── public/
│   └── images/               # Source images (before upload)
├── uploads/
│   └── images/               # Place your 604 JPGs here (page_001.jpg - page_604.jpg)
├── .env                      # Environment variables (DO NOT commit!)
├── .env.example              # Example env template
├── vercel.json               # Vercel deployment config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

---

## 🔧 Available Scripts

```bash
# Install dependencies
npm install

# Run development server (local)
npm run dev

# Build TypeScript
npm run build

# Start production server (local)
npm start

# Upload images to Cloudinary
npm run upload
```

---

## 🌟 Features

- ✅ **All 604 Quran pages** in Nastaleeq script
- ✅ **Fast CDN delivery** via Cloudinary
- ✅ **Serverless architecture** (Vercel Edge Functions)
- ✅ **CORS enabled** for web apps
- ✅ **TypeScript** for type safety
- ✅ **RESTful API** design
- ✅ **Image optimization** (Cloudinary transformations)
- ✅ **302 redirects** for efficient mobile image loading
- ✅ **Zero configuration** for API consumers
- ✅ **Free tier friendly** (Cloudinary + Vercel)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/Nastaleeq-API.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make changes** and commit: `git commit -m "Add your feature"`
5. **Push** to your fork: `git push origin feature/your-feature-name`
6. **Open a Pull Request** on GitHub

### Ideas for Contributions

- 📖 Add translation endpoints (Arabic, English, Urdu)
- 🎙️ Add audio recitation URLs
- 🔍 Add verse search functionality
- 📊 Add Surah/Juz metadata
- 🌐 Add more script options (Uthmani, IndoPak)
- 📱 Add SDKs for popular frameworks
- 📝 Improve documentation/examples

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Image Copyright Notice

The Quran text images are from public domain sources. This API serves as a hosting/delivery infrastructure. If you believe any content infringes your rights, please open an issue.

---

## 🙏 Acknowledgments

- **Cloudinary** for free image hosting
- **Vercel** for free serverless hosting
- **King Saud University** for Nastaleeq Quran resources
- The global Muslim developer community

---

## 📧 Contact

- **Website:** [emirateswebfusion.com](https://emirateswebfusion.com)
- **GitHub:** [@emirateswebfusion](https://github.com/emirateswebfusion)
- **Issues:** [GitHub Issues](https://github.com/emirateswebfusion/Nastaleeq-API/issues)

---

## 🌙 Made with ❤️ for the Ummah

**JazakAllahu Khairan** for using this API. May Allah accept this work and make it beneficial for those seeking to read and memorize the Holy Quran.

> *"The best among you are those who learn the Quran and teach it."* - Prophet Muhammad ﷺ

---

**⭐ Star this repo** if you find it useful!
