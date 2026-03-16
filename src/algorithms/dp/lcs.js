export const lcsCodeDocs = {
  recursion: `int lcs(string X, string Y, int m, int n) {
  if (m == 0 || n == 0) return 0;
  if (X[m - 1] == Y[n - 1]) {
    return 1 + lcs(X, Y, m - 1, n - 1);
  } else {
    return max(
      lcs(X, Y, m, n - 1),
      lcs(X, Y, m - 1, n)
    );
  }
}`,
  memoization: `int lcs(string X, string Y, int m, int n, vector<vector<int>>& memo) {
  // key mapped to memo[m][n]
  if (memo[m][n] != -1) return memo[m][n];
  if (m == 0 || n == 0) return 0;
  
  if (X[m - 1] == Y[n - 1]) {
    memo[m][n] = 1 + lcs(X, Y, m - 1, n - 1, memo);
    return memo[m][n];
  }
  
  memo[m][n] = max(
    lcs(X, Y, m, n - 1, memo),
    lcs(X, Y, m - 1, n, memo)
  );
  return memo[m][n];
}`,
  tabulation: `int lcs(string X, string Y) {
  int m = X.length(), n = Y.length();
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
  
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (X[i - 1] == Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`
};

let nodeIdCounter = 0;
const getId = () => `node-${nodeIdCounter++}`;

export function* lcsRecursion(_, inputs) {
  const X = inputs?.strX || "AGGTAB";
  const Y = inputs?.strY || "GXTXAYB";
  const limit = 8;
  // Just take substrings to keep tree small
  const strX = X.substring(0, limit);
  const strY = Y.substring(0, limit);
  
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  
  function* helper(m, n, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `LCS(${m},${n})`, active: true, result: null };
    tree.nodes.push(node);
    if (parentId) tree.edges.push({ source: parentId, target: currentId });
    
    yield { line: 1, tree: structuredClone(tree), description: `Evaluating LCS(m:${m}, n:${n}) for "${strX.substring(0,m)}" and "${strY.substring(0,n)}"`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    
    yield { line: 2, tree: structuredClone(tree), description: `Base case check`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    if (m === 0 || n === 0) {
      node.result = 0; node.active = false;
      yield { line: 2, tree: structuredClone(tree), description: `Base case met. Return 0.`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      return 0;
    }
    
    yield { line: 3, tree: structuredClone(tree), description: `Do last chars match? '${strX[m-1]}' === '${strY[n-1]}'?`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    if (strX[m - 1] === strY[n - 1]) {
      yield { line: 4, tree: structuredClone(tree), description: `Match! Adding 1 to LCS(${m-1}, ${n-1})`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      const res = yield* helper(m - 1, n - 1, currentId);
      node.active = true;
      node.result = 1 + res;
      yield { line: 4, tree: structuredClone(tree), description: `Returned 1 + ${res} = ${node.result}`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      node.active = false;
      return node.result;
    } else {
      yield { line: 6, tree: structuredClone(tree), description: `No match. Branching to LCS(${m},${n-1}) and LCS(${m-1},${n})`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      const left = yield* helper(m, n - 1, currentId);
      node.active = true;
      const right = yield* helper(m - 1, n, currentId);
      node.active = true;
      
      node.result = Math.max(left, right);
      yield { line: 6, tree: structuredClone(tree), description: `Max(${left}, ${right}) = ${node.result}`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      node.active = false;
      return node.result;
    }
  }
  
  yield* helper(strX.length, strY.length);
  tree.nodes.forEach(no => no.active = false);
  yield { line: null, tree, description: "Finished execution!", highlightInputs: {} };
}

export function* lcsMemoization(_, inputs) {
  const X = inputs?.strX || "AGGTAB";
  const Y = inputs?.strY || "GXTXAYB";
  const limit = 10;
  const strX = X.substring(0, limit);
  const strY = Y.substring(0, limit);
  
  nodeIdCounter = 0;
  const tree = { nodes: [], edges: [] };
  const memo = {};
  
  function* helper(m, n, parentId = null) {
    const currentId = getId();
    const node = { id: currentId, label: `LCS(${m},${n})`, active: true, result: null, isMemoHit: false };
    tree.nodes.push(node);
    if (parentId) tree.edges.push({ source: parentId, target: currentId });
    
    const key = `${m},${n}`;
    yield { line: 1, tree: structuredClone(tree), memo: structuredClone(memo), description: `Evaluating LCS(${m},${n})`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    
    yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Checking memo`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    if (key in memo) {
      node.isMemoHit = true; node.result = memo[key]; node.active = false;
      yield { line: 3, tree: structuredClone(tree), memo: structuredClone(memo), description: `Hit: returned ${memo[key]}`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      return memo[key];
    }
    
    yield { line: 4, tree: structuredClone(tree), memo: structuredClone(memo), description: `Base case`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    if (m === 0 || n === 0) return 0;
    
    yield { line: 6, tree: structuredClone(tree), memo: structuredClone(memo), description: `Do last chars match? '${strX[m-1]}' === '${strY[n-1]}'?`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    if (strX[m - 1] === strY[n - 1]) {
      yield { line: 7, tree: structuredClone(tree), memo: structuredClone(memo), description: `Match! Calling 1 + LCS(${m-1},${n-1})`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      const res = yield* helper(m - 1, n - 1, currentId);
      node.active = true;
      memo[key] = 1 + res; node.result = memo[key];
      yield { line: 7, tree: structuredClone(tree), memo: structuredClone(memo), description: `Cached memo['${key}'] = ${memo[key]}`, highlightInputs: { strX: m - 1, strY: n - 1 } };
      node.active = false;
      return memo[key];
    }
    
    yield { line: 11, tree: structuredClone(tree), memo: structuredClone(memo), description: `No match. Exploring Max(LCS(), LCS())`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    const left = yield* helper(m, n - 1, currentId);
    node.active = true;
    const right = yield* helper(m - 1, n, currentId);
    node.active = true;
    
    memo[key] = Math.max(left, right); node.result = memo[key];
    yield { line: 11, tree: structuredClone(tree), memo: structuredClone(memo), description: `Cached memo['${key}'] = ${memo[key]}`, highlightInputs: { strX: m - 1, strY: n - 1 } };
    node.active = false;
    return memo[key];
  }
  
  yield* helper(strX.length, strY.length);
  tree.nodes.forEach(no => no.active = false);
  yield { line: null, tree, memo, description: "Finished execution!", highlightInputs: {} };
}

export function* lcsTabulation(_, inputs) {
  const X = inputs?.strX || "AGGTAB";
  const Y = inputs?.strY || "GXTXAYB";
  const limit = 15;
  const strX = X.substring(0, limit);
  const strY = Y.substring(0, limit);
  const m = strX.length;
  const n = strY.length;
  
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  yield { line: 2, table2D: structuredClone(dp), description: `Initialized DP Matrix of size ${m+1}x${n+1}` };
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      yield { line: 6, table2D: structuredClone(dp), active2D: {r: i, c: j}, description: `Checking chars X[${i-1}]='${strX[i-1]}' vs Y[${j-1}]='${strY[j-1]}'`, highlightInputs: { strX: i - 1, strY: j - 1 } };
      if (strX[i - 1] === strY[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        yield { line: 7, table2D: structuredClone(dp), active2D: {r: i, c: j}, read2D: [{r: i-1, c: j-1}], description: `Match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`, highlightInputs: { strX: i - 1, strY: j - 1 } };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        yield { line: 9, table2D: structuredClone(dp), active2D: {r: i, c: j}, read2D: [{r: i-1, c: j}, {r: i, c: j-1}], description: `Mismatch. Max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`, highlightInputs: { strX: i - 1, strY: j - 1 } };
      }
    }
  }
  yield { line: 13, table2D: structuredClone(dp), active2D: {r: m, c: n}, description: `Finished. LCS = ${dp[m][n]}`, highlightInputs: {} };
}
