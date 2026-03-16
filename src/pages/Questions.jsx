import { Link, useParams } from 'react-router-dom';
import { categories } from '../algorithms';
import { ChevronRight, HelpCircle } from 'lucide-react';

export default function Questions() {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);

  if (!category) return <div>Category not found</div>;

  return (
    <div className="category-page centered-container">
      <h2 className="section-title">{category.title} Problems</h2>
      
      <div className="card-grid">
        {category.problems.length > 0 ? (
          category.problems.map(prob => (
            <Link key={prob.id} to={`/category/${categoryId}/${prob.id}/methods`} className="feature-card">
              <div className="card-title">
                <span className="card-icon-wrapper">
                  <HelpCircle size={24} />
                </span>
                {prob.title}
                <div style={{ marginLeft: 'auto' }}>
                  <span className={`badge-${prob.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--card-border)' }}>
                    {prob.difficulty}
                  </span>
                </div>
              </div>
              <p className="card-desc">{prob.desc}</p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 500 }}>
                Visualise <ChevronRight size={14} />
              </div>
            </Link>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', 
            background: 'var(--card-bg)', border: '2px dashed var(--card-border)', borderRadius: '12px' 
          }}>
            <HelpCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Visualizations for {category.title} are coming soon!</p>
            <Link to="/" className="btn" style={{ display: 'inline-flex', marginTop: '1rem' }}>Go Back</Link>
          </div>
        )}
      </div>
    </div>
  );
}
