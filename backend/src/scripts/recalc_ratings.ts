import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from '../shared/models/Company.model';
import { Review } from '../shared/models/Review.model';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cuuho247');
    console.log('Connected to DB');

    const companies = await Company.find({});
    for (const company of companies) {
      const stats = await Review.aggregate([
        { $match: { company_id: company._id } },
        {
          $group: {
            _id: '$company_id',
            rating_avg: { $avg: '$rating' },
            rating_count: { $sum: 1 },
          },
        },
      ]);

      let rating_avg = 0;
      let rating_count = 0;

      if (stats.length > 0) {
        rating_avg = Math.round(stats[0].rating_avg * 10) / 10;
        rating_count = stats[0].rating_count;
      }

      await Company.updateOne({ _id: company._id }, { $set: { rating_avg, rating_count } });
      console.log(`Updated company ${company.company_name} to avg ${rating_avg}, count ${rating_count}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
