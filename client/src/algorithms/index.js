import { fibCodeDocs, fibRecursion, fibMemoization, fibTabulation } from './dp/fibonacci';
import { knapsackCodeDocs, knapsackRecursion, knapsackMemoization, knapsackTabulation } from './dp/knapsack';
import { lcsCodeDocs, lcsRecursion, lcsMemoization, lcsTabulation } from './dp/lcs';
import { linkedListCodeDocs, singlyLLTraversal, singlyLLInsert, singlyLLDelete, doublyLLTraversal, doublyLLInsert, doublyLLDelete, circularLLTraversal, circularLLInsert, circularLLDelete, circularDoublyLLTraversal, circularDoublyLLInsert, circularDoublyLLDelete } from './linked-list/linkedList';
import { stackCombinedCode, stackPush, stackPop, stackTop } from './stack/stack';
import { queueCombinedCode, queueEnqueue, queueDequeue, queueFront } from './queue/queue';
import { bstCombinedCode, bstInsert, bstSearch, bstDelete, bstInorder, bstPreorder, bstPostorder } from './bst/bst';
import { heapCombinedCode, maxHeapInsert, maxHeapDelete, minHeapInsert, minHeapDelete, heapSort } from './heap/heap';
import { graphCodeDocs, bfsGenerator, dfsGenerator } from './graph/graph';
import { fibonacciCode, sumOfNCode, factorialCode, powerCode, fibonacciGenerator, sumOfNGenerator, factorialGenerator, powerGenerator } from './recursion/recursionAlgos';
import { fractionalKnapsackGenerator, fractionalKnapsackCode } from './greedy/greedyAlgos';
import { mergeSortGenerator, mergeSortCode, quickSortGenerator, quickSortCode } from './divide-conquer/divideConquerAlgos';
import { btCombinedCode, btInsert, btSearch, btPreorder, btInorder, btPostorder } from './binary-tree/binaryTree';
import { twoSumGenerator, twoSumCode } from './hashing/hashing';

export const categories = [
  {
    id: 'dp',
    title: 'Dynamic Programming',
    desc: 'Visualize Recursion, Memoization, and Tabulation',
    problems: [
      {
        id: 'fibonacci',
        title: 'Fibonacci Sequence',
        difficulty: 'Easy',
        desc: 'Find the nth Fibonacci number.',
        inputs: [
          { id: 'n', label: 'Enter n (1-15)', type: 'number', defaultValue: 5, min: 1, max: 15 }
        ],
        methods: [
          { id: 'recursion', title: 'Recursion', desc: 'Top-down approach without caching. Explores all branches. Shows recursion tree.', code: fibCodeDocs.recursion, generator: fibRecursion, timeComplexity: 'O(2ⁿ)', spaceComplexity: 'O(n)' },
          { id: 'memoization', title: 'Memoization', desc: 'Top-down caching. Avoids redundant calculations. Shows tree & cache.', code: fibCodeDocs.memoization, generator: fibMemoization, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
          { id: 'tabulation', title: 'Tabulation', desc: 'Bottom-up iterative approach. Shows 1D DP array.', code: fibCodeDocs.tabulation, generator: fibTabulation, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' }
        ]
      },
      {
        id: 'knapsack',
        title: '0/1 Knapsack',
        difficulty: 'Medium',
        desc: 'Maximize value given a weight capacity.',
        inputs: [
          { id: 'W', label: 'Max Capacity W', type: 'number', defaultValue: 5, min: 1, max: 10 },
          { id: 'wt', label: 'Weights (comma seq)', type: 'text', defaultValue: '1,2,3' },
          { id: 'val', label: 'Values (comma seq)', type: 'text', defaultValue: '60,100,120' }
        ],
        methods: [
          { id: 'recursion', title: 'Recursion', desc: 'Top-down approach exploring all valid capacity bounds.', code: knapsackCodeDocs.recursion, generator: knapsackRecursion, timeComplexity: 'O(2ⁿ)', spaceComplexity: 'O(n)' },
          { id: 'memoization', title: 'Memoization', desc: 'Caches results based on (n, W) to prune duplicate branches.', code: knapsackCodeDocs.memoization, generator: knapsackMemoization, timeComplexity: 'O(n*W)', spaceComplexity: 'O(n*W)' },
          { id: 'tabulation', title: 'Tabulation', desc: 'Iteratively fills a 2D matrix comparing include/exclude logic.', code: knapsackCodeDocs.tabulation, generator: knapsackTabulation, timeComplexity: 'O(n*W)', spaceComplexity: 'O(n*W)' }
        ]
      },
      {
        id: 'lcs',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        desc: 'Find the longest subsequence present in both strings.',
        inputs: [
          { id: 'strX', label: 'String 1', type: 'text', defaultValue: 'AGGTAB' },
          { id: 'strY', label: 'String 2', type: 'text', defaultValue: 'GXTXAYB' }
        ],
        methods: [
          { id: 'recursion', title: 'Recursion', desc: 'Explores character matches from the end of both strings backward.', code: lcsCodeDocs.recursion, generator: lcsRecursion, timeComplexity: 'O(2ⁿ⁺ᵐ)', spaceComplexity: 'O(n+m)' },
          { id: 'memoization', title: 'Memoization', desc: 'Caches results based on string indices.', code: lcsCodeDocs.memoization, generator: lcsMemoization, timeComplexity: 'O(n*m)', spaceComplexity: 'O(n*m)' },
          { id: 'tabulation', title: 'Tabulation', desc: 'Iteratively fills a 2D matrix matching character arrays.', code: lcsCodeDocs.tabulation, generator: lcsTabulation, timeComplexity: 'O(n*m)', spaceComplexity: 'O(n*m)' }
        ]
      }
    ]
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    desc: 'Dynamic data structure with nodes connected through references.',
    problems: [
      {
        id: 'singly-ll',
        title: 'Singly Linked List',
        difficulty: 'Easy',
        desc: 'Unidirectional chain of nodes.',
        inputs: [], // We'll handle inputs dynamically in the visualizer for LL
        methods: [
          { id: 'search', title: 'Search', desc: 'Find a value in the list.', code: linkedListCodeDocs.singly.search, generator: singlyLLTraversal, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'insert', title: 'Insert', desc: 'Add nodes at head, tail, or index.', code: linkedListCodeDocs.singly.insert, generator: singlyLLInsert, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'delete', title: 'Delete', desc: 'Remove nodes from head, tail, or by value.', code: linkedListCodeDocs.singly.delete, generator: singlyLLDelete, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
        ]
      },
      {
        id: 'doubly-ll',
        title: 'Doubly Linked List',
        difficulty: 'Easy',
        desc: 'Nodes with both next and previous pointers.',
        inputs: [],
        methods: [
          { id: 'search', title: 'Search', desc: 'Find a value using next/prev.', code: linkedListCodeDocs.doubly.search, generator: doublyLLTraversal, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'insert', title: 'Insert', desc: 'Add nodes at head, tail, or index.', code: linkedListCodeDocs.doubly.insert, generator: doublyLLInsert, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'delete', title: 'Delete', desc: 'Remove nodes and update neighbors.', code: linkedListCodeDocs.doubly.delete, generator: doublyLLDelete, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
        ]
      },
      {
        id: 'circular-ll',
        title: 'Circular Linked List',
        difficulty: 'Easy',
        desc: 'Last node points back to the head.',
        inputs: [],
        methods: [
          { id: 'search', title: 'Search', desc: 'Continuous loop traversal.', code: linkedListCodeDocs.circular.search, generator: circularLLTraversal, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'insert', title: 'Insert', desc: 'Update tail pointer to loop back.', code: linkedListCodeDocs.circular.insert, generator: circularLLInsert, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'delete', title: 'Delete', desc: 'Remove nodes and maintain loop.', code: linkedListCodeDocs.circular.delete, generator: circularLLDelete, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
        ]
      },
      {
        id: 'circular-doubly-ll',
        title: 'Circular Doubly Linked List',
        difficulty: 'Medium',
        desc: 'Doubly linked list where ends are joined.',
        inputs: [],
        methods: [
          { id: 'search', title: 'Search', desc: 'Continuous two-way loop traversal.', code: linkedListCodeDocs.circularDoubly.search, generator: circularDoublyLLTraversal, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'insert', title: 'Insert', desc: 'Maintain backward and forward circularity.', code: linkedListCodeDocs.circularDoubly.insert, generator: circularDoublyLLInsert, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
          { id: 'delete', title: 'Delete', desc: 'Remove nodes and update neighbor loop-backs.', code: linkedListCodeDocs.circularDoubly.delete, generator: circularDoublyLLDelete, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
        ]
      }
    ]
  },
  {
    id: 'stack',
    title: 'Stack',
    desc: 'LIFO data structure supporting push and pop operations. Visualize stack operations and state.',
    problems: [
      {
        id: 'stack-ops',
        title: 'Stack Operations',
        difficulty: 'Easy',
        desc: 'Perform push, pop, and top operations on a stack.',
        inputs: [
          { id: 'val', label: 'Value', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive push, pop, and peek operations on a stack with step-by-step simulation.',
            code: stackCombinedCode,
            generator: stackPush, // default (not used for stack — handled by UI buttons)
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(n)'
          }
        ]
      }
    ]
  },
  {
    id: 'queue',
    title: 'Queue',
    desc: 'FIFO data structure — elements enter at the rear and leave from the front.',
    problems: [
      {
        id: 'queue-ops',
        title: 'Queue Operations',
        difficulty: 'Easy',
        desc: 'Perform enqueue, dequeue, and front operations on a linear queue.',
        inputs: [
          { id: 'val', label: 'Value', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive enqueue, dequeue, and front peek operations with step-by-step C++ simulation.',
            code: queueCombinedCode,
            generator: queueEnqueue,
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(n)'
          }
        ]
      }
    ]
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    desc: 'A tree data structure where each node has at most two children. Learn about standard level-order structures and traversals.',
    problems: [
      {
        id: 'bt-ops',
        title: 'Binary Tree Operations',
        difficulty: 'Easy',
        desc: 'Perform level-order insert and tree traversals on a standard, non-sorted Binary Tree.',
        inputs: [
          { id: 'val', label: 'Value to Insert', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive Level-Order Insert and Traversals on a Binary Tree.',
            code: btCombinedCode,
            generator: btInsert,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)'
          },
          {
            id: 'search',
            title: 'Search',
            desc: 'Search for a value in the Binary Tree using Breadth First Search (BFS).',
            code: btCombinedCode,
            generator: btSearch,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)'
          }
        ]
      }
    ]
  },
  {
    id: 'bst',
    title: 'Binary Search Tree',
    desc: 'A binary tree that maintains sorted data with O(log n) operations. Learn about tree traversals.',
    problems: [
      {
        id: 'bst-ops',
        title: 'BST Operations',
        difficulty: 'Easy',
        desc: 'Perform insert and tree traversals on a Binary Search Tree.',
        inputs: [
          { id: 'val', label: 'Value', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive insertion (Push Left / Push Right) and Traversals on a Binary Search Tree.',
            code: bstCombinedCode,
            generator: bstInsert,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(n)'
          },
          {
            id: 'search',
            title: 'Search',
            desc: 'Search for a value in the BST with step-by-step visualization.',
            code: bstCombinedCode,
            generator: bstSearch,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(h)'
          },
          {
            id: 'delete',
            title: 'Delete',
            desc: 'Delete a value and correct the tree structure.',
            code: bstCombinedCode,
            generator: bstDelete,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(h)'
          }
        ]
      }
    ]
  },
  {
    id: 'heap',
    title: 'Heap',
    desc: 'Complete binary tree with heap property. Switch between min and max heaps.',
    problems: [
      {
        id: 'max-heap',
        title: 'Max Heap',
        difficulty: 'Medium',
        desc: 'A complete binary tree where the value of each node is greater than or equal to its children.',
        inputs: [
          { id: 'val', label: 'Value', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive Max Heap operations: Insert, Delete Root, and Heap Sort.',
            code: heapCombinedCode,
            generator: maxHeapInsert,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(n)'
          }
        ]
      },
      {
        id: 'min-heap',
        title: 'Min Heap',
        difficulty: 'Medium',
        desc: 'A complete binary tree where the value of each node is less than or equal to its children.',
        inputs: [
          { id: 'val', label: 'Value', type: 'number', defaultValue: 10 }
        ],
        methods: [
          {
            id: 'operations',
            title: 'Operations',
            desc: 'Interactive Min Heap operations: Insert, Delete Root, and Heap Sort.',
            code: heapCombinedCode,
            generator: minHeapInsert,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(n)'
          }
        ]
      }
    ]
  },
  {
    id: 'hashing',
    title: 'Hashing',
    desc: 'Map keys to fixed-size values for O(1) average-time lookups.',
    problems: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        desc: 'Find two numbers such that they add up to a specific target.',
        inputs: [
          { id: 'arrInput', label: 'Array (comma separated)', type: 'text', defaultValue: '2, 7, 11, 15' },
          { id: 'targetInput', label: 'Target Sum', type: 'number', defaultValue: 9 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Hashing Approach', desc: 'Use a hash map to find the complement in O(n) time.', 
            code: twoSumCode, generator: (v, inputs) => twoSumGenerator(inputs.arrInput, inputs.targetInput), 
            timeComplexity: 'O(n)', spaceComplexity: 'O(n)' 
          }
        ]
      }
    ]
  },
  {
    id: 'graph',
    title: 'Graph Algorithms',
    desc: 'Visualize BFS, DFS, Dijkstra, and more.',
    problems: [
      {
        id: 'bfs',
        title: 'Breadth First Search',
        difficulty: 'Easy',
        desc: 'Explore neighbors layer by layer using a queue.',
        inputs: [
          { id: 'startNode', label: 'Start Node ID', type: 'number', defaultValue: 1 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'BFS Traversal', desc: 'Visualize BFS step-by-step.', 
            code: graphCodeDocs.bfs, generator: bfsGenerator, 
            timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' 
          }
        ]
      },
      {
        id: 'dfs',
        title: 'Depth First Search',
        difficulty: 'Easy',
        desc: 'Explore as far as possible along each branch before backtracking.',
        inputs: [
          { id: 'startNode', label: 'Start Node ID', type: 'number', defaultValue: 1 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'DFS Traversal', desc: 'Visualize DFS step-by-step.', 
            code: graphCodeDocs.dfs, generator: dfsGenerator, 
            timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' 
          }
        ]
      }
    ]
  },
  {
    id: 'divide-conquer',
    title: 'Divide and Conquer',
    desc: 'Break problems into smaller subproblems and perfectly solve them iteratively/recursively.',
    problems: [
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        difficulty: 'Medium',
        desc: 'Merge sort is a sorting algorithm that works by dividing an array into smaller subarrays, sorting each subarray, and then merging the sorted subarrays back together to form the final sorted array.',
        inputs: [
          { id: 'arrInput', label: 'Array elements (comma-separated)', type: 'text', defaultValue: '38, 27, 43, 3, 9, 82, 10' },
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Sorting', desc: 'Visualize the recursive splitting and re-merging arrays step by step.', 
            code: mergeSortCode, generator: (ignored, inputs) => mergeSortGenerator(inputs.arrInput),
            timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)' 
          }
        ]
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        difficulty: 'Medium',
        desc: 'QuickSort is a sorting algorithm based on the Divide and Conquer algorithm that picks an element as a pivot and partitions the given array around the picked pivot by placing the pivot in its correct position in the sorted array.',
        inputs: [
          { id: 'arrInput', label: 'Array elements (comma-separated)', type: 'text', defaultValue: '10, 80, 30, 90, 40, 50, 70' },
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Sorting', desc: 'Visualize selecting the pivot element and recursively sorting left and right partitions.', 
            code: quickSortCode, generator: (ignored, inputs) => quickSortGenerator(inputs.arrInput),
            timeComplexity: 'O(N log N)', spaceComplexity: 'O(log N)' 
          }
        ]
      }
    ]
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    desc: 'Making locally optimal choices at each stage.',
    problems: [
      {
        id: 'fractional-knapsack',
        title: 'Fractional Knapsack',
        difficulty: 'Medium',
        desc: 'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. You can break items into fractions.',
        inputs: [
          { id: 'capacity', label: 'Knapsack Capacity (W)', type: 'number', defaultValue: 50, min: 1, max: 200 },
          { id: 'itemsStr', label: 'Items [weight, value]', type: 'text', defaultValue: '[10, 60], [20, 100], [30, 120]' }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Knapsack Filling', desc: 'Visualize sorting by ratio and filling the knapsack.', 
            code: fractionalKnapsackCode, generator: (ignored, inputs) => fractionalKnapsackGenerator(inputs.itemsStr, Number(inputs.capacity)),
            timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)' 
          }
        ]
      }
    ]
  },
  {
    id: 'recursion',
    title: 'Recursion',
    desc: 'The foundation of many algorithms. Visualize the call stack and tree.',
    problems: [
      {
        id: 'fibonacci-rec',
        title: 'Fibonacci Sequence',
        difficulty: 'Easy',
        desc: 'Computes the N-th Fibonacci number where each number is the sum of the two preceding ones.',
        inputs: [
          { id: 'n', label: 'Enter N', type: 'number', defaultValue: 4, min: 0, max: 10 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Recursion', desc: 'Visualize the recursive branching and call stack.', 
            code: fibonacciCode, generator: (ignored, inputs) => fibonacciGenerator(Number(inputs.n)),
            timeComplexity: 'O(2ⁿ)', spaceComplexity: 'O(n)' 
          }
        ]
      },
      {
        id: 'sum-of-n',
        title: 'Sum of First N Natural Numbers',
        difficulty: 'Easy',
        desc: 'Finds the sum of all numbers from 1 to N using recursion.',
        inputs: [
          { id: 'n', label: 'Enter N', type: 'number', defaultValue: 5, min: 0, max: 20 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Recursion', desc: 'Visualize the linear recursion call stack.', 
            code: sumOfNCode, generator: (ignored, inputs) => sumOfNGenerator(Number(inputs.n)),
            timeComplexity: 'O(n)', spaceComplexity: 'O(n)' 
          }
        ]
      },
      {
        id: 'factorial',
        title: 'Factorial of N (N!)',
        difficulty: 'Easy',
        desc: 'Calculates the product of an integer and all the integers below it.',
        inputs: [
          { id: 'n', label: 'Enter N', type: 'number', defaultValue: 4, min: 0, max: 12 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Recursion', desc: 'Visualize the recursive multiplications and call stack.', 
            code: factorialCode, generator: (ignored, inputs) => factorialGenerator(Number(inputs.n)),
            timeComplexity: 'O(n)', spaceComplexity: 'O(n)' 
          }
        ]
      },
      {
        id: 'power',
        title: 'Power of a Number (Base^Exp)',
        difficulty: 'Easy',
        desc: 'Calculates the power of a given number recursively.',
        inputs: [
          { id: 'base', label: 'Base', type: 'number', defaultValue: 2, min: 1, max: 10 },
          { id: 'exp', label: 'Exponent', type: 'number', defaultValue: 3, min: 0, max: 10 }
        ],
        methods: [
          { 
            id: 'traverse', title: 'Visualize Recursion', desc: 'Visualize calculating powers via a call stack.', 
            code: powerCode, generator: (ignored, inputs) => powerGenerator(Number(inputs.base), Number(inputs.exp)),
            timeComplexity: 'O(n)', spaceComplexity: 'O(n)' 
          }
        ]
      }
    ]
  }
];
