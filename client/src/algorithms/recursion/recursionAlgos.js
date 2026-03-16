// Fibonacci Generator
export function* fibonacciGenerator(n) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;

  const cloneTree = () => ({
    nodes: nodes.map(nd => ({ ...nd })),
    edges: [...edges]
  });

  function* helper(currN, parentId) {
    const id = idCounter++;
    nodes.push({ id, label: `fib(${currN})`, active: true, result: null });
    if (parentId !== null) {
      edges.push({ source: parentId, target: id });
    }
    
    nodes.forEach(nd => nd.active = (nd.id === id));

    yield {
      description: `Calling fib(${currN}).`,
      recursionTree: cloneTree(),
      line: 2
    };

    if (currN <= 1) {
      const node = nodes.find(nd => nd.id === id);
      node.result = currN;
      
      yield {
        description: `Base case reached: fib(${currN}) = ${currN}. Returning.`,
        recursionTree: cloneTree(),
        line: 3
      };
      return currN;
    }

    yield {
      description: `fib(${currN}) needs fib(${currN - 1}) and fib(${currN - 2}). Calling fib(${currN - 1}) first.`,
      recursionTree: cloneTree(),
      line: 6
    };

    const left = yield* helper(currN - 1, id);

    nodes.forEach(nd => nd.active = (nd.id === id));

    yield {
      description: `Returned to fib(${currN}). fib(${currN - 1}) = ${left}. Now calling fib(${currN - 2}).`,
      recursionTree: cloneTree(),
      line: 6
    };

    const right = yield* helper(currN - 2, id);
    
    nodes.forEach(nd => nd.active = (nd.id === id));
    const result = left + right;
    const node = nodes.find(nd => nd.id === id);
    node.result = result;
    
    yield {
      description: `Returned to fib(${currN}). Result is ${left} + ${right} = ${result}. Returning.`,
      recursionTree: cloneTree(),
      line: 7
    };
    
    return result;
  }

  const finalRes = yield* helper(n, null);
  
  nodes.forEach(nd => nd.active = false);
  yield {
    description: `Recursion complete! Final result = ${finalRes}.`,
    recursionTree: cloneTree(),
    line: null
  };
}

export const fibonacciCode = `int fib(int n) {
    if (n <= 1)
        return n;
        
    // Recursive calls
    return fib(n - 1) + fib(n - 2);
}`;

// Sum of N Generator
export function* sumOfNGenerator(n) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;

  const cloneTree = () => ({
    nodes: nodes.map(nd => ({ ...nd })),
    edges: [...edges]
  });

  function* helper(currN, parentId) {
    const id = idCounter++;
    nodes.push({ id, label: `sum(${currN})`, active: true, result: null });
    if (parentId !== null) {
      edges.push({ source: parentId, target: id });
    }
    
    nodes.forEach(nd => nd.active = (nd.id === id));

    yield {
      description: `Calling sum(${currN}).`,
      recursionTree: cloneTree(),
      line: 2
    };

    if (currN === 0) {
      const node = nodes.find(nd => nd.id === id);
      node.result = 0;
      
      yield {
        description: `Base case reached: sum(0) = 0. Returning.`,
        recursionTree: cloneTree(),
        line: 3
      };
      return 0;
    }

    yield {
      description: `sum(${currN}) needs ${currN} + sum(${currN - 1}). Calling sum(${currN - 1}).`,
      recursionTree: cloneTree(),
      line: 6
    };

    const subSum = yield* helper(currN - 1, id);
    
    nodes.forEach(nd => nd.active = (nd.id === id));
    const result = currN + subSum;
    const node = nodes.find(nd => nd.id === id);
    node.result = result;
    
    yield {
      description: `Returned to sum(${currN}). Result is ${currN} + ${subSum} = ${result}. Returning.`,
      recursionTree: cloneTree(),
      line: 6
    };
    
    return result;
  }

  const finalRes = yield* helper(n, null);
  
  nodes.forEach(nd => nd.active = false);
  yield {
    description: `Recursion complete! Final result = ${finalRes}.`,
    recursionTree: cloneTree(),
    line: null
  };
}

export const sumOfNCode = `int sum(int n) {
    if (n == 0)
        return 0;
        
    // Recursive call
    return n + sum(n - 1);
}`;

// Factorial Generator
export function* factorialGenerator(n) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;

  const cloneTree = () => ({
    nodes: nodes.map(nd => ({ ...nd })),
    edges: [...edges]
  });

  function* helper(currN, parentId) {
    const id = idCounter++;
    nodes.push({ id, label: `fact(${currN})`, active: true, result: null });
    if (parentId !== null) {
      edges.push({ source: parentId, target: id });
    }
    
    nodes.forEach(nd => nd.active = (nd.id === id));

    yield {
      description: `Calling fact(${currN}).`,
      recursionTree: cloneTree(),
      line: 2
    };

    if (currN <= 1) {
      const node = nodes.find(nd => nd.id === id);
      node.result = 1;
      
      yield {
        description: `Base case reached: fact(${currN}) = 1. Returning.`,
        recursionTree: cloneTree(),
        line: 3
      };
      return 1;
    }

    yield {
      description: `fact(${currN}) needs ${currN} * fact(${currN - 1}). Calling fact(${currN - 1}).`,
      recursionTree: cloneTree(),
      line: 6
    };

    const subFact = yield* helper(currN - 1, id);
    
    nodes.forEach(nd => nd.active = (nd.id === id));
    const result = currN * subFact;
    const node = nodes.find(nd => nd.id === id);
    node.result = result;
    
    yield {
      description: `Returned to fact(${currN}). Result is ${currN} * ${subFact} = ${result}. Returning.`,
      recursionTree: cloneTree(),
      line: 6
    };
    
    return result;
  }

  const finalRes = yield* helper(n, null);
  
  nodes.forEach(nd => nd.active = false);
  yield {
    description: `Recursion complete! Final result = ${finalRes}.`,
    recursionTree: cloneTree(),
    line: null
  };
}

export const factorialCode = `int fact(int n) {
    if (n <= 1)
        return 1;
        
    // Recursive call
    return n * fact(n - 1);
}`;

// Power Generator
export function* powerGenerator(base, exp) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;

  const cloneTree = () => ({
    nodes: nodes.map(nd => ({ ...nd })),
    edges: [...edges]
  });

  function* helper(b, e, parentId) {
    const id = idCounter++;
    nodes.push({ id, label: `pow(${b}, ${e})`, active: true, result: null });
    if (parentId !== null) {
      edges.push({ source: parentId, target: id });
    }
    
    nodes.forEach(nd => nd.active = (nd.id === id));

    yield {
      description: `Calling pow(${b}, ${e}).`,
      recursionTree: cloneTree(),
      line: 2
    };

    if (e === 0) {
      const node = nodes.find(nd => nd.id === id);
      node.result = 1;
      
      yield {
        description: `Base case reached: pow(${b}, 0) = 1. Returning.`,
        recursionTree: cloneTree(),
        line: 3
      };
      return 1;
    }

    yield {
      description: `pow(${b}, ${e}) needs ${b} * pow(${b}, ${e - 1}). Calling pow(${b}, ${e - 1}).`,
      recursionTree: cloneTree(),
      line: 6
    };

    const subPow = yield* helper(b, e - 1, id);
    
    nodes.forEach(nd => nd.active = (nd.id === id));
    const result = b * subPow;
    const node = nodes.find(nd => nd.id === id);
    node.result = result;
    
    yield {
      description: `Returned to pow(${b}, ${e}). Result is ${b} * ${subPow} = ${result}. Returning.`,
      recursionTree: cloneTree(),
      line: 6
    };
    
    return result;
  }

  const finalRes = yield* helper(base, exp, null);
  
  nodes.forEach(nd => nd.active = false);
  yield {
    description: `Recursion complete! Final result = ${finalRes}.`,
    recursionTree: cloneTree(),
    line: null
  };
}

export const powerCode = `int pow(int base, int exp) {
    if (exp == 0)
        return 1;
        
    // Recursive call
    return base * pow(base, exp - 1);
}`;
