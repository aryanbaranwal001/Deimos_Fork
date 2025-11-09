import { db } from '../config/firebase.js';
import { COLLECTION_NAMES } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchAllData() {
  try {
    logger.info('Fetching all data from Firebase...');

    const snapshot = await db.collection(COLLECTION_NAMES.BENCHMARKS).get();

    if (snapshot.empty) {
      logger.warn('No data found in Firebase');
      process.exit(1);
    }

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    logger.info(`Fetched ${data.length} benchmark entries`);

    // Write to firebasedata.js
    const outputPath = join(__dirname, '../firebasedata.js');
    const fileContent = `// Auto-generated file - Do not edit manually
// Last updated: ${new Date().toISOString()}

export const firebaseData = ${JSON.stringify(data, null, 2)};
`;

    await writeFile(outputPath, fileContent, 'utf-8');
    logger.info(`Data written to ${outputPath}`);
    logger.info('Fetch completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error fetching data:', error);
    process.exit(1);
  }
}

fetchAllData();
