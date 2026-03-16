export const knapsackCodeDocs = {
  recursion: `int knapSack(int W, int wt[], int val[], int n) {
  if (n == 0 || W == 0) return 0;
  if (wt[n - 1] > W)
    return knapSack(W, wt, val, n - 1);
  return max(
    val[n - 1] + knapSack(W - wt[n - 1], wt, val, n - 1),
    knapSack(W, wt, val, n - 1)
  );
}`,
  memoization: `int knapSack(int W, int wt[], int val[], int n, vector<vector<int>>& memo) {
  // key mapped to memo[n][W]
  if (memo[n][W] != -1) return memo[n][W];
  if (n == 0 || W == 0) return 0;
  if (wt[n - 1] > W) {
    memo[n][W] = knapSack(W, wt, val, n - 1, memo);
    return memo[n][W];
  }
  memo[n][W] = max(
    val[n - 1] + knapSack(W - wt[n - 1], wt, val, n - 1, memo),
    knapSack(W, wt, val, n - 1, memo)
  );
  return memo[n][W];
}`,
  tabulation: `int knapSack(int W, int wt[], int val[], int n) {
  vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
  for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = max(
          val[i - 1] + dp[i - 1][w - wt[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`
};

let nodeIdCounter = 0;
const getId = () => `node-${nodeIdCounter++}`;

export function* knapsackRecursion(W_input, inputs) {
  const W = Math.min(Number(W_input) || 5, 10);
  const wt = (inputs?.wt || '1,2,3').split(',').map(s => Number(s.trim()));
  const val = (inputs?.val || '60,100,120').split(',').map(s => Number(s.trim()));
  const n = wt.length;
  
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  
  function* helper(currW, currN, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `KS(${currW}, ${currN})`, active: true, result: null };
    tree.nodes.push(node);
    if (parentId) tree.edges.push({ source: parentId, target: currentId });
    
    yield { line: 1, tree: structuredClone(tree), description: `Evaluating KS(W:${currW}, n:${currN})`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    
    yield { line: 2, tree: structuredClone(tree), description: `Checking base case (n===0 or W===0)`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    if (currN === 0 || currW === 0) {
      node.result = 0;
      node.active = false;
      yield { line: 2, tree: structuredClone(tree), description: `Base case met. Returning 0`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      return 0;
    }
    
    yield { line: 3, tree: structuredClone(tree), description: `Checking if wt[${currN-1}] > W (${wt[currN-1]} > ${currW})`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    if (wt[currN - 1] > currW) {
      yield { line: 4, tree: structuredClone(tree), description: `Item is too heavy. Skipping.`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      const res = yield* helper(currW, currN - 1, currentId);
      node.active = true;
      node.result = res;
      yield { line: 4, tree: structuredClone(tree), description: `Returned ${res}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      node.active = false;
      return res;
    }
    
    yield { line: 5, tree: structuredClone(tree), description: `Item can fit. Exploring Include & Exclude branches.`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    
    // Include
    yield { line: 6, tree: structuredClone(tree), description: `Including item ${currN} (val: ${val[currN-1]}, wt: ${wt[currN-1]})`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    const inc = yield* helper(currW - wt[currN - 1], currN - 1, currentId);
    node.active = true;
    
    // Exclude
    yield { line: 7, tree: structuredClone(tree), description: `Excluding item ${currN}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    const exc = yield* helper(currW, currN - 1, currentId);
    node.active = true;
    
    node.result = Math.max(val[currN - 1] + inc, exc);
    yield { line: 5, tree: structuredClone(tree), description: `Max(Include: ${val[currN - 1] + inc}, Exclude: ${exc}) = ${node.result}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    
    node.active = false;
    return node.result;
  }
  
  yield* helper(W, n);
  tree.nodes.forEach(no => no.active = false);
  yield { line: null, tree, description: "Finished execution!", highlightInputs: {} };
}

export function* knapsackMemoization(W_input, inputs) {
  const W = Math.min(Number(W_input) || 5, 10); 
  const wt = (inputs?.wt || '1,2,3').split(',').map(s => Number(s.trim()));
  const val = (inputs?.val || '60,100,120').split(',').map(s => Number(s.trim()));
  const n = wt.length;
  
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  const memo = {};
  
  function* helper(currW, currN, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `KS(${currW}, ${currN})`, active: true, result: null, isMemoHit: false };
    tree.nodes.push(node);
    if (parentId) tree.edges.push({ source: parentId, target: currentId });
    
    yield { line: 1, tree: structuredClone(tree), memo: structuredClone(memo), description: `Evaluating KS(W:${currW}, n:${currN})`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    
    const key = currN + ',' + currW;
    yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking if '${key}' is in memo`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    if (key in memo) {
      node.isMemoHit = true;
      node.result = memo[key];
      node.active = false;
      yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Cache hit! Returning ${memo[key]}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      return memo[key];
    }
    
    yield { line: 4, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking base case`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    if (currN === 0 || currW === 0) return 0;
    
    yield { line: 5, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking if wt > W`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    if (wt[currN - 1] > currW) {
      yield { line: 6, tree: structuredClone(tree), memo: structuredClone(memo), description: `Too heavy, skipping.`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      const res = yield* helper(currW, currN - 1, currentId);
      node.active = true;
      memo[key] = res;
      node.result = res;
      yield { line: 6, tree: structuredClone(tree), memo: structuredClone(memo), description: `Caching memo['${key}'] = ${res}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
      node.active = false;
      return res;
    }
    
    yield { line: 9, tree: structuredClone(tree), memo: structuredClone(memo), description: `Branching Include/Exclude`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    const inc = yield* helper(currW - wt[currN - 1], currN - 1, currentId);
    node.active = true;
    const exc = yield* helper(currW, currN - 1, currentId);
    node.active = true;
    
    memo[key] = Math.max(val[currN - 1] + inc, exc);
    node.result = memo[key];
    yield { line: 9, tree: structuredClone(tree), memo: structuredClone(memo), description: `Caching memo['${key}'] = ${memo[key]}`, highlightInputs: { wt: currN - 1, val: currN - 1 } };
    
    node.active = false;
    return memo[key];
  }
  
  yield* helper(W, n);
  tree.nodes.forEach(no => no.active = false);
  yield { line: null, tree, memo, description: "Finished execution!", highlightInputs: {} };
}

export function* knapsackTabulation(W_input, inputs) {
  const W = Math.min(Number(W_input) || 5, 15); 
  const wt = (inputs?.wt || '1,2,3').split(',').map(s => Number(s.trim()));
  const val = (inputs?.val || '60,100,120').split(',').map(s => Number(s.trim()));
  const n = wt.length;
  
  // For 2D visualization we can map it to a 1D array of strings or create a specific 2D table format limit.
  // Visualizer expects table: [] of strings. We'll flatten the 2D array to show it, or just use nested.
  // To keep it compatible with existing TableRenderer, let's yield flattened strings or adjust TableRenderer.
  // Actually, we can yield table as strings "dp[i][j]: val" for the current row, or full 2D.
  // Let's pass the active cell as `{row: i, col: w}` but table as 2D array.
  
  const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
  
  yield { line: 1, table2D: structuredClone(dp), description: `Evaluating Knapsack W=${W}, n=${n} (Items: wt=[1,2,3], val=[60,100,120])`, highlightInputs: {} };
  yield { line: 2, table2D: structuredClone(dp), description: `Initialized (n+1)x(W+1) DP matrix with 0s`, highlightInputs: {} };
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      yield { line: 4, table2D: structuredClone(dp), active2D: {r: i, c: w}, description: `Checking item i=${i} (wt:${wt[i-1]}, val:${val[i-1]}) at capacity w=${w}`, highlightInputs: { wt: i - 1, val: i - 1 } };
      
      yield { line: 5, table2D: structuredClone(dp), active2D: {r: i, c: w}, description: `Is item weight ${wt[i-1]} <= capacity ${w}?`, highlightInputs: { wt: i - 1, val: i - 1 } };
      
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(
          val[i - 1] + dp[i - 1][w - wt[i - 1]],
          dp[i - 1][w]
        );
        yield { line: 6, table2D: structuredClone(dp), active2D: {r: i, c: w}, read2D: [{r: i-1, c: w - wt[i-1]}, {r: i-1, c: w}], description: `Yes. Max( Include(${val[i-1]} + dp[${i-1}][${w - wt[i-1]}]), Exclude(dp[${i-1}][${w}]) ) = ${dp[i][w]}`, highlightInputs: { wt: i - 1, val: i - 1 } };
      } else {
        dp[i][w] = dp[i - 1][w];
        yield { line: 11, table2D: structuredClone(dp), active2D: {r: i, c: w}, read2D: [{r: i-1, c: w}], description: `No. Inherit value from above: dp[${i-1}][${w}] = ${dp[i][w]}`, highlightInputs: { wt: i - 1, val: i - 1 } };
      }
    }
  }
  yield { line: 15, table2D: structuredClone(dp), active2D: {r: n, c: W}, description: `Finished iterating. Returning dp[${n}][${W}] = ${dp[n][W]}`, highlightInputs: {} };
}
