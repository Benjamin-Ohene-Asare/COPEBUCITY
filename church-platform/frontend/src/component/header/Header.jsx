import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Header.css";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/sermons", "Sermons"],
  ["/events", "Events"],
  ["/gallery", "Gallery"],
  ["/watch-live", "Watch Live"],
  ["/document", "Documents"],
  ["/photo-tag", "Photo Tag"],
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`site-header ${
        pathname === "/" ? "home-header" : "inner-header"
      }`}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <div className="header">
        <Link
          to="/"
          className="church-brand"
          onClick={closeMenu}
          aria-label="COP Ebukrom District home"
        >
          <img src={logo} alt="" width="48" height="48" />

          <span className="church-name">
            COP EBUKROM DIST
          </span>
        </Link>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <nav
          id="main-navigation"
          className={menuOpen ? "nav active" : "nav"}
          aria-label="Main navigation"
        >
          {links.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={closeMenu}
              aria-current={pathname === path ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;