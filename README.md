# 🕌 Nastaleeq Quran API

> **A free, public API serving all 604 pages of the Holy Quran in beautiful Nastaleeq (نستعلیق) script**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.x-brightgreen)](package.json)

> **📢 Note:** Pages 1-5 (intro/cover pages) are automatically skipped. **Page 1 = Al-Fatiha** (standard Quran numbering).

---

## 📖 What is this?

**Nastaleeq Quran API** is a **free REST API** that provides high-quality images of all 604 Quran pages in the **Nastaleeq (Urdu/Persian) script**. Since no reliable public CDN exists for Nastaleeq Quran pages, this project fills that gap by:

This script style is widely used in **India, Pakistan, and neighboring regions**, and is commonly known as **Hifz Quran**, **15-line Quran**, or **Hafizi Quran**.

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
`https://nastaleeq-api.vercel.app`

### Quick Test

Try these URLs in your browser:

- **Health Check:** [/health](https://nastaleeq-api.vercel.app/health)
- **Page 1 (Al-Fatiha):** [/api/pages/1/image](https://nastaleeq-api.vercel.app/api/pages/1/image)
- **Page 1 (Cropped Borders):** [/api/pages/1/image?crop=true](https://nastaleeq-api.vercel.app/api/pages/1/image?crop=true)
- **All Pages Metadata:** [/api/pages](https://nastaleeq-api.vercel.app/api/pages)

---

## 🚀 Quick Start (API Usage)

### For Mobile/Web Apps (Just Use It!)

No installation needed! Just make HTTP requests:

**React Native Example:**
```tsx
import { Image } from 'react-native';

const QuranPage = ({ pageNumber }: { pageNumber: number }) => {
  const API_BASE = 'https://nastaleeq-api.vercel.app';
  
  return (
    <Image
      source={{ uri: `${API_BASE}/api/pages/${pageNumber}/image?crop=true` }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />
  );
};
```

**JavaScript/Web Example:**
```javascript
const pageNumber = 1;
const API_BASE = 'https://nastaleeq-api.vercel.app';

// Get image URL
fetch(`${API_BASE}/api/pages/${pageNumber}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.url); // Direct Cloudinary URL
    document.querySelector('#quran-page').src = data.url;
  });

// OR directly use the redirect endpoint (recommended for mobile)
document.querySelector('#quran-page').src = 
  `${API_BASE}/api/pages/${pageNumber}/image?crop=true`;
```

---

## 📚 API Documentation

### Base URL

```
https://nastaleeq-api.vercel.app
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

**Query Parameters:**
- `crop` (optional) - `true` or `1` to remove decorative borders using Cloudinary crop transformation.
  - Active transformation: `c_crop,g_center,w_0.88,h_0.87,q_auto,f_auto`

**Response:** HTTP 302 redirect to Cloudinary image URL

**Why use this?**
- ✅ Simpler implementation (just set image source)
- ✅ Cloudinary handles caching/optimization
- ✅ No JSON parsing needed
- ✅ Works directly in `<img>` tags and React Native `<Image>`

**Example:** `/api/pages/1/image` → Redirects to Cloudinary

**Cropped Example (Recommended for full-screen reading):**

```
/api/pages/1/image?crop=true
```

This returns a 302 redirect to a Cloudinary URL with:

```
c_crop,g_center,w_0.88,h_0.87,q_auto,f_auto
```

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

## 📱 Mobile App Integration

### React Native (TypeScript)

```tsx
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

const API_BASE = 'https://nastaleeq-api.vercel.app';

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
    'https://nastaleeq-api.vercel.app';

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
    let apiBase = "https://nastaleeq-api.vercel.app"
    
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
    val apiBase = "https://nastaleeq-api.vercel.app"
    
    AsyncImage(
        model = "$apiBase/api/pages/$pageNumber/image",
        contentDescription = "Quran Page $pageNumber",
        contentScale = ContentScale.Fit
    )
}
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
