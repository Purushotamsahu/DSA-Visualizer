// Merge Sort Generator

export function* mergeSortGenerator(arrStr) {
  let arr = [];
  try {
    arr = JSON.parse(`[${arrStr}]`).map(Number);
  } catch (e) {
    yield { description: `Error parsing array: ${e.message}`, line: null };
    return;
  }

  const n = arr.length;
  if (n === 0) return;

  const cloneState = (activeIndices = [], merging = [], sorted = []) => ({
    array: arr.slice(),
    activeIndices,
    mergingIndices: merging,
    sortedIndices: sorted
  });

  yield {
    description: `Starting Merge Sort on array of size ${n}.`,
    sortState: cloneState(),
    line: 12
  };

  const states = [];

  function* merge(left, mid, right) {
    yield {
      description: `Merging sub-arrays: [${left}..${mid}] and [${mid + 1}..${right}].`,
      sortState: cloneState([], Array.from({length: right - left + 1}, (_, i) => left + i)),
      line: 2
    };

    let n1 = mid - left + 1;
    let n2 = right - mid;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      yield {
        description: `Placed ${arr[k]} at index ${k}.`,
        sortState: cloneState([k], Array.from({length: right - left + 1}, (_, x) => left + x)),
        line: 8
      };
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      yield {
        description: `Placed remaining ${arr[k]} from left half to index ${k}.`,
        sortState: cloneState([k], Array.from({length: right - left + 1}, (_, x) => left + x)),
        line: 11
      };
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      yield {
        description: `Placed remaining ${arr[k]} from right half to index ${k}.`,
        sortState: cloneState([k], Array.from({length: right - left + 1}, (_, x) => left + x)),
        line: 13
      };
      j++;
      k++;
    }

    yield {
      description: `Merged completely: [${left}..${right}].`,
      sortState: cloneState([], [], Array.from({length: right - left + 1}, (_, x) => left + x)),
      line: 15
    };
  }

  function* mergeSort(left, right) {
    if (left >= right) return;
    let mid = Math.floor(left + (right - left) / 2);
    
    yield {
      description: `Dividing array [${left}..${right}] at mid ${mid}.`,
      sortState: cloneState([mid], [], []),
      line: 18
    };

    yield* mergeSort(left, mid);
    yield* mergeSort(mid + 1, right);
    yield* merge(left, mid, right);
  }

  yield* mergeSort(0, n - 1);

  yield {
    description: `Merge Sort Complete!`,
    sortState: cloneState([], [], Array.from({length: n}, (_, i) => i)),
    line: null
  };
}

export const mergeSortCode = `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) { arr[k] = L[i]; i++; }
        else { arr[k] = R[j]; j++; }
        k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`;


// Quick Sort Generator

export function* quickSortGenerator(arrStr) {
  let arr = [];
  try {
    arr = JSON.parse(`[${arrStr}]`).map(Number);
  } catch (e) {
    yield { description: `Error parsing array: ${e.message}`, line: null };
    return;
  }

  const n = arr.length;
  if (n === 0) return;

  const cloneState = (active = [], pivot = -1, sorted = []) => ({
    array: arr.slice(),
    activeIndices: active,
    pivotIndex: pivot,
    sortedIndices: sorted
  });

  const sortedCache = [];

  yield {
    description: `Starting Quick Sort on array of size ${n}.`,
    sortState: cloneState(),
    line: 12
  };

  function swap(i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  function* partition(low, high) {
    let pivotData = arr[high];
    
    yield {
      description: `Partitioning [${low}..${high}]. Selected pivot: ${pivotData} at index ${high}.`,
      sortState: cloneState([], high, sortedCache),
      line: 2
    };

    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
      yield {
        description: `Comparing ${arr[j]} with pivot ${pivotData}.`,
        sortState: cloneState([j], high, sortedCache),
        line: 5
      };

      if (arr[j] < pivotData) {
        i++;
        swap(i, j);
        yield {
          description: `${arr[i]} < ${pivotData}. Swapped elements at ${i} and ${j}.`,
          sortState: cloneState([i, j], high, sortedCache),
          line: 7
        };
      }
    }
    swap(i + 1, high);
    sortedCache.push(i + 1); // Pivot is now in exactly its correct sorted place
    
    yield {
      description: `Partition complete. Placed pivot ${pivotData} at correctly sorted index ${i + 1}.`,
      sortState: cloneState([], i + 1, sortedCache),
      line: 10
    };
    
    return (i + 1);
  }

  function* quickSort(low, high) {
    if (low < high) {
      yield {
        description: `QuickSorting sub-array [${low}..${high}].`,
        sortState: cloneState([low, high], -1, sortedCache),
        line: 14
      };

      let pi = yield* partition(low, high);

      yield* quickSort(low, pi - 1);
      yield* quickSort(pi + 1, high);
    } else if (low === high) {
      if (!sortedCache.includes(low)) sortedCache.push(low);
    }
  }

  yield* quickSort(0, n - 1);
  
  // Sweep cleanup to ensure all are sorted
  for (let i = 0; i < n; i++) if (!sortedCache.includes(i)) sortedCache.push(i);

  yield {
    description: `Quick Sort Complete!`,
    sortState: cloneState([], -1, sortedCache),
    line: null
  };
}

export const quickSortCode = `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`;
