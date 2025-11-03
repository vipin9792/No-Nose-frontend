import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with proper headers for video streaming and caching
app.use('/uploads', (req, res, next) => {
  // Set headers for range support and caching behavior
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Vary', 'Range');

  // Cache policy: images can be cached, videos avoid disk cache to prevent ERR_CACHE_OPERATION_NOT_SUPPORTED
  if (req.path.includes('/images/')) {
    res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
    res.setHeader('Pragma', 'cache');
  } else if (req.path.includes('/videos/')) {
    // Avoid storing videos in disk cache to prevent browser cache range issues
    res.setHeader('Cache-Control', 'no-store');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day default
    res.setHeader('Pragma', 'cache');
  }

  next();
}, express.static(path.join(__dirname, 'uploads')));

// Create upload directories if they don't exist
import fs from 'fs';
const uploadDirs = [
  path.join(__dirname, 'uploads/images'),
  path.join(__dirname, 'uploads/videos')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// MongoDB connection
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaivailayam')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue without database connection for static file serving');
});

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Kaivailayam API is running!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

