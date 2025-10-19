export type StackStep = {
  stack: number[];
  operation: string;
  description: string;
  highlightIndex?: number;
};

export const stackPush = (stack: number[], value: number): StackStep[] => {
  const steps: StackStep[] = [];
  const workingStack = [...stack];

  steps.push({
    stack: [...workingStack],
    operation: "push-start",
    description: `Pushing ${value} onto the stack`
  });

  workingStack.push(value);

  steps.push({
    stack: [...workingStack],
    operation: "push-complete",
    description: `${value} pushed successfully. Stack size: ${workingStack.length}`,
    highlightIndex: workingStack.length - 1
  });

  return steps;
};

export const stackPop = (stack: number[]): StackStep[] => {
  const steps: StackStep[] = [];
  const workingStack = [...stack];

  if (workingStack.length === 0) {
    steps.push({
      stack: [],
      operation: "underflow",
      description: "Stack Underflow! Cannot pop from empty stack"
    });
    return steps;
  }

  const poppedValue = workingStack[workingStack.length - 1];

  steps.push({
    stack: [...workingStack],
    operation: "pop-start",
    description: `Popping top element: ${poppedValue}`,
    highlightIndex: workingStack.length - 1
  });

  workingStack.pop();

  steps.push({
    stack: [...workingStack],
    operation: "pop-complete",
    description: `Popped ${poppedValue}. Stack size: ${workingStack.length}`
  });

  return steps;
};

export const stackPeek = (stack: number[]): StackStep[] => {
  const steps: StackStep[] = [];

  if (stack.length === 0) {
    steps.push({
      stack: [],
      operation: "empty",
      description: "Stack is empty. Nothing to peek"
    });
    return steps;
  }

  const topValue = stack[stack.length - 1];

  steps.push({
    stack: [...stack],
    operation: "peek",
    description: `Top element: ${topValue}`,
    highlightIndex: stack.length - 1
  });

  return steps;
};
