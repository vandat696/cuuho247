import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please provide MONGODB_URI in the environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
