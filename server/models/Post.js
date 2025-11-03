import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: String,
  mediaType: String
}, { _id: false });

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  postType: String,
  media: {
    type: [mediaSchema],
    default: []
  },
  author: {
    type: String,
    default: 'Admin'
  },
  tags: [String],
  featured: Boolean,
  views: Number,
  heroContent: Boolean,
  topStory: Boolean,
  categoryHighlight: Boolean,
  position: Number
}, {
  timestamps: true,
  strict: false
});

// Add indexes for faster queries
postSchema.index({ category: 1 });
postSchema.index({ heroContent: 1 });
postSchema.index({ views: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;

