import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { Notification } from '../shared/models/Notification.model';

async function main() {
  await connectDB();
  const latestNotis = await Notification.find().sort({ created_at: -1 }).limit(10).lean();
  console.log('LATEST NOTIFICATIONS IN DB:');
  console.log(JSON.stringify(latestNotis, null, 2));
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
});
