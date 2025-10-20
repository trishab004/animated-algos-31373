// Binary Search Tree Operations

export interface BSTNode {
  value: number;
  left: number | null;
  right: number | null;
}

export interface BSTStep {
  nodes: BSTNode[];
  root: number | null;
  operation: string;
  description: string;
  highlightedNodes?: number[];
  comparingNodes?: number[];
}

export const bstInsert = (nodes: BSTNode[], root: number | null, value: number): BSTStep[] => {
  const steps: BSTStep[] = [];
  const newNodes = [...nodes];
  
  steps.push({
    nodes: newNodes,
    root,
    operation: "start",
    description: `Inserting ${value} into BST`,
    highlightedNodes: []
  });

  const newNodeIndex = newNodes.length;
  newNodes.push({ value, left: null, right: null });

  if (root === null) {
    steps.push({
      nodes: newNodes,
      root: newNodeIndex,
      operation: "insert-root",
      description: `Tree is empty. ${value} becomes root`,
      highlightedNodes: [newNodeIndex]
    });
    return steps;
  }

  let currentIndex = root;
  let inserted = false;

  while (!inserted) {
    const current = newNodes[currentIndex];

    steps.push({
      nodes: newNodes,
      root,
      operation: "comparing",
      description: `Comparing ${value} with ${current.value}`,
      comparingNodes: [currentIndex]
    });

    if (value < current.value) {
      steps.push({
        nodes: newNodes,
        root,
        operation: "go-left",
        description: `${value} < ${current.value}, go left`,
        highlightedNodes: [currentIndex]
      });

      if (current.left === null) {
        current.left = newNodeIndex;
        steps.push({
          nodes: newNodes,
          root,
          operation: "inserted",
          description: `Inserted ${value} as left child of ${current.value}`,
          highlightedNodes: [currentIndex, newNodeIndex]
        });
        inserted = true;
      } else {
        currentIndex = current.left;
      }
    } else {
      steps.push({
        nodes: newNodes,
        root,
        operation: "go-right",
        description: `${value} ≥ ${current.value}, go right`,
        highlightedNodes: [currentIndex]
      });

      if (current.right === null) {
        current.right = newNodeIndex;
        steps.push({
          nodes: newNodes,
          root,
          operation: "inserted",
          description: `Inserted ${value} as right child of ${current.value}`,
          highlightedNodes: [currentIndex, newNodeIndex]
        });
        inserted = true;
      } else {
        currentIndex = current.right;
      }
    }
  }

  return steps;
};

export const bstSearch = (nodes: BSTNode[], root: number | null, value: number): BSTStep[] => {
  const steps: BSTStep[] = [];

  steps.push({
    nodes,
    root,
    operation: "start",
    description: `Searching for ${value} in BST`,
    highlightedNodes: []
  });

  if (root === null) {
    steps.push({
      nodes,
      root,
      operation: "not-found",
      description: "Tree is empty",
      highlightedNodes: []
    });
    return steps;
  }

  let currentIndex: number | null = root;
  let found = false;

  while (currentIndex !== null && !found) {
    const current = nodes[currentIndex];

    steps.push({
      nodes,
      root,
      operation: "comparing",
      description: `Comparing ${value} with ${current.value}`,
      comparingNodes: [currentIndex]
    });

    if (value === current.value) {
      steps.push({
        nodes,
        root,
        operation: "found",
        description: `Found ${value}!`,
        highlightedNodes: [currentIndex]
      });
      found = true;
    } else if (value < current.value) {
      steps.push({
        nodes,
        root,
        operation: "go-left",
        description: `${value} < ${current.value}, search left subtree`,
        highlightedNodes: [currentIndex]
      });
      currentIndex = current.left;
    } else {
      steps.push({
        nodes,
        root,
        operation: "go-right",
        description: `${value} > ${current.value}, search right subtree`,
        highlightedNodes: [currentIndex]
      });
      currentIndex = current.right;
    }
  }

  if (!found) {
    steps.push({
      nodes,
      root,
      operation: "not-found",
      description: `Value ${value} not found in BST`,
      highlightedNodes: []
    });
  }

  return steps;
};

export const bstDelete = (nodes: BSTNode[], root: number | null, value: number): BSTStep[] => {
  const steps: BSTStep[] = [];
  let newNodes = [...nodes];

  steps.push({
    nodes: newNodes,
    root,
    operation: "start",
    description: `Deleting ${value} from BST`,
    highlightedNodes: []
  });

  if (root === null) {
    steps.push({
      nodes: newNodes,
      root,
      operation: "not-found",
      description: "Tree is empty",
      highlightedNodes: []
    });
    return steps;
  }

  // Find the node to delete
  let currentIndex: number | null = root;
  let parentIndex: number | null = null;
  let isLeftChild = false;

  while (currentIndex !== null) {
    const current = newNodes[currentIndex];

    steps.push({
      nodes: newNodes,
      root,
      operation: "searching",
      description: `Searching for ${value}, checking ${current.value}`,
      highlightedNodes: [currentIndex]
    });

    if (value === current.value) {
      steps.push({
        nodes: newNodes,
        root,
        operation: "found",
        description: `Found ${value} to delete`,
        highlightedNodes: [currentIndex]
      });

      // Case 1: Node is a leaf
      if (current.left === null && current.right === null) {
        steps.push({
          nodes: newNodes,
          root: parentIndex === null && currentIndex === root ? null : root,
          operation: "delete-leaf",
          description: `${value} is a leaf node, removing it`,
          highlightedNodes: [currentIndex]
        });

        if (parentIndex === null) {
          return steps;
        } else {
          const parent = newNodes[parentIndex];
          if (isLeftChild) parent.left = null;
          else parent.right = null;
        }
      }
      // Case 2: Node has one child
      else if (current.left === null || current.right === null) {
        const childIndex = current.left !== null ? current.left : current.right;
        
        steps.push({
          nodes: newNodes,
          root: parentIndex === null ? childIndex : root,
          operation: "delete-one-child",
          description: `${value} has one child, replacing with child`,
          highlightedNodes: [currentIndex, childIndex!]
        });

        if (parentIndex === null) {
          return steps;
        } else {
          const parent = newNodes[parentIndex];
          if (isLeftChild) parent.left = childIndex;
          else parent.right = childIndex;
        }
      }
      // Case 3: Node has two children - find inorder successor
      else {
        let successorParent = currentIndex;
        let successor = current.right!;

        while (newNodes[successor].left !== null) {
          successorParent = successor;
          successor = newNodes[successor].left!;
        }

        steps.push({
          nodes: newNodes,
          root,
          operation: "finding-successor",
          description: `Finding inorder successor (leftmost in right subtree)`,
          highlightedNodes: [currentIndex, successor]
        });

        // Replace value
        newNodes[currentIndex].value = newNodes[successor].value;

        steps.push({
          nodes: newNodes,
          root,
          operation: "replacing",
          description: `Replacing ${value} with successor ${newNodes[successor].value}`,
          highlightedNodes: [currentIndex, successor]
        });

        // Delete successor
        if (successorParent === currentIndex) {
          newNodes[successorParent].right = newNodes[successor].right;
        } else {
          newNodes[successorParent].left = newNodes[successor].right;
        }
      }

      break;
    } else if (value < current.value) {
      parentIndex = currentIndex;
      currentIndex = current.left;
      isLeftChild = true;
    } else {
      parentIndex = currentIndex;
      currentIndex = current.right;
      isLeftChild = false;
    }
  }

  if (currentIndex === null) {
    steps.push({
      nodes: newNodes,
      root,
      operation: "not-found",
      description: `Value ${value} not found in BST`,
      highlightedNodes: []
    });
  }

  return steps;
};
