import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          The Continental
        </Link>

        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </div>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/reservation" onClick={closeMenu} className={location.pathname === '/reservation' ? 'active' : ''}>
              Reservation
            </Link>
            <Link to="/facilities" onClick={closeMenu} className={location.pathname.startsWith('/facilities') ? 'active' : ''}>
              Facilities
            </Link>
            <Link to="/support" onClick={closeMenu} className={location.pathname === '/support' ? 'active' : ''}>
              Support
            </Link>
            <Link to="/location" onClick={closeMenu} className={location.pathname === '/location' ? 'active' : ''}>
              Location
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
