import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../algorithms';
import { Code, ChevronRight, Play, Cpu, Clock, Layers, Pause, SkipBack, SkipForward, Activity, Info, Terminal, ZoomIn, ZoomOut } from 'lucide-react';
import { compileCppToGenerator } from '../utils/simulationUtils';

export default function CustomSimulator() {
  const { categoryId, questionId } = useParams();
  const navigate = useNavigate();

  const category = categories.find(c => c.id === categoryId);
  const problem = category?.problems.find(p => p.id === questionId);

  const [customCode, setCustomCode] = useState(`int solve(int n) {\n  if (n <= 1) return n;\n  return solve(n-1) + solve(n-2);\n}`);
  const [customInputs, setCustomInputs] = useState(() => {
    const init = {};
    problem?.inputs.forEach(input => {
      init[input.id] = String(input.defaultValue);
    });
    return init;
  });
  const [customTime, setCustomTime] = useState("O(2ⁿ)");
  const [customSpace, setCustomSpace] = useState("O(n)");
  
  // Simulation State
  const [method, setMethod] = useState('recursion');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  if (!problem) return <div className="p-8">Problem not found</div>;

  const runSimulation = (selectedMethod) => {
    setMethod(selectedMethod);
    try {
      // Parse inputs
      const argsArr = problem.inputs.map(input => {
        const val = customInputs[input.id];
        if (input.type === 'number') return Number(val);
        if (typeof val === 'string' && val.includes(',')) {
          return val.split(',').map(s => {
            const trimmed = s.trim();
            return isNaN(trimmed) ? trimmed : Number(trimmed);
          });
        }
        return val;
      });

      const factory = compileCppToGenerator(customCode, selectedMethod);
      if (!factory) {
        setError("Failed to compile C++ code");
        return;
      }
      
      const generator = factory(argsArr);
      const allSteps = [];
      let result = generator.next();
      let limit = 2000;
      while (!result.done && limit-- > 0) {
        if (result.value) allSteps.push(result.value);
        result = generator.next();
      }
      
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setError("");
    } catch (e) {
      console.error("Simulation error", e);
      setError(e.message);
    }
  };

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps.length]);

  const stepState = steps[currentStepIndex] || {};
  const handleNext = () => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1));
  const handlePrev = () => setCurrentStepIndex(p => Math.max(p - 1, 0));

  return (
    <div className="visualizer-layout" style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Top Bar: Problem Info & Inputs */}
      <div className="visualizer-top" style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{problem.title}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Custom Simulation Page</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {problem.inputs.map(input => (
            <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-color)' }}>{input.label}:</label>
              <input 
                value={customInputs[input.id] || ""}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                style={{ 
                  background: 'var(--bg-color)', border: '1px solid var(--card-border)', 
                  padding: '6px 10px', borderRadius: '8px', width: input.type === 'number' ? '70px' : '150px', fontSize: '0.9rem',
                  fontWeight: 600, color: 'var(--primary-color)'
                }}
              />
            </div>
          ))}
          <div style={{ height: '32px', width: '1px', background: 'var(--card-border)', margin: '0 0.5rem' }}></div>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--accent)', padding: '4px', borderRadius: '10px' }}>
             <button onClick={() => runSimulation('recursion')} className={`btn ${method === 'recursion' ? 'btn-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}>Recursion</button>
             <button onClick={() => runSimulation('memoization')} className={`btn ${method === 'memoization' ? 'btn-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}>Memoization</button>
             <button onClick={() => runSimulation('tabulation')} className={`btn ${method === 'tabulation' ? 'btn-primary' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}>Tabulation</button>
          </div>
        </div>
      </div>

      <div className="visualizer-main" style={{ padding: '1rem', overflow: 'hidden', gap: '1.5rem' }}>
        {/* Left: Code Editor */}
        <div className="panel" style={{ flex: 1, minWidth: '400px' }}>
          <div className="panel-header" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={14} color="var(--primary-color)" />
              <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>SOURCE CODE (C++)</span>
            </div>
          </div>
          <textarea 
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="code-view"
            spellCheck="false"
            style={{ 
              width: '100%', height: '100%', border: 'none', resize: 'none', outline: 'none',
              fontFamily: '"Fira Code", monospace', fontSize: '13px', padding: '1.5rem',
              lineHeight: '1.6', background: 'transparent'
            }}
          />
          {error && <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', fontSize: '0.8rem', fontWeight: 600 }}>{error}</div>}
          
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--card-border)', background: 'rgba(59, 130, 246, 0.03)', display: 'flex', gap: '1rem' }}>
            <Info size={18} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>
              <strong>Step {steps.length > 0 ? currentStepIndex + 1 : 0}:</strong> {stepState.description || "Edit code on the left and click a mode button above to start."}
            </p>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="panel" style={{ flex: 1.5 }}>
          <div className="panel-header" style={{ background: 'rgba(16, 185, 129, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} color="var(--success)" />
              <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>VISUALIZATION</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-color)', padding: '2px', borderRadius: '8px', border: '1px solid var(--card-border)', textTransform: 'none', letterSpacing: 'normal' }}>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}
                title="Zoom Out"
                style={{ padding: '4px', height: '24px', border: 'none', background: 'transparent' }}
              >
                <ZoomOut size={14} />
              </button>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(1)}
                title="Reset Zoom"
                style={{ fontSize: '0.65rem', padding: '0 4px', height: '24px', border: 'none', background: 'transparent', fontWeight: 800, color: 'var(--primary-color)' }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
                title="Zoom In"
                style={{ padding: '4px', height: '24px', border: 'none', background: 'transparent' }}
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>
          <div className="state-view" style={{ background: 'radial-gradient(circle at 2px 2px, var(--card-border) 1px, transparent 0)', backgroundSize: '24px 24px', position: 'relative' }}>
            <div style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            {steps.length === 0 && !error && (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '1.5rem' }}>
                 <div style={{ padding: '2rem', borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary-color)' }}>
                    <Play size={48} />
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>Ready to Simulate?</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Choose a simulation mode from the top bar to begin visual execution.</p>
                 </div>
               </div>
            )}
            
            {(method === 'recursion' || method === 'memoization') && stepState.tree && (
              <TreeRenderer tree={stepState.tree} />
            )}
            
            {method === 'tabulation' && (stepState.table || stepState.table2D) && (
              <TableRenderer 
                table={stepState.table} active={stepState.activeIndex} read={stepState.readIndices} 
                table2D={stepState.table2D} active2D={stepState.active2D} read2D={stepState.read2D} 
              />
            )}
            
            {stepState.linkedList && (
              <LinkedListRenderer data={stepState.linkedList} />
            )}
            </div>

            {stepState.memo && Object.keys(stepState.memo).length > 0 && (
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-lg)', maxWidth: '240px', zIndex: 10 }}>
                <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 800 }}>MEMOIZATION CACHE</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(stepState.memo).map(([k, v]) => (
                    <div key={k} style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'var(--accent)', border: '1px solid var(--card-border)', borderRadius: '6px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--primary-color)' }}>{k}</span>: {v}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--card-border)', background: 'var(--bg-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>TIME COMPLEXITY</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                  <Clock size={14} />
                  <input 
                    value={customTime} 
                    onChange={e => setCustomTime(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '0.9rem', fontWeight: 800, width: '60px', color: 'inherit', outline: 'none' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>SPACE COMPLEXITY</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                  <Cpu size={14} />
                  <input 
                    value={customSpace} 
                    onChange={e => setCustomSpace(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '0.9rem', fontWeight: 800, width: '60px', color: 'inherit', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>

            {/* Variable Watch */}
            {(stepState.variables || stepState.activeIndex !== undefined || stepState.active2D) && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '6px 14px', background: 'var(--accent)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>LIVE VARS:</span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   {stepState.activeIndex !== undefined && <div style={{ fontSize: '0.85rem', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>i</span>: {stepState.activeIndex}</div>}
                   {stepState.active2D && (
                     <>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>r</span>: {stepState.active2D.r}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>c</span>: {stepState.active2D.c}</div>
                     </>
                   )}
                   {stepState.variables && Object.entries(stepState.variables).map(([name, val]) => (
                     <div key={name} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                       <span style={{ color: 'var(--primary-color)' }}>{name}</span>: {val}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Playback Controls */}
      <div className="visualizer-controls" style={{ padding: '1rem 2rem', borderTop: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={handlePrev} disabled={currentStepIndex === 0 || steps.length === 0} style={{ padding: '8px' }}>
            <SkipBack size={20} />
          </button>
          <button className="btn btn-primary" onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0} style={{ padding: '8px 20px', gap: '8px' }}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span style={{ fontWeight: 700 }}>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button className="btn" onClick={handleNext} disabled={currentStepIndex >= steps.length - 1 || steps.length === 0} style={{ padding: '8px' }}>
            <SkipForward size={20} />
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>PROGRESS</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 700 }}>
              Step {steps.length > 0 ? (currentStepIndex + 1) : 0} of {steps.length}
            </span>
          </div>
          <div style={{ width: '150px', height: '6px', background: 'var(--accent)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ 
               position: 'absolute', left: 0, top: 0, bottom: 0, 
               width: steps.length > 0 ? `${((currentStepIndex + 1) / steps.length) * 100}%` : '0%',
               background: 'var(--primary-color)', transition: 'width 0.3s ease'
             }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Renderers
function TreeRenderer({ tree }) {
  if (!tree || tree.nodes.length === 0) return null;
  const depths = {};
  const root = tree.nodes.find(n => !tree.edges.some(e => e.target === n.id));
  if (!root) return null;
  const attachDepths = (nodeId, d) => {
    depths[nodeId] = d;
    const children = tree.edges.filter(e => e.source === nodeId).map(e => e.target);
    children.forEach(c => attachDepths(c, d + 1));
  };
  attachDepths(root.id, 0);
  const xPos = {};
  const orderPositions = (nodeId, minX, maxX) => {
    xPos[nodeId] = (minX + maxX) / 2;
    const children = tree.edges.filter(e => e.source === nodeId).map(e => e.target);
    if (children.length === 1) orderPositions(children[0], minX, maxX);
    else if (children.length === 2) {
      orderPositions(children[0], minX, xPos[nodeId]);
      orderPositions(children[1], xPos[nodeId], maxX);
    }
  };
  orderPositions(root.id, 0, 800);
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ transition: 'all 0.3s ease' }}>
      <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cccccc" /></marker></defs>
      {tree.edges.map((edge, i) => {
        const source = tree.nodes.find(n => n.id === edge.source);
        const target = tree.nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        return <line key={i} x1={xPos[source.id]} y1={depths[source.id] * 80 + 75} x2={xPos[target.id]} y2={depths[target.id] * 80 + 5} stroke="#cccccc" strokeWidth="2" markerEnd="url(#arrow)" />;
      })}
      {tree.nodes.map(node => (
        <g key={node.id} style={{ transition: 'transform 0.3s ease' }}>
          <circle cx={xPos[node.id]} cy={depths[node.id] * 80 + 40} r="35" fill="var(--card-bg)" stroke={node.active ? "var(--primary-color)" : "#cccccc"} strokeWidth={node.active ? "4" : "2"} style={{ transition: 'stroke 0.3s ease' }} />
          <text x={xPos[node.id]} y={depths[node.id] * 80 + 40} textAnchor="middle" dominantBaseline="middle" fontSize="12px" fill="var(--text-color)" fontWeight={node.active ? "800" : "500"}>{node.label}</text>
          {node.result !== null && (
            <g transform={`translate(${xPos[node.id] + 30}, ${depths[node.id] * 80 + 15})`}>
               <rect width="30" height="20" rx="4" fill="var(--success)" opacity="0.1" />
               <text x="15" y="10" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--success)', fontSize: '11px', fontWeight: 'bold' }}>{node.result}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

function TableRenderer({ table, active, read, table2D, active2D, read2D }) {
  if (table2D) {
    const colCount = table2D[0]?.length || 0;
    return (
      <div style={{ padding: '2rem', overflow: 'auto', display: 'inline-block' }}>
        <div style={{ display: 'flex', gap: '4px', paddingLeft: '40px', marginBottom: '8px' }}>
          {Array.from({ length: colCount }).map((_, cIdx) => (
            <div key={cIdx} style={{ width: '40px', textAlign: 'center', fontSize: '10px', fontWeight: 800, color: active2D?.c === cIdx ? 'var(--primary-color)' : 'var(--text-muted)' }}>[{cIdx}]</div>
          ))}
        </div>
        {table2D.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '40px', textAlign: 'right', fontSize: '10px', fontWeight: 800, marginRight: '8px', color: active2D?.r === rIdx ? 'var(--primary-color)' : 'var(--text-muted)' }}>[{rIdx}]</div>
            {row.map((val, cIdx) => {
               const isActive = active2D?.r === rIdx && active2D?.c === cIdx;
               const isRead = read2D?.some(pos => pos.r === rIdx && pos.c === cIdx);
               return (
                 <div key={cIdx} style={{
                   width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   border: isActive ? '3px solid var(--primary-color)' : (isRead ? '3px solid var(--success)' : '1px solid var(--card-border)'),
                   background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                   borderRadius: '6px', fontSize: '14px', fontWeight: 800, color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                   transition: 'all 0.2s ease'
                 }}>{val}</div>
               );
            })}
          </div>
        ))}
      </div>
    );
  }
  if (!table) return null;
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '2rem' }}>
      {table.map((val, idx) => {
        const isActive = idx === active;
        const isRead = read?.includes(idx);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: isActive ? 'var(--primary-color)' : 'var(--text-muted)' }}>[{idx}]</span>
            <div style={{
              width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isActive ? '3px solid var(--primary-color)' : (isRead ? '3px solid var(--success)' : '1px solid var(--card-border)'),
              background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              borderRadius: '8px', fontSize: '16px', fontWeight: 800, color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
              transition: 'all 0.2s ease'
            }}>{val}</div>
          </div>
        );
      })}
    </div>
  );
}

function LinkedListRenderer({ data }) {
  if (!data || !data.nodes || data.nodes.length === 0) return null;
  const { nodes, activeId, foundId, headId, type } = data;

  return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', overflowX: 'auto' }}>
      <svg width={Math.max(800, nodes.length * 150)} height="250" viewBox={`0 0 ${Math.max(800, nodes.length * 150)} 250`}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#cccccc" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary-color)" />
          </marker>
        </defs>

        {nodes.map((node, i) => {
          const x = 50 + i * 140;
          const y = 80;
          const isActive = node.id === activeId;
          const isFound = node.id === foundId;
          const isHead = node.id === headId;

          return (
            <g key={node.id}>
              <rect 
                x={x} y={y} width="80" height="40" rx="8" 
                fill="var(--card-bg)" 
                stroke={isFound ? "var(--success)" : (isActive ? "var(--primary-color)" : "var(--card-border)")} 
                strokeWidth={isActive || isFound ? "3" : "2"}
              />
              <text x={x+40} y={y+20} textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fill="var(--text-color)">
                {node.val}
              </text>
              {isHead && <text x={x+40} y={y-15} textAnchor="middle" fontSize="10px" fill="var(--primary-color)" fontWeight="bold">HEAD</text>}

              {/* Forward Arrow */}
              {i < nodes.length - 1 && (
                <line 
                  x1={x + 80} y1={y + 15} x2={x + 130} y2={y + 15} 
                  stroke={isActive ? "var(--primary-color)" : "#cccccc"} strokeWidth="2" 
                  markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                />
              )}

              {/* Backward Arrow (Doubly) */}
              {(type === 'doubly' || type === 'circular-doubly') && i > 0 && (
                <line 
                  x1={x} y1={y + 25} x2={x - 50} y2={y + 25} 
                  stroke="#cccccc" strokeWidth="2" markerEnd="url(#arrowhead)"
                />
              )}

              {/* Circular Link (Forward) */}
              {(type === 'circular' || type === 'circular-doubly') && i === nodes.length - 1 && (
                <path 
                  d={`M ${x + 80} ${y + 20} C ${x + 140} ${y + 20}, ${x + 140} ${y + 120}, ${x / 2} ${y + 120} S ${50} ${y + 60}, ${50} ${y + 40}`}
                  fill="none" stroke="#cccccc" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)"
                />
              )}

              {/* Circular Link (Backward) */}
              {type === 'circular-doubly' && i === 0 && (
                <path 
                  d={`M ${x} ${y + 20} C ${x - 60} ${y + 20}, ${x - 60} ${y - 40}, ${50 + (nodes.length-1)*140 + 40} ${y - 40} S ${50 + (nodes.length-1)*140 + 80} ${y + 20}, ${50 + (nodes.length-1)*140 + 80} ${y + 40}`}
                  fill="none" stroke="#cccccc" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
