import { BinaryTreeStep } from "@/utils/binaryTreeOperations";
import { Card } from "./ui/card";

interface BinaryTreeVisualizerProps {
  steps: BinaryTreeStep[];
  currentStep: number;
}

export const BinaryTreeVisualizer = ({ steps, currentStep }: BinaryTreeVisualizerProps) => {
  if (!steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData || !currentStepData.nodes) return null;

  const { nodes, root, highlightedNodes = [], traversalOrder = [] } = currentStepData;

  // Calculate node positions using level-order layout
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
    const isRoot = index === root;

    return (
      <g key={index}>
        {/* Draw edges to children */}
        {node.left !== null && positions.has(node.left) && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.left)!.x}
            y2={positions.get(node.left)!.y - 20}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            opacity="0.6"
          />
        )}
        {node.right !== null && positions.has(node.right) && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.right)!.x}
            y2={positions.get(node.right)!.y - 20}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            opacity="0.6"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r="20"
          fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--card))"}
          stroke={isRoot ? "hsl(var(--accent))" : "hsl(var(--border))"}
          strokeWidth={isRoot ? "3" : "2"}
          className="transition-all duration-300"
          style={{
            filter: isHighlighted ? "drop-shadow(0 0 8px hsl(var(--primary)))" : "none"
          }}
        />
        
        {/* Node value */}
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm font-semibold"
          fill={isHighlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
        >
          {node.value}
        </text>
        
        {/* Root label */}
        {isRoot && (
          <text
            x={pos.x}
            y={pos.y - 35}
            textAnchor="middle"
            className="text-xs font-bold"
            fill="hsl(var(--accent))"
          >
            ROOT
          </text>
        )}
      </g>
    );
  };

  return (
    <Card className="glass p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Binary Tree Visualization</h3>
        
        {/* Tree SVG */}
        <div className="bg-background/50 rounded-lg p-4 mb-4 overflow-x-auto">
          <svg width="600" height="400" className="mx-auto">
            {Array.from(positions.keys()).map(index => renderNode(index))}
          </svg>
        </div>

        {/* Traversal Order Display */}
        {traversalOrder.length > 0 && (
          <div className="mb-4 p-4 bg-primary/10 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Traversal Order:</h4>
            <div className="flex flex-wrap gap-2">
              {traversalOrder.map((index, i) => (
                <div key={i} className="flex items-center">
                  <div className="px-3 py-1 rounded bg-primary/20 text-primary font-semibold">
                    {nodes[index].value}
                  </div>
                  {i < traversalOrder.length - 1 && (
                    <span className="mx-1 text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operation Description */}
        <div className="p-4 bg-accent/10 rounded-lg">
          <p className="text-sm font-medium text-accent">{currentStepData.operation}</p>
          <p className="text-foreground mt-1">{currentStepData.description}</p>
        </div>
      </div>
    </Card>
  );
};
