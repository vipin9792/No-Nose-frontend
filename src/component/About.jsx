import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { 
  Play, Users, Eye, Heart, Film, Globe, Award, Target,
  Clapperboard, Camera, Plane, Users2, Cpu, BookOpen 
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const { isDark } = useTheme();
  const themeVars = {
    pageBg: isDark ? '#0b0f1a' : '#f8f9fa',
    surfaceBg: isDark ? '#0f1724' : '#f8f9fa',
    cardBg: isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : '#fff',
    cardBorder: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    text: isDark ? 'rgba(255,255,255,0.92)' : '#0b1220',
    subtleText: isDark ? 'rgba(255,255,255,0.7)' : '#6c757d',
  };
  const stats = [
    { icon: Eye, value: '10M+', label: 'Monthly Views' },
    { icon: Users, value: '500K+', label: 'Community Members' },
    { icon: Film, value: '5K+', label: 'Stories Published' },
    { icon: Heart, value: '2M+', label: 'Engagements' }
  ];

  const values = [
    {
      icon: Film,
      title: 'Authentic Storytelling',
      description: 'We believe in capturing real moments and genuine experiences that resonate with audiences worldwide.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'From local human stories to global trends, we bring diverse voices and perspectives to your screen.'
    },
    {
      icon: Award,
      title: 'Quality Content',
      description: 'Every video, photo, and story is crafted with care to deliver engaging and meaningful content.'
    },
    {
      icon: Target,
      title: 'Audience First',
      description: 'Our community drives everything we do. We create content that matters to you and sparks conversation.'
    }
  ];
  const categories = [
    { name: 'Entertainment & Pop Culture', icon: Clapperboard, image: 'https://images.unsplash.com/photo-1515165562835-c4c1b8a8d0ef?auto=format&fit=crop&w=900&q=60' },
    { name: 'Lifestyle & Wellness', icon: Heart, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=60' },
    { name: 'Food, Travel & Experience', icon: Plane, image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=60' },
    { name: 'Human Stories', icon: Users2, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=60' },
    { name: 'Tech & Automobile', icon: Cpu, image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=900&q=60' },
    { name: 'Documentary', icon: BookOpen, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60' }
  ];

  return (
    <div style={{ backgroundColor: themeVars.pageBg, minHeight: '100vh', color: themeVars.text }}>
      <div
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '120px 0'
        }}
      >
        <Container>
          <Row>
            <Col lg={10} className="mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '1px' }}>
                Every 1Story Deserves to Be Told
              </h1>
              <p className="lead fs-4" style={{ opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
                We are a storytelling platform that celebrates human experiences — from laughter to tears, 
                from discovery to innovation. Dive into stories that move the world.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="py-5 shadow-sm" style={{ background: themeVars.cardBg, borderBottom: themeVars.cardBorder, borderTop: themeVars.cardBorder }}>
        <Container>
          <Row className="text-center g-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Col key={idx} xs={6} md={3}>
                  <Icon size={48} color="#667eea" className="mb-3" />
                  <h2 className="fw-bold mb-1" style={{ color: themeVars.text }}>{stat.value}</h2>
                  <p className="small" style={{ color: themeVars.subtleText }}>{stat.label}</p>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
      <Container className="py-5">
        <Row>
          <Col lg={10} className="mx-auto">
            <Tab.Container defaultActiveKey="mission">
              <Nav variant="tabs" className="justify-content-center mb-4 border-bottom">
                <Nav.Item>
                  <Nav.Link eventKey="mission" className="fw-semibold px-4 py-3">
                    Our Mission
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="vision" className="fw-semibold px-4 py-3">
                    Our Vision
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="story" className="fw-semibold px-4 py-3">
                    Our Story
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {['mission', 'vision', 'story'].map((key) => (
                  <Tab.Pane key={key} eventKey={key}>
                    <Card className="border-0 shadow-sm" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
                      <Card.Body className="p-5">
                        <h2 className="fw-bold mb-4 text-capitalize" style={{ color: themeVars.text }}>Our {key}</h2>
                        <p className="fs-5" style={{ color: themeVars.subtleText }}>
                          {key === 'mission'
                            ? 'To create and curate stories that inspire, inform, and connect audiences worldwide. Our mission is to give a voice to moments that matter.'
                            : key === 'vision'
                            ? 'To become the world’s most trusted platform for authentic visual storytelling — where every frame inspires empathy and curiosity.'
                            : 'From humble beginnings to global recognition, our story is about passion, creativity, and a belief in the power of storytelling to unite people.'}
                        </p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      <div className="py-5" style={{ background: themeVars.surfaceBg }}>
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <h2 className="display-5 fw-bold text-center mb-5" style={{ color: themeVars.text }}>What We Stand For</h2>
              <Row className="g-4">
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <Col key={idx} md={6}>
                      <Card className="h-100 border-0 shadow-sm hover-shadow" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
                        <Card.Body className="p-4">
                          <Icon size={48} color="#667eea" className="mb-3" />
                          <Card.Title className="fw-bold fs-4 mb-3" style={{ color: themeVars.text }}>{value.title}</Card.Title>
                          <Card.Text style={{ color: themeVars.subtleText }}>{value.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="py-5">
        <Row>
          <Col lg={10} className="mx-auto">
            <h2 className="display-5 fw-bold text-center mb-3" style={{ color: themeVars.text }}>Stories That Matter</h2>
            <p className="text-center fs-5 mb-5" style={{ color: themeVars.subtleText }}>
              Each story is crafted with emotion, creativity, and purpose — representing different worlds of storytelling.
            </p>
            <Row className="g-4">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <Col key={idx} xs={6} md={4}>
                    <Card
                      className="text-white text-center border-0 shadow-sm h-100"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${cat.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        transition: 'transform 0.3s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center h-100">
                        <Icon size={40} className="mb-3" />
                        <Card.Title className="fw-semibold">{cat.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .nav-link {
          color: ${isDark ? 'rgba(255,255,255,0.7)' : '#6c757d'} !important;
          border: none !important;
          border-bottom: 3px solid transparent !important;
        }
        .nav-link.active {
          color: #667eea !important;
          background-color: transparent !important;
          border-bottom: 3px solid #667eea !important;
        }
        .nav-link:hover {
          color: ${isDark ? '#e6eef8' : '#495057'} !important;
        }
      `}</style>
    </div>
  );
}
