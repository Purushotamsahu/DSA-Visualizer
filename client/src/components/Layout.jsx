import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

import UpcomingQuestion from './UpcomingQuestion';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    let currentPath = '';
    
    const crumbs = [{ name: 'Home', path: '/' }];
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      // Basic logic to make breadcrumbs human-readable
      let name = path.charAt(0).toUpperCase() + path.slice(1);
      if (path === 'category') return; // Skip "category" segment for cleaner crumbs
      
      crumbs.push({ name, path: currentPath });
    });
    
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="app-wrapper">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Dynamic Breadcrumbs displayed below navbar for algorithm pages */}
      {!['/', '/login', '/signup', '/about', '/contact'].includes(location.pathname) && (
        <div className="centered-container" style={{ padding: '1.5rem 0 0' }}>
          <nav className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
                <Link 
                  to={crumb.path} 
                  className={index === breadcrumbs.length - 1 ? 'active-breadcrumb' : ''}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      <main className="main-content">
        {children}
        
        {/* Upcoming Question Box - Refined Visibility */}
        {(location.pathname === '/' || (location.pathname.startsWith('/category/') && location.pathname.split('/').length === 3)) && (
          <div className="centered-container" style={{ marginTop: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">Coming Soon</h2>
            </div>
            <div style={{ maxWidth: '400px' }}>
              <UpcomingQuestion 
                isAdmin={isAdmin}
                topic={location.pathname === '/' ? "Visualizations" : 
                       location.pathname.split('/').pop().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
