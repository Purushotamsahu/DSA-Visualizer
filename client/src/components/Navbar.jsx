import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header">
      <Link to="/" className="logo-container">
        <LayoutIcon size={28} strokeWidth={2.5} />
        <span className="logo-text">DSA <span style={{ color: 'var(--primary-color)' }}>Visualizer</span></span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>About</Link>
        <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
      </nav>

      <div className="auth-buttons">
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)', fontWeight: 600 }}>
              <UserIcon size={18} style={{ color: 'var(--primary-color)' }} />
              <span>{user.name}</span>
            </div>
            <button onClick={logout} className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
