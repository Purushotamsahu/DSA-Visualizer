import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { categories } from '../algorithms';
import { Play, Pause, SkipBack, SkipForward, Code, Activity, Info, Settings, Save, Terminal, Plus, Trash2, Search, RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { compileCppToGenerator, parseArgs } from '../utils/simulationUtils';
import * as LLGenerators from '../algorithms/linked-list/linkedList';
import { stackPush, stackPop, stackTop } from '../algorithms/stack/stack';
import { queueEnqueue, queueDequeue, queueFront } from '../algorithms/queue/queue';
import { bstInsert, bstSearch, bstDelete, bstInorder, bstPreorder, bstPostorder } from '../algorithms/bst/bst';
import { btInsert, btSearch, btPreorder, btInorder, btPostorder, btReset } from '../algorithms/binary-tree/binaryTree';
import { heapCombinedCode, maxHeapInsert, maxHeapDelete, minHeapInsert, minHeapDelete, heapSort } from '../algorithms/heap/heap';
import { bfsGenerator, dfsGenerator } from '../algorithms/graph/graph';
import { MousePointer2, CircleDashed, Share2 as EdgeIcon } from 'lucide-react';

const DEFAULT_S_LIST = [
  { id: 1, val: 10, next: 2 },
  { id: 2, val: 20, next: 3 },
  { id: 3, val: 30, next: 4 },
  { id: 4, val: 40, next: 5 },
  { id: 5, val: 50, next: null }
];

const DEFAULT_D_LIST = [
  { id: 1, val: 10, next: 2, prev: null },
  { id: 2, val: 20, next: 3, prev: 1 },
  { id: 3, val: 30, next: 4, prev: 2 },
  { id: 4, val: 40, next: 5, prev: 3 },
  { id: 5, val: 50, next: null, prev: 4 }
];

const DEFAULT_C_LIST = [
  { id: 1, val: 10, next: 2 },
  { id: 2, val: 20, next: 3 },
  { id: 3, val: 30, next: 4 },
  { id: 4, val: 40, next: 5 },
  { id: 5, val: 50, next: 1 }
];

const DEFAULT_CD_LIST = [
  { id: 1, val: 10, next: 2, prev: 5 },
  { id: 2, val: 20, next: 3, prev: 1 },
  { id: 3, val: 30, next: 4, prev: 2 },
  { id: 4, val: 40, next: 5, prev: 3 },
  { id: 5, val: 50, next: 1, prev: 4 }
];

const DEFAULT_BST_TREE = {
  id: 'node-1', val: 50,
  left: {
    id: 'node-2', val: 30,
    left: { id: 'node-3', val: 20, left: null, right: null },
    right: { id: 'node-4', val: 40, left: null, right: null }
  },
  right: {
    id: 'node-5', val: 70,
    left: { id: 'node-6', val: 60, left: null, right: null },
    right: { id: 'node-7', val: 80, left: null, right: null }
  }
};

const DEFAULT_BT_TREE = {
  id: 'bt-node-1', val: 1,
  left: {
    id: 'bt-node-2', val: 2,
    left: { id: 'bt-node-4', val: 4, left: null, right: null },
    right: { id: 'bt-node-5', val: 5, left: null, right: null }
  },
  right: {
    id: 'bt-node-3', val: 3,
    left: { id: 'bt-node-6', val: 6, left: null, right: null },
    right: { id: 'bt-node-7', val: 7, left: null, right: null }
  }
};

export default function Visualizer() {
  const { categoryId, questionId, method: urlMethod } = useParams();
  const location = useLocation();
  
  const category = categories.find(c => c.id === categoryId);
  const problem = category?.problems.find(p => p.id === questionId);
  const methodConfig = problem?.methods.find(m => m.id === urlMethod);
  
  const [method, setMethod] = useState(urlMethod);

  const [inputs, setInputs] = useState(() => {
    const initial = {};
    if (problem) {
      problem.inputs.forEach(inp => initial[inp.id] = inp.defaultValue);
    }
    return initial;
  });
  
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  
  // LL Interaction State
  const [llValue, setLlValue] = useState(30);
  const [llIndex, setLlIndex] = useState(2);
  const [llList, setLlList] = useState([]);
  const [llHeadId, setLlHeadId] = useState(null);
  
  // Stack Interaction State
  const [stackItems, setStackItems] = useState([]);
  const [stackLastOp, setStackLastOp] = useState(null); // { type, val, result }

  // Queue Interaction State
  // Queue Interaction State
  const [queueItems, setQueueItems] = useState([]);
  const [queueLastOp, setQueueLastOp] = useState(null);

  // BST Interaction State
  const [bstTree, setBstTree] = useState(null);
  const [bstTraversal, setBstTraversal] = useState(null);

  // Heap Interaction State
  const [heapItems, setHeapItems] = useState([]);
  
  // Graph Interaction State
  const [graphNodes, setGraphNodes] = useState([
    { id: 1, x: 100, y: 100, label: '1' },
    { id: 2, x: 300, y: 100, label: '2' },
    { id: 3, x: 100, y: 300, label: '3' },
    { id: 4, x: 300, y: 300, label: '4' }
  ]);
  const [graphEdges, setGraphEdges] = useState([
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 }
  ]);
  const [graphMode, setGraphMode] = useState('select'); // 'select', 'addNode', 'addEdge'
  const [edgeSource, setEdgeSource] = useState(null);
  const [startNodeId, setStartNodeId] = useState(1);
  
  // Zoom State
  const [zoom, setZoom] = useState(1);
  
  const timerRef = useRef(null);

  // Sync method with URL
  useEffect(() => {
    setMethod(urlMethod);
  }, [urlMethod]);

  // Reset LL State on question change
  useEffect(() => {
    if (categoryId === 'linked-list') {
      let initialList = [];
      let initialHeadId = null;

      if (urlMethod === 'delete' || urlMethod === 'search') {
          if (questionId === 'singly-ll') { initialList = DEFAULT_S_LIST; initialHeadId = 1; }
          else if (questionId === 'doubly-ll') { initialList = DEFAULT_D_LIST; initialHeadId = 1; }
          else if (questionId === 'circular-ll') { initialList = DEFAULT_C_LIST; initialHeadId = 1; }
          else if (questionId === 'circular-doubly-ll') { initialList = DEFAULT_CD_LIST; initialHeadId = 1; }
      }
      
      setLlList(initialList);
      setLlHeadId(initialHeadId);
      
      // Create an initial step so it's visible immediately
      setSteps([{
        description: initialList.length > 0 ? "Initial list ready." : "List is empty. Start adding nodes!",
        linkedList: { 
          nodes: initialList, 
          headId: initialHeadId, 
          type: questionId.replace('-ll', '') 
        }
      }]);
      setCurrentStepIndex(0);
    }

    if (categoryId === 'stack') {
      setStackItems([]);
      setStackLastOp(null);
      setSteps([{
        description: "Stack is empty. Use Push, Pop, or Top to interact.",
        line: null,
        stack: { items: [], type: 'stack', operation: null }
      }]);
      setCurrentStepIndex(0);
    }

    if (categoryId === 'queue') {
      setQueueItems([]);
      setQueueLastOp(null);
      setSteps([{
        description: "Queue is empty. Use Enqueue, Dequeue, or Front to interact.",
        line: null,
        queue: { items: [], type: 'queue', operation: null }
      }]);
      setCurrentStepIndex(0);
    }

    if (categoryId === 'bst' || categoryId === 'binary-tree') {
      let initialTree = null;
      if (urlMethod === 'search' || urlMethod === 'delete') {
        initialTree = categoryId === 'bst' ? DEFAULT_BST_TREE : DEFAULT_BT_TREE;
      }
      setBstTree(initialTree);
      setBstTraversal(null);
      setSteps([{
        description: initialTree ? `Initial ${categoryId.toUpperCase()} ready for operations.` : `${categoryId.toUpperCase()} is empty. Use Push to interact.`,
        line: null,
        bstState: initialTree,
        bstTraversal: null,
        activeNode: null
      }]);
      setCurrentStepIndex(0);
    }

    if (categoryId === 'heap') {
      setHeapItems([]);
      setSteps([{
        description: "Heap is empty. Use Insert to interact.",
        line: null,
        heap: [],
        activeIndices: []
      }]);
      setCurrentStepIndex(0);
    }
  }, [categoryId, questionId, urlMethod]);

  const handleResetLL = () => {
    let initialList = [];
    let initialHeadId = null;

    if (method === 'delete' || method === 'search') {
        if (questionId === 'singly-ll') { initialList = DEFAULT_S_LIST; initialHeadId = 1; }
        else if (questionId === 'doubly-ll') { initialList = DEFAULT_D_LIST; initialHeadId = 1; }
        else if (questionId === 'circular-ll') { initialList = DEFAULT_C_LIST; initialHeadId = 1; }
        else if (questionId === 'circular-doubly-ll') { initialList = DEFAULT_CD_LIST; initialHeadId = 1; }
    }
    
    setLlList(initialList);
    setLlHeadId(initialHeadId);
    setSteps([{
      description: initialList.length > 0 ? "List reset to original." : "List cleared.",
      linkedList: { 
        nodes: initialList, 
        headId: initialHeadId, 
        type: questionId.replace('-ll', '') 
      }
    }]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!methodConfig) return;
    // Stack, Queue, BST & Heap: steps are driven by button clicks, not auto-generated
    if (categoryId === 'stack' || categoryId === 'queue' || categoryId === 'bst' || categoryId === 'heap' || categoryId === 'binary-tree') return;
    
    try {
      const firstInputVal = problem.inputs[0] ? inputs[problem.inputs[0].id] : null;
      const generator = methodConfig.generator(firstInputVal, inputs);
      
      const allSteps = [];
      let result = generator.next();
      let limit = 1000;
      while (!result.done && limit-- > 0) {
        if (result.value) allSteps.push(result.value);
        result = generator.next();
      }
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setError("");
    } catch (e) {
      console.error("Generator error", e);
      setError(e.message);
    }
  }, [categoryId, questionId, method, inputs, methodConfig, problem]);

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
  const codeLines = methodConfig ? methodConfig.code.split('\n') : [];

  const handleNext = () => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1));
  const handlePrev = () => setCurrentStepIndex(p => Math.max(p - 1, 0));

  const handleInputChange = (id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const runLLAction = (customGenerator) => {
    try {
      const gen = customGenerator(llValue, { 
        val: llValue, 
        pos: llIndex, 
        list: llList, 
        headId: llHeadId,
        type: questionId.startsWith('circular-doubly') ? 'circular-doubly' : (questionId.startsWith('circular') ? 'circular' : (questionId.startsWith('doubly') ? 'doubly' : 'singly'))
      });
      const allSteps = [];
      let lastLLState = null;
      let result = gen.next();
      let limit = 500;
      while (!result.done && limit-- > 0) {
        if (result.value) {
          allSteps.push(result.value);
          if (result.value.linkedList) {
            lastLLState = result.value.linkedList;
          }
        }
        result = gen.next();
      }
      
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);

      // Update persistent state based on the final step's LL state
      if (lastLLState) {
        setLlList(lastLLState.nodes);
        setLlHeadId(lastLLState.headId);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const runStackAction = (actionGen, opType) => {
    try {
      const inputVal = Number(inputs.val === '' ? 10 : inputs.val);
      const gen = actionGen(inputVal, { stack: stackItems });
      const allSteps = [];
      let lastStackState = null;
      let result = gen.next();
      let limit = 100;
      while (!result.done && limit-- > 0) {
        if (result.value) {
          allSteps.push(result.value);
          if (result.value.stack) lastStackState = result.value.stack;
        }
        result = gen.next();
      }
      setSteps(allSteps);
      // Jump straight to the LAST step so the result is visible immediately
      setCurrentStepIndex(allSteps.length - 1);
      setIsPlaying(false);

      let newStack = stackItems;
      if (lastStackState && !lastStackState.error) {
        newStack = lastStackState.items;
        setStackItems(newStack);
      }

      // Build status text
      if (opType === 'push') {
        setStackLastOp({ type: 'push', label: `Pushed: ${inputVal}`, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' });
      } else if (opType === 'pop') {
        const popped = lastStackState?.poppedVal ?? (stackItems.length > 0 ? stackItems[stackItems.length - 1] : null);
        if (lastStackState?.error) {
          setStackLastOp({ type: 'pop', label: 'Stack Underflow! Nothing to pop.', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' });
        } else {
          setStackLastOp({ type: 'pop', label: `Popped: ${popped}`, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' });
        }
      } else if (opType === 'top') {
        const topVal = stackItems.length > 0 ? stackItems[stackItems.length - 1] : null;
        if (topVal === null) {
          setStackLastOp({ type: 'top', label: 'Stack is Empty!', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' });
        } else {
          setStackLastOp({ type: 'top', label: `Top Value: ${topVal}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' });
        }
      }
    } catch (e) {
      setError(e.message);
    }
  };
  const runQueueAction = (actionGen, opType) => {
    try {
      const inputVal = Number(inputs.val === '' ? 10 : inputs.val);
      const gen = actionGen(inputVal, { queue: queueItems });
      const allSteps = [];
      let lastQueueState = null;
      let result = gen.next();
      let limit = 100;
      while (!result.done && limit-- > 0) {
        if (result.value) {
          allSteps.push(result.value);
          if (result.value.queue) lastQueueState = result.value.queue;
        }
        result = gen.next();
      }
      setSteps(allSteps);
      setCurrentStepIndex(allSteps.length - 1); // Jump to result immediately
      setIsPlaying(false);

      if (lastQueueState && !lastQueueState.error) {
        setQueueItems(lastQueueState.items);
      }

      if (opType === 'enqueue') {
        setQueueLastOp({ type: 'enqueue', label: `Enqueued: ${inputVal}`, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' });
      } else if (opType === 'dequeue') {
        const removed = lastQueueState?.dequeuedVal ?? (queueItems.length > 0 ? queueItems[0] : null);
        if (lastQueueState?.error) {
          setQueueLastOp({ type: 'dequeue', label: 'Queue Underflow! Nothing to dequeue.', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' });
        } else {
          setQueueLastOp({ type: 'dequeue', label: `Dequeued: ${removed}`, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' });
        }
      } else if (opType === 'front') {
        const frontVal = queueItems.length > 0 ? queueItems[0] : null;
        if (frontVal === null) {
          setQueueLastOp({ type: 'front', label: 'Queue is Empty!', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' });
        } else {
          setQueueLastOp({ type: 'front', label: `Front Value: ${frontVal}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' });
        }
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const runBstAction = (actionGen, actionType) => {
    try {
      const inputVal = Number(inputs.val === '' ? 10 : inputs.val);
      const gen = actionGen(inputVal, { tree: bstTree, direction: actionType });
      const allSteps = [];
      let lastState = null;
      let result = gen.next();
      let limit = 100;
      while (!result.done && limit-- > 0) {
        if (result.value) {
          allSteps.push(result.value);
          lastState = result.value;
        }
        result = gen.next();
      }
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);

      if (lastState && !lastState.error) {
        if (lastState.bstState !== undefined) setBstTree(lastState.bstState);
        if (lastState.bstTraversal !== undefined) setBstTraversal(lastState.bstTraversal);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const runGraphAction = () => {
    try {
      const startNode = Number(inputs.startNode || startNodeId);
      if (!graphNodes.find(n => n.id === startNode)) {
        setError(`Start node ${startNode} not found.`);
        return;
      }

      const gen = method === 'traverse' ? (questionId === 'bfs' ? bfsGenerator : dfsGenerator) : null;
      if (!gen) return;

      const generator = gen(startNode, { nodes: graphNodes, edges: graphEdges });
      const allSteps = [];
      let result = generator.next();
      let limit = 500;
      while (!result.done && limit-- > 0) {
        if (result.value) allSteps.push(result.value);
        result = generator.next();
      }
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleGraphClick = (e) => {
    if (graphMode === 'addNode') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      const newId = graphNodes.length > 0 ? Math.max(...graphNodes.map(n => n.id)) + 1 : 1;
      setGraphNodes([...graphNodes, { id: newId, x, y, label: String(newId) }]);
    }
  };

  const handleNodeClick = (nodeId) => {
    if (graphMode === 'addEdge') {
      if (edgeSource === null) {
        setEdgeSource(nodeId);
      } else {
        if (edgeSource !== nodeId) {
          // Check if edge already exists
          const exists = graphEdges.some(e => 
            (e.source === edgeSource && e.target === nodeId) || 
            (e.source === nodeId && e.target === edgeSource)
          );
          if (!exists) {
            setGraphEdges([...graphEdges, { source: edgeSource, target: nodeId }]);
          }
        }
        setEdgeSource(null);
      }
    } else if (graphMode === 'select') {
      setStartNodeId(nodeId);
      setInputs(prev => ({ ...prev, startNode: nodeId }));
    }
  };

  const runHeapAction = (actionGen, opType) => {
    try {
      const inputVal = Number(inputs.val === '' ? 10 : inputs.val);
      const gen = actionGen(inputVal, { heap: heapItems });
      const allSteps = [];
      let lastHeapState = null;
      let result = gen.next();
      let limit = 500;
      while (!result.done && limit-- > 0) {
        if (result.value) {
          allSteps.push(result.value);
          if (result.value.heap) lastHeapState = result.value.heap;
        }
        result = gen.next();
      }
      setSteps(allSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);

      if (lastHeapState && opType !== 'sort') {
        setHeapItems(lastHeapState);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  if (!methodConfig && categoryId !== 'graph') return <div className="p-8">Algorithm not found</div>;

  return (
    <div className="visualizer-layout">
      <div className="visualizer-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{problem?.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {methodConfig?.title} Approach
            </p>
          </div>
        </div>
        
        <div className="input-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {categoryId === 'linked-list' ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--accent)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              {/* Value Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Value:</span>
                <input 
                  type="number" value={llValue} onChange={e => setLlValue(Number(e.target.value))}
                  style={{ width: '60px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '4px', padding: '2px 6px' }}
                />
              </div>

              {/* Action Buttons based on Method */}
               {method === 'search' && (
                <button className="btn btn-primary btn-sm" onClick={() => {
                  const gen = problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLTraversal :
                              problem.id === 'circular-ll' ? LLGenerators.circularLLTraversal :
                              problem.id === 'doubly-ll' ? LLGenerators.doublyLLTraversal : 
                              LLGenerators.singlyLLTraversal;
                  runLLAction(gen);
                }}>
                  <Search size={14} style={{ marginRight: '6px' }} />
                  Search Node
                </button>
              )}

              {method === 'insert' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-primary btn-sm" onClick={() => {
                      const gen = problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLInsert :
                                  problem.id === 'circular-ll' ? LLGenerators.circularLLInsert :
                                  problem.id === 'doubly-ll' ? LLGenerators.doublyLLInsert :
                                  LLGenerators.singlyLLInsert;
                      runLLAction((v, i) => gen(v, { ...i, action: 'head' }));
                   }}>
                     <Plus size={14} style={{ marginRight: '4px' }} /> Head
                   </button>
                   <button className="btn btn-primary btn-sm" onClick={() => {
                      const gen = problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLInsert :
                                  problem.id === 'circular-ll' ? LLGenerators.circularLLInsert :
                                  problem.id === 'doubly-ll' ? LLGenerators.doublyLLInsert :
                                  LLGenerators.singlyLLInsert;
                      runLLAction((v, i) => gen(v, { ...i, action: 'tail' }));
                   }}>
                     <Plus size={14} style={{ marginRight: '4px' }} /> Tail
                   </button>
                   {(problem.id === 'singly-ll' || problem.id === 'doubly-ll' || problem.id === 'circular-ll' || problem.id === 'circular-doubly-ll') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid var(--card-border)', paddingLeft: '8px' }}>
                      <span style={{ fontSize: '0.7rem' }}>Idx</span>
                      <input type="number" value={llIndex} onChange={e => setLlIndex(Number(e.target.value))} style={{ width: '40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2px' }} />
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        const gen = problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLInsert :
                                    (problem.id === 'circular-ll' ? LLGenerators.circularLLInsert :
                                    (problem.id === 'doubly-ll' ? LLGenerators.doublyLLInsert : LLGenerators.singlyLLInsert));
                        runLLAction((v, i) => gen(v, { ...i, action: 'index' }));
                      }}>
                        Insert
                      </button>
                    </div>
                   )}
                </div>
              )}

               {method === 'delete' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-primary btn-sm" style={{ background: '#9ca3af', borderColor: '#9ca3af' }} onClick={() => {
                     const gen = problem.id === 'doubly-ll' ? LLGenerators.doublyLLDelete : 
                                 (problem.id === 'circular-ll' ? LLGenerators.circularLLDelete : 
                                 (problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLDelete : 
                                 LLGenerators.singlyLLDelete));
                     runLLAction((v, i) => gen(v, { ...i, action: 'head' }));
                   }}>
                     <Trash2 size={14} style={{ marginRight: '4px' }} /> Head
                   </button>
                   <button className="btn btn-primary btn-sm" style={{ background: '#9ca3af', borderColor: '#9ca3af' }} onClick={() => {
                     const gen = problem.id === 'doubly-ll' ? LLGenerators.doublyLLDelete : 
                                 (problem.id === 'circular-ll' ? LLGenerators.circularLLDelete : 
                                 (problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLDelete : 
                                 LLGenerators.singlyLLDelete));
                     runLLAction((v, i) => gen(v, { ...i, action: 'tail' }));
                   }}>
                     <Trash2 size={14} style={{ marginRight: '4px' }} /> Tail
                    </button>
                    {(problem.id === 'singly-ll' || problem.id === 'doubly-ll' || problem.id === 'circular-ll' || problem.id === 'circular-doubly-ll' ) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid var(--card-border)', paddingLeft: '8px' }}>
                        <button className="btn btn-primary btn-sm" style={{ background: '#9ca3af', borderColor: '#9ca3af' }} onClick={() => {
                          const gen = problem.id === 'doubly-ll' ? LLGenerators.doublyLLDelete : 
                                      (problem.id === 'circular-ll' ? LLGenerators.circularLLDelete : 
                                      (problem.id === 'circular-doubly-ll' ? LLGenerators.circularDoublyLLDelete : 
                                      LLGenerators.singlyLLDelete));
                          runLLAction((v, i) => gen(v, { ...i, action: 'value' }));
                        }}>
                          Value {llValue}
                        </button>
                      </div>
                    )}
                 </div>
               )}

               {/* Reset Button */}
               {(method === 'search' || method === 'delete' || method === 'insert') && (
                 <button className="btn btn-secondary btn-sm" onClick={handleResetLL} title="Reset to Original List" style={{ padding: '0.25rem 0.5rem' }}>
                   <RotateCcw size={14} />
                 </button>
               )}
             </div>
          ) : categoryId === 'stack' ? (
            <div className="visualizer-controls">
              {/* Value input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Value:</span>
                <input
                  type="number"
                  value={inputs.val}
                  onChange={e => handleInputChange('val', e.target.value)}
                  style={{ width: '80px' }}
                />
              </div>

              {/* PUSH */}
              <button
                className="btn btn-primary"
                onClick={() => runStackAction(stackPush, 'push')}
              >
                <Plus size={16} /> Push
              </button>

              {/* POP */}
              <button
                className="btn"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                onClick={() => runStackAction(stackPop, 'pop')}
              >
                <Trash2 size={16} /> Pop
              </button>

              {/* TOP / PEEK */}
              <button
                className="btn"
                onClick={() => runStackAction(stackTop, 'top')}
              >
                <Search size={16} /> Top
              </button>

              {/* CLEAR */}
              <button
                className="btn"
                title="Clear Stack"
                onClick={() => {
                  setStackItems([]);
                  setSteps([{ description: 'Stack cleared. Ready for operations.', line: null, stack: { items: [], type: 'stack', operation: null } }]);
                  setCurrentStepIndex(0);
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : categoryId === 'queue' ? (
            <div className="visualizer-controls">
              {/* Value input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Value:</span>
                <input
                  type="number"
                  value={inputs.val}
                  onChange={e => handleInputChange('val', e.target.value)}
                  style={{ width: '80px' }}
                />
              </div>

              {/* ENQUEUE */}
              <button
                className="btn btn-primary"
                onClick={() => runQueueAction(queueEnqueue, 'enqueue')}
              >
                <Plus size={16} /> Enqueue
              </button>

              {/* DEQUEUE */}
              <button
                className="btn"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                onClick={() => runQueueAction(queueDequeue, 'dequeue')}
              >
                <Trash2 size={16} /> Dequeue
              </button>

              {/* FRONT */}
              <button
                className="btn"
                onClick={() => runQueueAction(queueFront, 'front')}
              >
                <Search size={16} /> Front
              </button>

              {/* CLEAR */}
              <button
                className="btn"
                title="Clear Queue"
                onClick={() => {
                  setQueueItems([]);
                  setSteps([{ description: 'Queue cleared. Ready for operations.', line: null, queue: { items: [], type: 'queue', operation: null } }]);
                  setCurrentStepIndex(0);
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : categoryId === 'bst' ? (
            <div className="visualizer-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Value:</span>
                <input
                  type="number"
                  value={inputs.val ?? ''}
                  onChange={e => handleInputChange('val', e.target.value)}
                  style={{ width: '80px' }}
                />
              </div>

              {method === 'operations' && (
                <>
                  <button className="btn btn-primary" onClick={() => runBstAction(bstInsert, 'insert')}>
                    <Plus size={16} /> Push
                  </button>
                  <button className="btn" onClick={() => runBstAction(bstPreorder, 'preorder')}>
                    Preorder
                  </button>
                  <button className="btn" onClick={() => runBstAction(bstInorder, 'inorder')}>
                    Inorder
                  </button>
                  <button className="btn" onClick={() => runBstAction(bstPostorder, 'postorder')}>
                    Postorder
                  </button>
                </>
              )}

              {method === 'search' && (
                <button className="btn btn-primary" onClick={() => runBstAction(bstSearch, 'search')}>
                  <Search size={16} /> Search
                </button>
              )}

              {method === 'delete' && (
                <button className="btn" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => runBstAction(bstDelete, 'delete')}>
                  <Trash2 size={16} /> Delete
                </button>
              )}

              <button
                className="btn"
                title="Reset Tree"
                onClick={() => {
                  const initialTree = (method === 'search' || method === 'delete') ? (categoryId === 'bst' ? DEFAULT_BST_TREE : DEFAULT_BT_TREE) : null;
                  setBstTree(initialTree);
                  setBstTraversal(null);
                  setSteps([{ description: initialTree ? 'Tree reset to default.' : 'Tree cleared.', tree: initialTree, bstState: initialTree, bstTraversal: null, activeNode: null }]);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : categoryId === 'binary-tree' ? (
            <div className="visualizer-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Value:</span>
                <input
                  type="number"
                  value={inputs.val ?? ''}
                  onChange={e => handleInputChange('val', e.target.value)}
                  style={{ width: '80px' }}
                />
              </div>

              {method === 'operations' && (
                <>
                  <button className="btn btn-primary" onClick={() => runBstAction(btInsert, 'insert')}>
                    <Plus size={16} /> Push
                  </button>
                  <button className="btn" onClick={() => runBstAction(btPreorder, 'preorder')}>
                    Preorder
                  </button>
                  <button className="btn" onClick={() => runBstAction(btInorder, 'inorder')}>
                    Inorder
                  </button>
                  <button className="btn" onClick={() => runBstAction(btPostorder, 'postorder')}>
                    Postorder
                  </button>
                </>
              )}

              {method === 'search' && (
                <button className="btn btn-primary" onClick={() => runBstAction(btSearch, 'search')}>
                  <Search size={16} /> Search
                </button>
              )}

              <button
                className="btn"
                title="Reset Tree"
                onClick={() => {
                  btReset();
                  const initialTree = method === 'search' ? DEFAULT_BT_TREE : null;
                  setBstTree(initialTree);
                  setBstTraversal(null);
                  setSteps([{ description: initialTree ? 'Binary Tree reset to default.' : 'Binary Tree cleared.', tree: initialTree, bstState: initialTree, bstTraversal: null, activeNode: null }]);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : categoryId === 'heap' ? (
            <div className="visualizer-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Value:</span>
                <input
                  type="number"
                  value={inputs.val ?? ''}
                  onChange={e => handleInputChange('val', e.target.value)}
                  style={{ width: '80px' }}
                />
              </div>

              <button className="btn btn-primary" onClick={() => runHeapAction(questionId === 'max-heap' ? maxHeapInsert : minHeapInsert, 'insert')}>
                <Plus size={16} /> Insert
              </button>

              <button className="btn" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => runHeapAction(questionId === 'max-heap' ? maxHeapDelete : minHeapDelete, 'delete')}>
                <Trash2 size={16} /> Delete Root
              </button>

              <button className="btn" style={{ background: 'var(--primary-color)', color: 'white' }} onClick={() => runHeapAction(heapSort, 'sort')}>
                Heap Sort
              </button>

              <button
                className="btn"
                title="Clear Heap"
                onClick={() => {
                  setHeapItems([]);
                  setSteps([{ description: 'Heap cleared.', heap: [], activeIndices: [] }]);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : categoryId === 'graph' ? (
            <div className="visualizer-controls">
              {/* Mode Buttons */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--accent)', padding: '3px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                {[
                  { id: 'select', label: 'Select', icon: <MousePointer2 size={14}/> },
                  { id: 'addNode', label: 'Add Node', icon: <Plus size={14}/> },
                  { id: 'addEdge', label: 'Add Edge', icon: <EdgeIcon size={14}/> },
                ].map(m => (
                  <button
                    key={m.id}
                    className="btn btn-sm"
                    onClick={() => { setGraphMode(m.id); setEdgeSource(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '4px 10px', fontSize: '0.78rem',
                      background: graphMode === m.id ? 'var(--primary-color)' : 'transparent',
                      color: graphMode === m.id ? 'white' : 'var(--text-muted)',
                      border: 'none', borderRadius: '6px', fontWeight: 600
                    }}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              {/* Edge source hint */}
              {graphMode === 'addEdge' && edgeSource !== null && (
                <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                  Click target node for node {edgeSource}
                </span>
              )}

              {/* Delete Node */}
              <button
                className="btn"
                style={{ borderColor: 'var(--error)', color: 'var(--error)', fontSize: '0.8rem' }}
                onClick={() => {
                  if (graphNodes.length > 0) {
                    const lastId = graphNodes[graphNodes.length - 1].id;
                    setGraphNodes(prev => prev.filter(n => n.id !== lastId));
                    setGraphEdges(prev => prev.filter(e => e.source !== lastId && e.target !== lastId));
                  }
                }}
                title="Remove last node"
              >
                <Trash2 size={14}/> Node
              </button>

              <div style={{ width: '1px', height: '24px', background: 'var(--card-border)' }} />

              <button className="btn btn-primary" onClick={runGraphAction}>
                <Play size={14}/> Start {questionId.toUpperCase()}
              </button>

              <button className="btn" title="Reset Graph"
                onClick={() => {
                  setGraphNodes([
                    { id: 1, x: 100, y: 100, label: '1' },
                    { id: 2, x: 300, y: 100, label: '2' },
                    { id: 3, x: 100, y: 300, label: '3' },
                    { id: 4, x: 300, y: 300, label: '4' }
                  ]);
                  setGraphEdges([
                    { source: 1, target: 2 }, { source: 1, target: 3 },
                    { source: 2, target: 4 }, { source: 3, target: 4 }
                  ]);
                  setSteps([]);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                  setEdgeSource(null);
                }}
              >
                <RotateCcw size={14}/>
              </button>
            </div>
          ) : (
            problem?.inputs.map(inp => (
              <div key={inp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>{inp.label}:</label>
                <input 
                  type={inp.type}
                  value={inputs[inp.id]} 
                  onChange={e => handleInputChange(inp.id, e.target.value)}
                  min={inp.min} max={inp.max}
                  style={{ 
                    background: 'var(--accent)', border: '1px solid var(--card-border)', 
                    padding: '4px 8px', borderRadius: '6px', width: inp.type === 'number' ? '60px' : '120px', fontSize: '0.9rem'
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="visualizer-main">
        <div className="panel" style={{ flex: 0.8 }}>
          <div className="panel-header">
            <Code size={14} style={{ marginRight: '6px' }} />
            Code Execution
          </div>
          
          <div className="code-view">
            {codeLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`code-line ${stepState.line === idx + 1 ? 'active' : ''}`}
                style={{ 
                  paddingLeft: '1rem', 
                  borderLeft: stepState.line === idx + 1 ? '3px solid var(--primary-color)' : '3px solid transparent',
                  background: stepState.line === idx + 1 ? 'var(--accent)' : 'transparent',
                  whiteSpace: 'pre'
                }}
              >
                {line || ' '}
              </div>
            ))}
          </div>
          
          {error && <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', fontSize: '0.75rem' }}>{error}</div>}

          <div style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', background: 'var(--accent)', display: 'flex', gap: '0.75rem' }}>
            <Info size={18} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.4 }}>
              <strong style={{ fontFamily: 'Outfit', color: 'var(--primary-color)' }}>Step {currentStepIndex + 1}:</strong> {stepState.description || "Initializing..."}
            </p>
          </div>
        </div>

        <div className="panel" style={{ flex: 2.2 }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} style={{ marginRight: '6px' }} />
              Visualization
            </div>
            
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-color)', padding: '2px', borderRadius: '8px', border: '1px solid var(--card-border)', textTransform: 'none', letterSpacing: 'normal' }}>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                title="Zoom Out"
                style={{ padding: '4px', height: '28px', border: 'none', background: 'transparent' }}
              >
                <ZoomOut size={16} />
              </button>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(1)}
                title="Reset Zoom"
                style={{ fontSize: '0.75rem', padding: '0 6px', height: '28px', border: 'none', background: 'transparent', fontWeight: 800, color: 'var(--primary-color)' }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button 
                className="btn btn-sm" 
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                title="Zoom In"
                style={{ padding: '4px', height: '28px', border: 'none', background: 'transparent' }}
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Input Highlighting for DP */}
          {(categoryId === 'dp' && stepState.highlightInputs && Object.keys(stepState.highlightInputs).length > 0) && (
            <div style={{ 
              padding: '0.6rem 1rem', 
              background: 'var(--card-bg)', 
              borderBottom: '1px solid var(--card-border)', 
              display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={12} style={{ color: 'var(--primary-color)' }} />
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Current Inputs</span>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                {questionId === 'knapsack' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>WT:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {inputs.wt?.split(',').map((w, idx) => (
                          <div key={idx} style={{ 
                            padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px',
                            background: stepState.highlightInputs?.wt === idx ? 'var(--primary-color)' : 'var(--accent)',
                            color: stepState.highlightInputs?.wt === idx ? 'white' : 'var(--text-color)',
                            border: '1px solid var(--card-border)',
                            fontWeight: stepState.highlightInputs?.wt === idx ? 'bold' : 'normal',
                            boxShadow: stepState.highlightInputs?.wt === idx ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>{w}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VAL:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {inputs.val?.split(',').map((v, idx) => (
                          <div key={idx} style={{ 
                            padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px',
                            background: stepState.highlightInputs?.val === idx ? 'var(--primary-color)' : 'var(--accent)',
                            color: stepState.highlightInputs?.val === idx ? 'white' : 'var(--text-color)',
                            border: '1px solid var(--card-border)',
                            fontWeight: stepState.highlightInputs?.val === idx ? 'bold' : 'normal',
                            boxShadow: stepState.highlightInputs?.val === idx ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>{v}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {questionId === 'lcs' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STR1:</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {inputs.strX?.split('').map((char, idx) => (
                          <div key={idx} style={{ 
                            width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', borderRadius: '4px',
                            background: stepState.highlightInputs?.strX === idx ? 'var(--primary-color)' : 'var(--accent)',
                            color: stepState.highlightInputs?.strX === idx ? 'white' : 'var(--text-color)',
                            border: '1px solid var(--card-border)',
                            fontWeight: stepState.highlightInputs?.strX === idx ? 'bold' : 'normal',
                            boxShadow: stepState.highlightInputs?.strX === idx ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>{char}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STR2:</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {inputs.strY?.split('').map((char, idx) => (
                          <div key={idx} style={{ 
                            width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', borderRadius: '4px',
                            background: stepState.highlightInputs?.strY === idx ? 'var(--primary-color)' : 'var(--accent)',
                            color: stepState.highlightInputs?.strY === idx ? 'white' : 'var(--text-color)',
                            border: '1px solid var(--card-border)',
                            fontWeight: stepState.highlightInputs?.strY === idx ? 'bold' : 'normal',
                            boxShadow: stepState.highlightInputs?.strY === idx ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>{char}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="state-view" style={{ position: 'relative', overflow: 'auto' }}>
            <div style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
              {stepState.recursionTree && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem', overflow: 'auto' }}>
                  <TreeRenderer tree={stepState.recursionTree} />
                </div>
              )}
              {stepState.knapsackState && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem', overflowY: 'auto' }}>
                  <KnapsackRenderer data={stepState.knapsackState} />
                </div>
              )}
              {stepState.sortState && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem', overflowX: 'auto' }}>
                  <ArrayRenderer data={stepState.sortState} />
                </div>
              )}
              {stepState.stack && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                  {stackLastOp && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      margin: '1rem auto 0', padding: '8px 20px',
                      background: stackLastOp.bg, border: `1.5px solid ${stackLastOp.color}`,
                      borderRadius: '30px', fontWeight: 700, fontSize: '1rem',
                      color: stackLastOp.color, letterSpacing: '0.01em',
                      boxShadow: `0 4px 14px ${stackLastOp.bg}`
                    }}>
                      {stackLastOp.type === 'push' && '✅ '}
                      {stackLastOp.type === 'pop'  && '🗑️ '}
                      {stackLastOp.type === 'top'  && '👁 '}
                      {stackLastOp.label}
                    </div>
                  )}
                  <StackRenderer data={stepState.stack} />
                </div>
              )}
              {stepState.queue && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                  {queueLastOp && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      margin: '1rem auto 0', padding: '8px 20px',
                      background: queueLastOp.bg, border: `1.5px solid ${queueLastOp.color}`,
                      borderRadius: '30px', fontWeight: 700, fontSize: '1rem',
                      color: queueLastOp.color, letterSpacing: '0.01em',
                      boxShadow: `0 4px 14px ${queueLastOp.bg}`
                    }}>
                      {queueLastOp.type === 'enqueue' && '✅ '}
                      {queueLastOp.type === 'dequeue' && '🗑️ '}
                      {queueLastOp.type === 'front'   && '👁 '}
                      {queueLastOp.label}
                    </div>
                  )}
                  <QueueRenderer data={stepState.queue} />
                </div>
              )}
              {stepState.bstState !== undefined && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                  {stepState.bstTraversal && (
                     <div style={{ margin: '1rem', padding: '0.5rem 1.5rem', background: 'var(--accent)', border: '2px solid var(--primary-color)', borderRadius: '12px', fontWeight: 'bold', boxShadow: 'var(--shadow-md)', color: 'var(--text-color)' }}>
                       <span style={{ color: 'var(--primary-color)', marginRight: '8px' }}>{stepState.bstTraversal.type.toUpperCase()}:</span>
                       {stepState.bstTraversal.result.length > 0 ? stepState.bstTraversal.result.join(' → ') : 'Empty'}
                     </div>
                  )}
                  <BstRenderer root={stepState.bstState} activeNodeId={stepState.activeNode} />
                </div>
              )}
              {stepState.hashingState && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem', overflowY: 'auto', gap: '2rem' }}>
                  <div style={{ width: '100%' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Input Numbers</h4>
                    <ArrayRenderer data={{ 
                      array: stepState.hashingState.nums, 
                      activeIndices: stepState.hashingState.activeIndex !== -1 ? [stepState.hashingState.activeIndex] : [],
                      sortedIndices: stepState.hashingState.foundIndices
                    }} />
                  </div>
                  
                  <div style={{ width: '100%', borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Hash Map (Value → Index)</h4>
                    <HashMapRenderer data={stepState.hashingState.map} />
                  </div>

                  {stepState.hashingState.complement !== undefined && stepState.hashingState.foundIndices.length === 0 && (
                    <div style={{ 
                      background: 'var(--accent)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary-color)',
                      fontFamily: 'Outfit', fontWeight: 'bold', display: 'flex', gap: '1rem', alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target: {stepState.hashingState.target}</span>
                      <span style={{ color: 'var(--primary-color)' }}>Seeking Complement: {stepState.hashingState.complement}</span>
                    </div>
                  )}
                </div>
              )}
              {stepState.heap !== undefined && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem' }}>
                  <HeapRenderer items={stepState.heap} activeIndices={stepState.activeIndices} sortedIndices={stepState.sortedIndices} />
                </div>
              )}
              {categoryId === 'graph' && (
                <GraphRenderer
                  nodes={graphNodes}
                  edges={graphEdges}
                  stepState={stepState}
                  graphMode={graphMode}
                  edgeSource={edgeSource}
                  startNodeId={startNodeId}
                  onCanvasClick={handleGraphClick}
                  onNodeClick={handleNodeClick}
                  questionId={questionId}
                />
              )}
            </div>
            
            {stepState.memo && Object.keys(stepState.memo).length > 0 && (
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)', maxWidth: '200px', zIndex: 10 }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Cache</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {Object.entries(stepState.memo).map(([k, v]) => (
                    <div key={k} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--accent)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-color)' }}>
                      {k}:{v}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--card-border)', background: 'var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Time Complexity</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>{methodConfig?.timeComplexity || 'O(??)'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Space Complexity</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>{methodConfig?.spaceComplexity || 'O(??)'}</span>
              </div>
            </div>
            
            {/* Variable Watch Panel */}
            {(stepState.variables || stepState.activeIndex !== undefined || stepState.active2D) && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '4px 12px', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>VARS:</span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   {stepState.activeIndex !== undefined && (
                     <div style={{ fontSize: '0.8rem' }}>
                       <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>i</span>: {stepState.activeIndex}
                     </div>
                   )}
                   {stepState.active2D && (
                     <>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>r</span>: {stepState.active2D.r}
                        </div>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>c</span>: {stepState.active2D.c}
                        </div>
                     </>
                   )}
                   {stepState.variables && Object.entries(stepState.variables).map(([name, val]) => (
                     <div key={name} style={{ fontSize: '0.8rem' }}>
                       <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{name}</span>: {val}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {categoryId !== 'stack' && categoryId !== 'queue' && (
        <div className="visualizer-controls">
          {(categoryId !== 'linked-list' && categoryId !== 'bst' && categoryId !== 'heap') && (
            <>
              <button className="btn" onClick={handlePrev} disabled={currentStepIndex === 0}>
                <SkipBack size={18} />
              </button>
              <button className="btn btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="btn" onClick={handleNext} disabled={currentStepIndex >= steps.length - 1}>
                <SkipForward size={18} />
              </button>
            </>
          )}
          {(categoryId === 'bst' || categoryId === 'heap') && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button className="btn btn-sm" onClick={handlePrev} disabled={currentStepIndex === 0}>
                   <SkipBack size={14} style={{ marginRight: '2px' }} /> Prev
                 </button>
                 <button className="btn btn-sm" onClick={handleNext} disabled={currentStepIndex >= steps.length - 1}>
                   Next <SkipForward size={14} style={{ marginLeft: '2px' }} />
                 </button>
               </div>
            </div>
          )}
          {(categoryId === 'linked-list') && (
             <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm" onClick={handlePrev} disabled={currentStepIndex === 0}>
                    <SkipBack size={14} style={{ marginRight: '2px' }} /> Prev
                  </button>
                  <button className="btn btn-sm" onClick={handleNext} disabled={currentStepIndex >= steps.length - 1}>
                    Next <SkipForward size={14} style={{ marginLeft: '2px' }} />
                  </button>
                </div>
                <div style={{ height: '4px', background: 'var(--accent)', flex: 1, borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', background: 'var(--primary-color)', width: `${(currentStepIndex+1)/steps.length * 100}%`, transition: 'width 0.3s' }}></div>
                </div>
             </div>
          )}
          {categoryId !== 'bst' && categoryId !== 'heap' && (
            <>
              <div style={{ borderLeft: '1px solid var(--card-border)', height: '24px', margin: '0 0.5rem' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </>
          )}
          {(categoryId === 'bst' || categoryId === 'heap') && (
            <>
              <div style={{ borderLeft: '1px solid var(--card-border)', height: '24px', margin: '0 0.5rem' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Step {Math.max(1, currentStepIndex + 1)} of {Math.max(1, steps.length)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Simple Tree Renderer using basic CSS absolute positioning based on a simple layout algorithm
function TreeRenderer({ tree }) {
  if (!tree || tree.nodes.length === 0) return <div>No tree logic running...</div>;
  
  // Basic tree layout logic: assigns depth and horizontal position based on children
  // A robust layout algorithm is needed, but for simplicity we'll do a basic map
  
  // Calculate depth
  const depths = {};
  const root = tree.nodes.find(n => !tree.edges.some(e => e.target === n.id));
  if (!root) return null;
  
  const attachDepths = (nodeId, d) => {
    depths[nodeId] = d;
    const children = tree.edges.filter(e => e.source === nodeId).map(e => e.target);
    children.forEach(c => attachDepths(c, d + 1));
  };
  attachDepths(root.id, 0);

  // Layout horizontally (very naive for binary tree of fib)
  const xPos = {};
  const orderPositions = (nodeId, minX, maxX) => {
    xPos[nodeId] = (minX + maxX) / 2;
    const children = tree.edges.filter(e => e.source === nodeId).map(e => e.target);
    if (children.length === 1) {
      orderPositions(children[0], minX, maxX);
    } else if (children.length === 2) {
      orderPositions(children[0], minX, xPos[nodeId]);
      orderPositions(children[1], xPos[nodeId], maxX);
    }
  };
  orderPositions(root.id, 0, 800);

  return (
    <svg width="100%" height="100%" style={{ minHeight: '400px' }} viewBox="0 0 800 500">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#cccccc" />
        </marker>
      </defs>
      
      {/* Draw Edges */}
      {tree.edges.map((edge, i) => {
        const source = tree.nodes.find(n => n.id === edge.source);
        const target = tree.nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        const sx = xPos[source.id], sy = depths[source.id] * 80 + 40;
        const tx = xPos[target.id], ty = depths[target.id] * 80 + 40;
        return <line key={i} x1={sx} y1={sy + 35} x2={tx} y2={ty - 35} stroke="#cccccc" strokeWidth="2" markerEnd="url(#arrow)" />;
      })}
      
      {/* Draw Nodes */}
      {tree.nodes.map(node => {
        const cx = xPos[node.id];
        const cy = depths[node.id] * 80 + 40;
        const isActive = node.active;

        return (
          <g key={node.id}>
            <circle 
              cx={cx} cy={cy} r="35" 
              fill="none" 
              stroke={isActive ? "var(--primary-color)" : "#cccccc"} 
              strokeWidth={isActive ? "3" : "2"} 
            />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="12px" fill="var(--text-color)" fontWeight={isActive ? "700" : "400"}>
              {node.label}
            </text>
            {node.result !== null && (
              <text x={cx + 40} y={cy - 15} style={{ fill: 'var(--success)', fontSize: '11px', fontWeight: 'bold' }}>
                ={node.result}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TableRenderer({ table, active, read, table2D, active2D, read2D }) {
  if (table2D) {
    const rowCount = table2D.length;
    const colCount = table2D[0]?.length || 0;

    return (
      <div style={{ padding: '1.5rem', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {/* Column Headers */}
        <div style={{ display: 'flex', gap: '0.25rem', paddingLeft: '40px', marginBottom: '4px' }}>
          {Array.from({ length: colCount }).map((_, cIdx) => (
            <div key={cIdx} style={{ 
              width: '36px', textAlign: 'center', fontSize: '10px', 
              color: active2D?.c === cIdx ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: active2D?.c === cIdx ? 'bold' : 'normal'
            }}>
              [{cIdx}]
            </div>
          ))}
        </div>

        {table2D.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginBottom: '2px' }}>
            {/* Row Header */}
            <div style={{ 
              width: '36px', textAlign: 'right', fontSize: '10px', marginRight: '4px',
              color: active2D?.r === rIdx ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: active2D?.r === rIdx ? 'bold' : 'normal'
            }}>
              [{rIdx}]
            </div>
            
            {row.map((val, cIdx) => {
              let borderStyle = '1px solid var(--card-border)';
              let textColor = 'var(--text-color)';
              let background = 'transparent';
              
              if (active2D && active2D.r === rIdx && active2D.c === cIdx) {
                borderStyle = '2px solid var(--primary-color)';
                textColor = 'var(--primary-color)';
                background = 'rgba(59, 130, 246, 0.1)';
              } else if (read2D && read2D.some(pos => pos.r === rIdx && pos.c === cIdx)) {
                borderStyle = '2px solid var(--success)';
                textColor = 'var(--success)';
              }
              
              return (
                <div key={cIdx} style={{
                  width: '36px', height: '36px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: background, border: borderStyle, borderRadius: '4px',
                  fontSize: '14px', fontWeight: 'bold', color: textColor
                }} title={`[${rIdx}][${cIdx}]`}>
                  {val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (!table) return null;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1.5rem', alignItems: 'flex-end' }}>
      {table.map((val, idx) => {
        let borderStyle = '1px solid var(--card-border)';
        let textColor = 'var(--text-color)';
        let background = 'transparent';
        
        if (idx === active) {
          borderStyle = '2px solid var(--primary-color)';
          textColor = 'var(--primary-color)';
          background = 'rgba(59, 130, 246, 0.1)';
        } else if (read && read.includes(idx)) {
          borderStyle = '2px solid var(--success)';
          textColor = 'var(--success)';
        }
        
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '10px', 
              color: idx === active ? 'var(--primary-color)' : 'var(--text-muted)',
              marginBottom: '4px',
              fontWeight: idx === active ? 'bold' : 'normal'
            }}>
              [{idx}]
            </span>
            <div style={{
              width: '44px', height: '44px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: background, border: borderStyle, borderRadius: '6px',
              fontSize: '18px', fontWeight: 'bold', color: textColor
            }}>
              {val}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function LinkedListRenderer({ data }) {
  if (!data || !data.nodes) return null;
  const { nodes, activeId, foundId, headId, type } = data;

  // 1. Calculate Logical Order and Positions
  const orderedNodes = [];
  const visited = new Set();
  let currId = headId;

  while (currId !== null && !visited.has(currId)) {
    const node = nodes.find(n => n.id === currId);
    if (!node) break;
    orderedNodes.push(node);
    visited.add(currId);
    currId = node.next;
    // Circular check: if next is head, we stop after adding all but before looping
    if (currId === headId) break;
  }

  // Handle unlinked nodes (e.g., during insertion/deletion steps)
  nodes.forEach(n => {
    if (!visited.has(n.id)) orderedNodes.push(n);
  });

  const nodeWidth = 70;
  const nodeHeight = 35;
  const horizontalGap = 50;

  return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', overflowX: 'auto' }}>
      <svg width={Math.max(800, orderedNodes.length * 160)} height="300" viewBox={`0 0 ${Math.max(800, orderedNodes.length * 160)} 300`}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary-color)" />
          </marker>
        </defs>

        {orderedNodes.map((node, i) => {
          const x = 50 + i * (nodeWidth + horizontalGap);
          const y = 80;
          const isActive = node.id === activeId;
          const isFound = node.id === foundId;
          const isHead = node.id === headId;

          // Find the target node's position for arrows
          const getPos = (id) => {
            const idx = orderedNodes.findIndex(n => n.id === id);
            if (idx === -1) return null;
            return { x: 50 + idx * (nodeWidth + horizontalGap), y: 80 };
          };

          const targetPos = node.next ? getPos(node.next) : null;
          const prevPos = ((type === 'doubly' || type === 'circular-doubly') && node.prev) ? getPos(node.prev) : null;

          return (
            <g key={node.id}>
              {/* Forward Pointer Arrow */}
              {node.next && targetPos && (
                <>
                  {/* Handle normal forward link */}
                  {targetPos.x > x ? (
                    <line 
                      x1={x + nodeWidth} y1={y + 15} x2={targetPos.x} y2={y + 15} 
                      stroke={isActive ? "var(--primary-color)" : "#666"} strokeWidth="2" 
                      markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    />
                  ) : (
                    /* Handle circular loop back */
                    <path 
                      d={`M ${x + nodeWidth} ${y + 20} C ${x + 120} ${y + 20}, ${x + 120} ${y + 80}, ${x / 2} ${y + 80} S ${targetPos.x} ${y + 60}, ${targetPos.x} ${y + 40}`}
                      fill="none" stroke="#666" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)"
                    />
                  )}
                </>
              )}

              {/* Backward Pointer Arrow (Doubly) */}
              {(type === 'doubly' || type === 'circular-doubly') && node.prev && prevPos && (
                <>
                  {prevPos.x < x ? (
                    <line 
                      x1={x} y1={y + 25} x2={prevPos.x + nodeWidth} y2={y + 25} 
                      stroke="#888" strokeWidth="2" markerEnd="url(#arrowhead)"
                    />
                  ) : (
                    /* Handle circular PREV loop back (Head to Tail) */
                    <path 
                      d={`M ${x} ${y + 10} C ${x - 40} ${y + 10}, ${x - 40} ${y - 40}, ${prevPos.x + nodeWidth/2} ${y - 40} S ${prevPos.x + nodeWidth/2} ${y - 10}, ${prevPos.x + nodeWidth} ${y + 10}`}
                      fill="none" stroke="#888" strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#arrowhead)"
                    />
                  )}
                </>
              )}

              {/* Node Rect */}
              <rect 
                x={x} y={y} width={nodeWidth} height={nodeHeight} rx="8" 
                fill="var(--card-bg)" 
                stroke={isFound ? "var(--success)" : (isActive ? "var(--primary-color)" : "var(--card-border)")} 
                strokeWidth={isActive || isFound ? "3" : "2"}
                style={{ transition: 'all 0.3s ease' }}
              />
              <text x={x + nodeWidth/2} y={y + nodeHeight/2} textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fill="var(--text-color)" fontSize="14">
                {node.val}
              </text>
              {isHead && (
                <text x={x + nodeWidth/2} y={y - 12} textAnchor="middle" fontSize="10px" fill="var(--primary-color)" fontWeight="800">HEAD</text>
              )}
               {!visited.has(node.id) && (
                <text x={x + nodeWidth/2} y={y + 55} textAnchor="middle" fontSize="10px" fill="#9ca3af" fontWeight="bold">NEW NODE</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StackRenderer({ data }) {
  if (!data || !data.items) return null;
  const { items, activeIndex, error, operation, highlight, poppedVal } = data;

  // Professional color mapping using Indigo for primary and theme semantic colors
  const activeColors = {
    push:    { border: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)',   text: 'var(--success)' },
    pop:     { border: 'var(--error)',   bg: 'rgba(239, 68, 68, 0.1)',     text: 'var(--error)' },
    top:     { border: 'var(--primary-color)', bg: 'var(--accent)',  text: 'var(--primary-color)' },
    default: { border: 'var(--primary-color)', bg: 'var(--accent)',  text: 'var(--primary-color)' }
  };
  
  const currentColors = highlight ? (activeColors[highlight] || activeColors.default) : activeColors.default;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minHeight: '360px' }}>
      <div style={{
        fontFamily: 'Outfit', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px'
      }}>— TOP —</div>

      <div style={{
        display: 'flex', flexDirection: 'column-reverse', gap: '8px',
        padding: '12px 16px', border: '2px solid var(--card-border)', borderTop: 'none',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', background: 'var(--accent)',
        minWidth: '180px', minHeight: '220px', position: 'relative',
        boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)'
      }}>
        {items.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500'
          }}>
            Stack is Empty
          </div>
        )}

        {items.map((val, idx) => {
          const isTopElem  = idx === items.length - 1;
          const isActive   = idx === activeIndex;

          let bg = 'var(--card-bg)';
          let borderColor = 'var(--card-border)';
          let textColor = 'var(--text-color)';

          if (isActive) {
            bg          = currentColors.bg;
            borderColor = currentColors.border;
            textColor   = currentColors.text;
          }

          return (
            <div key={idx} style={{
              height: '42px', minWidth: '130px',
              background: bg,
              color: textColor,
              border: `2px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '1rem', position: 'relative',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {val}

              {isTopElem && (
                <div style={{
                  position: 'absolute', right: '-65px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: isActive ? currentColors.bg : 'var(--bg-color)',
                  border: `1px solid ${isActive ? currentColors.border : 'var(--card-border)'}`,
                  borderRadius: '20px', padding: '2px 10px',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 800,
                    color: isActive ? currentColors.text : 'var(--text-muted)',
                    letterSpacing: '0.05em', fontFamily: 'Outfit'
                  }}>
                    {highlight === 'popping' ? 'POP' : highlight === 'peek' ? 'PEEK' : 'TOP'}
                  </span>
                </div>
              )}

              <div style={{
                position: 'absolute', left: '-36px',
                fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600,
                fontFamily: 'Fira Code'
              }}>[{idx}]</div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: 'Outfit', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '8px'
      }}>— BOTTOM —</div>

      {poppedVal !== undefined && (
        <div style={{
          marginTop: '1.5rem', fontWeight: 700, fontSize: '1rem',
          padding: '8px 18px',
          background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-lg)',
          fontFamily: 'Outfit'
        }}>
          Popped: {poppedVal}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '1.5rem', color: 'var(--error)', fontWeight: 700,
          fontSize: '0.9rem', padding: '8px 18px',
          background: 'var(--bg-color)',
          border: `2px solid var(--error)`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)'
        }}>
          ⚠ {items.length >= 10 ? 'Stack Overflow!' : 'Stack Underflow!'}
        </div>
      )}
    </div>
  );
}

function QueueRenderer({ data }) {
  if (!data || !data.items) return null;
  const { items, activeIndex, error, operation, highlight, dequeuedVal } = data;

  const activeColors = {
    enqueue: { border: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)',   text: 'var(--success)' },
    dequeue: { border: 'var(--error)',   bg: 'rgba(239, 68, 68, 0.1)',     text: 'var(--error)' },
    front:   { border: 'var(--primary-color)', bg: 'var(--accent)',  text: 'var(--primary-color)' },
    default: { border: 'var(--primary-color)', bg: 'var(--accent)',  text: 'var(--primary-color)' }
  };
  
  const currentColors = highlight ? (activeColors[highlight] || activeColors.default) : activeColors.default;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '28px 20px', borderTop: '2px solid var(--card-border)', borderBottom: '2px solid var(--card-border)',
        background: 'var(--accent)', minHeight: '120px', width: '100%', maxWidth: '1000px',
        overflowX: 'auto', position: 'relative', gap: '10px', borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{
          position: 'absolute', top: '8px', left: '24px', fontSize: '0.7rem',
          fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', fontFamily: 'Outfit'
        }}>← FRONT (DEQUEUE)</div>

        <div style={{
          position: 'absolute', top: '8px', right: '24px', fontSize: '0.7rem',
          fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', fontFamily: 'Outfit'
        }}>REAR (ENQUEUE) ←</div>

        {items.length === 0 && (
          <div style={{
            width: '100%', textAlign: 'center', color: 'var(--text-muted)',
            fontSize: '1rem', fontWeight: '500', margin: 'auto'
          }}>
            Queue is Empty
          </div>
        )}

        {items.map((val, idx) => {
          const isFront = idx === 0;
          const isRear  = idx === items.length - 1;
          const isActive = idx === activeIndex;

          let bg = 'var(--card-bg)';
          let borderColor = 'var(--card-border)';
          let textColor = 'var(--text-color)';

          if (isActive) {
            bg = currentColors.bg;
            borderColor = currentColors.border;
            textColor = currentColors.text;
          }

          return (
            <div key={idx} style={{
              minWidth: '50px', height: '50px',
              background: bg, color: textColor,
              border: `2px solid ${borderColor}`, borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '1.1rem', position: 'relative',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', flexShrink: 0
            }}>
              {val}
              
              <div style={{
                position: 'absolute', bottom: '-28px', fontSize: '0.7rem',
                color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'Fira Code'
              }}>[{idx}]</div>

              {(isFront || isRear) && (
                <div style={{
                  position: 'absolute', top: '-20px',
                  display: 'flex', alignItems: 'center',
                  background: isActive ? currentColors.bg : 'var(--bg-color)',
                  border: `1px solid ${isActive ? currentColors.border : 'var(--card-border)'}`,
                  borderRadius: '12px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800,
                  color: isActive ? currentColors.text : 'var(--text-muted)', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap', fontFamily: 'Outfit', boxShadow: 'var(--card-shadow)'
                }}>
                  {isFront && 'FRONT'}
                  {isFront && isRear && ' / '}
                  {isRear && 'REAR'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {dequeuedVal !== undefined && (
        <div style={{
          marginTop: '3rem', fontWeight: 700, fontSize: '1rem',
          padding: '8px 20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)',
          border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-lg)',
          fontFamily: 'Outfit'
        }}>
          Dequeued: {dequeuedVal}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '3rem', color: 'var(--error)', fontWeight: 700,
          fontSize: '0.9rem', padding: '8px 20px', background: 'var(--bg-color)',
          border: `2px solid var(--error)`, borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)'
        }}>
          ⚠ {items.length >= 10 ? 'Queue Overflow!' : 'Queue Underflow!'}
        </div>
      )}
    </div>
  );
}

function BstRenderer({ root, activeNodeId }) {
  if (!root) return <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'Outfit', fontWeight: '600' }}>Tree is empty</div>;
  
  const nodeRadius = 22;
  const levelHeight = 60;
  
  const getTreeDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };
  
  const depth = getTreeDepth(root);
  const width = Math.max(800, Math.pow(2, Math.max(0, depth - 1)) * 40 + 200);
  const height = Math.max(350, depth * levelHeight + 100);

  const nodes = [];
  const edges = [];

  const traverse = (node, d, x, horizontalSpacing, parentX, parentY) => {
    if (!node) return;
    const y = d * levelHeight + 60;
    
    if (parentX !== null && parentY !== null) {
       edges.push({ x1: parentX, y1: parentY + nodeRadius, x2: x, y2: y - nodeRadius });
    }
    
    nodes.push({ id: node.id, val: node.val, x, y, active: node.active });
    
    if (node.left) traverse(node.left, d + 1, x - horizontalSpacing, Math.max(30, horizontalSpacing / 1.7), x, y);
    if (node.right) traverse(node.right, d + 1, x + horizontalSpacing, Math.max(30, horizontalSpacing / 1.7), x, y);
  };
  
  traverse(root, 0, width / 2, width / 4, null, null);

  return (
    <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {edges.map((e, idx) => (
           <line key={`edge-${idx}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="var(--card-border)" strokeWidth="2.5" />
        ))}
        {nodes.map(n => {
           const isActive = n.id === activeNodeId || n.active;
           return (
             <g key={n.id}>
               <circle 
                 cx={n.x} cy={n.y} r={nodeRadius} 
                 fill={isActive ? 'var(--accent)' : 'var(--card-bg)'}
                 stroke={isActive ? 'var(--primary-color)' : 'var(--card-border)'} 
                 strokeWidth={isActive ? "4" : "2.5"} 
                 style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
               />
               <text 
                 x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" 
                 fill={isActive ? 'var(--primary-color)' : 'var(--text-color)'} 
                 fontWeight="700" fontSize="16px" fontFamily="Inter"
               >
                 {n.val}
               </text>
             </g>
           );
        })}
      </svg>
    </div>
  );
}

function HeapRenderer({ items, activeIndices = [], sortedIndices = [] }) {
  if (!items || items.length === 0) return <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'Outfit', fontWeight: '600' }}>Heap is empty</div>;

  const nodeRadius = 22;
  const levelHeight = 60;
  
  const depth = Math.floor(Math.log2(items.length)) + 1;
  const width = Math.max(800, Math.pow(2, Math.max(0, depth - 1)) * 40 + 200);
  const height = Math.max(350, depth * levelHeight + 150);

  const getPos = (i) => {
    const d = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, d) - 1;
    const posInLevel = i - levelStart;
    const nodesInLevel = Math.pow(2, d);
    const spacing = width / nodesInLevel;
    const x = spacing * posInLevel + spacing / 2;
    const y = d * levelHeight + 60;
    return { x, y };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* Tree View */}
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {items.map((_, i) => {
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            const p = getPos(i);
            const edges = [];
            if (left < items.length) {
              const l = getPos(left);
              edges.push(<line key={`e-l-${i}`} x1={p.x} y1={p.y + nodeRadius} x2={l.x} y2={l.y - nodeRadius} stroke="var(--card-border)" strokeWidth="2.5" />);
            }
            if (right < items.length) {
              const r = getPos(right);
              edges.push(<line key={`e-r-${i}`} x1={p.x} y1={p.y + nodeRadius} x2={r.x} y2={r.y - nodeRadius} stroke="var(--card-border)" strokeWidth="2.5" />);
            }
            return edges;
          })}
          {items.map((val, i) => {
            const pos = getPos(i);
            const isActive = activeIndices.includes(i);
            const isSorted = sortedIndices.includes(i);
            return (
              <g key={`node-${i}`}>
                <circle 
                  cx={pos.x} cy={pos.y} r={nodeRadius} 
                  fill={isActive ? 'var(--primary-color)' : (isSorted ? 'var(--success)' : 'var(--card-bg)')}
                  stroke={isActive ? 'var(--primary-color)' : 'var(--card-border)'} 
                  strokeWidth="2.5" 
                  style={{ transition: 'all 0.3s ease' }}
                />
                <text 
                  x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" 
                  fill={isActive || isSorted ? 'white' : 'var(--text-color)'} 
                  fontWeight="700" fontSize="14px"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sorted View - specifically for Heap Sort feedback */}
      {sortedIndices.length > 0 && (
        <div style={{ 
          marginTop: '1.5rem', padding: '1.25rem', background: 'var(--accent)', 
          borderRadius: '16px', border: '1px solid var(--card-border)', width: 'auto',
          minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
            <Activity size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sorted Result</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {sortedIndices.slice().reverse().map((idx) => (
              <div key={idx} style={{
                padding: '6px 12px', background: 'var(--success)', color: 'white',
                borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)',
                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                {items[idx]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GraphRenderer({ nodes, edges, stepState, graphMode, edgeSource, startNodeId, onCanvasClick, onNodeClick, questionId }) {
  const NODE_RADIUS = 26;
  const svgWidth = 600;
  const svgHeight = 340;

  const visited = new Set(stepState?.visited || []);
  const currentNode = stepState?.currentNode;
  const activeNeighbor = stepState?.activeNeighbor;
  const traversalOrder = stepState?.traversalOrder || [];
  const bfsQueue = stepState?.queue || [];
  const dfsStack = stepState?.stack || [];

  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return '#f97316';
    if (nodeId === activeNeighbor) return '#a855f7';
    if (visited.has(nodeId)) return '#22c55e';
    if (nodeId === startNodeId && graphMode === 'select') return '#6366f1';
    return null;
  };

  const modeLabel = {
    select: '🖱 Click a node to set start. Then press Start BFS/DFS.',
    addNode: '➕ Click on the canvas to add a node.',
    addEdge: edgeSource ? `🔗 Now click the target node (from ${edgeSource})` : '🔗 Click the first node to start an edge.',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '0.6rem', padding: '0.5rem 0.25rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 500, minHeight: '1.1em' }}>
        {modeLabel[graphMode]}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: 0 }}>
        {/* SVG Canvas */}
        <div
          onClick={onCanvasClick}
          style={{
            flex: 1, position: 'relative',
            background: 'var(--accent)', borderRadius: '12px',
            border: `2px solid ${graphMode === 'addNode' ? '#22c55e' : graphMode === 'addEdge' ? '#a855f7' : 'var(--card-border)'}`,
            cursor: graphMode === 'addNode' ? 'crosshair' : 'default',
            overflow: 'hidden', minHeight: '200px'
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ position: 'absolute', inset: 0 }}>
            {edges.map((e, i) => {
              const src = nodeMap[e.source];
              const tgt = nodeMap[e.target];
              if (!src || !tgt) return null;
              const isActive =
                (e.source === currentNode && e.target === activeNeighbor) ||
                (e.target === currentNode && e.source === activeNeighbor);
              return (
                <line key={i}
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={isActive ? '#f97316' : 'var(--card-border)'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={isActive ? '6 3' : 'none'}
                  style={{ transition: 'stroke 0.3s' }}
                />
              );
            })}
            {nodes.map(node => {
              const color = getNodeColor(node.id);
              const isEdgeSrc = node.id === edgeSource;
              return (
                <g key={node.id} onClick={ev => { ev.stopPropagation(); onNodeClick(node.id); }} style={{ cursor: 'pointer' }}>
                  {isEdgeSrc && (
                    <circle cx={node.x} cy={node.y} r={NODE_RADIUS + 6} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 3" />
                  )}
                  <circle
                    cx={node.x} cy={node.y} r={NODE_RADIUS}
                    fill={color || 'var(--card-bg)'}
                    stroke={color || 'var(--primary-color)'}
                    strokeWidth="2.5"
                    style={{ transition: 'fill 0.3s ease, stroke 0.3s ease', filter: color ? `drop-shadow(0 0 6px ${color}88)` : 'none' }}
                  />
                  <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle"
                    fill={color ? 'white' : 'var(--text-color)'}
                    fontWeight="700" fontSize="14px" style={{ userSelect: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* BFS Queue / DFS Stack sidebar */}
        <div style={{
          width: '130px', display: 'flex', flexDirection: 'column', gap: '0.4rem',
          background: 'var(--card-bg)', borderRadius: '10px',
          border: '1px solid var(--card-border)', padding: '0.6rem', overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-color)', marginBottom: '4px' }}>
            {questionId === 'bfs' ? '📋 Queue' : '📚 Stack'}
          </div>
          {(questionId === 'bfs' ? bfsQueue : dfsStack).length === 0 ? (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>empty</div>
          ) : (
            [...(questionId === 'bfs' ? bfsQueue : dfsStack)].reverse().map((nodeId, i, arr) => (
              <div key={i} style={{
                padding: '4px 8px', borderRadius: '6px',
                background: i === 0 ? 'var(--primary-color)' : 'var(--accent)',
                color: i === 0 ? 'white' : 'var(--text-color)',
                fontWeight: 700, fontSize: '0.82rem', textAlign: 'center',
                border: '1px solid var(--card-border)',
                transition: 'all 0.2s ease'
              }}>
                {nodeId}
                {i === 0 && <span style={{ fontSize: '0.6rem', marginLeft: '4px', opacity: 0.8 }}>{questionId === 'bfs' ? '← front' : '← top'}</span>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { color: '#6366f1', label: 'Start' },
          { color: '#f97316', label: 'Current' },
          { color: '#a855f7', label: 'Neighbor' },
          { color: '#22c55e', label: 'Visited' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Traversal order */}
      {traversalOrder.length > 0 && (
        <div style={{
          display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap',
          padding: '6px 10px', background: 'var(--accent)', borderRadius: '8px',
          border: '1px solid var(--card-border)'
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: '4px' }}>Order:</span>
          {traversalOrder.map((nodeId, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{
                padding: '2px 9px', borderRadius: '20px',
                background: nodeId === currentNode ? '#f97316' : '#22c55e',
                color: 'white', fontWeight: 700, fontSize: '0.8rem',
                boxShadow: `0 2px 4px ${nodeId === currentNode ? '#f9731633' : '#22c55e33'}`
              }}>{nodeId}</span>
              {i < traversalOrder.length - 1 && <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>→</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function KnapsackRenderer({ data }) {
  if (!data) return null;
  const { items, capacity, currentWeight, totalValue } = data;

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '0 auto' }}>
      
      {/* Knapsack Bag Summary */}
      <div style={{ 
        background: 'var(--card-bg)', borderRadius: '12px', padding: '1.25rem', 
        border: '2px solid var(--card-border)', boxShadow: 'var(--shadow-md)',
        display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎒 Knapsack 
          </h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)' }}>
            Total Value: <span style={{ fontSize: '1.1rem' }}>{totalValue.toFixed(2)}</span>
          </span>
        </div>

        {/* Capacity Bar */}
        <div style={{ width: '100%', height: '24px', background: 'var(--accent)', borderRadius: '12px', border: '1px solid var(--card-border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ 
            position: 'absolute', top: 0, left: 0, height: '100%', 
            background: 'var(--primary-color)',
            width: `${Math.min(100, (currentWeight / capacity) * 100)}%`,
            transition: 'width 0.4s ease-out'
          }}></div>
          <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: currentWeight > capacity / 2 ? 'white' : 'var(--text-color)', zIndex: 1, textShadow: currentWeight > capacity / 2 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>
            {currentWeight.toFixed(2)} / {capacity} Weight
          </div>
        </div>
      </div>

      {/* Available Items List */}
      <div>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items Inventory (Sorted by Ratio)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => {
             const borderCol = item.isActive ? 'var(--primary-color)' : 'var(--card-border)';
             const bgCol = item.isActive ? 'rgba(59, 130, 246, 0.1)' : (item.status === 'taken' || item.status === 'fractional' ? 'rgba(34, 197, 94, 0.05)' : 'var(--card-bg)');
             
             let statusBadge = null;
             if (item.status === 'evaluating') statusBadge = <span style={{ fontSize: '0.7rem', color: 'white', background: 'var(--primary-color)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EVALUATING</span>;
             else if (item.status === 'taken') statusBadge = <span style={{ fontSize: '0.7rem', color: 'white', background: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>TAKEN (100%)</span>;
             else if (item.status === 'fractional') statusBadge = <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>FRACTION ({ (item.taken * 100).toFixed(0) }%)</span>;
             else if (item.status === 'skipped') statusBadge = <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--accent)', border: '1px solid var(--card-border)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SKIPPED</span>;

             return (
              <div key={item.id} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: bgCol,
                border: `2px solid ${borderCol}`, borderRadius: '8px',
                transition: 'all 0.2s',
                boxShadow: item.isActive ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Weight</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Fira Code, monospace' }}>{item.weight}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Value</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Fira Code, monospace', color: 'var(--success)' }}>{item.value}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px', opacity: 0.8 }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ratio</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Fira Code, monospace' }}>{item.ratio.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', minWidth: '100px', justifyContent: 'flex-end' }}>
                  {statusBadge}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HashMapRenderer({ data }) {
  if (!data) return null;
  const entries = Object.entries(data);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', padding: '1rem' }}>
      {entries.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>HashMap is empty</div>
      ) : (
        entries.map(([key, val]) => (
          <div key={key} style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'var(--card-bg)', border: '2px solid var(--primary-color)',
            borderRadius: '12px', padding: '0.5rem 1rem', minWidth: '80px',
            boxShadow: 'var(--shadow-sm)', animation: 'popIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Key</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '8px' }}>{key}</div>
            <div style={{ height: '1px', width: '100%', background: 'var(--card-border)', marginBottom: '8px' }}></div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Index</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{val}</div>
          </div>
        ))
      )}
    </div>
  );
}

function ArrayRenderer({ data }) {
  if (!data || !data.array) return null;
  const { array, activeIndices = [], mergingIndices = [], sortedIndices = [], pivotIndex = -1 } = data;

  return (
    <div style={{ 
      display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', 
      alignItems: 'end', minHeight: '150px', padding: '2rem 1rem', width: '100%' 
    }}>
      {array.map((val, idx) => {
        const isActive = activeIndices.includes(idx);
        const isMerging = mergingIndices.includes(idx);
        const isSorted = sortedIndices.includes(idx);
        const isPivot = pivotIndex === idx;

        let bgCol = 'var(--card-bg)';
        let borderCol = 'var(--card-border)';
        let fontCol = 'var(--text-color)';
        let label = '';
        let transform = 'translateY(0)';

        if (isPivot) {
          bgCol = 'var(--danger)'; 
          borderCol = 'var(--danger)';
          fontCol = 'white';
          label = 'PIVOT';
          transform = 'translateY(-10px)';
        } else if (isActive) {
          bgCol = 'var(--primary-color)';
          borderCol = 'var(--primary-color)';
          fontCol = 'white';
          transform = 'translateY(-10px)';
        } else if (isMerging) {
          bgCol = '#eab308'; // yellow
          borderCol = '#ca8a04';
          fontCol = '#fff';
        } else if (isSorted) {
          bgCol = 'var(--success)';
          borderCol = 'var(--success)';
          fontCol = 'white';
        }

        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {label && <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: bgCol, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>}
            <div style={{ 
              width: '60px', height: '60px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: bgCol, color: fontCol, border: `2px solid ${borderCol}`,
              borderRadius: '12px', fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'Fira Code, monospace',
              boxShadow: isActive || isPivot ? '0 8px 16px rgba(0,0,0,0.15)' : 'var(--shadow-sm)',
              transform: transform,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {val}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[{idx}]</span>
          </div>
        );
      })}
    </div>
  );
}
