import React from 'react';
import { Info, Target, Activity, Code2, Rocket, Coffee, Github, Linkedin, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  const [userCount, setUserCount] = React.useState(0);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8888/api/admin/stats')
      .then(res => res.json())
      .then(data => setUserCount(data.userCount))
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  return (
    <div className="centered-container" style={{ padding: '6rem 0' }}>
      {/* Hero Section with Glassmorphism Influence */}
      <header className="hero-header" style={{ marginBottom: '6rem', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '-50px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '300px', 
          height: '300px', 
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
          zIndex: -1 
        }}></div>
        
        <div style={{ display: 'inline-flex', padding: '14px', background: 'var(--accent)', borderRadius: '24px', color: 'var(--primary-color)', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.1)' }}>
          <Info size={36} />
        </div>
        <h1 className="hero-title" style={{ fontSize: '4rem', lineHeight: '1.1' }}>Bridging Theory & <br/><span style={{ color: 'var(--primary-color)' }}>Visual Interaction</span></h1>
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '1.5rem auto', fontSize: '1.25rem' }}>
          DSA Visualizer is an advanced educational ecosystem designed to make complex data structures 
          intuitive, interactive, and beautiful.
        </p>
      </header>

      {/* Impact Counter Section */}
      <section style={{ marginBottom: '8rem', textAlign: 'center' }}>
        <div className="info-card" style={{ 
          display: 'inline-block', 
          padding: '4rem 6rem', 
          background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--accent) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Rocket size={120} /></div>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Global Community</span>
          <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--text-color)', lineHeight: '1', marginBottom: '0.5rem' }}>{userCount}+</div>
          <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learners Empowered</p>
        </div>
      </section>
      
      {/* Core Values / Features */}
      <section style={{ marginBottom: '8rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Our Core Philosophy</h2>
          <p className="card-desc">Designed for the next generation of software engineers</p>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          <div className="feature-card" style={{ cursor: 'default', padding: '3rem', border: '1px solid var(--card-border)' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}><Target size={40} /></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Intuitive Learning</h3>
            <p className="card-desc" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Textbooks provide definitions; we provide experience. By interacting with algorithms in real-time, 
              your brain builds stronger neural connections, making retention effortless.
            </p>
          </div>
          <div className="feature-card" style={{ cursor: 'default', padding: '3rem', border: '1px solid var(--card-border)' }}>
            <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}><ShieldCheck size={40} /></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Production Ready</h3>
            <p className="card-desc" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              We don't just show "toy" examples. Our logic mirrors real-world implementation patterns 
              found in production systems and competitive programming.
            </p>
          </div>
          <div className="feature-card" style={{ cursor: 'default', padding: '3rem', border: '1px solid var(--card-border)' }}>
            <div style={{ color: 'var(--error)', marginBottom: '1.5rem' }}><Heart size={40} /></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Built for Students</h3>
            <p className="card-desc" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Created by a developer who understands the pain points of learning DSA. We focus on 
              high-fidelity animations that clearly show the "why" behind the "how".
            </p>
          </div>
        </div>
      </section>

      {/* Developer Profile Section - PREMIUM REDESIGN */}
      <section style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="developer-card">
          <div className="developer-avatar">
            <img 
              src="/developer_profile_purushotam_1773581000356.png" 
              alt="Purushotam Sahu" 
              className="avatar-img"
            />
            <div className="avatar-decoration">
              <Code2 size={20} />
            </div>
          </div>
          
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Lead Architect</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Purushotam Sahu</h2>
          <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '2rem' }}>Full Stack Engineer & Algorithm Specialist</p>
          
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            "I believe that education should be as dynamic as the technology it teaches. DSA Visualizer 
            is my contribution to the coding community—a tool designed to help you master 
            the fundamentals and conquer your next technical interview."
          </p>
          
          <div className="dev-social-stack">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
              <Github size={18} /> Profile
            </a>
            <a href="https://www.linkedin.com/in/purushotam-sahu-4b0369282/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
              <Linkedin size={18} /> Connect
            </a>
            <a href="/contact" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
              <MessageSquare size={18} /> Hire Me
            </a>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '6rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Coffee size={20} /> Built with passion in Jharkhand, India
      </div>
    </div>
  );
};

export default About;
