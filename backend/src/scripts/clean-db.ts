import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { getModelsToClean } from './db-utils';

async function main() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Cleaning up database...');

  const modelsToClean = getModelsToClean();

  for (const { name, model } of modelsToClean) {
    if (model && typeof model.deleteMany === 'function') {
      const result = await model.deleteMany({});
      console.log(`Cleared collection for ${name}: deleted ${result.deletedCount} documents.`);
    } else {
      console.warn(`Warning: Model ${name} does not have deleteMany method or is undefined.`);
    }
  }

  console.log('Database cleaned successfully!');
  await mongoose.disconnect();
  console.log('Database connection closed.');
}

main().catch(async (error) => {
  console.error('Failed to clean database:', error);
  await mongoose.disconnect();
  process.exit(1);
});
