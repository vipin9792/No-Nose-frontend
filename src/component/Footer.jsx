import React from 'react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';


const Footer = () => {
  const { isDark } = useTheme();
  const surface = isDark ? '#0f1724' : '#f8f9fa';
  const border = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eee';
  const text = isDark ? '#e6eef8' : '#333';
  const muted = isDark ? 'rgba(230,238,248,0.7)' : '#666';

  return (
  <footer
    style={{
      borderTop: border,
      background: surface,
      color: text,
      fontFamily: 'Inter, sans-serif',
    }}
  >
    <div className="container-fluid px-0">
      <div className="row g-0">
        <div
          className="col-12 col-lg-3 p-4 p-lg-5"
          style={{
            borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <h3
            style={{
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ff6b6b',
            }}
          >
            StoryHub
          </h3>
          <p style={{ color: muted, lineHeight: 1.6 }}>
            Inspiring stories, curated for you. Discover videos, photos, and human stories every day.
          </p>

          <div className="d-flex gap-3 mt-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={{
                width: '44px',
                height: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                color: 'white',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <Instagram size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              style={{
                width: '44px',
                height: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#1DA1F2',
                color: 'white',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <Twitter size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              style={{
                width: '44px',
                height: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#1877F2',
                color: 'white',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <Facebook size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              style={{
                width: '44px',
                height: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#FF0000',
                color: 'white',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <Youtube size={20} strokeWidth={1.8} />
            </a>
          </div>
        </div>
        <div
          className="col-12 col-sm-6 col-lg-3 p-4 p-lg-5"
          style={{
            borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <h5 className="fw-bold mb-3" style={{ color: '#ff6b6b' }}>
            Quick Links
          </h5>
          <ul className="list-unstyled mb-0" style={{ lineHeight: 2 }}>
            {['About', 'Contact', 'Advertise', 'Careers'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    color: isDark ? '#cfd9e6' : '#444',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease, text-decoration 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff6b6b';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = isDark ? '#cfd9e6' : '#444';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="col-12 col-sm-6 col-lg-3 p-4 p-lg-5"
          style={{
            borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <h5 className="fw-bold mb-3" style={{ color: '#ff6b6b' }}>
            Categories
          </h5>
          <ul className="list-unstyled mb-0" style={{ lineHeight: 2 }}>
            {['Entertainment', 'Lifestyle', 'Experience', 'Human Story', 'Tech', 'Documentary'].map((c) => (
              <li key={c}>
                <a
                  href="#"
                  style={{
                    color: isDark ? '#cfd9e6' : '#444',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease, text-decoration 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff6b6b';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = isDark ? '#cfd9e6' : '#444';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 col-lg-3 p-4 p-lg-5">
          <h5 className="fw-bold mb-3" style={{ color: '#ff6b6b' }}>
            Newsletter
          </h5>
          <p style={{ color: muted }}>Get the best stories in your inbox.</p>
          <div className="d-flex gap-2">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              style={{
                borderRadius: '25px',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                padding: '8px 14px',
                transition: 'all 0.3s ease',
                background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                color: isDark ? 'white' : '#0b0f1a',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 5px #ff6b6b')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
            <button
              className="btn px-4"
              style={{
                background: '#ff6b6b',
                color: 'white',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-wrap justify-content-between align-items-center py-3 px-3 px-lg-4"
        style={{
          color: isDark ? 'rgba(230,238,248,0.7)' : '#777',
          fontSize: '0.95rem',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <span>© {new Date().getFullYear()} StoryHub. All rights reserved.</span>
        <div className="d-flex gap-3">
          {['Privacy', 'Terms', 'Sitemap'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: isDark ? 'rgba(230,238,248,0.7)' : '#777',
                textDecoration: 'none',
                transition: 'color 0.3s ease, text-decoration 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ff6b6b';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? 'rgba(230,238,248,0.7)' : '#777';
                e.target.style.textDecoration = 'none';
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
