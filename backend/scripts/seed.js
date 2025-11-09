import { db } from '../config/firebase.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Read benchmark data from the website folder
    const benchmarkPath = join(__dirname, '../../website/src/app/benchmark.ts');
    const fileContent = await readFile(benchmarkPath, 'utf-8');

    // Extract the benchmarkData array from the TypeScript file
    const dataMatch = fileContent.match(/export const benchmarkData: BenchmarkData\[\] = (\[[\s\S]*?\]);/);
    
    if (!dataMatch) {
      throw new Error('Could not find benchmarkData in benchmark.ts');
    }

    // Parse the data (convert TypeScript to JSON)
    const dataString = dataMatch[1]
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

    const benchmarkData = eval(`(${dataString})`);

    console.log(`Found ${benchmarkData.length} benchmark entries`);

    // Delete all existing documents in the benchmarks collection
    console.log('Deleting existing data...');
    const existingDocs = await db.collection('benchmarks').get();
    const batch = db.batch();
    
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Deleted ${existingDocs.size} existing documents`);

    // Add new data
    console.log('Adding new data...');
    let addedCount = 0;

    for (const item of benchmarkData) {
      await db.collection('benchmarks').add({
        circuit: item.circuit,
        framework: item.framework,
        language: item.language,
        platform: item.platform,
        device: item.device,
        provingTime: item.provingTime,
        verificationTime: item.verificationTime,
        createdAt: new Date().toISOString()
      });
      addedCount++;
    }

    console.log(`Successfully seeded ${addedCount} benchmark entries`);
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
