import express from 'express';
import benchmarkRoutes from './benchmarkRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deimos Backend API is running' });
});

// Mount benchmark routes
router.use('/', benchmarkRoutes);

export default router;
