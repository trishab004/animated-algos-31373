export type ArrayStep = {
  array: number[];
  highlightIndices: number[];
  operation: string;
  description: string;
};

export const arrayInsert = (arr: number[], value: number, position: number): ArrayStep[] => {
  const steps: ArrayStep[] = [];
  const workingArray = [...arr];

  steps.push({
    array: [...workingArray],
    highlightIndices: [],
    operation: "insert",
    description: `Starting insertion of ${value} at position ${position}`
  });

  // Shift elements to the right
  for (let i = workingArray.length - 1; i >= position; i--) {
    steps.push({
      array: [...workingArray],
      highlightIndices: [i, i + 1],
      operation: "shifting",
      description: `Shifting element ${workingArray[i]} from index ${i} to ${i + 1}`
    });
  }

  // Insert the new value
  workingArray.splice(position, 0, value);
  steps.push({
    array: [...workingArray],
    highlightIndices: [position],
    operation: "inserted",
    description: `Inserted ${value} at position ${position}`
  });

  return steps;
};

export const arrayDelete = (arr: number[], position: number): ArrayStep[] => {
  const steps: ArrayStep[] = [];
  const workingArray = [...arr];

  if (position >= workingArray.length) {
    return steps;
  }

  const deletedValue = workingArray[position];

  steps.push({
    array: [...workingArray],
    highlightIndices: [position],
    operation: "delete",
    description: `Deleting element ${deletedValue} at position ${position}`
  });

  workingArray.splice(position, 1);

  // Show shifting left
  for (let i = position; i < workingArray.length; i++) {
    steps.push({
      array: [...workingArray],
      highlightIndices: [i],
      operation: "shifting",
      description: `Shifted element ${workingArray[i]} from index ${i + 1} to ${i}`
    });
  }

  steps.push({
    array: [...workingArray],
    highlightIndices: [],
    operation: "deleted",
    description: `Successfully deleted ${deletedValue}`
  });

  return steps;
};

export const arraySearch = (arr: number[], value: number): ArrayStep[] => {
  const steps: ArrayStep[] = [];

  steps.push({
    array: [...arr],
    highlightIndices: [],
    operation: "search",
    description: `Searching for ${value} in the array`
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      highlightIndices: [i],
      operation: "comparing",
      description: `Checking index ${i}: ${arr[i]} ${arr[i] === value ? '==' : '!='} ${value}`
    });

    if (arr[i] === value) {
      steps.push({
        array: [...arr],
        highlightIndices: [i],
        operation: "found",
        description: `Found ${value} at index ${i}!`
      });
      return steps;
    }
  }

  steps.push({
    array: [...arr],
    highlightIndices: [],
    operation: "not-found",
    description: `${value} not found in the array`
  });

  return steps;
};
