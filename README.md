# Kaivailayam - Complete MERN Stack CMS

A complete Content Management System built with React, Node.js, Express, and MongoDB.

## Features

- ✅ User Authentication (JWT-based)
- ✅ Complete CRUD operations for posts
- ✅ File upload (images and videos)
- ✅ Category management
- ✅ Featured/Hero/Top Story functionality
- ✅ Responsive dashboard
- ✅ Dark/Light theme support
- ✅ Modern UI with Bootstrap 5

## Tech Stack

**Frontend:**
- React 18
- React Router
- Bootstrap 5
- Lucide React (Icons)
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (File uploads)
- JWT Authentication

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd kaivailayam
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Setup Backend

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kaivailayam
JWT_SECRET=your-secret-key-change-this-in-production
```

### 5. Start MongoDB

Make sure MongoDB is running on your system.

**Windows:**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 6. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Login

First, you need to register a new account on the login page.

Or you can create a default admin user by running (optional):
```bash
cd server
node createAdmin.js
```

## Project Structure

```
kaivailayam/
├── src/
│   ├── api/              # API service layer
│   ├── component/        # React components
│   ├── context/          # React contexts (Theme, Auth)
│   └── App.jsx           # Main app component
├── server/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── uploads/         # Uploaded files
│   └── server.js         # Backend entry point
└── package.json
```

## Features Overview

### Dashboard
- Content management with full CRUD
- Category-based organization
- Hero section management
- Top stories management
- Featured content

### Frontend Pages
- Homepage with dynamic content
- Category pages
- Story detail pages
- About & Contact pages

### Admin Features
- Upload images/videos
- Edit existing content
- Delete content
- Mark content as featured/top story/hero
- Filter and search content

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Development

### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

### Backend
```bash
cd server
npm run dev    # Development with nodemon
npm start      # Production
```

## Deployment

### Frontend
Build and deploy to platforms like Vercel, Netlify, etc.

### Backend
Deploy to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

Don't forget to:
1. Set environment variables
2. Configure MongoDB URI
3. Set up file storage (consider cloud storage for production)

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
