// src/algorithms/bst.js

export const bstCombinedCode = `
class Node {
public:
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
public:
    Node* root;

    BST() : root(nullptr) {}

    Node* insert(Node* node, int val) {
        if (!node) return new Node(val);
        if (val < node->data) {
            node->left = insert(node->left, val);
        } else if (val > node->data) {
            node->right = insert(node->right, val);
        }
        return node;
    }

    Node* search(Node* node, int val) {
        if (!node || node->data == val) return node;
        if (val < node->data) return search(node->left, val);
        return search(node->right, val);
    }

    Node* findMin(Node* node) {
        while (node->left) node = node->left;
        return node;
    }

    Node* deleteNode(Node* node, int val) {
        if (!node) return nullptr;
        if (val < node->data) {
            node->left = deleteNode(node->left, val);
        } else if (val > node->data) {
            node->right = deleteNode(node->right, val);
        } else {
            if (!node->left) {
                Node* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                Node* temp = node->left;
                delete node;
                return temp;
            }
            Node* temp = findMin(node->right);
            node->data = temp->data;
            node->right = deleteNode(node->right, temp->data);
        }
        return node;
    }

    void insertValue(int val) { root = insert(root, val); }
    void deleteValue(int val) { root = deleteNode(root, val); }
    bool searchValue(int val) { return search(root, val) != nullptr; }

    void preorder(Node* node, vector<int>& res) {
        if (!node) return;
        res.push_back(node->data);
        preorder(node->left, res);
        preorder(node->right, res);
    }

    void inorder(Node* node, vector<int>& res) {
        if (!node) return;
        inorder(node->left, res);
        res.push_back(node->data);
        inorder(node->right, res);
    }

    void postorder(Node* node, vector<int>& res) {
        if (!node) return;
        postorder(node->left, res);
        postorder(node->right, res);
        res.push_back(node->data);
    }
};
`;

// Helper to clone the tree perfectly for state
const cloneTree = (node) => {
    if (!node) return null;
    return {
        id: node.id,
        val: node.val,
        left: cloneTree(node.left),
        right: cloneTree(node.right)
    };
};

let nextNodeId = 100; // Start higher to avoid collision with predefined

export function* bstInsert(value, inputs) {
    const stateTree = inputs.tree;
    let treeCopy = cloneTree(stateTree);

    // If tree is empty, initialize root
    if (!treeCopy) {
        treeCopy = { id: `node-${nextNodeId++}`, val: value, left: null, right: null };
        yield { 
            description: `Initializing BST with root node (${value})`,
            tree: cloneTree(treeCopy),
            bstState: cloneTree(treeCopy),
            bstTraversal: null,
            line: 16
        };
        yield { 
            description: `Root node created.`,
            tree: cloneTree(treeCopy),
            bstState: cloneTree(treeCopy),
            bstTraversal: null,
            line: 19
        };
        return;
    }

    let curr = treeCopy;
    let parent = null;
    let isLeft = false;

    while (curr) {
        parent = curr;
        
        yield {
            description: `Comparing ${value} with ${curr.val}`,
            tree: cloneTree(treeCopy),
            bstState: cloneTree(treeCopy),
            bstTraversal: null,
            activeNode: curr.id,
            line: 20
        };

        if (value < curr.val) {
            yield {
                description: `${value} < ${curr.val}, going left...`,
                tree: cloneTree(treeCopy),
                bstState: cloneTree(treeCopy),
                bstTraversal: null,
                activeNode: curr.id,
                line: 21
            };
            curr = curr.left;
            isLeft = true;
        } else if (value > curr.val) {
            yield {
                description: `${value} > ${curr.val}, going right...`,
                tree: cloneTree(treeCopy),
                bstState: cloneTree(treeCopy),
                bstTraversal: null,
                activeNode: curr.id,
                line: 22
            };
            curr = curr.right;
            isLeft = false;
        } else {
            yield {
                description: `Value ${value} already exists in the BST.`,
                tree: cloneTree(treeCopy),
                bstState: cloneTree(treeCopy),
                bstTraversal: null,
                activeNode: curr.id,
                error: true
            };
            return;
        }
    }

    const newNode = { id: `node-${nextNodeId++}`, val: value, left: null, right: null };
    if (isLeft) {
        parent.left = newNode;
    } else {
        parent.right = newNode;
    }

    yield {
        description: `Inserted ${value} as ${isLeft ? 'left' : 'right'} child of ${parent.val}`,
        tree: cloneTree(treeCopy),
        bstState: cloneTree(treeCopy),
        activeNode: newNode.id,
        line: 25
    };
    
    yield {
        description: `Insertion complete.`,
        tree: cloneTree(treeCopy),
        bstState: cloneTree(treeCopy),
        activeNode: null
    };
}

export function* bstSearch(value, inputs) {
    const tree = cloneTree(inputs.tree);
    if (!tree) {
        yield { description: 'Tree is empty.', tree: null, bstState: null, error: true };
        return;
    }

    let curr = tree;
    while (curr) {
        yield {
            description: `Searching ${value}: Comparing with ${curr.val}`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            activeNode: curr.id,
            line: 31
        };

        if (value === curr.val) {
            yield {
                description: `Value ${value} found in BST!`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: curr.id,
                line: 31
            };
            return;
        }

        if (value < curr.val) {
            yield {
                description: `${value} < ${curr.val}, looking in left subtree.`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: curr.id,
                line: 32
            };
            curr = curr.left;
        } else {
            yield {
                description: `${value} > ${curr.val}, looking in right subtree.`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: curr.id,
                line: 33
            };
            curr = curr.right;
        }
    }

    yield {
        description: `Value ${value} not found in the BST.`,
        tree: cloneTree(tree),
        bstState: cloneTree(tree),
        activeNode: null,
        error: true
    };
}

export function* bstDelete(value, inputs) {
    const tree = cloneTree(inputs.tree);
    if (!tree) {
        yield { description: 'Tree is empty.', tree: null, bstState: null, error: true };
        return;
    }

    let newTree = tree;
    let found = false;

    function* deleteRec(node, val, parentInfo = null) {
        if (!node) return null;

        yield {
            description: `Searching for ${val} to delete: Comparing with ${node.val}`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            activeNode: node.id,
            line: 41
        };

        if (val < node.val) {
            node.left = yield* deleteRec(node.left, val, { parent: node, side: 'left' });
            return node;
        } else if (val > node.val) {
            node.right = yield* deleteRec(node.right, val, { parent: node, side: 'right' });
            return node;
        } else {
            found = true;
            yield {
                description: `Found node ${val}. Preparing to delete.`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: node.id,
                line: 45
            };

            // Case 1: Leaf or Single Child
            if (!node.left) {
                yield {
                    description: `Node ${val} has no left child. Replacing with right child.`,
                    tree: cloneTree(tree),
                    bstState: cloneTree(tree),
                    activeNode: node.id,
                    line: 47
                };
                return node.right;
            } else if (!node.right) {
                yield {
                    description: `Node ${val} has no right child. Replacing with left child.`,
                    tree: cloneTree(tree),
                    bstState: cloneTree(tree),
                    activeNode: node.id,
                    line: 51
                };
                return node.left;
            }

            // Case 2: Two Children
            yield {
                description: `Node ${val} has two children. Finding inorder successor.`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: node.id,
                line: 56
            };

            let successor = node.right;
            while (successor.left) {
                yield {
                    description: `Moving left to find successor: current ${successor.val}`,
                    tree: cloneTree(tree),
                    bstState: cloneTree(tree),
                    activeNode: successor.id,
                    line: 36
                };
                successor = successor.left;
            }

            yield {
                description: `Found inorder successor: ${successor.val}. Replacing ${node.val} with ${successor.val}.`,
                tree: cloneTree(tree),
                bstState: cloneTree(tree),
                activeNode: successor.id,
                line: 57
            };

            node.val = successor.val;
            node.right = yield* deleteRec(node.right, successor.val, { parent: node, side: 'right' });
            return node;
        }
    }

    const finalTree = yield* deleteRec(newTree, value);

    if (!found) {
        yield {
            description: `Value ${value} not found for deletion.`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            activeNode: null,
            error: true
        };
    } else {
        yield {
            description: `Successfully deleted ${value} and corrected the tree.`,
            tree: cloneTree(finalTree),
            bstState: cloneTree(finalTree),
            activeNode: null
        };
    }
}

export function* bstPreorder(value, inputs) {
    const tree = cloneTree(inputs.tree); // Use pure tree copy during traversal
    const res = [];
    if (!tree) {
        yield { description: 'Tree is empty.', tree: null, bstState: null, bstTraversal: { type: 'preorder', result: res } };
        return;
    }

    function* dfs(node) {
        if (!node) return;
        
        res.push(node.val);
        yield {
            description: `Visiting Node ${node.val} (Root)`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            bstTraversal: { type: 'preorder', result: [...res] },
            activeNode: node.id,
            line: 71
        };
        
        yield* dfs(node.left);
        yield* dfs(node.right);
    }

    yield* dfs(tree);

    yield {
        description: `Preorder Traversal Complete: ${res.join(', ')}`,
        tree: cloneTree(tree),
        bstState: cloneTree(tree),
        bstTraversal: { type: 'preorder', result: res }
    };
}

export function* bstInorder(value, inputs) {
    const tree = cloneTree(inputs.tree);
    const res = [];
    if (!tree) {
        yield { description: 'Tree is empty.', tree: null, bstState: null, bstTraversal: { type: 'inorder', result: res } };
        return;
    }

    function* dfs(node) {
        if (!node) return;
        
        yield* dfs(node.left);
        
        res.push(node.val);
        yield {
            description: `Visiting Node ${node.val} (Root)`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            bstTraversal: { type: 'inorder', result: [...res] },
            activeNode: node.id,
            line: 78
        };
        
        yield* dfs(node.right);
    }

    yield* dfs(tree);

    yield {
        description: `Inorder Traversal Complete: ${res.join(', ')}`,
        tree: cloneTree(tree),
        bstState: cloneTree(tree),
        bstTraversal: { type: 'inorder', result: res }
    };
}

export function* bstPostorder(value, inputs) {
    const tree = cloneTree(inputs.tree);
    const res = [];
    if (!tree) {
        yield { description: 'Tree is empty.', tree: null, bstState: null, bstTraversal: { type: 'postorder', result: res } };
        return;
    }

    function* dfs(node) {
        if (!node) return;
        
        yield* dfs(node.left);
        yield* dfs(node.right);
        
        res.push(node.val);
        yield {
            description: `Visiting Node ${node.val} (Root)`,
            tree: cloneTree(tree),
            bstState: cloneTree(tree),
            bstTraversal: { type: 'postorder', result: [...res] },
            activeNode: node.id,
            line: 87
        };
    }

    yield* dfs(tree);

    yield {
        description: `Postorder Traversal Complete: ${res.join(', ')}`,
        tree: cloneTree(tree),
        bstState: cloneTree(tree),
        bstTraversal: { type: 'postorder', result: res }
    };
}
