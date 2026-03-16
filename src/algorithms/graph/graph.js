export const graphCodeDocs = {
  bfs: `// BFS Traversal
void bfs(int startNode, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;

    visited[startNode] = true;
    q.push(startNode);

    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        cout << curr << " ";

        for (int neighbor : adj[curr]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
  dfs: `// DFS Traversal
void dfs(int curr, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[curr] = true;
    cout << curr << " ";

    for (int neighbor : adj[curr]) {
        if (!visited[neighbor]) {
            dfs(neighbor, adj, visited);
        }
    }
}

// Initial call
vector<bool> visited(n, false);
dfs(startNode, adj, visited);`
};

export function* bfsGenerator(startNodeId, { nodes, edges }) {
  const visited = new Set();
  const queue = [startNodeId];
  const traversalOrder = [];
  const adj = {};

  // Build adjacency list
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e.target);
    adj[e.target].push(e.source); // Assuming undirected for now
  });

  visited.add(startNodeId);

  yield {
    description: `Starting BFS from node ${startNodeId}. Added to queue.`,
    currentNode: null,
    visited: Array.from(visited),
    queue: [...queue],
    traversalOrder: [...traversalOrder],
    line: 8
  };

  while (queue.length > 0) {
    const curr = queue.shift();
    traversalOrder.push(curr);

    yield {
      description: `Popped node ${curr} from queue. Visiting neighbors...`,
      currentNode: curr,
      visited: Array.from(visited),
      queue: [...queue],
      traversalOrder: [...traversalOrder],
      line: 12
    };

    for (const neighbor of adj[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        yield {
          description: `Neighbor ${neighbor} not visited. Marking visited and adding to queue.`,
          currentNode: curr,
          activeNeighbor: neighbor,
          visited: Array.from(visited),
          queue: [...queue],
          traversalOrder: [...traversalOrder],
          line: 18
        };
      } else {
        yield {
          description: `Neighbor ${neighbor} already visited. Skipping.`,
          currentNode: curr,
          activeNeighbor: neighbor,
          visited: Array.from(visited),
          queue: [...queue],
          traversalOrder: [...traversalOrder],
          line: 17
        };
      }
    }
  }

  yield {
    description: "BFS Traversal Complete.",
    currentNode: null,
    visited: Array.from(visited),
    queue: [],
    traversalOrder: [...traversalOrder],
    line: 23
  };
}

export function* dfsGenerator(startNodeId, { nodes, edges }) {
  const visited = new Set();
  const stack = [startNodeId];
  const traversalOrder = [];
  const adj = {};

  // Build adjacency list
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push(e.target);
    adj[e.target].push(e.source); // Assuming undirected
  });

  yield {
    description: `Starting DFS from node ${startNodeId}.`,
    currentNode: null,
    visited: [],
    stack: [...stack],
    traversalOrder: [],
    line: 13
  };

  // Explicit stack for better visualization
  while (stack.length > 0) {
    const curr = stack.pop();

    if (!visited.has(curr)) {
      visited.add(curr);
      traversalOrder.push(curr);

      yield {
        description: `Visiting node ${curr}.`,
        currentNode: curr,
        visited: Array.from(visited),
        stack: [...stack],
        traversalOrder: [...traversalOrder],
        line: 3
      };

      // To visit in a predictable order (like children in code), we reverse neighbors
      const neighbors = [...adj[curr]].reverse();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          yield {
            description: `Edge to ${neighbor} found. Adding to stack.`,
            currentNode: curr,
            activeNeighbor: neighbor,
            visited: Array.from(visited),
            stack: [...stack],
            traversalOrder: [...traversalOrder],
            line: 7
          };
        }
      }
    }
  }

  yield {
    description: "DFS Traversal Complete.",
    currentNode: null,
    visited: Array.from(visited),
    stack: [],
    traversalOrder: [...traversalOrder],
    line: 15
  };
}
