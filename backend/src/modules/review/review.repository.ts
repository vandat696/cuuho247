import mongoose from 'mongoose';
import { Review, IReview } from '@/shared/models/Review.model';

class ReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    return review.save();
  }

  async findById(id: string): Promise<IReview | null> {
    return Review.findById(id);
  }

  async findByRequestId(requestId: string): Promise<IReview | null> {
    return Review.findOne({ rescue_request_id: requestId });
  }

  async findByCompanyId(
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: IReview[]; total: number }> {
    const query = { company_id: companyId, is_visible: true };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user_id', 'full_name avatar_url')
        .lean(),
      Review.countDocuments(query),
    ]);

    return { reviews: reviews as unknown as IReview[], total };
  }

  async findAllForAdmin(page: number = 1, limit: number = 20): Promise<{ reviews: IReview[]; total: number }> {
    const [reviews, total] = await Promise.all([
      Review.find({})
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user_id', 'full_name phone avatar_url')
        .populate('company_id', 'company_name phone')
        .lean(),
      Review.countDocuments({}),
    ]);

    return { reviews: reviews as unknown as IReview[], total };
  }

  async updateReply(id: string, content: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(
      id,
      {
        $set: {
          reply: {
            content,
            replied_at: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );
  }

  async calculateCompanyStats(companyId: string): Promise<{ rating_avg: number; rating_count: number }> {
    const result = await Review.aggregate([
      { $match: { company_id: new mongoose.Types.ObjectId(companyId), is_visible: true } },
      {
        $group: {
          _id: null,
          rating_avg: { $avg: '$rating' },
          rating_count: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      // Round to 1 decimal place
      return {
        rating_avg: Math.round(result[0].rating_avg * 10) / 10,
        rating_count: result[0].rating_count,
      };
    }

    return { rating_avg: 0, rating_count: 0 };
  }
}

export const reviewRepository = new ReviewRepository();
