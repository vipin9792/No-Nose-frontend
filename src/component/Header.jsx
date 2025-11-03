import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";


const Header = () => {
  const { isDark, toggleTheme, setSearchTerm } = useTheme();
  const [localQuery, setLocalQuery] = useState("");
  const navigate = useNavigate();
  const { search: currentSearch, pathname } = useLocation();
  const navbarCollapseRef = useRef(null);
  const navbarTogglerRef = useRef(null);

  const handleNavLinkClick = () => {
    // Check if navbar is expanded (mobile view)
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
      // Click the toggler button to close the menu
      if (navbarTogglerRef.current) {
        navbarTogglerRef.current.click();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = localQuery.trim();
    setSearchTerm(q);
    const params = new URLSearchParams(currentSearch);
    if (q) params.set('q', q); else params.delete('q');
    navigate({ pathname: '/CategoryPage', search: params.toString() ? `?${params.toString()}` : '' });
    handleNavLinkClick();
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm sticky-top"
      style={{
        background: isDark ? "#0b0f1a" : "#f8f9fa",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid py-2 px-4">
        <Link
          className="navbar-brand fw-bold fs-3"
          to="/"
          style={{
            color: "#ff6b6b",
            textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
          }}
          onClick={handleNavLinkClick}
        >
          StoryHub
        </Link>
        <button
          ref={navbarTogglerRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link position-relative" to="/home" onClick={handleNavLinkClick}>
                Home
                <span className="underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link position-relative" to="/about" onClick={handleNavLinkClick}>
                About
                <span className="underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link position-relative" to="/categorypage" onClick={handleNavLinkClick}>
                Category
                <span className="underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link position-relative" to="/contact" onClick={handleNavLinkClick}>
                Contact
                <span className="underline"></span>
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center ms-3 gap-2">
            <button onClick={toggleTheme} className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`} aria-label="Toggle theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <div
              className="search-container"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                className="form-control"
                type="search"
                placeholder="Search..."
                aria-label="Search"
                style={{
                  borderRadius: "30px",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ddd",
                  padding: "8px 40px 8px 15px",
                  transition: "all 0.3s ease",
                  outline: "none",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#fff",
                  color: isDark ? "white" : "#0b0f1a",
                }}
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #ff6b6b")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              <button
                className="btn"
                type="submit"
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "#ff6b6b",
                  borderRadius: "50%",
                  color: "white",
                  padding: "6px 10px",
                  border: "none",
                }}
              >
                <Search size={18} strokeWidth={2} />
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
      <style>
        {`
          .nav-link {
            color: ${isDark ? '#e6eef8' : '#333'} !important;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          .nav-link:hover {
            color: #ff6b6b !important;
          }
          .underline {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: #ff6b6b;
            transition: width 0.3s ease;
          }
          .nav-link:hover .underline {
            width: 100%;
          }
          .dropdown-menu a:hover {
            background-color: #ffecec;
            color: #ff6b6b !important;
          }
        `}
      </style>
    </nav>
  );
};

export default Header;