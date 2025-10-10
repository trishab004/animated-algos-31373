import { SortStep } from "@/components/SortingVisualizer";

export const bubbleSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Starting Bubble Sort algorithm"
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
        description: `Comparing elements at positions ${j} and ${j + 1}: ${array[j]} and ${array[j + 1]}`
      });

      if (array[j] > array[j + 1]) {
        // Swapping
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
          description: `Swapping ${array[j]} and ${array[j + 1]} because ${array[j]} > ${array[j + 1]}`
        });

        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
          description: `Swapped! New positions: ${array[j]} at ${j}, ${array[j + 1]} at ${j + 1}`
        });
      }
    }
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    description: "Sorting complete! All elements are in order."
  });

  return steps;
};

export const quickSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Starting Quick Sort algorithm"
  });

  const partition = (low: number, high: number): number => {
    const pivot = array[high];
    steps.push({
      array: [...array],
      comparing: [high],
      swapping: [],
      sorted: [],
      description: `Choosing pivot element: ${pivot} at position ${high}`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: [],
        description: `Comparing ${array[j]} with pivot ${pivot}`
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            description: `Swapping ${array[i]} and ${array[j]}`
          });

          [array[i], array[j]] = [array[j], array[i]];

          steps.push({
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: [],
            description: `Elements swapped successfully`
          });
        }
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [],
      description: `Placing pivot ${pivot} in correct position`
    });

    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [i + 1],
      description: `Pivot ${pivot} is now in its final sorted position`
    });

    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, idx) => idx),
    description: "Quick Sort complete! All elements are sorted."
  });

  return steps;
};

export const mergeSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Starting Merge Sort algorithm"
  });

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      swapping: [],
      sorted: [],
      description: `Merging subarrays from index ${left} to ${right}`
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: [...array],
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Placed ${array[k]} at position ${k}`
      });

      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Copying remaining element ${array[k]} to position ${k}`
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        description: `Copying remaining element ${array[k]} to position ${k}`
      });
      j++;
      k++;
    }
  };

  const sort = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        array: [...array],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        swapping: [],
        sorted: [],
        description: `Dividing array from index ${left} to ${right}`
      });

      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  };

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, idx) => idx),
    description: "Merge Sort complete! All elements are sorted."
  });

  return steps;
};
