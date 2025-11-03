import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Eye,
  Flame,
  Star,
  Phone,
  Play,
} from "lucide-react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useTheme } from '../context/ThemeContext';
import { postsAPI } from '../api/api';
import "bootstrap/dist/css/bootstrap.min.css";

const StoryPage = () => {
  const [liked, setLiked] = useState(false);
  const { themeVars: shared } = useTheme();
  const [likeCount, setLikeCount] = useState(2458);
  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
  };

  const moreStories = [
    {
      id: 101,
      title: 'AI Breakthrough: New Model',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      category: 'Tech',
      views: '1.2M',
      duration: '12:45',
      type: 'video',
      video: 'https://www.youtube.com/watch?v=HXFoV3_-1iU',
      author: 'Alex Rivera',
      date: 'October 10, 2025',
      likes: 3421,
      content: [
        'Researchers unveiled a new AI model that significantly improves few-shot learning. The model demonstrates strong generalization across tasks and reduces the amount of labeled data needed for high-quality results.',
        'Industry experts believe this will accelerate adoption in healthcare, robotics, and creative tooling. The model architecture focuses on modularity and energy efficiency, enabling deployment on edge devices.',
        'Early pilots show promising accuracy improvements in medical imaging and natural language tasks. Ethics panels are calling for open benchmarks and clearer disclosure when such models are used in production.'
      ]
    },
    {
      id: 102,
      title: 'Street Food Festival Highlights',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      category: 'Food',
      views: '980K',
      duration: null,
      type: 'photo',
      video: null,
      author: 'Maya Singh',
      date: 'October 7, 2025',
      likes: 1240,
      content: [
        'The cityulinary scene came alive this weekend at the annual Street Food Festival. Chefs from across the region showcased unique fusion dishes and traditional favorites.',
        'Attendees enjoyed live cooking demos, music and a family-friendly atmosphere. Many vendors reported record sales, and organizers say the event helped raise money for local food banks.'
      ]
    },
    {
      id: 103,
      title: 'Inside a Celebrity Gala',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      category: 'Entertainment',
      views: '2.4M',
      duration: '04:20',
      type: 'video',
      video: 'https://www.youtube.com/watch?v=1ucncjCGNcU',
      author: 'Jordan Lee',
      date: 'October 5, 2025',
      likes: 8870,
      content: [
        'The annual gala brought celebrities and changemakers together to celebrate achievements in film and philanthropy. Highlights included surprise performances and a moving speech about community impact.',
        'Fashion moments dominated social feeds, with several designers debuting bold new looks on the red carpet.'
      ]
    },
    {
      id: 104,
      title: 'Mental Health Stories',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      category: 'Wellness',
      views: '640K',
      duration: null,
      type: 'article',
      video: null,
      author: 'Priya Das',
      date: 'September 29, 2025',
      likes: 560,
      content: [
        'Community programs focused on mental health awareness have expanded rapidly. Local groups are creating safe spaces for conversation and peer support.',
        'Experts say early intervention and accessible counseling are key to reducing stigma and improving outcomes.'
      ]
    },
    {
      id: 105,
      title: 'Electric Cars Review',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
      category: 'Automobile',
      views: '1.1M',
      duration: '08:30',
      type: 'video',
      video: 'https://www.youtube.com/watch?v=HXFoV3_-1iU',
      author: 'Samir Patel',
      date: 'October 1, 2025',
      likes: 2100,
      content: [
        'We test the latest electric vehicles on range, charging speed and in-city comfort. The newest models show strong improvements on battery longevity and driver assistance features.',
        'Buyers should consider charging infrastructure in their area and total cost of ownership beyond sticker price.'
      ]
    },
    {
      id: 106,
      title: 'Ancient Civilizations Doc',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
      category: 'Documentary',
      views: '890K',
      duration: '22:10',
      type: 'video',
      video: 'https://www.youtube.com/watch?v=HXFoV3_-1iU',
      author: 'Lena Morales',
      date: 'September 20, 2025',
      likes: 1530,
      content: [
        'This documentary explores the rise and fall of several ancient civilizations and the archaeological discoveries that changed our understanding of history.',
        'Viewers will find rare footage and expert interviews that bring the past to life.'
      ]
    },
  ];

  const { search } = useLocation();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);
  const idParam = params.get('id');
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);

        // Extract actual post ID from composite ID (e.g., "lifestyle-67203..." -> "67203...")
        let postId = idParam;
        if (idParam && idParam.includes('-')) {
          const parts = idParam.split('-');
          postId = parts[1]; // Get the MongoDB ID part
        }

        console.log('🔍 Fetching post with ID:', postId);

        // Try to fetch from API first
        if (postId && postId !== 'fallback') {
          try {
            const response = await postsAPI.getById(postId);
            console.log('✅ API Response:', response);

            if (response) {
              // Transform API data to story format
              const apiStory = {
                id: response._id,
                title: response.title,
                image: response.media && response.media[0] ? `http://localhost:5000${response.media[0].url}` : '',
                mediaUrl: response.media && response.media[0] ? `http://localhost:5000${response.media[0].url}` : '',
                mediaType: response.media && response.media[0] ? response.media[0].mediaType : 'image',
                category: response.category,
                views: response.views || 0,
                duration: null,
                type: response.media && response.media[0] && response.media[0].mediaType === 'video' ? 'video' : 'photo',
                video: response.media && response.media[0] && response.media[0].mediaType === 'video'
                  ? `http://localhost:5000${response.media[0].url}`
                  : null,
                author: response.author || 'Staff Writer',
                date: new Date(response.createdAt).toLocaleDateString(),
                likes: 0,
                content: [response.description || 'No description available.']
              };

              setSelectedStory(apiStory);
              setLikeCount(apiStory.likes);
              setLiked(false);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.warn('⚠️ API fetch failed, trying fallback:', apiError);
          }
        }

        // Fallback to dummy data or URL params
        const found = idParam ? moreStories.find(s => String(s.id) === String(idParam) || `${s.category}-${s.id}` === String(idParam)) : null;
        let pick = found || null;

        if (!pick) {
          const titleQ = params.get('title');
          const imageQ = params.get('image');
          const categoryQ = params.get('category');

          if (titleQ || imageQ || categoryQ) {
            pick = {
              id: idParam || 'fallback',
              title: titleQ || 'Untitled Story',
              image: imageQ || '',
              mediaUrl: imageQ || '',
              mediaType: 'image',
              category: categoryQ || 'General',
              views: '—',
              duration: null,
              type: 'article',
              video: null,
              author: 'Staff Writer',
              date: new Date().toLocaleDateString(),
              likes: 0,
              content: [
                'This story was generated from a card click. The full content would normally be loaded from your CMS or API. Replace this fallback with real data as needed.',
                'You can add longer, richer content here. This placeholder demonstrates how the Story page will render a dynamic item when navigated from a thumbnail.'
              ]
            };
          } else {
            pick = moreStories[0];
          }
        }

        setSelectedStory(pick);
        if (pick && typeof pick.likes === 'number') setLikeCount(pick.likes);
        setLiked(false);
      } catch (error) {
        console.error('❌ Error fetching story:', error);
        setSelectedStory(moreStories[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [idParam]);

  const isDark = (typeof document !== 'undefined') ? document.documentElement.classList.contains('dark') : false;
  const themeVars = {
    pageBg: isDark ? '#0b1220' : '#f8f9fa',
    panelBg: isDark ? '#0f1724' : '#fff',
    text: isDark ? '#e6eef8' : '#0b1220',
    muted: isDark ? 'rgba(230,238,248,0.7)' : '#6c757d',
    cardBg: shared.cardBg,
    cardBorder: shared.cardBorder,
    primaryGradient: shared.primaryGradient,
  };

  return (
    <div style={{ background: themeVars.pageBg, minHeight: '100vh', color: themeVars.text, paddingBottom: '4rem' }}>
      <Container fluid className="py-2" />
      <Container className="py-3">
      <QueryMeta />
      <Container>
        <Row className="g-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-4 mb-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
              {loading ? (
                <div className="ratio ratio-16x9 rounded-top-4 overflow-hidden d-flex align-items-center justify-content-center" style={{ background: themeVars.pageBg }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : selectedStory && (
                <>
                  <div className="ratio ratio-16x9 rounded-top-4 overflow-hidden">
                    {selectedStory.type === 'video' && selectedStory.video ? (
                      selectedStory.video.includes('youtube') || selectedStory.video.includes('vimeo') ? (
                        <iframe
                          src={selectedStory.video.includes('youtube') ? selectedStory.video.replace('watch?v=', 'embed/') : selectedStory.video}
                          title={selectedStory.title}
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={selectedStory.video}
                          controls
                          autoPlay
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <img src={selectedStory.image} alt={selectedStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    )}
                  </div>
                  <Card.Body className="p-4">
                    <span className="badge bg-gradient text-white px-3 py-2 rounded-pill mb-3" style={{ background: themeVars.primaryGradient }}>
                      <Phone size={16} className="me-1" />
                      {selectedStory.category}
                    </span>
                    <h1 className="fw-bold mb-3">{selectedStory.title}</h1>
                    <div className="d-flex align-items-center flex-wrap gap-3 border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-gradient p-3" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)', width: '48px', height: '48px' }}></div>
                        <div>
                          <h6 className="mb-0 fw-bold">{selectedStory.author}</h6>
                          <small className="text-muted">{selectedStory.type === 'article' ? 'Reporter' : 'Contributor'}</small>
                        </div>
                      </div>
                      <div className="text-muted d-flex align-items-center gap-2">
                        <span>📅 {selectedStory.date}</span>
                        <span>•</span>
                        <span>{selectedStory.duration ? `⏱️ ${selectedStory.duration}` : (selectedStory.type === 'video' ? 'Video' : 'Read')}</span>
                      </div>
                    </div>

                    {selectedStory.content && selectedStory.content.map((p, i) => (
                      <p key={i} className="text-secondary">{p}</p>
                    ))}
                  </Card.Body>
                </>
              )}
            </Card>
            <Card className="shadow-sm border-0 rounded-4 mb-4 p-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
              <Row className="mb-4 text-center">
                <Col md={4}>
                  <div>
                    <div
                      className="rounded-3 mx-auto mb-2 d-flex justify-content-center align-items-center"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "linear-gradient(135deg,#f093fb,#f5576c)",
                        color: "#fff",
                      }}
                    >
                      <Heart size={20} />
                    </div>
                    <h5 className="fw-bold mb-0">{likeCount.toLocaleString()}</h5>
                    <small className="text-muted">Likes</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <div
                      className="rounded-3 mx-auto mb-2 d-flex justify-content-center align-items-center"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "linear-gradient(135deg,#667eea,#764ba2)",
                        color: "#fff",
                      }}
                    >
                      <MessageCircle size={20} />
                    </div>
                    <h5 className="fw-bold mb-0">142</h5>
                    <small className="text-muted">Comments</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <div
                      className="rounded-3 mx-auto mb-2 d-flex justify-content-center align-items-center"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "linear-gradient(135deg,#a8edea,#fed6e3)",
                        color: "#fff",
                      }}
                    >
                      <Eye size={20} />
                    </div>
                    <h5 className="fw-bold mb-0">24.5K</h5>
                    <small className="text-muted">Views</small>
                  </div>
                </Col>
              </Row>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  variant={liked ? "danger" : "outline-secondary"}
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={toggleLike}
                >
                  <Heart fill={liked ? "white" : "none"} size={18} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                >
                  <MessageCircle size={18} /> Comment
                </Button>
                <Button
                  variant="outline-secondary"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                >
                  <Bookmark size={18} /> Save
                </Button>
              </div>

              <h6 className="fw-semibold mb-3">Share this story</h6>
              <div className="d-flex flex-wrap gap-2">
                <Button className="rounded-circle" style={{ background: "#1877f2" }}>
                  <Facebook size={20} color="white" />
                </Button>
                <Button className="rounded-circle bg-dark border-0">
                  <Twitter size={20} color="white" />
                </Button>
                <Button className="rounded-circle" style={{ background: "#0077b5" }}>
                  <Linkedin size={20} color="white" />
                </Button>
                <Button
                  className="rounded-circle border-0"
                  style={{
                    background:
                      "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  }}
                >
                  <Instagram size={20} color="white" />
                </Button>
                <Button className="rounded-circle" style={{ background: "#ea4335" }}>
                  <Mail size={20} color="white" />
                </Button>
              </div>
            </Card>
<Card className="shadow-sm border-0 rounded-4 mb-4 p-4">
  <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
    <Share2 /> Related Social Posts
  </h4>

  {[
    {
      platform: "Twitter",
      color: "#1DA1F2",
      icon: <Twitter size={18} color="white" />,
      user: "@TechWorld",
      content:
        "AI continues to break boundaries — the latest advancements are nothing short of revolutionary! 🚀 #ArtificialIntelligence #TechTrends",
      time: "2h ago",
    },
    {
      platform: "LinkedIn",
      color: "#0077b5",
      icon: <Linkedin size={18} color="white" />,
      user: "Tech Innovators Network",
      content:
        "Revolutionary AI is reshaping industries across the globe. Here's our analysis of what's next for innovation in 2025.",
      time: "5h ago",
    },
    {
      platform: "Instagram",
      color: "#E1306C",
      icon: <Instagram size={18} color="white" />,
      user: "@AI_Insights",
      content:
        "Creative meets cognitive 💡 AI-generated art is changing how we see creativity forever.",
      time: "1d ago",
    },
  ].map((post, i) => (
    <div key={i} className="border-bottom py-3">
      <div className="d-flex align-items-center mb-2">
        <div
          className="rounded-circle d-flex justify-content-center align-items-center me-2"
          style={{
            width: "36px",
            height: "36px",
            background: post.color,
          }}
        >
          {post.icon}
        </div>
        <div>
          <strong>{post.user}</strong>
          <br />
          <small className="text-muted">{post.platform} • {post.time}</small>
        </div>
      </div>
      <p className="mb-0 text-secondary">{post.content}</p>
    </div>
  ))}
</Card>
            <section className="mb-4">
              <h4 className="fw-bold mb-3">More stories</h4>
              <div className="row g-3">
                {moreStories.map((s) => (
                  <div key={s.id} className="col-12 col-sm-6 col-md-4">
                    <Link to={`/StoryPage?id=${s.id}&category=${encodeURIComponent(s.category)}`} className="text-decoration-none text-reset">
                      <div className="card h-100 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                          <img src={s.image} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          {s.type === 'video' && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '999px', padding: '8px' }}>
                              <Play size={22} color="#3b82f6" />
                            </div>
                          )}
                          {s.duration && <span className="badge bg-dark position-absolute" style={{ bottom: '8px', right: '8px' }}>{s.duration}</span>}
                        </div>
                        <div className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', color: 'white' }}>{s.category}</span>
                            <small className="text-muted">{s.views}</small>
                          </div>
                          <h6 className="mb-1 fw-bold" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>{s.title}</h6>
                          <p className="mb-0 text-muted small">{s.type === 'video' ? 'Video' : s.type}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
            <Card className="shadow-sm border-0 rounded-4 mb-4 p-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <MessageCircle /> Comments (142)
              </h4>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Share your thoughts about this story..."
                className="mb-3"
              />
              <Button
                style={{
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  border: "none",
                }}
              >
                Post Comment
              </Button>

              <div className="mt-4 d-flex flex-column gap-3">
                {[
                  {
                    name: "Michael Chen",
                    time: "2 hours ago",
                    text: "This is absolutely fascinating! The way AI is evolving is beyond our wildest dreams.",
                  },
                  {
                    name: "Emma Rodriguez",
                    time: "5 hours ago",
                    text: "Excellent reporting! Would love to see more articles exploring the ethical implications.",
                  },
                  {
                    name: "David Kumar",
                    time: "1 day ago",
                    text: "The future is here! This article perfectly captures AI’s impact on our daily lives.",
                  },
                ].map((comment, i) => (
                  <div
                    key={i}
                    className="d-flex p-3 bg-white rounded-3 border"
                    style={{ borderColor: "#f0f0f0" }}
                  >
                    <div
                      className="rounded-circle me-3 flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "linear-gradient(135deg,#ffecd2,#fcb69f)",
                      }}
                    ></div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong>{comment.name}</strong>
                        <small className="text-muted">{comment.time}</small>
                      </div>
                      <p className="mb-0 text-secondary">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-4 mb-4 p-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Star /> Related Stories
              </h4>
              {moreStories.slice(0, 6).map((s, i) => (
                <Link key={i} to={`/StoryPage?id=${encodeURIComponent(s.id)}&category=${encodeURIComponent(s.category)}`} className="text-decoration-none text-reset">
                  <div className="d-flex gap-3 align-items-center mb-3 pb-3 border-bottom">
                    <div className="position-relative rounded overflow-hidden" style={{ width: '120px', aspectRatio: '16 / 9', flexShrink: 0 }}>
                      <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {s.type === 'video' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                          <span className="badge bg-light text-dark" style={{ opacity: 0.9 }}>▶</span>
                        </div>
                      )}
                      {s.duration && <span className="badge bg-dark position-absolute" style={{ bottom: '6px', right: '6px' }}>{s.duration}</span>}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1" style={{ color: themeVars.text }}>{s.title}</h6>
                      <small className="text-muted">{s.category} • {s.views}</small>
                    </div>
                  </div>
                </Link>
              ))}
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Flame /> Trending Now
              </h4>
              {[
                "Global Tech Summit Announces Major Breakthroughs",
                "New Smartphone Features Everyone's Talking About",
                "Cybersecurity Tips for 2025",
                "Electric Vehicles Hit New Milestone",
                "Space Exploration Updates",
              ].map((title, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center py-2 border-bottom"
                >
                  <span className="fw-bold text-primary me-3 fs-5">{i + 1}</span>
                  <div>
                    <p className="mb-1 fw-semibold">{title}</p>
                    <small className="text-muted">{(9 + i * 2).toFixed(1)}K views</small>
                  </div>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
    </div>
  );
};

export default StoryPage;

  function QueryMeta() {
    const { search } = useLocation();
    const params = React.useMemo(() => new URLSearchParams(search), [search]);
    const category = params.get('category');
    const id = params.get('id');

    if (!category && !id) return null;

    return (
      <Container fluid className="py-3" style={{ background: '#fff' }}>
        <div className="container d-flex align-items-center gap-3">
          <Link to={category ? `/CategoryPage?category=${encodeURIComponent(category)}` : '/CategoryPage'} className="btn btn-md btn-outline-secondary">
            ← Back to {category ? `${category}` : 'Category'}
          </Link>
          {category && <span className="badge bg-secondary p-3">Category: {category}</span>}
          {id && <small className="text-muted">Story ID: {id}</small>}
        </div>
      </Container>
    );
  }
