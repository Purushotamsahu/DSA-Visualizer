// src/algorithms/heap.js

export const heapCombinedCode = `
#include <iostream>
#include <vector>
#include <algorithm>

class Heap {
    std::vector<int> heap;
    bool isMaxHeap;

    void heapifyUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (isMaxHeap) {
                if (heap[i] > heap[parent]) {
                    std::swap(heap[i], heap[parent]);
                    i = parent;
                } else break;
            } else {
                if (heap[i] < heap[parent]) {
                    std::swap(heap[i], heap[parent]);
                    i = parent;
                } else break;
            }
        }
    }

    void heapifyDown(int i) {
        int size = heap.size();
        while (true) {
            int target = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (isMaxHeap) {
                if (left < size && heap[left] > heap[target]) target = left;
                if (right < size && heap[right] > heap[target]) target = right;
            } else {
                if (left < size && heap[left] < heap[target]) target = left;
                if (right < size && heap[right] < heap[target]) target = right;
            }

            if (target != i) {
                std::swap(heap[i], heap[target]);
                i = target;
            } else break;
        }
    }

public:
    Heap(bool max = true) : isMaxHeap(max) {}

    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }

    void deleteRoot() {
        if (heap.empty()) return;
        heap[0] = heap.back();
        heap.pop_back();
        heapifyDown(0);
    }

    void heapSort(std::vector<int>& arr) {
        // Build heap
        int n = arr.size();
        for (int i = n / 2 - 1; i >= 0; i--)
            // heapify logic...
        
        // Extract elements
        for (int i = n - 1; i > 0; i--) {
            std::swap(arr[0], arr[i]);
            // heapify logic on reduced heap...
        }
    }
};
`;

export function* maxHeapInsert(value, inputs) {
    let heap = [...(inputs.heap || [])];
    heap.push(value);
    let i = heap.length - 1;

    yield {
        description: `Added ${value} at the end of the heap (index ${i}).`,
        heap: [...heap],
        activeIndices: [i],
        line: 45
    };

    while (i > 0) {
        let parent = Math.floor((i - 1) / 2);
        yield {
            description: `Comparing child heap[${i}] (${heap[i]}) with parent heap[${parent}] (${heap[parent]}).`,
            heap: [...heap],
            activeIndices: [i, parent],
            line: 13
        };

        if (heap[i] > heap[parent]) {
            yield {
                description: `${heap[i]} > ${heap[parent]}. Swapping child with parent.`,
                heap: [...heap],
                activeIndices: [i, parent],
                line: 15
            };
            [heap[i], heap[parent]] = [heap[parent], heap[i]];
            i = parent;
            yield {
                description: `Swapped. Continuing heapify up...`,
                heap: [...heap],
                activeIndices: [i],
                line: 16
            };
        } else {
            yield {
                description: `${heap[i]} <= ${heap[parent]}. Heap property satisfied.`,
                heap: [...heap],
                activeIndices: [i, parent],
                line: 17
            };
            break;
        }
    }

    yield {
        description: `Insertion complete. Max Heap updated.`,
        heap: [...heap],
        activeIndices: []
    };
}

export function* maxHeapDelete(unused, inputs) {
    let heap = [...(inputs.heap || [])];
    if (heap.length === 0) {
        yield { description: "Heap is empty. Nothing to delete.", heap: [], error: true };
        return;
    }

    const rootVal = heap[0];
    const lastVal = heap[heap.length - 1];

    if (heap.length === 1) {
        heap.pop();
        yield { description: `Removed the only node (${rootVal}).`, heap: [], line: 52 };
        return;
    }

    yield {
        description: `Replacing root (${rootVal}) with last element (${lastVal}).`,
        heap: [...heap],
        activeIndices: [0, heap.length - 1],
        line: 51
    };

    heap[0] = heap.pop();

    yield {
        description: `Root replaced. Now heapifying down...`,
        heap: [...heap],
        activeIndices: [0],
        line: 53
    };

    let i = 0;
    while (true) {
        let target = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let size = heap.size || heap.length;

        yield {
            description: `Checking children of index ${i} (${heap[i]}).`,
            heap: [...heap],
            activeIndices: [i],
            line: 25
        };

        if (left < size) {
            yield {
                description: `Comparing target (${heap[target]}) with left child (${heap[left]}).`,
                heap: [...heap],
                activeIndices: [target, left],
                line: 30
            };
            if (heap[left] > heap[target]) target = left;
        }

        if (right < size) {
            yield {
                description: `Comparing current target (${heap[target]}) with right child (${heap[right]}).`,
                heap: [...heap],
                activeIndices: [target, right],
                line: 31
            };
            if (heap[right] > heap[target]) target = right;
        }

        if (target !== i) {
            yield {
                description: `Child is larger. Swapping ${heap[i]} with ${heap[target]}.`,
                heap: [...heap],
                activeIndices: [i, target],
                line: 35
            };
            [heap[i], heap[target]] = [heap[target], heap[i]];
            i = target;
        } else {
            yield {
                description: `Heap property satisfied at index ${i}.`,
                heap: [...heap],
                activeIndices: [i],
                line: 37
            };
            break;
        }
    }

    yield {
        description: `Deletion complete. Max Heap updated.`,
        heap: [...heap],
        activeIndices: []
    };
}

export function* minHeapInsert(value, inputs) {
    let heap = [...(inputs.heap || [])];
    heap.push(value);
    let i = heap.length - 1;

    yield {
        description: `Added ${value} at the end of the heap (index ${i}).`,
        heap: [...heap],
        activeIndices: [i],
        line: 45
    };

    while (i > 0) {
        let parent = Math.floor((i - 1) / 2);
        yield {
            description: `Comparing child heap[${i}] (${heap[i]}) with parent heap[${parent}] (${heap[parent]}).`,
            heap: [...heap],
            activeIndices: [i, parent],
            line: 13
        };

        if (heap[i] < heap[parent]) {
            yield {
                description: `${heap[i]} < ${heap[parent]}. Swapping child with parent.`,
                heap: [...heap],
                activeIndices: [i, parent],
                line: 15
            };
            [heap[i], heap[parent]] = [heap[parent], heap[i]];
            i = parent;
            yield {
                description: `Swapped. Continuing heapify up...`,
                heap: [...heap],
                activeIndices: [i],
                line: 16
            };
        } else {
            yield {
                description: `${heap[i]} >= ${heap[parent]}. Heap property satisfied.`,
                heap: [...heap],
                activeIndices: [i, parent],
                line: 17
            };
            break;
        }
    }

    yield {
        description: `Insertion complete. Min Heap updated.`,
        heap: [...heap],
        activeIndices: []
    };
}

export function* minHeapDelete(unused, inputs) {
    let heap = [...(inputs.heap || [])];
    if (heap.length === 0) {
        yield { description: "Heap is empty. Nothing to delete.", heap: [], error: true };
        return;
    }

    const rootVal = heap[0];
    const lastVal = heap[heap.length - 1];

    if (heap.length === 1) {
        heap.pop();
        yield { description: `Removed the only node (${rootVal}).`, heap: [], line: 52 };
        return;
    }

    yield {
        description: `Replacing root (${rootVal}) with last element (${lastVal}).`,
        heap: [...heap],
        activeIndices: [0, heap.length - 1],
        line: 51
    };

    heap[0] = heap.pop();

    yield {
        description: `Root replaced. Now heapifying down...`,
        heap: [...heap],
        activeIndices: [0],
        line: 53
    };

    let i = 0;
    while (true) {
        let target = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let size = heap.length;

        yield {
            description: `Checking children of index ${i} (${heap[i]}).`,
            heap: [...heap],
            activeIndices: [i],
            line: 25
        };

        if (left < size) {
            yield {
                description: `Comparing target (${heap[target]}) with left child (${heap[left]}).`,
                heap: [...heap],
                activeIndices: [target, left],
                line: 30
            };
            if (heap[left] < heap[target]) target = left;
        }

        if (right < size) {
            yield {
                description: `Comparing current target (${heap[target]}) with right child (${heap[right]}).`,
                heap: [...heap],
                activeIndices: [target, right],
                line: 31
            };
            if (heap[right] < heap[target]) target = right;
        }

        if (target !== i) {
            yield {
                description: `Child is smaller. Swapping ${heap[i]} with ${heap[target]}.`,
                heap: [...heap],
                activeIndices: [i, target],
                line: 35
            };
            [heap[i], heap[target]] = [heap[target], heap[i]];
            i = target;
        } else {
            yield {
                description: `Heap property satisfied at index ${i}.`,
                heap: [...heap],
                activeIndices: [i],
                line: 37
            };
            break;
        }
    }

    yield {
        description: `Deletion complete. Min Heap updated.`,
        heap: [...heap],
        activeIndices: []
    };
}

export function* heapSort(unused, inputs) {
    let arr = [...(inputs.heap || [])];
    if (arr.length === 0) {
        yield { description: "Array is empty. Please insert some elements first.", heap: [], error: true };
        return;
    }

    let n = arr.length;

    // Phase 1: Build Max Heap
    yield {
        description: "Phase 1: Building Max Heap from the array.",
        heap: [...arr],
        activeIndices: [],
        line: 56
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
    }

    yield {
        description: "Max Heap built. Phase 2: Extracting elements one by one.",
        heap: [...arr],
        activeIndices: [],
        line: 60
    };

    // Phase 2: Extract elements
    for (let i = n - 1; i > 0; i--) {
        yield {
            description: `Swapping root (${arr[0]}) with element at index ${i} (${arr[i]}).`,
            heap: [...arr],
            activeIndices: [0, i],
            line: 61
        };
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        yield {
            description: `Element ${arr[i]} sorted. Re-heapifying the remaining ${i} elements.`,
            heap: [...arr],
            activeIndices: [i],
            sortedIndices: Array.from({length: n-i}, (_, k) => n - 1 - k)
        };

        yield* heapify(arr, i, 0, n);
    }

    yield {
        description: "Heap Sort complete. The array is now sorted.",
        heap: [...arr],
        activeIndices: [],
        sortedIndices: Array.from({length: n}, (_, k) => k)
    };
}

function* heapify(arr, n, i, originalN = null) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    const sortedIndices = originalN ? Array.from({length: originalN - n}, (_, k) => originalN - 1 - k) : [];

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        yield {
            description: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property.`,
            heap: [...arr],
            activeIndices: [i, largest],
            sortedIndices
        };
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        yield* heapify(arr, n, largest, originalN);
    }
}
