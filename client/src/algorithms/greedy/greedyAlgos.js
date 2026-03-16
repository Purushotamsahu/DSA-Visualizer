// Fractional Knapsack Greedy Algorithm Generator

export function* fractionalKnapsackGenerator(itemsStr, capacity) {
  // Parse inputs
  let items = [];
  try {
    // Expected format: "[weight, value], [weight, value]"
    // We'll wrap it in array brackets to parse securely
    const parsed = JSON.parse(`[${itemsStr}]`);
    items = parsed.map((item, index) => ({
      id: index,
      weight: Number(item[0]),
      value: Number(item[1]),
      ratio: Number(item[1]) / Number(item[0]),
      taken: 0, // Fraction taken: 0 to 1
      status: 'pending' // pending, evaluating, taken, skipped
    }));
  } catch (e) {
    yield {
      description: `Error parsing items: ${e.message}`,
      knapsackState: null,
      line: null
    };
    return;
  }

  let currentWeight = 0;
  let totalValue = 0;

  const cloneState = (activeIdx = -1) => ({
    items: items.map((it, idx) => ({ ...it, isActive: idx === activeIdx })),
    capacity,
    currentWeight,
    totalValue
  });

  yield {
    description: `Parsed ${items.length} items. Target Capacity: ${capacity}.`,
    knapsackState: cloneState(),
    line: 2
  };

  // Sort items by value/weight ratio descending
  items.sort((a, b) => b.ratio - a.ratio);

  yield {
    description: `Sorted items by Value/Weight ratio in descending order.`,
    knapsackState: cloneState(),
    line: 8
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.status = 'evaluating';

    yield {
      description: `Evaluating item with Weight: ${item.weight}, Value: ${item.value} (Ratio: ${item.ratio.toFixed(2)}).`,
      knapsackState: cloneState(i),
      line: 11
    };

    if (currentWeight + item.weight <= capacity) {
      // Can take full item
      currentWeight += item.weight;
      totalValue += item.value;
      item.taken = 1;
      item.status = 'taken';

      yield {
        description: `Can take full item. Added Weight: ${item.weight}, Added Value: ${item.value}.`,
        knapsackState: cloneState(i),
        line: 12
      };
    } else {
      // Take fractional part
      const remainingCapacity = capacity - currentWeight;
      const fraction = remainingCapacity / item.weight;
      const addedValue = item.value * fraction;
      
      currentWeight += remainingCapacity;
      totalValue += addedValue;
      item.taken = fraction;
      item.status = 'fractional';

      yield {
        description: `Knapsack full! Taking ${ (fraction * 100).toFixed(0) }% of item. Added Weight: ${remainingCapacity}, Added Value: ${addedValue.toFixed(2)}.`,
        knapsackState: cloneState(i),
        line: 16
      };
      
      break; // Knapsack is full
    }
  }

  // Mark remaining as skipped
  items.forEach(it => {
    if (it.status === 'pending') it.status = 'skipped';
  });

  yield {
    description: `Algorithm complete. Total Value in Knapsack: ${totalValue.toFixed(2)}.`,
    knapsackState: cloneState(),
    line: 23
  };
}

export const fractionalKnapsackCode = `struct Item {
    int weight, value;
    Item(int w, int v) : weight(w), value(v) {}
};

bool compare(Item a, Item b) {
    double r1 = (double)a.value / a.weight;
    double r2 = (double)b.value / b.weight;
    return r1 > r2;
}

double fractionalKnapsack(int W, Item arr[], int n) {
    sort(arr, arr + n, compare);

    int currentWeight = 0;
    double finalValue = 0.0;

    for (int i = 0; i < n; i++) {
        if (currentWeight + arr[i].weight <= W) {
            currentWeight += arr[i].weight;
            finalValue += arr[i].value;
        } else {
            int remain = W - currentWeight;
            finalValue += arr[i].value * ((double)remain / arr[i].weight);
            break;
        }
    }
    return finalValue;
}`;
