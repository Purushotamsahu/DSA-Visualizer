export const fibCodeDocs = {
  recursion: `int fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
  memoization: `int fib(int n, vector<int>& memo) {
  if (memo[n] != -1) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}`,
  tabulation: `int fib(int n) {
  if (n == 0) return 0;
  vector<int> dp(n + 1, 0);
  dp[1] = 1;
  for (int i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`
};

// Helper to generate unique IDs for tree nodes
let nodeIdCounter = 0;
const getId = () => `node-${nodeIdCounter++}`;

export function* fibRecursion(n) {
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  
  function* helper(n, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `fib(${n})`, active: true, result: null };
    tree.nodes.push(node);
    
    if (parentId) {
      tree.edges.push({ source: parentId, target: currentId });
    }
    
    // Highlight function execution start
    yield { line: 1, tree: structuredClone(tree), description: `Evaluating fib(${n})` };
    
    // Highlight base case check
    yield { line: 2, tree: structuredClone(tree), description: `Checking base case n <= 1` };
    if (n <= 1) {
      node.result = n;
      node.active = false;
      yield { line: 2, tree: structuredClone(tree), description: `Base case met. Returning ${n}` };
      return n;
    }
    
    // Highlight recursive calls line
    yield { line: 3, tree: structuredClone(tree), description: `Calling fib(${n - 1}) and fib(${n - 2})` };
    
    const left = yield* helper(n - 1, currentId);
    
    // Back to current frame after left returns
    node.active = true;
    yield { line: 3, tree: structuredClone(tree), description: `fib(${n - 1}) returned ${left}. Now calling fib(${n - 2})` };
    
    const right = yield* helper(n - 2, currentId);
    
    // Compute result
    node.active = true;
    node.result = left + right;
    yield { line: 3, tree: structuredClone(tree), description: `fib(${n - 2}) returned ${right}. Returning ${left} + ${right}` };
    
    node.active = false;
    return node.result;
  }
  
  yield* helper(n);
  // Final state
  tree.nodes.forEach(n => n.active = false);
  yield { line: null, tree, description: "Execution finished!" };
}

export function* fibMemoization(n) {
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  const memo = {};
  
  function* helper(n, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `fib(${n})`, active: true, result: null, isMemoHit: false };
    tree.nodes.push(node);
    
    if (parentId) {
      tree.edges.push({ source: parentId, target: currentId });
    }
    
    yield { line: 1, tree: structuredClone(tree), memo: structuredClone(memo), description: `Evaluating fib(${n})` };
    
    yield { line: 2, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking if n in memo` };
    if (n in memo) {
      node.isMemoHit = true;
      node.result = memo[n];
      node.active = false;
      yield { line: 2, tree: structuredClone(tree), memo: structuredClone(memo), description: `Cache hit! Returning memo[${n}] = ${memo[n]}` };
      return memo[n];
    }
    
    yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking base case n <= 1` };
    if (n <= 1) {
      node.result = n;
      node.active = false;
      yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Base case met. Returning ${n}` };
      return n;
    }
    
    yield { line: 4, tree: structuredClone(tree), memo: structuredClone(memo), description: `Calling fib(${n - 1}) and fib(${n - 2})` };
    
    const left = yield* helper(n - 1, currentId);
    node.active = true;
    yield { line: 4, tree: structuredClone(tree), memo: structuredClone(memo), description: `fib(${n - 1}) returned ${left}. Now calling fib(${n - 2})` };
    
    const right = yield* helper(n - 2, currentId);
    node.active = true;
    
    memo[n] = left + right;
    node.result = memo[n];
    yield { line: 4, tree: structuredClone(tree), memo: structuredClone(memo), description: `fib(${n - 2}) returned ${right}. Caching memo[${n}] = ${memo[n]}` };
    
    yield { line: 5, tree: structuredClone(tree), memo: structuredClone(memo), description: `Returning ${memo[n]}` };
    node.active = false;
    return memo[n];
  }
  
  yield* helper(n);
  tree.nodes.forEach(n => n.active = false);
  yield { line: null, tree, memo, description: "Execution finished!" };
}

export function* fibTabulation(n) {
  yield { line: 1, table: [], description: `Evaluating fib(${n})` };
  
  yield { line: 2, table: [], description: `Base case check: n === 0` };
  if (n === 0) {
    yield { line: 2, table: [], description: `Returning 0` };
    return 0;
  }
  
  const dp = new Array(n + 1).fill(0);
  yield { line: 3, table: [...dp], description: `Created dp array of size ${n + 1}`, activeIndex: null };
  
  dp[1] = 1;
  yield { line: 4, table: [...dp], description: `Set base case dp[1] = 1`, activeIndex: 1, readIndices: [] };
  
  for (let i = 2; i <= n; i++) {
    yield { line: 5, table: [...dp], description: `Looping i = ${i}`, activeIndex: i, readIndices: [] };
    
    dp[i] = dp[i - 1] + dp[i - 2];
    yield { line: 6, table: [...dp], description: `Calculated dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`, activeIndex: i, readIndices: [i - 1, i - 2] };
  }
  
  yield { line: 8, table: [...dp], description: `Returning final answer dp[${n}] = ${dp[n]}`, activeIndex: n, readIndices: [] };
}
