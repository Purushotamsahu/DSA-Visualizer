import React, { useState } from 'react';
import { Mail, Github, Linkedin, MessageSquare, Send, Phone, MapPin, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://127.0.0.1:8888/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent! We will get back to you soon.' });
        setFormData({ name: '', email: '', category: 'General Inquiry', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: 'Could not connect to the server. Please check your internet or try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-container" style={{ padding: '6rem 0' }}>
      {/* Visual Header */}
      <header className="hero-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <div style={{ display: 'inline-flex', padding: '14px', background: 'var(--accent)', borderRadius: '24px', color: 'var(--primary-color)', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.1)' }}>
          <MessageSquare size={36} />
        </div>
        <h1 className="hero-title" style={{ fontSize: '4rem' }}>Let's Connect</h1>
        <p className="hero-subtitle" style={{ maxWidth: '650px', margin: '1rem auto' }}>
          Have a revolutionary feature idea or spotted a bug? We're here to listen. 
          Expect a response from our Team within 24 hours.
        </p>
      </header>

      <div className="contact-grid">
        {/* Contact Form - Premium Redesign */}
        <div className="info-card" style={{ padding: '3.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Send a Message</h3>
            <p className="card-desc">Your feedback drives our innovation.</p>
          </div>
          
          {status.message && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '10px', 
              marginBottom: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
              border: `1px solid ${status.type === 'success' ? 'var(--success)' : 'var(--error)'}`
            }}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span style={{ fontWeight: 600 }}>{status.message}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  placeholder="Enter your name.." 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="user@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Inquiry Category</label>
              <select 
                name="category"
                className="form-input" 
                style={{ appearance: 'auto', background: 'var(--bg-color)' }}
                value={formData.category}
                onChange={handleChange}
              >
                <option>New Feature Suggestion</option>
                <option>Bug Report (Visualization)</option>
                <option>Contribution / Open Source</option>
                <option>Enterprise Collaboration</option>
                <option>Other / General</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Detailed Message</label>
              <textarea 
                className="form-input" 
                rows="6" 
                name="message"
                placeholder="Tell us what's on your mind..." 
                style={{ resize: 'none', background: 'var(--bg-color)' }}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem', gap: '12px' }}
            >
              <Send size={20} /> {loading ? 'Sending...' : 'Launch Message'}
            </button>
          </form>
        </div>

        {/* Reach Out Info - Premium Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="info-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem' }}>Direct Channels</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Email</h4>
                  <p className="footer-link">dsaconnect123@gmail.com</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Phone</h4>
                  <p className="footer-link">+91 91xx-xxxx-xx</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Location</h4>
                  <p className="footer-link">Jharkhand, India</p>
                </div>
              </div>

            </div>
          </div>

          <div className="info-card" style={{ background: 'var(--primary-color)', color: 'white', border: 'none' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.3rem' }}>Developer Socials</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '2rem' }}>Follow the journey and contribute to the source.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/purushotam-sahu-4b0369282/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
