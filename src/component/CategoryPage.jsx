import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Eye, Calendar, Star, Share2, Heart, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { postsAPI } from '../api/api';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const sampleStories = [
  { id: 1, title: 'The Future of AI Technology', type: 'video', views: '2.3M', date: '2 days ago', duration: '12:45', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: 'Tech', trending: true },
  { id: 2, title: 'Life in the Mountains', type: 'photo', views: '1.8M', date: '1 week ago', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', category: 'Lifestyle', trending: false },
  { id: 3, title: 'Behind the Scenes of Hollywood', type: 'video', views: '3.1M', date: '5 days ago', duration: '18:30', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', category: 'Entertainment', trending: true },
  { id: 5, title: 'Urban Living Redefined', type: 'photo', views: '987K', date: '4 days ago', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', category: 'Lifestyle', trending: false },
  { id: 6, title: 'Amazing Human Stories', type: 'video', views: '2.7M', date: '1 day ago', duration: '15:20', image: 'https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=800', category: 'Human Story', trending: true },
  { id: 7, title: 'Tech Innovation Summit', type: 'photo', views: '1.5M', date: '6 days ago', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', category: 'Tech', trending: false },
  { id: 8, title: 'Concert Experience Live', type: 'video', views: '2.9M', date: '2 days ago', duration: '20:15', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', category: 'Experience', trending: true },
  { id: 9, title: 'City Nights: Neon Stories', type: 'video', views: '1.1M', date: '3 days ago', duration: '11:02', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800', category: 'Lifestyle', trending: false },
  { id: 10, title: 'Designing the Future UI', type: 'video', views: '856K', date: '4 days ago', duration: '14:44', image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800', category: 'Tech', trending: true },
  { id: 11, title: 'Humanity: Acts of Kindness', type: 'video', views: '1.9M', date: '1 week ago', duration: '09:57', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800', category: 'Human Story', trending: true },
  { id: 12, title: 'Epic Travel Vlog: Island Hopping', type: 'video', views: '1.3M', date: '2 weeks ago', duration: '21:30', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', category: 'Experience', trending: false },
  { id: 13, title: 'Behind the Lens: Street Photography', type: 'video', views: '743K', date: '5 days ago', duration: '13:18', image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800', category: 'Documentary', trending: false },
  { id: 14, title: 'Blockbusters: How They are Made', type: 'video', views: '2.2M', date: '3 days ago', duration: '19:05', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800', category: 'Entertainment', trending: true },
  { id: 15, title: 'Wellness Routines That Work', type: 'video', views: '612K', date: '6 days ago', duration: '10:26', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=800', category: 'Lifestyle', trending: false },
  { id: 16, title: 'Quantum Computing Explained', type: 'video', views: '1.6M', date: '1 day ago', duration: '16:33', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', category: 'Tech', trending: true },
  { id: 18, title: 'Culinary Journeys: Street Food', type: 'video', views: '1.0M', date: '4 days ago', duration: '17:41', image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', category: 'Experience', trending: false },
  { id: 19, title: 'Nature Docs: Oceans Alive', type: 'video', views: '2.0M', date: '1 week ago', duration: '24:55', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'Documentary', trending: true },
  { id: 20, title: 'Live Session: Indie Concert', type: 'video', views: '934K', date: '2 weeks ago', duration: '08:36', image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800', category: 'Entertainment', trending: false },
];

const featuredStories = sampleStories.slice(0, 5);
const filters = ['All', 'Latest', 'Most Viewed', 'Trending', 'Videos', 'Photos'];
const categories = ['All', 'Entertainment', 'Lifestyle', 'Experience', 'Human Story', 'Tech', 'Documentary'];

const CategoryPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);
  const initialCategory = params.get('category') || 'All';

  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { isDark, theme, themeVars: shared } = useTheme();
  const [searchTerm, setSearchTerm] = useState(() => params.get('q') || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef({});



  // Handle story card click
  const handleStoryClick = (story) => {
    const compositeId = `${story.category}-${story.id}`;
    const q = new URLSearchParams({
      id: compositeId,
      category: story.category || '',
      title: story.title,
      image: story.image
    }).toString();
    navigate(`/StoryPage?${q}`);
  };
  
  const themeVars = {
    pageBg: isDark ? '#0b0f1a' : '#f8f9fa',
    chipBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    chipText: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)',
    containerText: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.9)',
    subtleText: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    cardBg: isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : 'linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))',
    cardBorder: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    panelBg: isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : 'linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))',
    panelBorder: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    carouselBorder: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    dotActive: shared.dotActive,
    dotInactive: shared.dotInactive,
    primaryGradient: shared.primaryGradient,
    dangerGradient: shared.dangerGradient,
    emptyBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    emptyText: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    searchBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    searchColor: isDark ? 'white' : '#0b0f1a',
    searchBorder: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
  };

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAll();
        setPosts(response.data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Convert posts to story format
  const allStories = posts.map(post => ({
    id: post._id,
    title: post.title,
    type: post.media && post.media[0] && post.media[0].mediaType === 'video' ? 'video' : 'photo',
    views: post.views || 0,
    date: new Date(post.createdAt).toLocaleDateString(),
    duration: post.media && post.media[0] && post.media[0].mediaType === 'video' ? '00:00' : null,
    image: post.media && post.media[0] ? `http://localhost:5000${post.media[0].url}` : '',
    mediaUrl: post.media && post.media[0] ? `http://localhost:5000${post.media[0].url}` : '',
    mediaType: post.media && post.media[0] ? post.media[0].mediaType : 'image',
    category: post.category,
    trending: post.topStory || false,
    featured: post.featured || false,
    description: post.description,
    _id: post._id
  }));

  const featuredStories = allStories.filter(s => s.featured).slice(0, 5);
  const displayStories = allStories.length > 0 ? allStories : sampleStories;
  const displayFeatured = featuredStories.length > 0 ? featuredStories : sampleStories.slice(0, 5);

  const filteredStories = displayStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
    if (!matchesSearch || !matchesCategory) return false;
    if (activeFilter === 'All' || activeFilter === 'Latest') return true;
    if (activeFilter === 'Most Viewed') return story.views > 100;
    if (activeFilter === 'Trending') return story.trending;
    if (activeFilter === 'Videos') return story.type === 'video';
    if (activeFilter === 'Photos') return story.type === 'photo';
    return true;
  });

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayFeatured.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayFeatured.length) % displayFeatured.length);

  useEffect(() => {
    if (displayFeatured.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [displayFeatured.length]);

  if (loading) {
    return (
      <div style={{ backgroundColor: themeVars.pageBg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: themeVars.primaryGradient, width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: themeVars.containerText }}>Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: themeVars.pageBg, minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid mb-4 px-3 px-lg-4">
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
          <div className="d-flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : (isDark ? 'btn-outline-light' : 'btn-outline-dark')}`}
                style={{ borderRadius: '999px', background: activeCategory === cat ? themeVars.primaryGradient : 'transparent', borderColor: themeVars.chipBorder, color: activeCategory === cat ? 'white' : themeVars.chipText }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2"></div>
        </div>
      </div>
      <div className="container-fluid my-4 position-relative px-3 px-lg-4">
        <div className="overflow-hidden rounded-4 shadow" style={{ height: '45vh', position: 'relative', border: themeVars.carouselBorder }}>
          {displayFeatured.map((story, index) => (
            <div key={story.id} className="position-absolute top-0 start-0 w-100 h-100" style={{ transition: 'opacity 0.7s', opacity: index === currentSlide ? 1 : 0 }}>
              {story.mediaType === 'video' ? (
                <video
                  src={story.mediaUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(8%) saturate(110%)' }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              ) : (
                <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(8%) saturate(110%)' }} loading="lazy" />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.65))' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', color: 'white', maxWidth: '760px' }}>
                <span className="badge mb-2" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }}>{story.category}</span>
                <h2 style={{ fontWeight: '800', fontSize: 'clamp(1.75rem, 2.5vw + 1rem, 2.5rem)', lineHeight: 1.15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{story.title}</h2>
                <p className="text-white-50 mb-3"><Eye size={14} /> {story.views} • <Calendar size={14} /> {story.date} {story.duration && `• ${story.duration}`}</p>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-lg" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', color: 'white', borderRadius: '999px', paddingInline: '1.25rem' }}>{story.type === 'video' ? 'Watch Now' : 'View Story'}</button>
                  <button className="btn btn-outline-light" style={{ borderRadius: '999px' }}><Heart size={18} /></button>
                  <button className="btn btn-outline-light" style={{ borderRadius: '999px' }}><Bookmark size={18} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={prevSlide} className={`btn ${isDark ? 'btn-dark' : 'btn-light'} position-absolute top-50 start-0 translate-middle-y shadow-sm`} style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>◀</button>
          <button onClick={nextSlide} className={`btn ${isDark ? 'btn-dark' : 'btn-light'} position-absolute top-50 end-0 translate-middle-y shadow-sm`} style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>▶</button>
          <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-3">
            {displayFeatured.map((_, i) => (
              <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentSlide ? themeVars.dotActive : themeVars.dotInactive }} />
            ))}
          </div>
        </div>
      </div>
      <div className="container-fluid mb-4 d-flex flex-wrap gap-2 justify-content-center px-3 px-lg-4">
        {filters.map(filter => (
          <button
            key={filter}
            className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : (isDark ? 'btn-outline-light' : 'btn-outline-dark')}`}
            style={{ borderRadius: '999px', background: activeFilter === filter ? themeVars.primaryGradient : 'transparent', borderColor: themeVars.chipBorder, color: activeFilter === filter ? 'white' : themeVars.chipText }}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="container-fluid px-3 px-lg-4" style={{ color: themeVars.containerText }}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-4">
              {filteredStories.map(story => (
                <div key={story.id} className="col-12 col-sm-6 col-xl-4">
                  <div
                    className="shadow h-100"
                    style={{ cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', borderRadius: '20px', overflow: 'hidden', background: themeVars.cardBg, border: themeVars.cardBorder }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={() => handleStoryClick(story)}
                  >
                    <div className="position-relative">
                      {story.mediaType === 'video' ? (
                        <video
                          ref={el => videoRefs.current[story.id] = el}
                          src={story.mediaUrl}
                          style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                          preload="none"
                          muted
                          playsInline
                          onMouseEnter={e => {
                            e.stopPropagation();
                            e.target.play();
                          }}
                          onMouseLeave={e => {
                            e.stopPropagation();
                            e.target.pause();
                            e.target.currentTime = 0;
                          }}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <img src={story.image} alt={story.title} style={{ height: '200px', width: '100%', objectFit: 'cover' }} loading="lazy" />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.55))' }} />
                      {story.type && <span className="badge position-absolute" style={{ top: '10px', right: '10px', background: themeVars.dangerGradient }}>{story.type.toUpperCase()}</span>}
                      {story.trending && <span className="badge text-dark position-absolute" style={{ top: '10px', left: '10px', background: '#fbbf24' }}>TRENDING</span>}
                      {story.duration && <span className="badge bg-dark position-absolute" style={{ bottom: '10px', right: '10px' }}>{story.duration}</span>}
                      {story.type === 'video' && (
                        <div className="position-absolute top-50 start-50 translate-middle" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '999px', padding: '8px' }}>
                          <Play size={26} color="#3b82f6" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <span className="badge mb-2" style={{ background: themeVars.primaryGradient }}>{story.category}</span>
                      <h5 className="mb-2" style={{ color: isDark ? 'white' : '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3rem' }}>{story.title}</h5>
                      <p className="mb-3" style={{ color: themeVars.subtleText }}>
                        <Eye size={14} /> {story.views} • <Calendar size={14} /> {story.date}
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn flex-grow-1"
                          style={{ background: themeVars.primaryGradient, color: 'white', borderRadius: '10px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStoryClick(story);
                          }}
                        >
                          {story.type === 'video' ? 'Watch' : 'View'}
                        </button>
                        <button
                          className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`}
                          style={{ borderColor: themeVars.chipBorder }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStories.length === 0 && <p className="text-center py-5 rounded" style={{ background: themeVars.emptyBg, color: themeVars.emptyText }}>No stories found.</p>}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination pagination-sm" style={{ gap: '6px' }}>
                  {[1,2,3,4].map(p => (
                    <li key={p} className={`page-item ${p === 1 ? 'active' : ''}`}>
                      <button className={`page-link`} style={{ borderRadius: '8px', background: p === 1 ? themeVars.primaryGradient : 'transparent', border: `1px solid ${themeVars.chipBorder}`, color: p === 1 ? 'white' : themeVars.chipText }}>{p}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '88px', zIndex: 0 }}>
              <div className="mb-4 p-3" style={{ borderRadius: '20px', background: themeVars.panelBg, border: themeVars.panelBorder }}>
                <h5 className="fw-bold mb-3" style={{ color: isDark ? 'white' : '#111827' }}><Star size={18} /> Popular Stories</h5>
                {displayStories.slice(0, 5).map((story, idx) => (
                  <div key={story.id} className="d-flex align-items-start gap-3 mb-3">
                    <span className="text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px', background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)' }}>{idx + 1}</span>
                    <div>
                      <p className="mb-1 fw-bold" style={{ color: isDark ? 'white' : '#111827' }}>{story.title}</p>
                      <small style={{ color: themeVars.subtleText }}><Eye size={12} /> {story.views}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3" style={{ borderRadius: '20px', background: themeVars.panelBg, border: themeVars.panelBorder }}>
                <h5 className="fw-bold mb-3" style={{ color: isDark ? 'white' : '#111827' }}><Play size={18} /> Recommended Videos</h5>
                {displayStories.filter(s => s.type === 'video').slice(0, 4).map(story => (
                  <div key={story.id} className="d-flex gap-3 align-items-center mb-3" style={{ cursor: 'pointer' }}>
                    <div className="position-relative">
                      {story.mediaType === 'video' ? (
                        <video
                          src={story.mediaUrl}
                          style={{ width: '110px', height: '66px', objectFit: 'cover', borderRadius: '10px' }}
                          preload="metadata"
                          muted
                          playsInline
                        />
                      ) : (
                        <img src={story.image} alt={story.title} style={{ width: '110px', height: '66px', objectFit: 'cover', borderRadius: '10px' }} />
                      )}
                      {story.duration && <span className="badge bg-dark position-absolute bottom-0 end-0">{story.duration}</span>}
                      <div className="position-absolute top-50 start-50 translate-middle" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '999px' }}>
                        <Play size={16} color="#3b82f6" />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.92rem', color: isDark ? 'white' : '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{story.title}</p>
                      <small style={{ color: themeVars.subtleText }}><Eye size={12} /> {story.views}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
