import { logger } from '../utils/logger.js';

/**
 * Receive benchmark result data from mobile app
 */
export const receiveBenchmarkResult = async (req, res) => {
  try {
    const data = req.body;
  
    console.log('\n111=== Complete Data ===111\n');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n111=====================================111\n');
    
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
