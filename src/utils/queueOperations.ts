export type QueueStep = {
  queue: number[];
  operation: string;
  description: string;
  highlightIndices?: number[];
  front?: number;
  rear?: number;
};

export const queueEnqueue = (queue: number[], value: number, maxSize: number = 10): QueueStep[] => {
  const steps: QueueStep[] = [];
  const workingQueue = [...queue];

  if (workingQueue.length >= maxSize) {
    steps.push({
      queue: [...workingQueue],
      operation: "overflow",
      description: `Queue Overflow! Cannot enqueue. Max size: ${maxSize}`,
      front: 0,
      rear: workingQueue.length - 1
    });
    return steps;
  }

  steps.push({
    queue: [...workingQueue],
    operation: "enqueue-start",
    description: `Enqueueing ${value} to the rear`,
    front: 0,
    rear: workingQueue.length - 1
  });

  workingQueue.push(value);

  steps.push({
    queue: [...workingQueue],
    operation: "enqueue-complete",
    description: `${value} enqueued successfully. Queue size: ${workingQueue.length}`,
    highlightIndices: [workingQueue.length - 1],
    front: 0,
    rear: workingQueue.length - 1
  });

  return steps;
};

export const queueDequeue = (queue: number[]): QueueStep[] => {
  const steps: QueueStep[] = [];
  const workingQueue = [...queue];

  if (workingQueue.length === 0) {
    steps.push({
      queue: [],
      operation: "underflow",
      description: "Queue Underflow! Cannot dequeue from empty queue"
    });
    return steps;
  }

  const dequeuedValue = workingQueue[0];

  steps.push({
    queue: [...workingQueue],
    operation: "dequeue-start",
    description: `Dequeueing front element: ${dequeuedValue}`,
    highlightIndices: [0],
    front: 0,
    rear: workingQueue.length - 1
  });

  workingQueue.shift();

  steps.push({
    queue: [...workingQueue],
    operation: "dequeue-complete",
    description: `Dequeued ${dequeuedValue}. Queue size: ${workingQueue.length}`,
    front: workingQueue.length > 0 ? 0 : undefined,
    rear: workingQueue.length > 0 ? workingQueue.length - 1 : undefined
  });

  return steps;
};

export const queuePeekFront = (queue: number[]): QueueStep[] => {
  const steps: QueueStep[] = [];

  if (queue.length === 0) {
    steps.push({
      queue: [],
      operation: "empty",
      description: "Queue is empty. Nothing at front"
    });
    return steps;
  }

  steps.push({
    queue: [...queue],
    operation: "peek-front",
    description: `Front element: ${queue[0]}`,
    highlightIndices: [0],
    front: 0,
    rear: queue.length - 1
  });

  return steps;
};
