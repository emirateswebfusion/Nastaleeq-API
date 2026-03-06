import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pagesRouter from './routes/pages';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', pagesRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Nastaleeq Quran Pages API',
    docs: 'https://github.com/your-repo',
    endpoints: {
      health: '/health',
      page: '/api/pages/:pageNumber',
      allPages: '/api/pages',
      download: '/api/pages/:pageNumber?format=url',
    },
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🕌 Nastaleeq API running on port ${PORT}`);
    console.log(`📖 GET http://localhost:${PORT}/api/pages/1`);
  });
}

export default app;
