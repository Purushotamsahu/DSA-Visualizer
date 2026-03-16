// Standard Binary Tree Generator

const cloneTree = (node) => {
    if (!node) return null;
    return {
        id: node.id,
        val: node.val,
        left: cloneTree(node.left),
        right: cloneTree(node.right)
    };
};

function getBTState(root, activeId = null, extraData = {}) {
  const rootClone = cloneTree(root);
  return {
    bstState: rootClone,
    tree: rootClone,
    activeNode: activeId,
    ...extraData
  };
}

let nextNodeId = 1000;

// 1. Level-Order Insert Generator
export function* btInsert(valStr, inputs) {
  const val = Number(valStr);
  if (isNaN(val)) return;

  let root = cloneTree(inputs.tree);

  yield {
    description: `Initializing insert for value: ${val}`,
    ...getBTState(root, null, { message: `Starting Level-Order Insert for ${val}` }),
    line: 7
  };

  const newNode = { id: `bt-node-${nextNodeId++}`, val: val, left: null, right: null };

  if (!root) {
    root = newNode;
    yield {
      description: `Tree is empty. Inserted ${val} as root.`,
      ...getBTState(root, newNode.id, { message: `Inserted ${val} as root.` }),
      line: 8
    };
    return;
  }

  const queue = [root];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    yield {
      description: `Checking node ${current.val}`,
      ...getBTState(root, current.id, { message: `Visiting node: ${current.val}` }),
      line: 12
    };

    if (!current.left) {
      current.left = newNode;
      yield {
        description: `Left child of ${current.val} is empty. Inserting ${val} here.`,
        ...getBTState(root, newNode.id, { message: `Inserted ${val} as left child of ${current.val}` }),
        line: 13
      };
      return;
    } else {
      queue.push(current.left);
    }

    if (!current.right) {
      current.right = newNode;
      yield {
        description: `Right child of ${current.val} is empty. Inserting ${val} here.`,
        ...getBTState(root, newNode.id, { message: `Inserted ${val} as right child of ${current.val}` }),
        line: 15
      };
      return;
    } else {
      queue.push(current.right);
    }
  }
}

// 2. Search Generator (BFS)
export function* btSearch(valStr, inputs) {
  const val = Number(valStr);
  if (isNaN(val)) return;

  const root = cloneTree(inputs.tree);

  if (!root) {
    yield {
      description: 'Tree is empty.',
      ...getBTState(root, null, { message: 'Binary Tree is empty.', error: true }),
      line: 30
    };
    return;
  }

  const queue = [root];
  while (queue.length > 0) {
    const current = queue.shift();

    yield {
      description: `Checking node ${current.val}`,
      ...getBTState(root, current.id, { message: `Visiting node: ${current.val}` }),
      line: 33
    };

    if (current.val === val) {
      yield {
        description: `Found value ${val}!`,
        ...getBTState(root, current.id, { message: `SUCCESS: Value ${val} found.` }),
        line: 34
      };
      return;
    }

    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }

  yield {
    description: `Value ${val} not found in the tree.`,
    ...getBTState(root, null, { message: `FAILURE: Value ${val} not found.`, error: true }),
    line: 38
  };
}

// 3. Preorder Traversal
export function* btPreorder(ignored, inputs) {
  const root = cloneTree(inputs.tree);
  const result = [];
  function* traverse(node) {
    if (!node) return;
    
    result.push(node.val);
    yield {
      description: `Visiting node ${node.val} (Root)`,
      ...getBTState(root, node.id, { bstTraversal: { type: 'preorder', result: [...result] } }),
      line: 25
    };

    yield* traverse(node.left);
    yield* traverse(node.right);
  }

  yield {
    description: "Starting Preorder Traversal (Root, Left, Right)",
    ...getBTState(root, null, { bstTraversal: { type: 'preorder', result: [] } }),
    line: 23
  };

  yield* traverse(root);
  
  yield {
    description: `Preorder Traversal Complete: ${result.join(' → ')}`,
    ...getBTState(root, null, { bstTraversal: { type: 'preorder', result: result } }),
    line: 27
  };
}

// 4. Inorder Traversal
export function* btInorder(ignored, inputs) {
  const root = cloneTree(inputs.tree);
  const result = [];
  function* traverse(node) {
    if (!node) return;
    
    yield* traverse(node.left);
    
    result.push(node.val);
    yield {
      description: `Visiting node ${node.val} (Root)`,
      ...getBTState(root, node.id, { bstTraversal: { type: 'inorder', result: [...result] } }),
      line: 32
    };

    yield* traverse(node.right);
  }

  yield {
    description: "Starting Inorder Traversal (Left, Root, Right)",
    ...getBTState(root, null, { bstTraversal: { type: 'inorder', result: [] } }),
    line: 30
  };

  yield* traverse(root);
  
  yield {
    description: `Inorder Traversal Complete: ${result.join(' → ')}`,
    ...getBTState(root, null, { bstTraversal: { type: 'inorder', result: result } }),
    line: 34
  };
}

// 5. Postorder Traversal
export function* btPostorder(ignored, inputs) {
  const root = cloneTree(inputs.tree);
  const result = [];
  function* traverse(node) {
    if (!node) return;
    
    yield* traverse(node.left);
    yield* traverse(node.right);
    
    result.push(node.val);
    yield {
      description: `Visiting node ${node.val} (Root)`,
      ...getBTState(root, node.id, { bstTraversal: { type: 'postorder', result: [...result] } }),
      line: 39
    };
  }

  yield {
    description: "Starting Postorder Traversal (Left, Right, Root)",
    ...getBTState(root, null, { bstTraversal: { type: 'postorder', result: [] } }),
    line: 37
  };

  yield* traverse(root);
  
  yield {
    description: `Postorder Traversal Complete: ${result.join(' → ')}`,
    ...getBTState(root, null, { bstTraversal: { type: 'postorder', result: result } }),
    line: 41
  };
}

export const btCombinedCode = `struct Node {
    int data;
    Node* left;
    Node* right;
};

// Level Order Insertion
void insert(Node*& root, int val) {
    if (!root) {
        root = new Node(val);
        return;
    }
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        if (!curr->left) {
            curr->left = new Node(val);
            return;
        } else q.push(curr->left);
        if (!curr->right) {
            curr->right = new Node(val);
            return;
        } else q.push(curr->right);
    }
}

// Traversals
void preorder(Node* node) {
    if (!node) return;
    cout << node->data << " ";
    preorder(node->left);
    preorder(node->right);
}

void inorder(Node* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->data << " ";
    inorder(node->right);
}

void postorder(Node* node) {
    if (!node) return;
    postorder(node->left);
    postorder(node->right);
    cout << node->data << " ";
}

// Search (BFS)
bool search(Node* root, int val) {
    if (!root) return false;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        if (curr->data == val) return true;
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
    return false;
}
`;

export function btReset() {
  nextNodeId = 1000;
}
