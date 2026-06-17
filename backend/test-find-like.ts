import mongoose from 'mongoose';
import { CommunityPostLike } from './src/shared/models/CommunityPostLike.model';

async function test() {
  await mongoose.connect('mongodb://localhost:27017/cuuho247');
  const like = await CommunityPostLike.findOne({});
  if (!like) {
    console.log('No likes found');
    process.exit(0);
  }
  console.log('Found like:', like);
  const foundByIds = await CommunityPostLike.findOne({
    post_id: like.post_id.toString(),
    user_id: like.user_id.toString(),
  });
  console.log('Found by string IDs:', foundByIds);
  process.exit(0);
}
test().catch(console.error);
