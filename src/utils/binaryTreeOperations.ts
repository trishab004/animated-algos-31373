// Binary Tree Operations with Traversals

export interface TreeNode {
  value: number;
  left: number | null;
  right: number | null;
}

export interface BinaryTreeStep {
  nodes: TreeNode[];
  root: number | null;
  operation: string;
  description: string;
  highlightedNodes?: number[];
  traversalOrder?: number[];
}

export const binaryTreeInsert = (nodes: TreeNode[], root: number | null, value: number): BinaryTreeStep[] => {
  const steps: BinaryTreeStep[] = [];
  const newNodes = [...nodes];
  
  steps.push({
    nodes: newNodes,
    root,
    operation: "start",
    description: `Inserting value ${value} into binary tree`,
    highlightedNodes: []
  });

  const newNodeIndex = newNodes.length;
  newNodes.push({ value, left: null, right: null });

  if (root === null) {
    steps.push({
      nodes: newNodes,
      root: newNodeIndex,
      operation: "insert-root",
      description: `Tree is empty. ${value} becomes the root`,
      highlightedNodes: [newNodeIndex]
    });
    return steps;
  }

  // Level-order insertion (complete tree)
  const queue: number[] = [root];
  let inserted = false;

  while (queue.length > 0 && !inserted) {
    const currentIndex = queue.shift()!;
    const current = newNodes[currentIndex];

    steps.push({
      nodes: newNodes,
      root,
      operation: "searching",
      description: `Checking node ${current.value} for empty position`,
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
    } else if (current.right === null) {
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
      queue.push(current.left);
      queue.push(current.right);
    }
  }

  return steps;
};

export const binaryTreeInorder = (nodes: TreeNode[], root: number | null): BinaryTreeStep[] => {
  const steps: BinaryTreeStep[] = [];
  const traversalOrder: number[] = [];

  steps.push({
    nodes,
    root,
    operation: "start",
    description: "Starting Inorder Traversal (Left → Root → Right)",
    highlightedNodes: [],
    traversalOrder: []
  });

  const inorderHelper = (index: number | null) => {
    if (index === null) return;

    const node = nodes[index];
    
    // Visit left
    if (node.left !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-left",
        description: `Going to left subtree of ${node.value}`,
        highlightedNodes: [index, node.left],
        traversalOrder: [...traversalOrder]
      });
      inorderHelper(node.left);
    }

    // Visit current
    traversalOrder.push(index);
    steps.push({
      nodes,
      root,
      operation: "visiting",
      description: `Visiting node ${node.value}`,
      highlightedNodes: [index],
      traversalOrder: [...traversalOrder]
    });

    // Visit right
    if (node.right !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-right",
        description: `Going to right subtree of ${node.value}`,
        highlightedNodes: [index, node.right],
        traversalOrder: [...traversalOrder]
      });
      inorderHelper(node.right);
    }
  };

  inorderHelper(root);

  steps.push({
    nodes,
    root,
    operation: "complete",
    description: `Inorder traversal complete: ${traversalOrder.map(i => nodes[i].value).join(" → ")}`,
    highlightedNodes: [],
    traversalOrder
  });

  return steps;
};

export const binaryTreePreorder = (nodes: TreeNode[], root: number | null): BinaryTreeStep[] => {
  const steps: BinaryTreeStep[] = [];
  const traversalOrder: number[] = [];

  steps.push({
    nodes,
    root,
    operation: "start",
    description: "Starting Preorder Traversal (Root → Left → Right)",
    highlightedNodes: [],
    traversalOrder: []
  });

  const preorderHelper = (index: number | null) => {
    if (index === null) return;

    const node = nodes[index];
    
    // Visit current first
    traversalOrder.push(index);
    steps.push({
      nodes,
      root,
      operation: "visiting",
      description: `Visiting node ${node.value}`,
      highlightedNodes: [index],
      traversalOrder: [...traversalOrder]
    });

    // Visit left
    if (node.left !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-left",
        description: `Going to left subtree of ${node.value}`,
        highlightedNodes: [index, node.left],
        traversalOrder: [...traversalOrder]
      });
      preorderHelper(node.left);
    }

    // Visit right
    if (node.right !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-right",
        description: `Going to right subtree of ${node.value}`,
        highlightedNodes: [index, node.right],
        traversalOrder: [...traversalOrder]
      });
      preorderHelper(node.right);
    }
  };

  preorderHelper(root);

  steps.push({
    nodes,
    root,
    operation: "complete",
    description: `Preorder traversal complete: ${traversalOrder.map(i => nodes[i].value).join(" → ")}`,
    highlightedNodes: [],
    traversalOrder
  });

  return steps;
};

export const binaryTreePostorder = (nodes: TreeNode[], root: number | null): BinaryTreeStep[] => {
  const steps: BinaryTreeStep[] = [];
  const traversalOrder: number[] = [];

  steps.push({
    nodes,
    root,
    operation: "start",
    description: "Starting Postorder Traversal (Left → Right → Root)",
    highlightedNodes: [],
    traversalOrder: []
  });

  const postorderHelper = (index: number | null) => {
    if (index === null) return;

    const node = nodes[index];
    
    // Visit left
    if (node.left !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-left",
        description: `Going to left subtree of ${node.value}`,
        highlightedNodes: [index, node.left],
        traversalOrder: [...traversalOrder]
      });
      postorderHelper(node.left);
    }

    // Visit right
    if (node.right !== null) {
      steps.push({
        nodes,
        root,
        operation: "traversing-right",
        description: `Going to right subtree of ${node.value}`,
        highlightedNodes: [index, node.right],
        traversalOrder: [...traversalOrder]
      });
      postorderHelper(node.right);
    }

    // Visit current last
    traversalOrder.push(index);
    steps.push({
      nodes,
      root,
      operation: "visiting",
      description: `Visiting node ${node.value}`,
      highlightedNodes: [index],
      traversalOrder: [...traversalOrder]
    });
  };

  postorderHelper(root);

  steps.push({
    nodes,
    root,
    operation: "complete",
    description: `Postorder traversal complete: ${traversalOrder.map(i => nodes[i].value).join(" → ")}`,
    highlightedNodes: [],
    traversalOrder
  });

  return steps;
};

export const binaryTreeSearch = (nodes: TreeNode[], root: number | null, value: number): BinaryTreeStep[] => {
  const steps: BinaryTreeStep[] = [];

  steps.push({
    nodes,
    root,
    operation: "start",
    description: `Searching for value ${value} in binary tree`,
    highlightedNodes: []
  });

  const queue: number[] = root !== null ? [root] : [];
  let found = false;

  while (queue.length > 0 && !found) {
    const currentIndex = queue.shift()!;
    const current = nodes[currentIndex];

    steps.push({
      nodes,
      root,
      operation: "comparing",
      description: `Checking node ${current.value}`,
      highlightedNodes: [currentIndex]
    });

    if (current.value === value) {
      steps.push({
        nodes,
        root,
        operation: "found",
        description: `Found ${value}!`,
        highlightedNodes: [currentIndex]
      });
      found = true;
    } else {
      if (current.left !== null) queue.push(current.left);
      if (current.right !== null) queue.push(current.right);
    }
  }

  if (!found) {
    steps.push({
      nodes,
      root,
      operation: "not-found",
      description: `Value ${value} not found in tree`,
      highlightedNodes: []
    });
  }

  return steps;
};
