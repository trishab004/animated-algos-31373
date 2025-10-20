import { GraphStep } from "@/utils/graphOperations";
import { Card } from "./ui/card";

interface GraphVisualizerProps {
  steps: GraphStep[];
  currentStep: number;
}

export const GraphVisualizer = ({ steps, currentStep }: GraphVisualizerProps) => {
  if (!steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData || !currentStepData.nodes) return null;

  const { nodes, edges, highlightedNodes = [], highlightedEdges = [], visitedNodes = [], distance } = currentStepData;

  // Simple circular layout for nodes if positions aren't set
  const nodePositions = nodes.map((node, index) => {
    if (node.x !== undefined && node.y !== undefined) {
      return { id: node.id, x: node.x, y: node.y };
    }
    
    const angle = (index * 2 * Math.PI) / nodes.length - Math.PI / 2;
    const radius = 120;
    const centerX = 300;
    const centerY = 200;
    
    return {
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodePosition = (nodeId: number) => {
    return nodePositions.find(p => p.id === nodeId) || { x: 0, y: 0 };
  };

  const isEdgeHighlighted = (from: number, to: number) => {
    return highlightedEdges.some(([f, t]) => f === from && t === to);
  };

  return (
    <Card className="glass p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Graph Visualization</h3>
        
        {/* Graph SVG */}
        <div className="bg-background/50 rounded-lg p-4 mb-4 overflow-x-auto">
          <svg width="600" height="400" className="mx-auto">
            {/* Draw edges first */}
            {edges.map((edge, index) => {
              const fromPos = getNodePosition(edge.from);
              const toPos = getNodePosition(edge.to);
              const isHighlighted = isEdgeHighlighted(edge.from, edge.to);
              
              return (
                <g key={index}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    strokeWidth={isHighlighted ? "3" : "2"}
                    opacity={isHighlighted ? "1" : "0.4"}
                    className="transition-all duration-300"
                    markerEnd={isHighlighted ? "url(#arrowhead-highlighted)" : "url(#arrowhead)"}
                  />
                  
                  {/* Edge weight label */}
                  {edge.weight !== undefined && (
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2 - 5}
                      textAnchor="middle"
                      className="text-xs font-semibold"
                      fill="hsl(var(--accent))"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Arrow markers */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill="hsl(var(--muted-foreground))"
                  opacity="0.4"
                />
              </marker>
              <marker
                id="arrowhead-highlighted"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill="hsl(var(--primary))"
                />
              </marker>
            </defs>

            {/* Draw nodes */}
            {nodes.map((node) => {
              const pos = getNodePosition(node.id);
              const isHighlighted = highlightedNodes.includes(node.id);
              const isVisited = visitedNodes.includes(node.id);
              const isCurrent = currentStepData.currentNode === node.id;
              
              return (
                <g key={node.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="22"
                    fill={
                      isCurrent 
                        ? "hsl(var(--accent))" 
                        : isHighlighted 
                          ? "hsl(var(--primary))" 
                          : isVisited 
                            ? "hsl(var(--primary) / 0.3)" 
                            : "hsl(var(--card))"
                    }
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    className="transition-all duration-300"
                    style={{
                      filter: (isHighlighted || isCurrent) ? "drop-shadow(0 0 10px currentColor)" : "none"
                    }}
                  />
                  
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm font-bold"
                    fill={isHighlighted || isCurrent ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                  >
                    {node.value}
                  </text>

                  {/* Distance label for Dijkstra */}
                  {distance && distance.has(node.id) && (
                    <text
                      x={pos.x}
                      y={pos.y + 35}
                      textAnchor="middle"
                      className="text-xs font-semibold"
                      fill="hsl(var(--accent))"
                    >
                      d: {distance.get(node.id) === Infinity ? "∞" : distance.get(node.id)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Visited order */}
        {visitedNodes.length > 0 && (
          <div className="mb-4 p-4 bg-primary/10 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Visited Order:</h4>
            <div className="flex flex-wrap gap-2">
              {visitedNodes.map((nodeId, i) => {
                const node = nodes.find(n => n.id === nodeId);
                return (
                  <div key={i} className="flex items-center">
                    <div className="px-3 py-1 rounded bg-primary/20 text-primary font-semibold">
                      {node?.value}
                    </div>
                    {i < visitedNodes.length - 1 && (
                      <span className="mx-1 text-muted-foreground">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span>Highlighted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/30"></div>
            <span>Visited</span>
          </div>
        </div>

        {/* Operation Description */}
        <div className="p-4 bg-accent/10 rounded-lg">
          <p className="text-sm font-medium text-accent">{currentStepData.operation}</p>
          <p className="text-foreground mt-1">{currentStepData.description}</p>
        </div>
      </div>
    </Card>
  );
};
