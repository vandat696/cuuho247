import { connectDB } from '../shared/config/db';
import { CommunityPost, CommunityPostComment, User, Company } from '../shared/models';
import mongoose from 'mongoose';

const migrate = async () => {
  await connectDB();
  try {
    // 1. Fix CommunityPost documents
    const posts = await CommunityPost.find();
    console.log(`Checking ${posts.length} posts...`);
    for (const post of posts) {
      const isCompany = await Company.exists({ _id: post.user_id });
      const isUser = await User.exists({ _id: post.user_id });

      let targetType: 'User' | 'Company' = 'User';
      if (isCompany) {
        targetType = 'Company';
      } else if (isUser) {
        targetType = 'User';
      } else {
        console.warn(
          `Post ${post._id} (${post.title}) has user_id ${post.user_id} which does not exist in User or Company collection!`
        );
      }

      if (post.user_type !== targetType) {
        console.log(`Updating post "${post.title}" user_type from "${post.user_type}" to "${targetType}"`);
        post.user_type = targetType;
        await post.save();
      }
    }

    // 2. Fix CommunityPostComment documents
    const comments = await CommunityPostComment.find();
    console.log(`Checking ${comments.length} comments...`);
    for (const comment of comments) {
      const isCompany = await Company.exists({ _id: comment.user_id });
      const isUser = await User.exists({ _id: comment.user_id });

      let targetType: 'User' | 'Company' = 'User';
      if (isCompany) {
        targetType = 'Company';
      } else if (isUser) {
        targetType = 'User';
      } else {
        console.warn(
          `Comment ${comment._id} has user_id ${comment.user_id} which does not exist in User or Company collection!`
        );
      }

      if (comment.user_type !== targetType) {
        console.log(
          `Updating comment on post ${comment.post_id} user_type from "${comment.user_type}" to "${targetType}"`
        );
        comment.user_type = targetType;
        await comment.save();
      }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

migrate();
