import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingQuestion = ({ topic = "Visualizations", isAdmin = false, link = "#" }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="feature-card" 
      onClick={() => (isAdmin && link !== "#") ? window.location.href = link : null}
      style={{ 
        cursor: (isAdmin && link !== "#") ? 'pointer' : 'default', 
        opacity: (isAdmin && link !== "#") ? 1 : 0.8,
        borderStyle: 'dashed',
        userSelect: 'none'
      }}
    >
      <div className="card-content">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="card-icon-wrapper" style={{ background: 'var(--accent)', color: isAdmin ? 'var(--primary-color)' : 'var(--text-muted)' }}>
            <HelpCircle size={24} />
          </span>
          Upcoming Segment {topic}
          {isAdmin && <span className="badge badge-primary" style={{ fontSize: '0.6rem', marginLeft: 'auto' }}>Admin Early Access</span>}
        </div>
        <p className="card-desc">
          {isAdmin 
            ? `Special access enabled for ${topic} advanced features and simulators. Click to explore.`
            : `We are working on bringing more advanced ${topic} algorithms and a new **Custom Simulator** to the platform. Stay tuned!`}
        </p>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge badge-primary" style={{ background: 'var(--accent)', color: isAdmin ? 'var(--primary-color)' : 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
            {isAdmin ? "Feature Enabled" : "Coming Soon"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingQuestion;
