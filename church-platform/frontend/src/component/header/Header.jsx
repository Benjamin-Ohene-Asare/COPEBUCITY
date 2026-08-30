import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import logo  from "../../assets/LOGO.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <div className="header">
       <div className="logo">
         <img src={logo} alt="" />
        <h2>COP EBUCITY</h2>
       </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={menuOpen ? 'nav active' : 'nav'}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/sermons" onClick={() => setMenuOpen(false)}>Sermons</Link>
          <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/live" onClick={() => setMenuOpen(false)}>Watch Live</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header