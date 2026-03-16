import { Link, useParams, useNavigate } from 'react-router-dom';
import { categories } from '../algorithms';
import { Play, ChevronRight, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Methods() {
  const { categoryId, questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const category = categories.find(c => c.id === categoryId);
  if (!category) return <div>Category not found</div>;

  const problem = category.problems.find(p => p.id === questionId);
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="methods-page centered-container">
      <h2 className="section-title">Select Approach for {problem.title}</h2>
      
      <div className="card-grid">
        {problem.methods.map(method => (
          <Link 
            key={method.id} 
            to={`/category/${categoryId}/${questionId}/visualize/${method.id}`} 
            className="feature-card"
          >
            <div className="card-title">
              <span className="card-icon-wrapper">
                <Play size={24} />
              </span>
              {method.title}
            </div>
            <p className="card-desc">{method.desc}</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
              Start Visualization <ChevronRight size={14} />
            </div>
          </Link>
        ))}

        <div 
          onClick={() => isAdmin ? navigate(`/category/${categoryId}/${questionId}/custom`) : null}
          className="feature-card"
          style={{ 
            border: isAdmin ? '2px dashed var(--primary-color)' : '2px dashed var(--card-border)', 
            background: isAdmin ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            cursor: isAdmin ? 'pointer' : 'default',
            opacity: isAdmin ? 1 : 0.7
          }}
        >
          <div className="card-title">
            <span className="card-icon-wrapper" style={{ background: isAdmin ? 'var(--primary-color)' : 'var(--accent)' }}>
              <Code size={24} color={isAdmin ? "white" : "var(--text-muted)"} />
            </span>
            Custom Simulator {!isAdmin && <span className="badge" style={{ fontSize: '0.6rem', marginLeft: '8px', background: 'var(--accent)', color: 'var(--primary-color)' }}>Upcoming</span>}
          </div>
          <p className="card-desc">
            {isAdmin 
              ? "Write your own C++ code to solve this problem and visualize its execution in real-time."
              : "Advanced feature: Write and visualize your own algorithms. This feature is currently in private beta."}
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 500, color: isAdmin ? 'var(--primary-color)' : 'var(--text-muted)' }}>
            {isAdmin ? "Open Advanced IDE" : "Coming Soon"} <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
