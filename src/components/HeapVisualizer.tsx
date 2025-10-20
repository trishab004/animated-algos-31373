import { HeapStep } from "@/utils/heapOperations";
import { Card } from "./ui/card";

interface HeapVisualizerProps {
  steps: HeapStep[];
  currentStep: number;
}

export const HeapVisualizer = ({ steps, currentStep }: HeapVisualizerProps) => {
  if (!steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData || !currentStepData.array) return null;

  const { array, heapType, highlightedIndices = [], comparingIndices = [] } = currentStepData;

  // Calculate tree positions from array indices
  const positions = new Map<number, { x: number; y: number; level: number }>();
  
  const calculatePositions = (index: number, x: number, y: number, level: number, width: number) => {
    if (index >= array.length) return;
    
    positions.set(index, { x, y, level });
    
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    const childWidth = width / 2;
    
    if (leftChild < array.length) {
      calculatePositions(leftChild, x - childWidth / 2, y + 70, level + 1, childWidth);
    }
    if (rightChild < array.length) {
      calculatePositions(rightChild, x + childWidth / 2, y + 70, level + 1, childWidth);
    }
  };
  
  if (array.length > 0) {
    calculatePositions(0, 300, 40, 0, 400);
  }

  const renderTreeNode = (index: number) => {
    const pos = positions.get(index);
    if (!pos) return null;

    const value = array[index];
    const isHighlighted = highlightedIndices?.includes(index);
    const isComparing = comparingIndices?.includes(index);
    const isRoot = index === 0;

    const fillColor = isComparing 
      ? "hsl(var(--accent))" 
      : isHighlighted 
        ? "hsl(var(--primary))" 
        : heapType === "min" 
          ? "hsl(var(--primary) / 0.2)" 
          : "hsl(var(--accent) / 0.2)";

    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;

    return (
      <g key={index}>
        {/* Edges to children */}
        {leftChild < array.length && positions.has(leftChild) && (
          <line
            x1={pos.x}
            y1={pos.y + 18}
            x2={positions.get(leftChild)!.x}
            y2={positions.get(leftChild)!.y - 18}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            opacity="0.5"
          />
        )}
        {rightChild < array.length && positions.has(rightChild) && (
          <line
            x1={pos.x}
            y1={pos.y + 18}
            x2={positions.get(rightChild)!.x}
            y2={positions.get(rightChild)!.y - 18}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            opacity="0.5"
          />
        )}
        
        {/* Node */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r="18"
          fill={fillColor}
          stroke={isRoot ? "hsl(var(--accent))" : "hsl(var(--border))"}
          strokeWidth={isRoot ? "3" : "2"}
          className="transition-all duration-300"
          style={{
            filter: (isHighlighted || isComparing) ? "drop-shadow(0 0 8px currentColor)" : "none"
          }}
        />
        
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-bold"
          fill="hsl(var(--foreground))"
        >
          {value}
        </text>

        {/* Index label */}
        <text
          x={pos.x}
          y={pos.y + 32}
          textAnchor="middle"
          className="text-[10px] font-mono"
          fill="hsl(var(--muted-foreground))"
        >
          [{index}]
        </text>
      </g>
    );
  };

  return (
    <Card className="glass p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">
          {heapType === "min" ? "Min Heap" : "Max Heap"} Visualization
        </h3>
        
        {/* Tree View */}
        <div className="bg-background/50 rounded-lg p-4 mb-4 overflow-x-auto">
          <h4 className="text-sm font-semibold mb-2">Tree Structure:</h4>
          <svg width="600" height="280" className="mx-auto">
            {Array.from(positions.keys()).map(index => renderTreeNode(index))}
          </svg>
        </div>

        {/* Array View */}
        <div className="bg-background/50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold mb-3">Array Representation:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {array.map((value, index) => {
              const isHighlighted = highlightedIndices?.includes(index);
              const isComparing = comparingIndices?.includes(index);
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 flex flex-col items-center justify-center rounded border-2 transition-all duration-300 ${
                      isComparing
                        ? "bg-accent/30 border-accent glow-accent"
                        : isHighlighted
                          ? "bg-primary/30 border-primary glow-primary"
                          : heapType === "min"
                            ? "bg-primary/10 border-primary/40"
                            : "bg-accent/10 border-accent/40"
                    }`}
                  >
                    <span className="text-sm font-bold">{value}</span>
                    <span className="text-[10px] text-muted-foreground">[{index}]</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${heapType === "min" ? "bg-primary/20" : "bg-accent/20"}`}></div>
            <span>Heap Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span>Highlighted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent"></div>
            <span>Comparing</span>
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
