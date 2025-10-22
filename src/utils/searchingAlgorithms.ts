import { SearchStep } from "@/components/SearchingVisualizer";

export const linearSearch = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Starting Linear Search for target value: ${target}`
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      checking: i,
      found: -1,
      searchRange: [],
      description: `Checking element at index ${i}: ${array[i]}`
    });

    if (array[i] === target) {
      steps.push({
        array: [...array],
        checking: -1,
        found: i,
        searchRange: [],
        description: `Found target ${target} at index ${i}!`
      });
      return steps;
    }
  }

  steps.push({
    array: [...array],
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Target ${target} not found in the array`
  });

  return steps;
};

export const binarySearch = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const array = [...arr];
  
  // Sort the array first if not sorted
  const sortedArray = [...array].sort((a, b) => a - b);
  const isSorted = JSON.stringify(array) === JSON.stringify(sortedArray);
  
  if (!isSorted) {
    steps.push({
      array: sortedArray,
      checking: -1,
      found: -1,
      searchRange: [],
      description: "Array must be sorted for Binary Search. Sorting array first..."
    });
  }

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: Array.from({ length: sortedArray.length }, (_, i) => i),
    description: `Starting Binary Search for target value: ${target}`
  });

  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: sortedArray,
      checking: mid,
      found: -1,
      searchRange: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Searching in range [${left}...${right}]. Checking middle element at index ${mid}: ${sortedArray[mid]}`
    });

    if (sortedArray[mid] === target) {
      steps.push({
        array: sortedArray,
        checking: -1,
        found: mid,
        searchRange: [],
        description: `Found target ${target} at index ${mid}!`
      });
      return steps;
    }

    if (sortedArray[mid] < target) {
      steps.push({
        array: sortedArray,
        checking: -1,
        found: -1,
        searchRange: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
        description: `${sortedArray[mid]} < ${target}. Searching right half...`
      });
      left = mid + 1;
    } else {
      steps.push({
        array: sortedArray,
        checking: -1,
        found: -1,
        searchRange: Array.from({ length: mid - left }, (_, i) => left + i),
        description: `${sortedArray[mid]} > ${target}. Searching left half...`
      });
      right = mid - 1;
    }
  }

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Target ${target} not found in the array`
  });

  return steps;
};

export const jumpSearch = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const array = [...arr];
  
  // Sort the array first if not sorted
  const sortedArray = [...array].sort((a, b) => a - b);
  const isSorted = JSON.stringify(array) === JSON.stringify(sortedArray);
  
  if (!isSorted) {
    steps.push({
      array: sortedArray,
      checking: -1,
      found: -1,
      searchRange: [],
      description: "Array must be sorted for Jump Search. Sorting array first..."
    });
  }

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Starting Jump Search for target value: ${target}`
  });

  const n = sortedArray.length;
  const jump = Math.floor(Math.sqrt(n));
  let prev = 0;

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Jump size: ${jump} (√${n})`
  });

  // Finding the block where element may be present
  let step = jump;
  while (step < n && sortedArray[Math.min(step, n) - 1] < target) {
    steps.push({
      array: sortedArray,
      checking: Math.min(step, n) - 1,
      found: -1,
      searchRange: Array.from({ length: step - prev }, (_, i) => prev + i),
      description: `Jumping to index ${Math.min(step, n) - 1}: ${sortedArray[Math.min(step, n) - 1]} < ${target}. Continue jumping...`
    });
    
    prev = step;
    step += jump;
  }

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: Array.from({ length: Math.min(step, n) - prev }, (_, i) => prev + i),
    description: `Block found. Performing linear search from index ${prev} to ${Math.min(step, n) - 1}`
  });

  // Linear search in the block
  while (prev < Math.min(step, n)) {
    steps.push({
      array: sortedArray,
      checking: prev,
      found: -1,
      searchRange: Array.from({ length: Math.min(step, n) - prev }, (_, i) => prev + i),
      description: `Checking element at index ${prev}: ${sortedArray[prev]}`
    });

    if (sortedArray[prev] === target) {
      steps.push({
        array: sortedArray,
        checking: -1,
        found: prev,
        searchRange: [],
        description: `Found target ${target} at index ${prev}!`
      });
      return steps;
    }
    prev++;
  }

  steps.push({
    array: sortedArray,
    checking: -1,
    found: -1,
    searchRange: [],
    description: `Target ${target} not found in the array`
  });

  return steps;
};
