import { db } from '../config/firebase.js';
import { COLLECTION_NAMES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * Receive benchmark result data from mobile app
 */
export const receiveBenchmarkResult = async (req, res) => {
  try {
    const data = req.body;
  
    console.log('\n=== Complete Data ===\n');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n=====================================\n');
    
    // Check for duplicate based on androidId (if present)
    const androidId = data.deviceInfo?.androidId;
    
    if (androidId) {
      // Query Firestore to check if this androidId already exists
      const existingSnapshot = await db.collection(COLLECTION_NAMES.BENCHMARKS)
        .where('deviceInfo.androidId', '==', androidId)
        .limit(1)
        .get();
      
      if (!existingSnapshot.empty) {
        logger.info(`Duplicate benchmark data detected for androidId: ${androidId}`);
        return res.status(200).json({
          success: false,
          message: 'Benchmark data already exists for this device',
          duplicate: true,
          androidId: androidId
        });
      }
    }
    
    // Add the benchmark data to Firestore
    const docRef = await db.collection(COLLECTION_NAMES.BENCHMARKS).add({
      ...data,
      createdAt: new Date().toISOString()
    });
    
    logger.info(`Benchmark data saved successfully with ID: ${docRef.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Benchmark result received and saved successfully',
      documentId: docRef.id,
      receivedAt: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error receiving benchmark result:', error);
    res.status(500).json({ error: error.message });
  }
};
