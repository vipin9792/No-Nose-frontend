import express from 'express';
import Post from '../models/Post.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'videos') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'images') {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, featured, heroContent, topStory, limit = 50, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (heroContent) query.heroContent = heroContent === 'true';
    if (topStory) query.topStory = topStory === 'true';

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hero/Banner Section - MUST be before /:id
router.get('/hero', async (req, res) => {
  try {
    const posts = await Post.find({ heroContent: true })
      .select('title description category media views createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.set('Cache-Control', 'public, max-age=300');
    res.json(posts);
  } catch (err) {
    console.error('Hero route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Trending Now - MUST be before /:id
// Shows posts sorted by views (most viewed first), with limit of 10
router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find()
      .select('title description category media views createdAt')
      .sort({ views: -1, createdAt: -1 })
      .limit(10)
      .lean();

    res.set('Cache-Control', 'public, max-age=300');
    res.json(posts);
  } catch (err) {
    console.error('Trending route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Category Endpoints - MUST be before /:id
const validCategories = ['entertainment','lifestyle','experience','humanStory','tech','documentary'];
validCategories.forEach(category => {
  router.get(`/category/${category}`, async (req, res) => {
    try {
      const posts = await Post.find({ category: category })
        .select('title description category media views createdAt')
        .sort({ createdAt: -1 })
        .lean();

      res.set('Cache-Control', 'public, max-age=300');
      res.json(posts);
    } catch (err) {
      console.error(`Category ${category} route error:`, err);
      res.status(500).json({ error: err.message });
    }
  });
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
router.post('/', upload.fields([{ name: 'videos', maxCount: 5 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, description, category, type, author, tags, featured, heroContent, topStory, categoryHighlight } = req.body;
    
    console.log('Received data:', { title, category, type, hasFiles: !!req.files });
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const media = [];
    
    // Handle uploaded files
    if (req.files) {
      if (req.files.videos && Array.isArray(req.files.videos)) {
        req.files.videos.forEach(file => {
          media.push({
            url: `/uploads/videos/${file.filename}`,
            mediaType: 'video'
          });
        });
      }
      if (req.files.images && Array.isArray(req.files.images)) {
        req.files.images.forEach(file => {
          media.push({
            url: `/uploads/images/${file.filename}`,
            mediaType: 'image'
          });
        });
      }
    }

    console.log('Media array:', media);

    // Create post object
    const postData = {
      title,
      description,
      category: category || 'entertainment',
      postType: type || 'article',
      media,
      author: author || 'Admin',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      featured: featured === 'true' || featured === true,
      heroContent: heroContent === 'true' || heroContent === true,
      topStory: topStory === 'true' || topStory === true,
      categoryHighlight: categoryHighlight === 'true' || categoryHighlight === true,
      views: 0
    };

    console.log('Post data:', postData);

    const post = new Post(postData);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update post
router.put('/:id', upload.fields([{ name: 'videos', maxCount: 5 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, description, category, type, author, tags, featured, heroContent, topStory } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;
    if (type) post.postType = type;
    if (author) post.author = author;
    if (tags) post.tags = tags.split(',').map(t => t.trim());
    if (featured !== undefined) post.featured = featured === 'true';
    if (heroContent !== undefined) post.heroContent = heroContent === 'true';
    if (topStory !== undefined) post.topStory = topStory === 'true';

    // Handle new media uploads
    if (req.files) {
      const newMedia = [];
      
      if (req.files.videos && Array.isArray(req.files.videos)) {
        req.files.videos.forEach(file => {
          newMedia.push({
            url: `/uploads/videos/${file.filename}`,
            mediaType: 'video'
          });
        });
      }
      if (req.files.images && Array.isArray(req.files.images)) {
        req.files.images.forEach(file => {
          newMedia.push({
            url: `/uploads/images/${file.filename}`,
            mediaType: 'image'
          });
        });
      }
      
      if (newMedia.length > 0) {
        post.media = [...(post.media || []), ...newMedia];
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

