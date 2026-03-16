import React from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutIcon, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
            <LayoutIcon size={24} strokeWidth={2.5} />
            <span className="logo-text">DSA <span style={{ color: 'var(--primary-color)' }}>Visualizer</span></span>
          </div>
          <p className="footer-link" style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            An advanced educational platform for mastering data structures and algorithms through 
            high-fidelity interactive visualizations.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="footer-link"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/purushotam-sahu-4b0369282/" target="_blank" rel="noopener noreferrer" className="footer-link"><Linkedin size={20} /></a>
            <a href="#" className="footer-link"><Twitter size={20} /></a>
            <a href="mailto:dsaconnect123@gmail.com" className="footer-link"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Algorithms</h4>
          <div className="footer-links">
            <Link to="/category/dp" className="footer-link">Dynamic Programming</Link>
            <Link to="/category/linked-list" className="footer-link">Linked List</Link>
            <Link to="/category/bst" className="footer-link">Binary Search Tree</Link>
            <Link to="/category/graph" className="footer-link">Graph Algorithms</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About Project</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <div className="footer-links">
            <a href="https://github.com/topics/algorithms" target="_blank" rel="noopener noreferrer" className="footer-link">Algo Repository</a>
            <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="footer-link">Practice Problems</a>
            <a href="https://geeksforgeeks.org" target="_blank" rel="noopener noreferrer" className="footer-link">Theory Guide</a>
            <a href="https://visualgo.net" target="_blank" rel="noopener noreferrer" className="footer-link">VisuAlgo Partner</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Stay Connected</h4>
          <p className="footer-link" style={{ marginBottom: '1rem' }}>
            Get the latest updates on new visualizations and features.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="form-input" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} 
              id="newsletter-email"
            />
            <button className="btn btn-primary btn-sm">Join</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
             <span style={{ padding: '4px 8px', background: 'var(--accent)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>BETA v2.0</span>
             <span style={{ padding: '4px 8px', background: 'var(--accent)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>OPEN SOURCE</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DSA Visualizer. Created by Purushotam Sahu.</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
