// Graph Operations and Algorithms

export interface GraphNode {
  id: number;
  value: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  operation: string;
  description: string;
  highlightedNodes?: number[];
  highlightedEdges?: [number, number][];
  visitedNodes?: number[];
  currentNode?: number;
  distance?: Map<number, number>;
}

export const graphBFS = (nodes: GraphNode[], edges: GraphEdge[], startId: number): GraphStep[] => {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [startId];

  steps.push({
    nodes,
    edges,
    operation: "start",
    description: `Starting BFS from node ${startId}`,
    highlightedNodes: [startId],
    visitedNodes: []
  });

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);

    steps.push({
      nodes,
      edges,
      operation: "visiting",
      description: `Visiting node ${currentId}`,
      currentNode: currentId,
      visitedNodes: Array.from(visited),
      highlightedNodes: [currentId]
    });

    // Find neighbors
    const neighbors = edges
      .filter(e => e.from === currentId)
      .map(e => e.to)
      .filter(id => !visited.has(id));

    for (const neighborId of neighbors) {
      if (!queue.includes(neighborId) && !visited.has(neighborId)) {
        queue.push(neighborId);
        
        steps.push({
          nodes,
          edges,
          operation: "discovering",
          description: `Discovered node ${neighborId} from ${currentId}`,
          currentNode: currentId,
          visitedNodes: Array.from(visited),
          highlightedNodes: [currentId, neighborId],
          highlightedEdges: [[currentId, neighborId]]
        });
      }
    }
  }

  steps.push({
    nodes,
    edges,
    operation: "complete",
    description: `BFS complete. Visited order: ${Array.from(visited).join(" → ")}`,
    visitedNodes: Array.from(visited),
    highlightedNodes: []
  });

  return steps;
};

export const graphDFS = (nodes: GraphNode[], edges: GraphEdge[], startId: number): GraphStep[] => {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();

  steps.push({
    nodes,
    edges,
    operation: "start",
    description: `Starting DFS from node ${startId}`,
    highlightedNodes: [startId],
    visitedNodes: []
  });

  const dfsHelper = (currentId: number) => {
    visited.add(currentId);

    steps.push({
      nodes,
      edges,
      operation: "visiting",
      description: `Visiting node ${currentId}`,
      currentNode: currentId,
      visitedNodes: Array.from(visited),
      highlightedNodes: [currentId]
    });

    // Find neighbors
    const neighbors = edges
      .filter(e => e.from === currentId)
      .map(e => e.to);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        steps.push({
          nodes,
          edges,
          operation: "exploring",
          description: `Exploring edge ${currentId} → ${neighborId}`,
          currentNode: currentId,
          visitedNodes: Array.from(visited),
          highlightedNodes: [currentId, neighborId],
          highlightedEdges: [[currentId, neighborId]]
        });

        dfsHelper(neighborId);

        steps.push({
          nodes,
          edges,
          operation: "backtracking",
          description: `Backtracking to node ${currentId}`,
          currentNode: currentId,
          visitedNodes: Array.from(visited),
          highlightedNodes: [currentId]
        });
      }
    }
  };

  dfsHelper(startId);

  steps.push({
    nodes,
    edges,
    operation: "complete",
    description: `DFS complete. Visited order: ${Array.from(visited).join(" → ")}`,
    visitedNodes: Array.from(visited),
    highlightedNodes: []
  });

  return steps;
};

// Helper function to show graph state
export const graphShowState = (nodes: GraphNode[], edges: GraphEdge[], operation: string, description: string): GraphStep[] => {
  return [{
    nodes,
    edges,
    operation,
    description,
    visitedNodes: [],
    highlightedNodes: []
  }];
};

export const graphDijkstra = (nodes: GraphNode[], edges: GraphEdge[], startId: number): GraphStep[] => {
  const steps: GraphStep[] = [];
  const distance = new Map<number, number>();
  const visited = new Set<number>();
  const unvisited = new Set(nodes.map(n => n.id));

  // Initialize distances
  nodes.forEach(node => {
    distance.set(node.id, node.id === startId ? 0 : Infinity);
  });

  steps.push({
    nodes,
    edges,
    operation: "start",
    description: `Starting Dijkstra's algorithm from node ${startId}`,
    highlightedNodes: [startId],
    distance: new Map(distance),
    visitedNodes: []
  });

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId = -1;
    let minDist = Infinity;

    for (const id of unvisited) {
      const dist = distance.get(id) || Infinity;
      if (dist < minDist) {
        minDist = dist;
        currentId = id;
      }
    }

    if (currentId === -1 || minDist === Infinity) break;

    unvisited.delete(currentId);
    visited.add(currentId);

    steps.push({
      nodes,
      edges,
      operation: "visiting",
      description: `Processing node ${currentId} with distance ${minDist}`,
      currentNode: currentId,
      visitedNodes: Array.from(visited),
      highlightedNodes: [currentId],
      distance: new Map(distance)
    });

    // Update distances to neighbors
    const outgoingEdges = edges.filter(e => e.from === currentId);

    for (const edge of outgoingEdges) {
      const neighborId = edge.to;
      if (visited.has(neighborId)) continue;

      const newDist = (distance.get(currentId) || 0) + (edge.weight || 1);
      const currentDist = distance.get(neighborId) || Infinity;

      steps.push({
        nodes,
        edges,
        operation: "relaxing",
        description: `Checking edge ${currentId} → ${neighborId} (weight: ${edge.weight || 1})`,
        currentNode: currentId,
        visitedNodes: Array.from(visited),
        highlightedNodes: [currentId, neighborId],
        highlightedEdges: [[currentId, neighborId]],
        distance: new Map(distance)
      });

      if (newDist < currentDist) {
        distance.set(neighborId, newDist);
        
        steps.push({
          nodes,
          edges,
          operation: "updated",
          description: `Updated distance to ${neighborId}: ${currentDist} → ${newDist}`,
          currentNode: currentId,
          visitedNodes: Array.from(visited),
          highlightedNodes: [neighborId],
          distance: new Map(distance)
        });
      }
    }
  }

  steps.push({
    nodes,
    edges,
    operation: "complete",
    description: `Dijkstra's algorithm complete`,
    visitedNodes: Array.from(visited),
    highlightedNodes: [],
    distance: new Map(distance)
  });

  return steps;
};
