
/**
 * Basic C++ to JS Transpiler for Simulation
 * Transforms recursive C++ code into a JavaScript Generator function
 * that yields state changes for visualization.
 */

export const compileCppToGenerator = (cppCode, type = 'recursion') => {
  let jsCode = cppCode;
  
  // 1. Basic cleaning
  jsCode = jsCode.replace(/#include.*\n/g, '');
  jsCode = jsCode.replace(/using namespace.*\n/g, '');
  
  // 2. Handle common C++ specific syntax
  jsCode = jsCode.replace(/std::/g, '');
  jsCode = jsCode.replace(/size_t/g, 'number');
  jsCode = jsCode.replace(/::/g, '_');
  
  // Handle unicode operators
  jsCode = jsCode.replace(/≤/g, '<=');
  jsCode = jsCode.replace(/≥/g, '>=');
  jsCode = jsCode.replace(/≠/g, '!=');

  // 3. Transform function declarations
  const funcMatch = cppCode.match(/(?:int|long|float|double|bool|string|void|vector<.*?>)\s+([a-zA-Z_]\w*)\s*\(/);
  const funcName = funcMatch ? funcMatch[1] : null;

  if (funcName) {
    jsCode = jsCode.replace(new RegExp(`(?:int|long|float|double|bool|string|void|vector<.*?>)\\s+${funcName}\\s*\\(([^)]*)\\)`, 'g'), 
      (match, params) => {
        const cleanedParams = params.split(',').map(p => {
          return p.replace(/vector<.*?>&?/g, '').replace(/(?:int|long|float|double|bool|string)\s*/g, '').replace(/&/g, '').trim();
        }).join(', ');
        return `let ${funcName} = function*(${cleanedParams})`;
      }
    );

    // 4. Transform recursive calls to yield*
    const recursiveCallRegex = new RegExp(`(?<!function\\*\\s+)\\b${funcName}\\(`, 'g');
    jsCode = jsCode.replace(recursiveCallRegex, `yield* ${funcName}(`);
  }

  // 5. Transform internal variable declarations
  jsCode = jsCode.replace(/\b(?:int|long|float|double|bool|string|auto)\b\s+([a-zA-Z_]\w*)\s*(?==|;)/g, 'let $1 ');
  jsCode = jsCode.replace(/\bvector<.*?>\s+([a-zA-Z_]\w*)/g, 'let $1');

  // 6. Common C++ math
  jsCode = jsCode.replace(/\bmax\s*\(/g, 'Math.max(');
  jsCode = jsCode.replace(/\bmin\s*\(/g, 'Math.min(');
  jsCode = jsCode.replace(/\babs\s*\(/g, 'Math.abs(');

  // 7. Loop Variable Tracking (Experimental Injection)
  // Look for for(int i=...; ...) and inject a yield after the opening {
  // We handle i, j, k, r, c, idx
  const loopVars = ['i', 'j', 'k', 'r', 'c', 'idx'];
  loopVars.forEach(v => {
    const loopRegex = new RegExp(`for\\s*\\(\\s*(?:let|int|size_t|auto)\\s+${v}\\s*=[^;]+;[^;]+;[^)]+\\)\\s*{`, 'g');
    jsCode = jsCode.replace(loopRegex, (match) => {
      return `${match} yield { variables: { ${v}: ${v} }, description: 'Looping ${v} = ' + ${v} };`;
    });
  });

  let finalWrapper = "";

  if (type === 'recursion' || type === 'memoization') {
    finalWrapper = `
      let nodeIdCounter = 0;
      const tree = { nodes: [], edges: [] };
      const memo = {};
      
      return function* simulationRunner(initArgs) {
        try {
          ${jsCode}
          
          if (typeof ${funcName || 'non_existent'} !== 'function') {
            yield { description: "Simulation failed: Function '${funcName}' not found or incorrectly parsed." };
            return;
          }
          
          const originalUserFunc = ${funcName};
          
          function* proxiedHelper(...args) {
            const id = 'node-' + nodeIdCounter++;
            const argKey = args.join(',');
            const label = '${funcName}(' + args.map(a => Array.isArray(a) ? '['+a.length+']' : a).join(',') + ')';
            
            if ("${type}" === "memoization" && memo[argKey] !== undefined) {
               yield { memo: JSON.parse(JSON.stringify(memo)), description: "Returning cached value for " + label };
               return memo[argKey];
            }

            const node = { id, label, active: true, result: null };
            tree.nodes.push(node);
            
            yield { tree: JSON.parse(JSON.stringify(tree)), memo: JSON.parse(JSON.stringify(memo)), description: 'Calling ' + label };
            
            const prevFunc = ${funcName};
            ${funcName} = proxiedHelper;
            
            const res = yield* originalUserFunc(...args);
            
            ${funcName} = prevFunc;
            
            node.active = false;
            node.result = res;
            if ("${type}" === "memoization") memo[argKey] = res;

            yield { tree: JSON.parse(JSON.stringify(tree)), memo: JSON.parse(JSON.stringify(memo)), description: label + ' returned ' + res };
            return res;
          }
          
          yield* proxiedHelper(...initArgs);
        } catch (e) {
          yield { description: "Simulation Runtime Error: " + e.message };
        }
      };
    `;
  } else if (type === 'tabulation') {
    // For tabulation, we expect a loop structure. 
    // This is hard to generalize, so we'll provide a very basic support 
    // where the user can use 'visualizeTable(index, value)' or similar helper.
    finalWrapper = `
      const table = [];
      const table2D = null; // Could extend to 2D
      
      return function* simulationRunner(initArgs) {
        try {
          // Provide visualization helpers to the C++ (transpiled to JS) context
          const setTable = (idx, val) => {
             table[idx] = val;
          };

          ${jsCode}

          // If the user didn't call a function, but just wrote main logic
          if (typeof ${funcName} === 'function') {
             yield* ${funcName}(...initArgs);
          } else {
             // Maybe it's just raw code
             yield { description: "Running tabulation steps..." };
          }

        } catch (e) {
          yield { description: "Simulation Runtime Error: " + e.message };
        }
      };
    `;
  }

  try {
    const factory = new Function(finalWrapper);
    return factory();
  } catch (err) {
    console.error("Transpile Error", err);
    return null;
  }
};

export const parseArgs = (input) => {
  try {
    const trimmed = input.trim();
    if (!trimmed) return [];
    const jsonStr = trimmed.startsWith('[') && trimmed.endsWith(']') ? trimmed : `[${trimmed}]`;
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return input.split(',').map(s => {
      const t = s.trim();
      return isNaN(t) ? t : Number(t);
    });
  }
};
