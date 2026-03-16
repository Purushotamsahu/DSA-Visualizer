import { Link } from 'react-router-dom';
import { categories } from '../algorithms';
import { 
  GitMerge, 
  Layers, 
  Share2, 
  Scissors, 
  TrendingUp, 
  RotateCcw,
  TreePine, 
  ListOrdered,
  Search,
  Box,
  Hash,
  Terminal,
  Zap
} from 'lucide-react';

const getIcon = (id) => {
  switch (id) {
    case 'dp': return <Layers size={24} />;
    case 'linked-list': return <ListOrdered size={24} />;
    case 'stack': return <GitMerge size={24} />;
    case 'queue': return <GitMerge size={24} style={{ transform: 'rotate(180deg)' }} />;
    case 'bst': return <Search size={24} />;
    case 'heap': return <Box size={24} />;
    case 'hashing': return <Hash size={24} />;
    case 'graph': return <Share2 size={24} />;
    case 'divide-conquer': return <Scissors size={24} />;
    case 'greedy': return <TrendingUp size={24} />;
    case 'recursion': return <RotateCcw size={24} />;
    case 'binary-tree': return <TreePine size={24} />;
    default: return <Zap size={24} />;
  }
};

export default function Home() {
  const allCategories = categories;

  return (
    <div className="home-container">
      <div className="centered-container">
        <header className="hero-header">
          <h1 className="hero-title">Data Structure Visualizer</h1>
          <p className="hero-subtitle">
            Master computer science fundamentals through high-fidelity interactive visualizations. 
            See algorithms in motion, step-by-step, with real-time code execution.
          </p>
        </header>

        <div className="section-header">
          <h2 className="section-title">Data Structures</h2>
        </div>
        
        <div className="card-grid">
          {allCategories.map(cat => (
            <Link key={cat.id} to={cat.problems ? `/category/${cat.id}` : '#'} className="feature-card">
              <div className="card-content">
                <div className="card-title">
                  <span className="card-icon-wrapper">
                    {getIcon(cat.id)}
                  </span>
                  {cat.title}
                </div>
                <p className="card-desc">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
