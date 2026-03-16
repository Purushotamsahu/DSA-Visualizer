// Combined C++ code for all queue operations shown in the code panel
export const queueCombinedCode = `#include <iostream>
using namespace std;

const int MAX = 10;
int queue[MAX];
int front = -1, rear = -1;

// ── ENQUEUE (Push to Rear) ─────────
void enqueue(int data) {
  if (rear >= MAX - 1) {           // Line 10
    cout << "Queue Overflow";      // Line 11
    return;                        // Line 12
  }
  if (front == -1) front = 0;      // Line 14
  queue[++rear] = data;            // Line 15
}

// ── DEQUEUE (Pop from Front) ───────
int dequeue() {
  if (front == -1 || front > rear) { // Line 19
    cout << "Queue Underflow";       // Line 20
    return -1;                       // Line 21
  }
  int val = queue[front++];          // Line 23
  if (front > rear) {                // Line 24
    front = rear = -1;               // Line 25 (reset when empty)
  }
  return val;                        // Line 27
}

// ── FRONT (Peek at Front) ──────────
int peek() {
  if (front == -1 || front > rear) { // Line 31
    cout << "Queue is Empty";        // Line 32
    return -1;                       // Line 33
  }
  return queue[front];               // Line 35
}`;

export const queueCodeDocs = {
  enqueue: queueCombinedCode,
  dequeue: queueCombinedCode,
  front: queueCombinedCode,
};

// ── ENQUEUE generator ─────────────────────────────────────────────────────────
export function* queueEnqueue(val, inputs) {
  const queue = inputs?.queue ? [...inputs.queue] : [];
  const newVal = typeof val === 'object' ? (val?.val ?? 0) : (val ?? 0);

  // Step 1 – check overflow
  yield {
    description: `enqueue(${newVal}) called. Checking if queue is full (rear = ${queue.length - 1}, MAX-1 = 9).`,
    line: 10,
    queue: { items: [...queue], type: 'queue', operation: 'enqueue' }
  };

  if (queue.length >= 10) {
    yield {
      description: `Queue Overflow! rear (${queue.length - 1}) >= MAX-1 (9). Cannot enqueue.`,
      line: 11,
      queue: { items: [...queue], type: 'queue', error: true, operation: 'enqueue' }
    };
    return;
  }

  // Step 2 – init front if needed
  if (queue.length === 0) {
    yield {
      description: `Queue was empty. Setting front = 0.`,
      line: 14,
      queue: { items: [...queue], type: 'queue', operation: 'enqueue' }
    };
  }

  // Step 3 – add to rear
  const newQueue = [...queue, newVal];
  yield {
    description: `queue[++rear] = ${newVal}. ${newVal} added to the REAR. rear = ${newQueue.length - 1}.`,
    line: 15,
    queue: { items: newQueue, activeIndex: newQueue.length - 1, type: 'queue', operation: 'enqueue', highlight: 'enqueued' }
  };
}

// ── DEQUEUE generator ─────────────────────────────────────────────────────────
export function* queueDequeue(unused, inputs) {
  const queue = inputs?.queue ? [...inputs.queue] : [];

  // Step 1 – show intent
  yield {
    description: `dequeue() called. Checking if queue is empty (front = ${queue.length === 0 ? -1 : 0}).`,
    line: 19,
    queue: { items: [...queue], type: 'queue', operation: 'dequeue' }
  };

  // Step 2 – underflow?
  if (queue.length === 0) {
    yield {
      description: `Queue Underflow! front == -1. Nothing to dequeue.`,
      line: 20,
      queue: { items: [], type: 'queue', error: true, operation: 'dequeue' }
    };
    return;
  }

  // Step 3 – highlight front element about to leave
  const removedVal = queue[0];
  yield {
    description: `Front element is ${removedVal}. Marking it for removal (front = 0).`,
    line: 23,
    queue: { items: [...queue], activeIndex: 0, type: 'queue', operation: 'dequeue', highlight: 'dequeuing' }
  };

  // Step 4 – actually remove
  const newQueue = queue.slice(1);
  yield {
    description: `${removedVal} dequeued from FRONT! queue[front++] returned ${removedVal}. ${newQueue.length === 0 ? 'Queue is now empty (front = rear = -1).' : `front now points to ${newQueue[0]}.`}`,
    line: newQueue.length === 0 ? 25 : 23,
    queue: { items: newQueue, type: 'queue', operation: 'dequeue', dequeuedVal: removedVal }
  };
}

// ── FRONT / PEEK generator ────────────────────────────────────────────────────
export function* queueFront(unused, inputs) {
  const queue = inputs?.queue ? [...inputs.queue] : [];

  // Step 1 – show intent
  yield {
    description: `peek() called. Checking if queue is empty (front = ${queue.length === 0 ? -1 : 0}).`,
    line: 31,
    queue: { items: [...queue], type: 'queue', operation: 'front' }
  };

  // Step 2 – empty?
  if (queue.length === 0) {
    yield {
      description: `Queue is Empty! front == -1. No element to peek at.`,
      line: 32,
      queue: { items: [], type: 'queue', operation: 'front' }
    };
    return;
  }

  // Step 3 – highlight front
  const frontVal = queue[0];
  yield {
    description: `Front element is ${frontVal}. queue[front] = queue[0] = ${frontVal}. (No removal — just a peek!)`,
    line: 35,
    queue: { items: [...queue], activeIndex: 0, type: 'queue', operation: 'front', highlight: 'peek' }
  };
}
