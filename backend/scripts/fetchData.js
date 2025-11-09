import { db } from '../config/firebase.js';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchAllData() {
  try {
    console.log('Fetching all data from Firebase...');

    const snapshot = await db.collection('benchmarks').get();

    if (snapshot.empty) {
      console.log('No data found in Firebase');
      process.exit(1);
    }

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Fetched ${data.length} benchmark entries`);

    // Write to firebasedata.js
    const outputPath = join(__dirname, '../firebasedata.js');
    const fileContent = `// Auto-generated file - Do not edit manually
// Last updated: ${new Date().toISOString()}

export const firebaseData = ${JSON.stringify(data, null, 2)};
`;

    await writeFile(outputPath, fileContent, 'utf-8');
    console.log(`Data written to ${outputPath}`);
    console.log('Fetch completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

fetchAllData();
