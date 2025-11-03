import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, TrendingUp, Heart, Share2, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import "../index.css";
import { useTheme } from '../context/ThemeContext';
import { sectionAPI } from '../api/api';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTopStory, setCurrentTopStory] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [heroMuted, setHeroMuted] = useState(true);
  const [showAllByCategory, setShowAllByCategory] = useState({});
  const { isDark, themeVars: shared } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const videoRefs = useRef([]);
  
  // API data states
  const [heroPosts, setHeroPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [entertainmentPosts, setEntertainmentPosts] = useState([]);
  const [lifestylePosts, setLifestylePosts] = useState([]);
  const [foodPosts, setFoodPosts] = useState([]);
  const [humanStoryPosts, setHumanStoryPosts] = useState([]);
  const [techPosts, setTechPosts] = useState([]);
  const [documentaryPosts, setDocumentaryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dataFetchedRef = useRef(false);

  const themeVars = {
    pageBg: isDark ? '#0b0f1a' : '#f8f9fa',
    chipBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    chipText: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)',
    containerText: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.9)',
    text: isDark ? 'rgba(255,255,255,0.92)' : '#0b1220',
    subtleText: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    cardBg: isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : '#fff',
    cardBorder: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    primaryGradient: shared.primaryGradient
  };

  // Dynamic category list from API or config
  const categoryList = ['All', 'Entertainment', 'Lifestyle', 'Food', 'Human Story', 'Tech', 'Documentary'];
  
  // Social media data - should be from API/config in future
  const [socialMedia, setSocialMedia] = useState([
    { icon: Instagram, color: "#E1306C", name: "Instagram", handle: "@kaivailayam" },
    { icon: Twitter, color: "#1DA1F2", name: "Twitter", handle: "@kaivailayam" },
    { icon: Facebook, color: "#4267B2", name: "Facebook", handle: "kaivailayam" },
    { icon: Youtube, color: "#FF0000", name: "YouTube", handle: "@kaivailayam" }
  ]);

  // Fetch critical data first (Hero + Trending) - FAST LOAD
  useEffect(() => {
    if (dataFetchedRef.current) return;

    async function fetchCriticalData() {
      try {
        setLoading(true);
        setError(null);
        // Load hero and trending first (critical for above-the-fold)
        const [hero, trending] = await Promise.all([
          sectionAPI.getHero(),
          sectionAPI.getTrending()
        ]);

        setHeroPosts(hero || []);
        setTrendingPosts(trending || []);
        setLoading(false);

        // Load other sections in background (non-blocking)
        loadOtherSections();
        dataFetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching critical data:', error);
        setError(error.message || 'Failed to load content');
        setLoading(false);
        // Set empty arrays so page doesn't break
        setHeroPosts([]);
        setTrendingPosts([]);
      }
    }

    fetchCriticalData();
  }, []);

  // Load other sections in background (non-blocking)
  const loadOtherSections = async () => {
    try {
      const [entertainment, lifestyle, experience, humanStory, tech, documentary] = await Promise.all([
        sectionAPI.getEntertainment(),
        sectionAPI.getLifestyle(),
        sectionAPI.getExperience(),
        sectionAPI.getHumanStory(),
        sectionAPI.getTech(),
        sectionAPI.getDocumentary()
      ]);

      setEntertainmentPosts(entertainment || []);
      setLifestylePosts(lifestyle || []);
      setFoodPosts(experience || []);
      setHumanStoryPosts(humanStory || []);
      setTechPosts(tech || []);
      setDocumentaryPosts(documentary || []);
    } catch (error) {
      console.error('Error fetching other sections:', error);
      // Don't set error state for background loads - just log it
    }
  };

  // Video refs management
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      try {
        v.muted = heroMuted;
        if (i === currentSlide) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
          try { v.currentTime = 0; } catch {}
        }
      } catch {}
    });
  }, [currentSlide, heroMuted]);

  const getCategoryItems = useCallback((categoryId) => {
    let items = [];
    switch(categoryId) {
      case 'entertainment':
        items = entertainmentPosts;
        break;
      case 'lifestyle':
        items = lifestylePosts;
        break;
      case 'food':
        items = foodPosts;
        break;
      case 'humanStory':
        items = humanStoryPosts;
        break;
      case 'tech':
        items = techPosts;
        break;
      case 'documentary':
        items = documentaryPosts;
        break;
      default:
        items = [];
    }

    // For media files, use base URL without /api
    const MEDIA_BASE = 'http://localhost:5000';

    return items.map(post => ({
      id: post._id,
      title: post.title,
      image: post.media && post.media[0] ? `${MEDIA_BASE}${post.media[0].url}` : '',
      views: post.views || 0,
      category: post.category,
      _id: post._id,
      description: post.description,
      mediaType: post.media && post.media[0] ? post.media[0].mediaType : 'image',
      mediaUrl: post.media && post.media[0] ? `${MEDIA_BASE}${post.media[0].url}` : ''
    }));
  }, [entertainmentPosts, lifestylePosts, foodPosts, humanStoryPosts, techPosts, documentaryPosts]);

  const toggleShowAll = useCallback((categoryId) => {
    setShowAllByCategory((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }, []);

  // Hero slider autoplay
  useEffect(() => {
    if (!autoPlay || heroPosts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroPosts.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoPlay, heroPosts.length, heroPosts]);

  // Trending stories autoplay
  useEffect(() => {
    if (trendingPosts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTopStory((prev) => {
        // Show 1 item at a time, cycle through all
        const maxIndex = Math.max(trendingPosts.length - 1, 0);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [trendingPosts.length, trendingPosts]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (heroPosts.length || 1));
  }, [heroPosts.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + (heroPosts.length || 1)) % (heroPosts.length || 1));
  }, [heroPosts.length]);

  const scrollTopStories = useCallback((direction) => {
    if (direction === 'next') {
      // Cycle through all trending posts
      setCurrentTopStory((prev) => (prev + 1) % (trendingPosts.length || 1));
    } else {
      // Go to previous, wrap around if at start
      setCurrentTopStory((prev) => (prev - 1 + (trendingPosts.length || 1)) % (trendingPosts.length || 1));
    }
  }, [trendingPosts.length]);

  const CategoryCard = React.memo(({ story, categoryId }) => {
    const compositeId = `${categoryId || story.category}-${story.id}`;
    const q = new URLSearchParams({
      id: compositeId,
      category: categoryId || story.category || '',
      title: story.title,
      image: story.image
    }).toString();

    const isVideo = story.mediaType === 'video';

    return (
      <Link to={`/StoryPage?${q}`} className="text-decoration-none text-reset">
        <div style={{ background: themeVars.cardBg }} className="rounded-lg shadow-md overflow-hidden hover-shadow transition-all duration-300 transform hover:-translate-y-1 position-relative">
          <div className="position-relative" style={{ paddingTop: '60%', backgroundColor: '#e9ecef' }}>
            {isVideo ? (
              <video
                src={story.mediaUrl}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ objectFit: 'cover' }}
                preload="auto"
                muted
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={story.image}
                alt={story.title}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ objectFit: 'cover' }}
                loading="eager"
                decoding="sync"
              />
            )}
            {isVideo && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Play size={28} className="text-white" style={{ marginLeft: '4px' }} />
                </div>
              </div>
            )}
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge bg-danger">{story.views} views</span>
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3 card-hover-overlay" style={{ background: isDark ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' : 'linear-gradient(to top, rgba(255,255,255,0.6), rgba(255,255,255,0))', opacity: 0, transition: 'opacity 0.3s ease' }}>
              <h6 className="fw-bold mb-1" style={{ color: themeVars.containerText, textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.6)' : 'none' }}>{story.title}</h6>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm d-flex align-items-center gap-1" style={{ background: themeVars.primaryGradient, color: 'white', borderRadius: '999px', border: 'none' }}>
                  <Play size={14} /> {isVideo ? 'Watch' : 'Read'}
                </button>
                <Heart size={16} className="text-white" style={{ cursor: 'pointer', opacity: 0.9 }} />
                <Share2 size={16} className="text-white" style={{ cursor: 'pointer', opacity: 0.9 }} />
              </div>
            </div>
          </div>
          <div className="p-3">
            <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.4', color: themeVars.containerText }}>{story.title}</h6>
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-md d-flex align-items-center gap-1" style={{ background: themeVars.primaryGradient, color: 'white', borderRadius: '999px', border: 'none' }}>
                <Play size={14} /> {isVideo ? 'Watch' : 'Read'}
              </button>
              <div className="d-flex gap-2">
                <Heart size={16} style={{ color: themeVars.subtleText, cursor: 'pointer' }} />
                <Share2 size={16} style={{ color: themeVars.subtleText, cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  });

  CategoryCard.displayName = 'CategoryCard';

  // For media files, use base URL without /api
  const MEDIA_BASE = 'http://localhost:5000';

  const CategorySection = React.memo(({ category, allItems, showTrendingSection, showAll, itemsToShow, toggleShowAll }) => {
    const { ref, isVisible } = useIntersectionObserver();
    const items = showAll ? allItems : allItems.slice(0, itemsToShow);

    return (
      <section
        ref={ref}
        id={category.id}
        className="py-5"
        style={{ backgroundColor: isDark ? '#0f1724' : '#f8f9fa' }}
      >
        <div
          className="container-fluid rounded-4 shadow-md overflow-hidden px-3 px-md-4 py-4"
          style={{
            width: "93%",
            marginLeft: "auto",
            marginRight: "auto",
            background: themeVars.cardBg,
            border: themeVars.cardBorder
          }}
        >
          <div className="row">
            <div className={showTrendingSection ? "col-12 col-lg-9" : "col-12"}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0" style={{ color: category.color }}>
                  {category.title}
                  <span className="ms-3 badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                    {showAll ? allItems.length : Math.min(itemsToShow, allItems.length)} / {allItems.length}
                  </span>
                </h2>
                {allItems.length > itemsToShow && (
                  <button
                    onClick={() => toggleShowAll(category.id)}
                    className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`}
                    style={{
                      fontWeight: '600',
                      padding: '0.5rem 1rem',
                      borderWidth: '2px'
                    }}
                    aria-label={showAll ? 'View less' : 'View all'}
                  >
                    {showAll ? '▲ View Less' : '▼ View All'}
                  </button>
                )}
              </div>
              <div className="row g-4">
                {items.map((story) => (
                  <div key={story.id} className={showTrendingSection ? "col-12 col-sm-6 col-lg-4" : "col-12 col-sm-6 col-lg-3"}>
                    <CategoryCard story={story} categoryId={category.id} />
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="col-12 small text-muted" style={{ opacity: 0.7 }}>Loading section…</div>
                )}
              </div>
            </div>
            {showTrendingSection && (
              <div className="col-12 col-lg-3">
                <h3 className="d-flex align-items-center gap-2 mb-3">
                  <TrendingUp className="text-danger fw-bold" size={22} />
                  <span className="fw-semibold">Trending Now</span>
                </h3>
                <div
                  className="rounded-3 shadow-lg p-3 d-flex flex-column text-white"
                  style={{
                    minHeight: '400px',
                    background: 'linear-gradient(135deg, #1f2937 0%, #111827 60%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex-grow-1 overflow-hidden">
                    {isVisible && trendingPosts.length > 0 ? (() => {
                      const story = trendingPosts[currentTopStory] || trendingPosts[0];
                      return (
                        <div key="trending-slide" className="w-100">
                          <div className="card border-0 h-100 bg-transparent text-white">
                            <div className="position-relative" style={{ paddingTop: '60%' }}>
                              {story.media && story.media[0] && (
                                story.media[0].mediaType === 'video' ? (
                                  <>
                                    <video
                                      src={`${MEDIA_BASE}${story.media[0].url}`}
                                      className="card-img-top position-absolute top-0 start-0 w-100 h-100"
                                      style={{ objectFit: 'cover', filter: 'grayscale(10%) brightness(0.9)' }}
                                      preload="metadata"
                                      muted
                                      autoPlay
                                      loop
                                      playsInline
                                    />
                                  </>
                                ) : (
                                  <img
                                    src={`${MEDIA_BASE}${story.media[0].url}`}
                                    alt={story.title}
                                    className="card-img-top position-absolute top-0 start-0 w-100 h-100"
                                    style={{ objectFit: 'cover', filter: 'grayscale(10%) brightness(0.9)' }}
                                    loading="eager"
                                    decoding="sync"
                                  />
                                )
                              )}
                              <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                                {story.category}
                              </span>
                            </div>
                            <div className="card-body">
                              <h6 className="card-title fw-bold">{story.title}</h6>
                              <div className="d-flex justify-content-between align-items-center small" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                <span>{story.views || 0} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="text-white text-center">No trending stories yet.</div>
                    )}
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      onClick={() => scrollTopStories('prev')}
                      className="btn btn-outline-light btn-sm rounded-circle"
                      disabled={trendingPosts.length <= 1}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollTopStories('next')}
                      className="btn btn-outline-light btn-sm rounded-circle"
                      disabled={trendingPosts.length <= 1}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  });

  CategorySection.displayName = 'CategorySection';

  return (
    <div style={{ background: themeVars.pageBg, color: themeVars.containerText, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <section className="hero-banner position-relative" style={{ height: '60vh', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            Loading Hero Content...
          </div>
        ) : heroPosts.length > 0 ? (
          (() => {
            const slide = heroPosts[currentSlide] || heroPosts[0];
            const index = currentSlide;
            return (
              <div
                key="hero-slide"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  opacity: 1,
                  transition: 'opacity 0.6s ease-in-out',
                  zIndex: 1,
                }}
              >
                {slide.media && slide.media[0] && (
                  slide.media[0].mediaType === 'video' ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      autoPlay
                      muted={heroMuted}
                      loop
                      playsInline
                      preload="auto"
                      className="hero-video"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      src={`${MEDIA_BASE}${slide.media[0].url}`}
                      onPlay={() => {}}
                      onCanPlay={() => {}}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${MEDIA_BASE}${slide.media[0].url}`}
                      alt={slide.title}
                      className="hero-video"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="eager"
                      decoding="sync"
                    />
                  )
                )}
                <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end" style={{ background: isDark ? 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.2))' : 'linear-gradient(to top, rgba(255,255,255,0.0), rgba(0,0,0,0.2))', zIndex: 2 }}>
                  <div className="container pb-5" style={{ maxWidth: '700px', color: themeVars.containerText }}>
                    <span className="badge mb-3 px-3 py-2 bg-danger">{slide.category}</span>
                    <h1 className="text-white fw-bold mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{slide.title}</h1>
                    <button className="btn btn-outline-light btn-lg px-4 py-2">
                      <Play size={20} className="me-2" /> Watch Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            No Hero Content Available
          </div>
        )}
      </section>

      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={10} lg={8} xl={8} className="px-3 px-sm-4 px-md-5">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
              <div className="d-flex flex-wrap gap-2">
                {categoryList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`btn btn-sm ${activeCategory === c ? 'btn-primary' : (isDark ? 'btn-outline-light' : 'btn-outline-dark')}`}
                    style={{ 
                      borderRadius: '999px', 
                      background: activeCategory === c ? themeVars.primaryGradient : 'transparent', 
                      borderColor: themeVars.chipBorder, 
                      color: activeCategory === c ? 'white' : themeVars.chipText 
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {[
        { id: 'entertainment', title: 'Entertainment & Pop Culture', color: '#e74c3c' },
        { id: 'lifestyle', title: 'Lifestyle & Wellness', color: '#e74c3c' },
        { id: 'food', title: 'Food, Travel & Experience', color: '#e74c3c' },
        { id: 'humanStory', title: 'Human Story', color: '#e74c3c' },
        { id: 'tech', title: 'Tech & Automobile', color: '#e74c3c' },
        { id: 'documentary', title: 'Documentary', color: '#e74c3c' }
      ].map((category) => {
        if (activeCategory !== 'All' && activeCategory.toLowerCase() !== category.id) return null;
        const allItems = getCategoryItems(category.id);
        const showAll = showAllByCategory[category.id];
        const itemsToShow = category.id === 'entertainment' ? 3 : 4;
        const showTrendingSection = category.id === 'entertainment';

        return (
          <CategorySection
            key={category.id}
            category={category}
            allItems={allItems}
            showTrendingSection={showTrendingSection}
            showAll={showAll}
            itemsToShow={itemsToShow}
            toggleShowAll={toggleShowAll}
          />
        );
      })}

      <section
        className="py-5"
        style={{
          background: isDark ? '#0f1724' : '#fff',
          color: themeVars.containerText,
          width: "93%", 
          marginLeft: "auto", 
          marginRight: "auto", 
        }}
      >
        <div className="container-fluid">
          <h2 className="fw-bold text-center mb-5" style={{ color: '#e74c3c' }}>
            Follow Us on Social Media
          </h2>
          
          <div className="row g-4">
            {socialMedia.map((social) => (
              <div key={social.name} className="col-lg-3 col-md-6">
                <div className="text-center p-4 rounded-4 shadow-sm h-100"
                  style={{
                    background: themeVars.cardBg,
                    border: themeVars.cardBorder,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <social.icon size={48} className="mb-3" style={{ color: social.color }} />
                  <h5 className="fw-bold">{social.name}</h5>
                  <div className="small text-muted mb-2">@{social.handle}</div>
                  <a href={`https://${social.name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: social.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      textDecoration: 'none'
                    }}
                  >
                    Follow
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <button className="btn px-4 py-2 load-more-btn">Follow All</button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
          transform: translateY(-4px);
        }
        .rounded-lg {
          border-radius: 12px;
        }
        .skeleton-loader {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .load-more-btn {
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
          font-weight: 500;
          border-radius: 30px;
          transition: all 0.3s ease;
          background: transparent;
        }
        .load-more-btn:hover {
          background: #ff6b6b;
          color: #fff;
        }
        .col-lg-3 .text-center:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Home;
