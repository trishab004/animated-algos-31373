// Heap Operations (Min & Max Heap)

export interface HeapStep {
  array: number[];
  heapType: "min" | "max";
  operation: string;
  description: string;
  highlightedIndices?: number[];
  comparingIndices?: number[];
}

const parent = (i: number) => Math.floor((i - 1) / 2);
const leftChild = (i: number) => 2 * i + 1;
const rightChild = (i: number) => 2 * i + 2;

export const heapBuild = (array: number[], heapType: "min" | "max"): HeapStep[] => {
  const steps: HeapStep[] = [];
  const heap = [...array];

  steps.push({
    array: heap,
    heapType,
    operation: "start",
    description: `Building ${heapType} heap from array`,
    highlightedIndices: []
  });

  // Heapify from last non-leaf node to root
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    heapifyDown(heap, i, heap.length, heapType, steps);
  }

  steps.push({
    array: heap,
    heapType,
    operation: "complete",
    description: `${heapType} heap built successfully`,
    highlightedIndices: []
  });

  return steps;
};

const heapifyDown = (
  heap: number[],
  index: number,
  size: number,
  heapType: "min" | "max",
  steps: HeapStep[]
) => {
  let target = index;
  const left = leftChild(index);
  const right = rightChild(index);

  steps.push({
    array: [...heap],
    heapType,
    operation: "heapify-down",
    description: `Heapifying node at index ${index} (value: ${heap[index]})`,
    highlightedIndices: [index]
  });

  // Compare with children
  if (left < size) {
    steps.push({
      array: [...heap],
      heapType,
      operation: "comparing",
      description: `Comparing ${heap[index]} with left child ${heap[left]}`,
      comparingIndices: [index, left]
    });

    if (heapType === "min" ? heap[left] < heap[target] : heap[left] > heap[target]) {
      target = left;
    }
  }

  if (right < size) {
    steps.push({
      array: [...heap],
      heapType,
      operation: "comparing",
      description: `Comparing ${heap[target]} with right child ${heap[right]}`,
      comparingIndices: [target, right]
    });

    if (heapType === "min" ? heap[right] < heap[target] : heap[right] > heap[target]) {
      target = right;
    }
  }

  if (target !== index) {
    steps.push({
      array: [...heap],
      heapType,
      operation: "swapping",
      description: `Swapping ${heap[index]} and ${heap[target]} to maintain heap property`,
      highlightedIndices: [index, target]
    });

    [heap[index], heap[target]] = [heap[target], heap[index]];

    steps.push({
      array: [...heap],
      heapType,
      operation: "swapped",
      description: `Swapped, continuing to heapify down`,
      highlightedIndices: [target]
    });

    heapifyDown(heap, target, size, heapType, steps);
  }
};

export const heapInsert = (heap: number[], value: number, heapType: "min" | "max"): HeapStep[] => {
  const steps: HeapStep[] = [];
  const newHeap = [...heap];

  steps.push({
    array: newHeap,
    heapType,
    operation: "start",
    description: `Inserting ${value} into ${heapType} heap`,
    highlightedIndices: []
  });

  newHeap.push(value);
  let index = newHeap.length - 1;

  steps.push({
    array: newHeap,
    heapType,
    operation: "inserted",
    description: `Added ${value} at the end (index ${index})`,
    highlightedIndices: [index]
  });

  // Bubble up
  while (index > 0) {
    const parentIndex = parent(index);
    const parentValue = newHeap[parentIndex];

    steps.push({
      array: newHeap,
      heapType,
      operation: "comparing",
      description: `Comparing ${value} with parent ${parentValue}`,
      comparingIndices: [index, parentIndex]
    });

    const shouldSwap = heapType === "min" 
      ? newHeap[index] < parentValue 
      : newHeap[index] > parentValue;

    if (shouldSwap) {
      steps.push({
        array: newHeap,
        heapType,
        operation: "bubbling-up",
        description: `${value} violates heap property, swapping with parent`,
        highlightedIndices: [index, parentIndex]
      });

      [newHeap[index], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[index]];
      index = parentIndex;
    } else {
      steps.push({
        array: newHeap,
        heapType,
        operation: "complete",
        description: `Heap property satisfied, insertion complete`,
        highlightedIndices: [index]
      });
      break;
    }
  }

  return steps;
};

export const heapExtract = (heap: number[], heapType: "min" | "max"): HeapStep[] => {
  const steps: HeapStep[] = [];
  
  if (heap.length === 0) {
    steps.push({
      array: [],
      heapType,
      operation: "empty",
      description: "Heap is empty, nothing to extract",
      highlightedIndices: []
    });
    return steps;
  }

  const newHeap = [...heap];
  const extracted = newHeap[0];

  steps.push({
    array: newHeap,
    heapType,
    operation: "start",
    description: `Extracting ${heapType === "min" ? "minimum" : "maximum"} value: ${extracted}`,
    highlightedIndices: [0]
  });

  if (newHeap.length === 1) {
    steps.push({
      array: [],
      heapType,
      operation: "complete",
      description: `Extracted ${extracted}, heap is now empty`,
      highlightedIndices: []
    });
    return steps;
  }

  // Replace root with last element
  newHeap[0] = newHeap[newHeap.length - 1];
  newHeap.pop();

  steps.push({
    array: newHeap,
    heapType,
    operation: "replaced",
    description: `Moved last element ${newHeap[0]} to root, now heapifying down`,
    highlightedIndices: [0]
  });

  heapifyDown(newHeap, 0, newHeap.length, heapType, steps);

  steps.push({
    array: newHeap,
    heapType,
    operation: "complete",
    description: `Extraction complete, extracted ${extracted}`,
    highlightedIndices: []
  });

  return steps;
};

export const heapPeek = (heap: number[], heapType: "min" | "max"): HeapStep[] => {
  const steps: HeapStep[] = [];

  if (heap.length === 0) {
    steps.push({
      array: heap,
      heapType,
      operation: "empty",
      description: "Heap is empty",
      highlightedIndices: []
    });
    return steps;
  }

  steps.push({
    array: heap,
    heapType,
    operation: "peek",
    description: `${heapType === "min" ? "Minimum" : "Maximum"} value is ${heap[0]} at root`,
    highlightedIndices: [0]
  });

  return steps;
};
