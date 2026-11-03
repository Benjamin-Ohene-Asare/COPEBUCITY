import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isHome = location.pathname === '/'

  return (
    <header className={isHome ? 'site-header home-header' : 'site-header inner-header'}>
      <div className="header">
        <h2>Ebucity Church</h2>

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
          <Link to="/watch-live" onClick={() => setMenuOpen(false)}>Watch Live</Link>
        
       <Link to="/document" onClick={() => setMenuOpen(false)}>

  Documents
</Link>

<Link
  to="/photo-tag"
  onClick={() => setMenuOpen(false)}
>
  Photo Tag
</Link>

        </nav>
      </div>
    </header>
  )
}

export default Header