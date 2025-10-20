import { BSTStep } from "@/utils/bstOperations";
import { Card } from "./ui/card";

interface BSTVisualizerProps {
  steps: BSTStep[];
  currentStep: number;
}

export const BSTVisualizer = ({ steps, currentStep }: BSTVisualizerProps) => {
  if (!steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData || !currentStepData.nodes) return null;

  const { nodes, root, highlightedNodes = [], comparingNodes = [] } = currentStepData;

  // Calculate node positions for BST layout
  const positions = new Map<number, { x: number; y: number; level: number }>();
  
  if (root !== null) {
    const calculatePositions = (index: number | null, x: number, y: number, level: number, width: number) => {
      if (index === null || !nodes[index]) return;
      
      positions.set(index, { x, y, level });
      
      const node = nodes[index];
      const childWidth = width / 2;
      
      if (node.left !== null) {
        calculatePositions(node.left, x - childWidth / 2, y + 80, level + 1, childWidth);
      }
      if (node.right !== null) {
        calculatePositions(node.right, x + childWidth / 2, y + 80, level + 1, childWidth);
      }
    };
    
    calculatePositions(root, 300, 50, 0, 400);
  }

  const renderNode = (index: number) => {
    const pos = positions.get(index);
    if (!pos) return null;

    const node = nodes[index];
    const isHighlighted = highlightedNodes.includes(index);
    const isComparing = comparingNodes.includes(index);
    const isRoot = index === root;

    const fillColor = isComparing 
      ? "hsl(var(--accent))" 
      : isHighlighted 
        ? "hsl(var(--primary))" 
        : "hsl(var(--card))";

    return (
      <g key={index}>
        {/* Draw edges to children */}
        {node.left !== null && positions.has(node.left) && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.left)!.x}
            y2={positions.get(node.left)!.y - 20}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="4 2"
          />
        )}
        {node.right !== null && positions.has(node.right) && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.right)!.x}
            y2={positions.get(node.right)!.y - 20}
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="4 2"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r="22"
          fill={fillColor}
          stroke={isRoot ? "hsl(var(--accent))" : "hsl(var(--border))"}
          strokeWidth={isRoot ? "3" : "2"}
          className="transition-all duration-300"
          style={{
            filter: (isHighlighted || isComparing) ? "drop-shadow(0 0 10px currentColor)" : "none"
          }}
        />
        
        {/* Node value */}
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm font-bold"
          fill={isHighlighted || isComparing ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
        >
          {node.value}
        </text>
        
        {/* Root label */}
        {isRoot && (
          <text
            x={pos.x}
            y={pos.y - 38}
            textAnchor="middle"
            className="text-xs font-bold"
            fill="hsl(var(--accent))"
          >
            ROOT
          </text>
        )}

        {/* Left/Right labels */}
        {node.left !== null && positions.has(node.left) && (
          <text
            x={(pos.x + positions.get(node.left)!.x) / 2 - 10}
            y={(pos.y + positions.get(node.left)!.y) / 2}
            className="text-xs font-semibold"
            fill="hsl(var(--primary))"
          >
            L
          </text>
        )}
        {node.right !== null && positions.has(node.right) && (
          <text
            x={(pos.x + positions.get(node.right)!.x) / 2 + 10}
            y={(pos.y + positions.get(node.right)!.y) / 2}
            className="text-xs font-semibold"
            fill="hsl(var(--accent))"
          >
            R
          </text>
        )}
      </g>
    );
  };

  return (
    <Card className="glass p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Binary Search Tree</h3>
        
        {/* BST SVG */}
        <div className="bg-background/50 rounded-lg p-4 mb-4 overflow-x-auto">
          <svg width="600" height="400" className="mx-auto">
            {Array.from(positions.keys()).map(index => renderNode(index))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span>Highlighted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary rounded-full"></div>
            <span className="text-primary font-semibold">L = Left</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-accent rounded-full"></div>
            <span className="text-accent font-semibold">R = Right</span>
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
