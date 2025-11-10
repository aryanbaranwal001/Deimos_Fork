import { logger } from '../utils/logger.js';

/**
 * Receive benchmark result data from mobile app
 */
export const receiveBenchmarkResult = async (req, res) => {
  try {
    const data = req.body;
  
    logger.info('\n=== Complete Data ===');
    logger.info(JSON.stringify(data, null, 2));
    logger.info('=====================================\n');
    
    res.status(200).json({
      success: true,
      message: 'Benchmark result received and logged successfully',
      receivedAt: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error receiving benchmark result:', error);
    res.status(500).json({ error: error.message });
  }
};
