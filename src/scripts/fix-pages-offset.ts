import cloudinary from '../config/cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fix Pages Offset Script
 * 
 * Problem: Pages 1-5 are intro/cover. Page 6 = Al-Fatiha.
 * Solution: Remap API so page 1 returns Cloudinary page_006, page 2 returns page_007, etc.
 * 
 * This creates a 599-page API (604 - 5 intro pages).
 */

const META_FILE = path.join(__dirname, '../../meta/pages.json');
const OFFSET = 5; // Skip first 5 pages
const TOTAL_CLOUDINARY_PAGES = 624; // Total images in Cloudinary
const TOTAL_API_PAGES = TOTAL_CLOUDINARY_PAGES - OFFSET; // 619 pages in API

interface PageData {
  page: number;
  url: string;
  thumb: string;
  secure_url: string;
  uploaded_at: string;
}

async function fixPagesOffset() {
  console.log('🕌 Nastaleeq Quran - Fix Page Offset\n');
  console.log(`📋 Skipping first ${OFFSET} intro pages`);
  console.log(`📖 API will serve ${TOTAL_API_PAGES} pages (page 1 = Al-Fatiha)\n`);

  const pages: Record<number, PageData> = {};

  console.log('☁️  Fetching images from Cloudinary...\n');

  try {
    let allResources: any[] = [];
    let nextCursor: string | undefined = undefined;

    // Paginate through all results (Cloudinary limits to 500 per request)
    do {
      const searchQuery = cloudinary.search
        .expression('folder:quran/nastaleeq')
        .sort_by('public_id', 'asc')
        .max_results(500);

      if (nextCursor) {
        searchQuery.next_cursor(nextCursor);
      }

      const result = await searchQuery.execute();
      
      if (result.resources && result.resources.length > 0) {
        allResources = allResources.concat(result.resources);
        console.log(`📥 Fetched ${result.resources.length} images (total: ${allResources.length})`);
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);

    if (allResources.length === 0) {
      console.error('❌ No images found in Cloudinary folder: quran/nastaleeq');
      console.error('\nMake sure you have uploaded images first:');
      console.error('  npm run upload\n');
      process.exit(1);
    }

    console.log(`\n✅ Found ${allResources.length} total images in Cloudinary\n`);

    // Process each image (skip first 5)
    let apiPage = 1;
    for (const resource of allResources) {
      // Extract page number from public_id (e.g., "quran/nastaleeq/page_006" -> 6)
      const match = resource.public_id.match(/page_(\d+)/);
      if (!match) continue;

      const cloudinaryPage = parseInt(match[1], 10);

      // Skip first 5 intro pages
      if (cloudinaryPage <= OFFSET) {
        console.log(`⏭️  Skipping intro page ${cloudinaryPage}`);
        continue;
      }

      // Generate thumbnail URL
      const thumbUrl = cloudinary.url(resource.public_id, {
        width: 300,
        crop: 'scale',
      });

      pages[apiPage] = {
        page: apiPage,
        url: resource.secure_url,
        thumb: thumbUrl,
        secure_url: resource.secure_url,
        uploaded_at: resource.created_at,
      };

      if (apiPage <= 3 || apiPage === TOTAL_API_PAGES) {
        console.log(`✅ API Page ${apiPage} → Cloudinary Page ${cloudinaryPage}`);
      } else if (apiPage === 4) {
        console.log(`   ... mapping ${TOTAL_API_PAGES - 3} more pages ...`);
      }

      apiPage++;
    }

    // Save to meta/pages.json
    fs.writeFileSync(META_FILE, JSON.stringify(pages, null, 2));

    console.log(`\n📊 Summary`);
    console.log('=================');
    console.log(`✅ API Pages: ${Object.keys(pages).length}`);
    console.log(`📄 Saved to: meta/pages.json`);
    console.log(`\n🎉 Page mapping complete!`);
    console.log(`\n📖 Your API now serves:`);
    console.log(`   • Page 1 = Al-Fatiha (Surah 1)`);
    console.log(`   • Page ${TOTAL_API_PAGES} = End of Quran`);
    console.log(`\n🚀 Deploy to Vercel:`);
    console.log(`   vercel --prod\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPagesOffset().catch(console.error);
