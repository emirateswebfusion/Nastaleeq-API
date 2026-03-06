import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = express.Router();
const META_FILE = path.join(__dirname, '../../meta/pages.json');

// Load pages metadata
const loadPages = (): Record<number, any> => {
  try {
    if (fs.existsSync(META_FILE)) {
      const data = fs.readFileSync(META_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading pages metadata:', error);
  }
  return {};
};

// GET /api/pages/:pageNumber - Get page URL and metadata
router.get('/pages/:pageNumber', (req: Request, res: Response) => {
  try {
    const pageNum = parseInt(req.params.pageNumber, 10);

    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      return res.status(400).json({ error: 'Invalid page number. Must be 1-604.' });
    }

    const pages = loadPages();
    const pageData = pages[pageNum];

    if (!pageData) {
      return res.status(404).json({ error: `Page ${pageNum} not found. Please run the upload script first.` });
    }

    // Format for mobile app query
    const format = req.query.format;
    if (format === 'url') {
      // Just return the URL string for simple integration
      return res.status(200).send(pageData.url);
    }

    // Return full metadata
    res.json({
      page: pageNum,
      url: pageData.url,
      thumb: pageData.thumb,
      secure_url: pageData.secure_url,
      uploaded_at: pageData.uploaded_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page', message: String(error) });
  }
});

// GET /api/pages/:pageNumber/image - Redirect directly to image URL (best for RN <Image />)
router.get('/pages/:pageNumber/image', (req: Request, res: Response) => {
  try {
    const pageNum = parseInt(req.params.pageNumber, 10);

    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      return res.status(400).json({ error: 'Invalid page number. Must be 1-604.' });
    }

    const pages = loadPages();
    const pageData = pages[pageNum];

    if (!pageData?.url) {
      return res.status(404).json({ error: `Page ${pageNum} not found. Please run upload first.` });
    }

    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.redirect(302, pageData.url);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to redirect image', message: String(error) });
  }
});

// GET /api/pages - Get all pages metadata
router.get('/pages', (req: Request, res: Response) => {
  try {
    const pages = loadPages();
    const count = Object.keys(pages).length;

    res.json({
      total_pages: count,
      pages: pages,
      ready: count === 604,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages', message: String(error) });
  }
});

// GET /api/pages/range/:start/:end - Get page URLs for a range
router.get('/pages/range/:start/:end', (req: Request, res: Response) => {
  try {
    const start = parseInt(req.params.start, 10);
    const end = parseInt(req.params.end, 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end > 604 || start > end) {
      return res.status(400).json({ error: 'Invalid range. Must be 1-604.' });
    }

    const pages = loadPages();
    const range: Record<number, any> = {};

    for (let i = start; i <= end; i++) {
      if (pages[i]) {
        range[i] = pages[i];
      }
    }

    res.json({
      start,
      end,
      count: Object.keys(range).length,
      pages: range,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch range', message: String(error) });
  }
});

export default router;
