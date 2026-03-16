// Combined C++ code for all stack operations shown in the code panel
export const stackCombinedCode = `#include <iostream>
using namespace std;

const int MAX = 10;
int stack[MAX];
int top = -1;

// ── PUSH ──────────────────────────
void push(int data) {
  if (top >= MAX - 1) {          // Line 10
    cout << "Stack Overflow";    // Line 11
    return;                      // Line 12
  }
  stack[++top] = data;           // Line 14
}

// ── POP ───────────────────────────
int pop() {
  if (top < 0) {                 // Line 18
    cout << "Stack Underflow";   // Line 19
    return -1;                   // Line 20
  }
  return stack[top--];           // Line 22
}

// ── TOP / PEEK ────────────────────
int peek() {
  if (top < 0) {                 // Line 26
    cout << "Stack is Empty";    // Line 27
    return -1;                   // Line 28
  }
  return stack[top];             // Line 30
}`;

// Line numbers in the combined code file:
// push body starts ~line 9
// pop body starts ~line 18
// top/peek body starts ~line 26

export const stackCodeDocs = {
  push: stackCombinedCode,
  pop:  stackCombinedCode,
  top:  stackCombinedCode
};

// ── PUSH generator ────────────────────────────────────────────────────────────
export function* stackPush(val, inputs) {
  const stack = inputs?.stack ? [...inputs.stack] : [];
  const newVal = typeof val === 'object' ? (val?.val ?? 0) : (val ?? 0);

  // Step 1 – show intent
  yield {
    description: `push(${newVal}) called. Checking if stack is full (top = ${stack.length - 1}, MAX-1 = 9).`,
    line: 10,
    stack: { items: [...stack], type: 'stack', operation: 'push' }
  };

  // Step 2 – overflow?
  if (stack.length >= 10) {
    yield {
      description: `Stack Overflow! top (${stack.length - 1}) >= MAX-1 (9). Cannot push.`,
      line: 11,
      stack: { items: [...stack], type: 'stack', error: true, operation: 'push' }
    };
    return;
  }

  // Step 3 – increment top and assign
  const newStack = [...stack, newVal];
  yield {
    description: `stack[++top] = ${newVal}. Top moves to index ${newStack.length - 1}. Value ${newVal} is now at the top!`,
    line: 14,
    stack: { items: newStack, activeIndex: newStack.length - 1, type: 'stack', operation: 'push', highlight: 'pushed' }
  };
}

// ── POP generator ─────────────────────────────────────────────────────────────
export function* stackPop(unused, inputs) {
  const stack = inputs?.stack ? [...inputs.stack] : [];

  // Step 1 – show intent
  yield {
    description: `pop() called. Checking if stack is empty (top = ${stack.length - 1}).`,
    line: 18,
    stack: { items: [...stack], type: 'stack', operation: 'pop' }
  };

  // Step 2 – underflow?
  if (stack.length === 0) {
    yield {
      description: `Stack Underflow! top < 0. Nothing to pop.`,
      line: 19,
      stack: { items: [], type: 'stack', error: true, operation: 'pop' }
    };
    return;
  }

  // Step 3 – highlight element about to be popped
  const poppedVal = stack[stack.length - 1];
  yield {
    description: `Top element is ${poppedVal}. Marking it for removal (top = ${stack.length - 1}).`,
    line: 22,
    stack: { items: [...stack], activeIndex: stack.length - 1, type: 'stack', operation: 'pop', highlight: 'popping' }
  };

  // Step 4 – actually remove
  const newStack = stack.slice(0, -1);
  yield {
    description: `${poppedVal} popped! stack[top--] returned ${poppedVal}. Top decremented to ${newStack.length - 1}.`,
    line: 22,
    stack: { items: newStack, type: 'stack', operation: 'pop', poppedVal }
  };
}

// ── TOP / PEEK generator ──────────────────────────────────────────────────────
export function* stackTop(unused, inputs) {
  const stack = inputs?.stack ? [...inputs.stack] : [];

  // Step 1 – show intent
  yield {
    description: `peek() called. Checking if stack is empty (top = ${stack.length - 1}).`,
    line: 26,
    stack: { items: [...stack], type: 'stack', operation: 'top' }
  };

  // Step 2 – empty?
  if (stack.length === 0) {
    yield {
      description: `Stack is Empty! top < 0. No element to peek at.`,
      line: 27,
      stack: { items: [], type: 'stack', operation: 'top' }
    };
    return;
  }

  // Step 3 – show top element
  const topVal = stack[stack.length - 1];
  yield {
    description: `Top element is ${topVal}. stack[top] = stack[${stack.length - 1}] = ${topVal}. (No removal, just peek!)`,
    line: 30,
    stack: { items: [...stack], activeIndex: stack.length - 1, type: 'stack', operation: 'top', highlight: 'peek' }
  };
}
