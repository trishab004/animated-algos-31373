export type LinkedListNode = {
  value: number;
  next: number | null; // index of next node, null if tail
};

export type LinkedListStep = {
  nodes: LinkedListNode[];
  operation: string;
  description: string;
  highlightIndices?: number[];
  head: number | null;
};

export const linkedListInsertHead = (nodes: LinkedListNode[], head: number | null, value: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  const workingNodes = [...nodes];

  steps.push({
    nodes: [...workingNodes],
    operation: "insert-head-start",
    description: `Inserting ${value} at the head`,
    head
  });

  const newNode: LinkedListNode = {
    value,
    next: head
  };

  workingNodes.push(newNode);
  const newHead = workingNodes.length - 1;

  steps.push({
    nodes: [...workingNodes],
    operation: "insert-head-complete",
    description: `${value} inserted as new head`,
    highlightIndices: [newHead],
    head: newHead
  });

  return steps;
};

export const linkedListInsertTail = (nodes: LinkedListNode[], head: number | null, value: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  const workingNodes = [...nodes];

  if (head === null) {
    return linkedListInsertHead(workingNodes, head, value);
  }

  steps.push({
    nodes: [...workingNodes],
    operation: "insert-tail-start",
    description: `Finding tail to insert ${value}`,
    head
  });

  // Find tail
  let currentIndex = head;
  const traversePath: number[] = [currentIndex];
  
  while (workingNodes[currentIndex].next !== null) {
    currentIndex = workingNodes[currentIndex].next!;
    traversePath.push(currentIndex);
    
    steps.push({
      nodes: [...workingNodes],
      operation: "traversing",
      description: `Traversing to node with value ${workingNodes[currentIndex].value}`,
      highlightIndices: traversePath,
      head
    });
  }

  const newNode: LinkedListNode = {
    value,
    next: null
  };

  workingNodes.push(newNode);
  const newNodeIndex = workingNodes.length - 1;
  workingNodes[currentIndex].next = newNodeIndex;

  steps.push({
    nodes: [...workingNodes],
    operation: "insert-tail-complete",
    description: `${value} inserted at tail`,
    highlightIndices: [newNodeIndex],
    head
  });

  return steps;
};

export const linkedListDelete = (nodes: LinkedListNode[], head: number | null, value: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  const workingNodes = [...nodes];

  if (head === null) {
    steps.push({
      nodes: [],
      operation: "empty",
      description: "List is empty. Nothing to delete",
      head: null
    });
    return steps;
  }

  steps.push({
    nodes: [...workingNodes],
    operation: "delete-start",
    description: `Searching for node with value ${value}`,
    head
  });

  // Check if head needs to be deleted
  if (workingNodes[head].value === value) {
    const newHead = workingNodes[head].next;
    
    steps.push({
      nodes: [...workingNodes],
      operation: "delete-head",
      description: `Deleting head node with value ${value}`,
      highlightIndices: [head],
      head
    });

    // Remove the node (conceptually)
    steps.push({
      nodes: workingNodes.filter((_, idx) => idx !== head),
      operation: "delete-complete",
      description: `Deleted node with value ${value}`,
      head: newHead !== null && newHead > head ? newHead - 1 : newHead
    });

    return steps;
  }

  // Find the node to delete
  let currentIndex = head;
  let prevIndex = head;

  while (currentIndex !== null && workingNodes[currentIndex].value !== value) {
    prevIndex = currentIndex;
    currentIndex = workingNodes[currentIndex].next!;

    if (currentIndex !== null) {
      steps.push({
        nodes: [...workingNodes],
        operation: "searching",
        description: `Checking node with value ${workingNodes[currentIndex].value}`,
        highlightIndices: [currentIndex],
        head
      });
    }
  }

  if (currentIndex === null) {
    steps.push({
      nodes: [...workingNodes],
      operation: "not-found",
      description: `Node with value ${value} not found`,
      head
    });
    return steps;
  }

  // Delete the node
  workingNodes[prevIndex].next = workingNodes[currentIndex].next;

  steps.push({
    nodes: [...workingNodes],
    operation: "delete-complete",
    description: `Deleted node with value ${value}`,
    head
  });

  return steps;
};

export const linkedListReverse = (nodes: LinkedListNode[], head: number | null): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  
  if (head === null) {
    steps.push({
      nodes: [],
      operation: "empty",
      description: "List is empty. Nothing to reverse",
      head: null
    });
    return steps;
  }

  const workingNodes = nodes.map(node => ({ ...node }));

  steps.push({
    nodes: [...workingNodes],
    operation: "reverse-start",
    description: "Starting list reversal",
    head
  });

  let prev: number | null = null;
  let current: number | null = head;
  let stepCount = 0;

  while (current !== null) {
    const nextNode = workingNodes[current].next;
    
    steps.push({
      nodes: [...workingNodes],
      operation: "reversing",
      description: `Reversing pointer of node ${workingNodes[current].value}`,
      highlightIndices: [current],
      head
    });

    workingNodes[current].next = prev;
    prev = current;
    current = nextNode;
    stepCount++;
  }

  steps.push({
    nodes: [...workingNodes],
    operation: "reverse-complete",
    description: `List reversed successfully in ${stepCount} steps`,
    head: prev
  });

  return steps;
};
