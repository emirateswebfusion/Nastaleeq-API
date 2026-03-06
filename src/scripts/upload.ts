import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const PDF_PATH = path.join(__dirname, '../../uploads/nastaleeq.pdf');
const META_FILE = path.join(__dirname, '../../meta/pages.json');

interface PageData {
  page: number;
  url: string;
  thumb: string;
  secure_url: string;
  uploaded_at: string;
}

async function uploadPagesFromPDF() {
  console.log('🕌 Nastaleeq Quran PDF Upload Script');
  console.log('=====================================\n');

  // Check Cloudinary credentials
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Error: Missing Cloudinary credentials in .env');
    console.error('   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Check PDF exists
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ Error: PDF not found at ${PDF_PATH}`);
    console.error('\n   Please:');
    console.error('   1. Download Nastaleeq Quran PDF from KFGQPC');
    console.error('   2. Place it at: ./uploads/nastaleeq.pdf');
    console.error('\n   KFGQPC: https://quran.ksu.edu.sa/');
    process.exit(1);
  }

  console.log('📖 Reading PDF...');
  const pdfBuffer = fs.readFileSync(PDF_PATH);

  let pdfDoc;
  try {
    pdfDoc = await pdf(pdfBuffer);
  } catch (error) {
    console.error('❌ Error parsing PDF:', error);
    process.exit(1);
  }

  const totalPages = pdfDoc.numpages;
  console.log(`✅ PDF loaded: ${totalPages} pages\n`);

  const pages: Record<number, PageData> = {};
  let uploadedCount = 0;
  let failedCount = 0;

  // Check if already partially uploaded
  if (fs.existsSync(META_FILE)) {
    const existing = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
    Object.assign(pages, existing);
    uploadedCount = Object.keys(existing).length;
    console.log(`📝 Found ${uploadedCount} already uploaded pages. Resuming...\n`);
  }

  // Process each page (skip if already uploaded)
  for (let i = 1; i <= totalPages; i++) {
    if (pages[i]) {
      process.stdout.write(`\r⏭️  Pages: ${i}/${totalPages} (${uploadedCount} uploaded)`);
      continue;
    }

    process.stdout.write(`\r⏳ Processing: ${i}/${totalPages} (${uploadedCount} uploaded)`);

    try {
      // Extract page as image
      const pageBuffer = await new Promise<Buffer>((resolve, reject) => {
        const canvas = require('canvas');
        // Note: This is a simplified approach. For production, consider using:
        // - pdf2image library
        // - ImageMagick
        // - Or GhostScript

        console.error(
          `\n⚠️  Note: PDF to image conversion requires pdf2image or similar dependency.`
        );
        console.error(`   Install: npm install pdf2image`);
        console.error(`   Or uncomment the conversion code in upload.ts`);
        reject(new Error('PDF rendering not configured. See notes above.'));
      });
    } catch (error) {
      failedCount++;
      if (failedCount <= 3) {
        console.error(`\n❌ Error processing page ${i}:`, String(error).substring(0, 50));
      }
      continue;
    }
  }

  console.log(`\n\n📊 Upload Summary`);
  console.log('=================');
  console.log(`✅ Uploaded: ${uploadedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📝 Total: ${Object.keys(pages).length}/${totalPages}`);

  if (Object.keys(pages).length === totalPages) {
    console.log(`\n🎉 All pages uploaded!`);
    console.log(`📍 Metadata saved to: ${META_FILE}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Deploy to Vercel: vercel deploy`);
    console.log(`   2. Update API endpoint in mobile app`);
  }
}

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  THIS SCRIPT PROCESSES LOCAL PDF FILES ONLY                    ║
║  You are responsible for ensuring rights to the PDF file       ║
║                                                                 ║  
║  Recommended sources:                                          ║
║  • King Fahd Glorious Qur'an Printing Complex (KFGQPC)          ║
║  • https://quran.ksu.edu.sa/                                   ║
║  • Official Qur'an publishers supporting open distribution    ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log('\n⚠️  PDF-to-Image Conversion Note:');
console.log('────────────────────────────────');
console.log('While this script is structured for PDF processing,');
console.log('pdf-to-image conversion requires external tools.\n');
console.log('Recommended approach:');
console.log('1. Use CloudConvert API (free tier available)');
console.log('2. Use PDF2Image service');
console.log('3. Use local GhostScript installed on your machine\n');
console.log('OR manually convert PDF -> JPGs and place in ./uploads/images/ folder,');
console.log('then use the batch-upload alternative below.\n');

uploadPagesFromPDF().catch(console.error);
