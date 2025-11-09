import { logger } from '../utils/logger.js';

/**
 * Receive benchmark result data from mobile app
 */
export const receiveBenchmarkResult = async (req, res) => {
  try {
    const data = req.body;
    
    logger.info('=== Received Benchmark Result from Mobile App ===');
    logger.info('Circuit:', data.circuit);
    logger.info('Framework:', data.framework);
    logger.info('Language:', data.language);
    logger.info('Platform:', data.platform);
    logger.info('Device:', data.device);
    logger.info('Proving Time:', `${data.provingTimeSeconds}s (${data.provingTime}ms)`);
    logger.info('Verification Time:', `${data.verificationTimeSeconds}s (${data.verificationTime}ms)`);
    logger.info('Proof Valid:', data.proofValid);
    logger.info('Proof Size:', data.proofSize, 'bytes');
    logger.info('Custom Input:', data.customInput);
    logger.info('Timestamp:', data.timestamp);
    
    logger.info('\n=== Device Information ===');
    if (data.deviceInfo) {
      // Log basic device info
      const basicInfo = { ...data.deviceInfo };
      delete basicInfo.processor;
      delete basicInfo.memory;
      
      Object.entries(basicInfo).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          logger.info(`${key}:`, JSON.stringify(value, null, 2));
        } else {
          logger.info(`${key}:`, value);
        }
      });
      
      // Log processor information separately
      if (data.deviceInfo.processor) {
        logger.info('\n=== Processor Information ===');
        Object.entries(data.deviceInfo.processor).forEach(([key, value]) => {
          logger.info(`${key}:`, value);
        });
      }
      
      // Log memory information separately
      if (data.deviceInfo.memory) {
        logger.info('\n=== Memory Information ===');
        const mem = data.deviceInfo.memory;
        logger.info('Total RAM:', `${mem.totalPhysicalMemoryGB} GB (${mem.totalPhysicalMemoryMB} MB)`);
        logger.info('Used RAM:', `${mem.usedPhysicalMemoryGB} GB (${mem.usedPhysicalMemoryMB} MB)`);
        logger.info('Free RAM:', `${mem.freePhysicalMemoryGB} GB (${mem.freePhysicalMemoryMB} MB)`);
        logger.info('Memory Usage:', `${mem.memoryUsagePercent}%`);
        logger.info('Total Virtual Memory:', `${mem.totalVirtualMemoryMB} MB`);
        logger.info('Used Virtual Memory:', `${mem.usedVirtualMemoryMB} MB`);
        logger.info('Free Virtual Memory:', `${mem.freeVirtualMemoryMB} MB`);
      }
    }
    
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
