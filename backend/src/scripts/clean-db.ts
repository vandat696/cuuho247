import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import * as Models from '../shared/models';

async function main() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Cleaning up database...');

  const modelsToClean: Array<{ name: string; model: any }> = [
    { name: 'User', model: Models.User },
    { name: 'Company', model: Models.Company },
    { name: 'Admin', model: Models.Admin },
    { name: 'ServiceCategory', model: Models.ServiceCategory },
    { name: 'Service', model: Models.Service },
    { name: 'Vehicle', model: Models.Vehicle },
    { name: 'RescueRequest', model: Models.RescueRequest },
    { name: 'Message', model: Models.Message },
    { name: 'Review', model: Models.Review },
    { name: 'Notification', model: Models.Notification },
    { name: 'CommunityPost', model: Models.CommunityPost },
    { name: 'CommunityPostComment', model: Models.CommunityPostComment },
    { name: 'CommunityPostLike', model: Models.CommunityPostLike },
    { name: 'AdminLog', model: Models.AdminLog },
  ];

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
