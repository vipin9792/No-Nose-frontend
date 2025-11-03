import React, { useState, useEffect } from 'react';
import { 
  Home, Video, Image, FileText, Users, Mail, Search, 
  Plus, Edit2, Trash2, Eye, TrendingUp, Calendar,
  Film, Heart, Utensils, User, Cpu, BookOpen,
  Save, X, Upload, Play, LogOut
} from 'lucide-react';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ContentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('homepage');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState({ category: '', type: '', search: '' });

  const categories = [
    { id: 'entertainment', name: 'Entertainment & Pop Culture', icon: Film, color: '#e74c3c' },
    { id: 'lifestyle', name: 'Lifestyle & Wellness', icon: Heart, color: '#e91e63' },
    { id: 'experience', name: 'Food, Travel & Experience', icon: Utensils, color: '#ff9800' },
    { id: 'humanStory', name: 'Human Story', icon: User, color: '#9c27b0' },
    { id: 'tech', name: 'Tech & Automobile', icon: Cpu, color: '#2196f3' },
    { id: 'documentary', name: 'Documentary', icon: BookOpen, color: '#4caf50' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'entertainment',
    type: 'video',
    files: [],
    tags: '',
    author: '',
    featured: false,
    heroContent: false,
    topStory: false,
    categoryHighlight: false
  });

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on active section
  const getFilteredPosts = () => {
    let filtered = [...posts];
    
    if (activeSection === 'stories') {
      if (filter.category) {
        filtered = filtered.filter(p => p.category === filter.category);
      }
      if (filter.type) {
        filtered = filtered.filter(p => p.type === filter.type);
      }
      if (filter.search) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filter.search.toLowerCase())
        );
      }
    } else if (activeSection === 'homepage') {
      filtered = filtered.filter(p => p.topStory || p.heroContent || p.featured);
    } else if (categories.find(c => c.id === activeSection)) {
      filtered = filtered.filter(p => p.category === activeSection);
    }

    return filtered;
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setShowModal(true);
    if (data) {
      setEditingPost(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'entertainment',
        type: data.postType || data.type || 'video', // Fixed: Use postType first
        files: [],
        tags: data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : '',
        author: data.author || '',
        featured: data.featured || false,
        heroContent: data.heroContent || false,
        topStory: data.topStory || false,
        categoryHighlight: data.categoryHighlight || false
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        description: '',
        category: 'entertainment',
        type: 'video',
        files: [],
        tags: '',
        author: '',
        featured: false,
        heroContent: false,
        topStory: false,
        categoryHighlight: false
      });
    }
  };

 const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('heroContent', formData.heroContent);
      formDataToSend.append('topStory', formData.topStory);
      formDataToSend.append('categoryHighlight', formData.categoryHighlight);

      formData.files.forEach((file) => {
        if (file.type.startsWith('video/')) {
          formDataToSend.append('videos', file);
        } else {
          formDataToSend.append('images', file);
        }
      });

      if (editingPost && editingPost._id) {
        await postsAPI.update(editingPost._id, formDataToSend);
      } else {
        await postsAPI.create(formDataToSend);
      }

      await fetchPosts();
      setShowModal(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsAPI.delete(id);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error: ' + error.message);
    }
  };

  const renderSidebar = () => (
    <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh', position: 'fixed' }}>
      <div className="p-4 border-bottom border-secondary">
        <h4 className="mb-0"><Video size={24} className="me-2" />CMS Dashboard</h4>
      </div>
      <nav className="p-3">
        <div className="mb-4">
          <h6 className="text-muted small mb-2">MAIN SECTIONS</h6>
          <button 
            className={`btn w-100 text-start mb-2 ${activeSection === 'homepage' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setActiveSection('homepage')}
          >
            <Home size={18} className="me-2" />Homepage
          </button>
          <button 
            className={`btn w-100 text-start mb-2 ${activeSection === 'stories' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setActiveSection('stories')}
          >
            <FileText size={18} className="me-2" />All Stories
          </button>
        </div>
        
        <div className="mb-4">
          <h6 className="text-muted small mb-2">CATEGORIES</h6>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button 
                key={cat.id}
                className={`btn w-100 text-start mb-2 ${activeSection === cat.id ? 'btn-primary' : 'btn-dark text-white'}`}
                onClick={() => setActiveSection(cat.id)}
              >
                <Icon size={18} className="me-2" />{cat.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        <div>
          <h6 className="text-muted small mb-2">PAGES</h6>
          <button 
            className={`btn w-100 text-start mb-2 ${activeSection === 'about' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setActiveSection('about')}
          >
            <Users size={18} className="me-2" />About Us
          </button>
          <button 
            className={`btn w-100 text-start mb-2 ${activeSection === 'contact' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setActiveSection('contact')}
          >
            <Mail size={18} className="me-2" />Contact
          </button>
        </div>
      </nav>

      <div className="p-3 border-top border-secondary mt-4">
        <button 
          className="btn btn-danger w-100" 
          onClick={() => {
            logout();
            navigate('/home');
          }}
        >
          <LogOut size={18} className="me-2" />Logout
        </button>
      </div>
    </div>
  );

  const renderHomepage = () => {
    const heroPosts = posts.filter(p => p.heroContent);
    const topStoryPosts = posts.filter(p => p.topStory);
    const featuredPosts = posts.filter(p => p.featured);

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Homepage Management</h2>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0"><Play size={20} className="me-2" />Hero Section</h5>
            <button className="btn btn-light btn-sm" onClick={() => openModal('hero')}>
              <Plus size={16} className="me-1" />Add Hero
            </button>
          </div>
          <div className="card-body">
            {heroPosts.length > 0 ? (
              <div className="row g-3">
                {heroPosts.map(post => (
                  <div key={post._id} className="col-md-6">
                    <div className="card">
                      {post.media && post.media[0] && (
                        <img src={`http://localhost:5000${post.media[0].url}`} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h6 className="card-title">{post.title}</h6>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openModal('hero', post)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No hero content set. Click "Add Hero" to upload.</p>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0"><TrendingUp size={20} className="me-2" />Top Stories Slider</h5>
            <button className="btn btn-light btn-sm" onClick={() => openModal('topStory')}>
              <Plus size={16} className="me-1" />Add Story
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {topStoryPosts.length > 0 ? (
                topStoryPosts.map(post => (
                  <div key={post._id} className="col-md-4">
                    <div className="card">
                      {post.media && post.media[0] && (
                        <img src={`http://localhost:5000${post.media[0].url}`} className="card-img-top" alt={post.title} style={{ height: '150px', objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h6 className="card-title">{post.title}</h6>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openModal('topStory', post)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">No top stories set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStories = () => {
    const filteredPosts = getFilteredPosts();

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>All Stories & Videos</h2>
          <button className="btn btn-primary" onClick={() => openModal('story')}>
            <Plus size={20} className="me-2" />Create New Story
          </button>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <select 
                  className="form-select" 
                  value={filter.category}
                  onChange={(e) => setFilter({...filter, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={filter.type}
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="video">Video</option>
                  <option value="image">Photo Story</option>
                  <option value="article">Article</option>
                </select>
              </div>
              <div className="col-md-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search stories..." 
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post._id} className="col-md-4">
                  <div className="card h-100">
                    {post.media && post.media[0] && (
                      <div className="ratio ratio-16x9">
                        {post.media[0].type === 'video' ? (
                          <video src={`http://localhost:5000${post.media[0].url}`} className="w-100 h-100 object-fit-cover" style={{ objectFit: 'cover' }} preload="none" />
                        ) : (
                          <img src={`http://localhost:5000${post.media[0].url}`} alt={post.title} className="w-100 h-100 object-fit-cover" style={{ objectFit: 'cover' }} loading="lazy" />
                        )}
                      </div>
                    )}
                    <div className="card-body">
                      <span className="badge bg-primary mb-2">{post.category}</span>
                      <h6 className="card-title">{post.title}</h6>
                      <p className="card-text small text-muted">{post.description.substring(0, 100)}...</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          <Calendar size={14} className="me-1" />{new Date(post.createdAt).toLocaleDateString()}
                        </small>
                        <div>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openModal('story', post)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-muted text-center">No posts found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCategoryPage = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    const categoryPosts = posts.filter(p => p.category === categoryId);
    
    const Icon = category.icon;
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: category.color }}>
            <Icon size={32} className="me-2" />{category.name}
          </h2>
          <button className="btn btn-primary" onClick={() => openModal('story', { category: categoryId })}>
            <Plus size={20} className="me-2" />Add Content
          </button>
        </div>

        <div className="card mb-4" style={{ borderLeft: `4px solid ${category.color}` }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Category Content</h5>
          </div>
          <div className="card-body">
            {categoryPosts.length > 0 ? (
              <div className="row g-3">
                {categoryPosts.map(post => (
                  <div key={post._id} className="col-md-4">
                    <div className="card">
                      {post.media && post.media[0] && (
                        <img src={`http://localhost:5000${post.media[0].url}`} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h6 className="card-title">{post.title}</h6>
                        <p className="card-text small text-muted">{post.description.substring(0, 80)}...</p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openModal('story', post)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No content for this category yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAboutPage = () => (
    <div>
      <h2 className="mb-4">About Us Page</h2>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Brand Story & Mission</label>
            <textarea className="form-control" rows="5" placeholder="Enter your brand story, mission, and vision..."></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Team Members</label>
            <button className="btn btn-outline-primary btn-sm ms-3">
              <Plus size={16} className="me-1" />Add Team Member
            </button>
          </div>
          <button className="btn btn-primary">
            <Save size={18} className="me-2" />Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderContactPage = () => (
    <div>
      <h2 className="mb-4">Contact Page</h2>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Contact Email</label>
            <input type="email" className="form-control" placeholder="contact@yoursite.com" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Partnership Inquiry Email</label>
            <input type="email" className="form-control" placeholder="partnerships@yoursite.com" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Social Media Links</label>
            <input type="url" className="form-control mb-2" placeholder="Instagram URL" />
            <input type="url" className="form-control mb-2" placeholder="Twitter URL" />
            <input type="url" className="form-control mb-2" placeholder="Facebook URL" />
            <input type="url" className="form-control" placeholder="YouTube URL" />
          </div>
          <button className="btn btn-primary">
            <Save size={18} className="me-2" />Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderModal = () => (
    <div className={`modal ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingPost ? 'Edit Content' : 'Create New Content'}
            </h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Category *</label>
                <select 
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Content Type *</label>
                <select 
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="video">Video</option>
                  <option value="image">Image/Photo Story</option>
                  <option value="article">Article</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                {formData.type === 'video' ? 'Upload Video' : 'Upload Media'} *
              </label>
              <input 
                type="file" 
                className="form-control"
                accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                multiple
                onChange={handleFileChange}
              />
              <small className="text-muted">
                {formData.type === 'video' ? 'Supported formats: MP4, MOV, AVI' : 'Supported formats: JPG, PNG, WebP'}
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Author/Credits</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Story creator or source"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tags (comma separated)</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="trending, viral, exclusive"
              />
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    id="featuredCheck"
                  />
                  <label className="form-check-label" htmlFor="featuredCheck">
                    Featured
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={formData.heroContent}
                    onChange={(e) => setFormData({...formData, heroContent: e.target.checked})}
                    id="heroCheck"
                  />
                  <label className="form-check-label" htmlFor="heroCheck">
                    Hero Content
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={formData.topStory}
                    onChange={(e) => setFormData({...formData, topStory: e.target.checked})}
                    id="topStoryCheck"
                  />
                  <label className="form-check-label" htmlFor="topStoryCheck">
                    Top Story
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              <X size={18} className="me-2" />Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save & Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      {renderSidebar()}
      
      <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
        <nav className="navbar navbar-light bg-white border-bottom px-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="mb-0">Content Management System</h5>
            <button className="btn btn-outline-primary">
              <User size={18} className="me-2" />Admin
            </button>
          </div>
        </nav>

        <div className="p-4">
          {activeSection === 'homepage' && renderHomepage()}
          {activeSection === 'stories' && renderStories()}
          {activeSection === 'about' && renderAboutPage()}
          {activeSection === 'contact' && renderContactPage()}
          {categories.find(c => c.id === activeSection) && renderCategoryPage(activeSection)}
        </div>
      </div>

      {showModal && renderModal()}
    </div>
  );
};

export default ContentDashboard;
