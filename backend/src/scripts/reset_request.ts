import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { RescueRequest } from '../models';

async function main() {
  await connectDB();
  const request = await RescueRequest.findOne({ _id: '6a02e8d189cc323254bdc4ec' });
  if (request) {
    request.status = 'pending';
    await request.save();
    console.log('SUCCESS: Seeded RescueRequest has been reset to PENDING.');
  } else {
    console.log('ERROR: Seeded RescueRequest not found!');
  }
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
});
