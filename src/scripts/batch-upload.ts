import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * BATCH IMAGE UPLOAD SCRIPT
 * 
 * Use this if you've manually converted your Nastaleeq PDF to JPEG images.
 * 
 * Setup:
 * 1. Convert PDF to images and place them in: ./uploads/images/
 * 2. Name them: page_001.jpg, page_002.jpg, ... page_604.jpg
 * 3. Run: npx ts-node src/scripts/batch-upload.ts
 */

const IMAGE_DIR = path.join(__dirname, '../../uploads/images');
const META_FILE = path.join(__dirname, '../../meta/pages.json');

interface PageData {
  page: number;
  url: string;
  thumb: string;
  secure_url: string;
  uploaded_at: string;
}

async function uploadImages() {
  console.log('🕌 Nastaleeq Quran Batch Image Upload\n');

  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Error: Images directory not found at ${IMAGE_DIR}\n`);
    console.error('Create the folder and add your JPEG images:');
    console.error('  ./uploads/images/page_001.jpg');
    console.error('  ./uploads/images/page_002.jpg');
    console.error('  ... up to page_604.jpg\n');
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGE_DIR).filter((f) => f.match(/page_\d+\.jpg$/i));

  if (files.length === 0) {
    console.error(`❌ No image files found in ${IMAGE_DIR}`);
    console.error('Expected format: page_001.jpg, page_002.jpg, etc.\n');
    process.exit(1);
  }

  console.log(`📸 Found ${files.length} image files\n`);

  const pages: Record<number, PageData> = {};

  // Load existing metadata
  if (fs.existsSync(META_FILE)) {
    const existing = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
    Object.assign(pages, existing);
  }

  let uploadedCount = Object.keys(pages).length;
  let failedCount = 0;

  // Upload each image
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pageMatch = file.match(/page_(\d+)/);
    if (!pageMatch) continue;

    const pageNum = parseInt(pageMatch[1], 10);

    // Skip if already uploaded
    if (pages[pageNum]) {
      process.stdout.write(`\r⏭️  Pages: ${pageNum} (${uploadedCount}/${files.length} uploaded)`);
      continue;
    }

    process.stdout.write(`\r⏳ Uploading: ${pageNum} (${uploadedCount}/${files.length})`);

    try {
      const filePath = path.join(IMAGE_DIR, file);
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'quran/nastaleeq',
            public_id: `page_${String(pageNum).padStart(3, '0')}`,
            resource_type: 'image',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });

      // Generate thumbnail URL
      const thumbUrl = cloudinary.url(result.public_id, {
        width: 300,
        crop: 'scale',
      });

      pages[pageNum] = {
        page: pageNum,
        url: result.secure_url,
        thumb: thumbUrl,
        secure_url: result.secure_url,
        uploaded_at: new Date().toISOString(),
      };

      uploadedCount++;

      // Save progress every 10 pages
      if (uploadedCount % 10 === 0) {
        fs.writeFileSync(META_FILE, JSON.stringify(pages, null, 2));
      }
    } catch (error) {
      failedCount++;
      if (failedCount <= 3) {
        console.error(`\n❌ Error uploading page ${pageNum}:`, String(error).substring(0, 60));
      }
    }
  }

  // Final save
  fs.writeFileSync(META_FILE, JSON.stringify(pages, null, 2));

  console.log(`\n\n📊 Upload Summary`);
  console.log('=================');
  console.log(`✅ Uploaded: ${uploadedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📝 Total: ${Object.keys(pages).length}`);

  if (Object.keys(pages).length === 604) {
    console.log(`\n🎉 All 604 pages ready!`);
    console.log(`\n🚀 Deploy to Vercel:`);
    console.log(`   vercel deploy`);
  }
}

uploadImages().catch(console.error);
