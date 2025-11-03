import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Heart,
} from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "general",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    setFormData({ name: "", email: "", message: "", inquiryType: "general" });
  };

  const { isDark } = useTheme();
  const surface = isDark ? '#0f1724' : '#fff';
  const pageBg = isDark ? '#0b0f1a' : '#f8f9fa';
  const cardBg = isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : '#fff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)';
  const text = isDark ? 'rgba(255,255,255,0.92)' : '#333';
  const muted = isDark ? 'rgba(255,255,255,0.7)' : '#555';

  return (
    <section
      style={{
        background: pageBg,
        minHeight: "100vh",
        padding: "100px 0 80px",
        fontFamily: "Inter, sans-serif",
        color: text,
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1
            style={{
              fontWeight: 800,
              color: "#ff6b6b",
              letterSpacing: "0.5px",
              fontSize: "2.5rem",
            }}
          >
            Contact Us
          </h1>
          <p style={{ color: muted, fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
            Whether you have a question, want to collaborate, or just say hi — we’d love to hear from you.
          </p>
        </div>
        <div className="row justify-content-center mb-5 g-4">
          {[
            {
              icon: <Mail size={36} color="#ff6b6b" />,
              title: "Email Us",
              text: "support@storyhub.com",
              bg: cardBg,
            },
            {
              icon: <Phone size={36} color="#ff6b6b" />,
              title: "Call Us",
              text: "+1 (800) 234-5678",
              bg: cardBg,
            },
            {
              icon: <MapPin size={36} color="#ff6b6b" />,
              title: "Visit Us",
              text: "New York, USA",
              bg: cardBg,
            },
          ].map((item, index) => (
            <div key={index} className="col-12 col-md-4">
              <div
                className="text-center p-5 rounded-4 shadow-sm h-100"
                style={{
                  background: item.bg,
                  border: cardBorder,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    (isDark ? "0 8px 25px rgba(0,0,0,0.35)" : "0 8px 25px rgba(255,107,107,0.25)");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark ? "0 4px 12px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)";
                }}
              >
                <div className="mb-3">{item.icon}</div>
                <h5 className="fw-bold mb-1">{item.title}</h5>
                <p className="mb-0" style={{ color: muted }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="row align-items-stretch g-4">
          <div className="col-12 col-lg-6">
            <form
              onSubmit={handleSubmit}
              style={{
                background: surface,
                padding: "2rem 2.5rem",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                height: "100%",
                border: cardBorder,
              }}
            >
              <h4
                className="fw-bold mb-4"
                style={{ color: "#ff6b6b", textAlign: "center" }}
              >
                Send Us a Message
              </h4>

              <div className="mb-3">
                <label className="form-label fw-semibold">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                  style={{
                    borderRadius: "12px",
                    padding: "12px 14px",
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: text,
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Your Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                  style={{
                    borderRadius: "12px",
                    padding: "12px 14px",
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: text,
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="form-select"
                  style={{
                    borderRadius: "12px",
                    padding: "12px 14px",
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: text,
                  }}
                >
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership / Collaboration</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="form-control"
                  required
                  style={{
                    borderRadius: "12px",
                    padding: "12px 14px",
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: text,
                    resize: "none",
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{
                  background: "#ff6b6b",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "12px",
                  padding: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(255,107,107,0.3)",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="col-12 col-lg-6">
            <div
              style={{
                height: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.35)" : "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <iframe
                title="StoryHub Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.862157793438!2d-74.0060156845948!3d40.71277537933025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6b7b9f0b1fbd4c8b!2sNew%20York!5e0!3m2!1sen!2sus!4v1678149068255!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="text-center mt-5">
          <h5 style={{ color: "#ff6b6b", fontWeight: 700, marginBottom: "1rem" }}>
            Connect With Us
          </h5>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {[
              {
                icon: <Instagram size={20} />,
                bg: "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                link: "https://instagram.com",
              },
              {
                icon: <Twitter size={20} />,
                bg: "#1DA1F2",
                link: "https://twitter.com",
              },
              {
                icon: <Facebook size={20} />,
                bg: "#1877F2",
                link: "https://facebook.com",
              },
              {
                icon: <Linkedin size={20} />,
                bg: "#0077B5",
                link: "https://linkedin.com",
              },
              {
                icon: <Heart size={20} />,
                bg: "#ff6b6b",
                link: "#",
              },
            ].map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
