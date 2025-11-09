import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/firebase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deimos Backend API is running' });
});

// Get filtered and paginated benchmark data
app.get('/api/benchmarks', async (req, res) => {
  try {
    const {
      circuit = 'all',
      framework = 'all',
      language = 'all',
      platform = 'all',
      page = '1',
      limit = '10'
    } = req.query;

    // Parse pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid limit' });
    }

    // Build Firestore query
    let query = db.collection('benchmarks');

    // Apply filters
    if (circuit !== 'all') {
      query = query.where('circuit', '==', circuit);
    }
    if (framework !== 'all') {
      query = query.where('framework', '==', framework);
    }
    if (language !== 'all') {
      query = query.where('language', '==', language);
    }
    if (platform !== 'all') {
      query = query.where('platform', '==', platform);
    }

    // Get total count for filtered data
    const countSnapshot = await query.get();
    const totalCount = countSnapshot.size;

    // Calculate pagination
    const startIndex = (pageNum - 1) * limitNum;
    
    // Get paginated data
    const snapshot = await query
      .offset(startIndex)
      .limit(limitNum)
      .get();

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      data,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get unique filter values
app.get('/api/filters', async (req, res) => {
  try {
    const snapshot = await db.collection('benchmarks').get();
    
    const circuits = new Set();
    const frameworks = new Set();
    const languages = new Set();
    const platforms = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      circuits.add(data.circuit);
      frameworks.add(data.framework);
      languages.add(data.language);
      platforms.add(data.platform);
    });

    res.json({
      circuits: ['all', ...Array.from(circuits).sort()],
      frameworks: ['all', ...Array.from(frameworks).sort()],
      languages: ['all', ...Array.from(languages).sort()],
      platforms: ['all', ...Array.from(platforms).sort()]
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
