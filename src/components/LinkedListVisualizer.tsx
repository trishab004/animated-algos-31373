import { LinkedListStep } from "@/utils/linkedListOperations";
import { ArrowRight } from "lucide-react";

interface LinkedListVisualizerProps {
  steps: LinkedListStep[];
  currentStep: number;
}

export const LinkedListVisualizer = ({ steps, currentStep }: LinkedListVisualizerProps) => {
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData) return null;

  const getNodeColor = (index: number) => {
    if (currentStepData.highlightIndices?.includes(index)) {
      if (currentStepData.operation.includes("insert") && currentStepData.operation.includes("complete")) 
        return "bg-accent glow-success";
      if (currentStepData.operation.includes("delete")) 
        return "bg-destructive glow-destructive";
      return "bg-[hsl(var(--warning))] glow-warning";
    }
    return "bg-primary/80 glow-primary";
  };

  // Build visual representation following the linked structure
  const buildVisualList = () => {
    if (currentStepData.head === null) return [];
    
    const visualNodes: number[] = [];
    let currentIndex: number | null = currentStepData.head;
    const visited = new Set<number>();
    
    while (currentIndex !== null && !visited.has(currentIndex)) {
      visited.add(currentIndex);
      visualNodes.push(currentIndex);
      currentIndex = currentStepData.nodes[currentIndex]?.next ?? null;
    }
    
    return visualNodes;
  };

  const visualList = buildVisualList();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Linked List Container */}
      <div className="glass p-8 rounded-3xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Head Label */}
        {currentStepData.head !== null && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-lg">
            <span className="text-xs font-semibold text-accent">HEAD</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        )}

        <div className="flex gap-2 items-center flex-wrap justify-center relative z-10 max-w-4xl">
          {visualList.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">List is empty</p>
            </div>
          ) : (
            visualList.map((nodeIndex, visualIndex) => {
              const node = currentStepData.nodes[nodeIndex];
              return (
                <div key={nodeIndex} className="flex items-center gap-2">
                  {/* Node */}
                  <div className="flex flex-col items-center gap-2 transition-all duration-500">
                    <div
                      className={`w-20 h-20 flex flex-col items-center justify-center rounded-xl transition-all duration-500 ${getNodeColor(nodeIndex)} relative overflow-hidden border-2 border-white/20`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <span className="text-xl font-bold text-white relative z-10">
                        {node.value}
                      </span>
                      <span className="text-[10px] text-white/60 relative z-10">
                        {node.next !== null ? `→ ${node.next}` : "null"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold">
                      idx: {nodeIndex}
                    </span>
                  </div>
                  
                  {/* Arrow to next node */}
                  {visualIndex < visualList.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  )}
                  
                  {/* Null marker at end */}
                  {visualIndex === visualList.length - 1 && (
                    <>
                      <ArrowRight className="w-8 h-8 text-muted-foreground/50" />
                      <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/30">
                        <span className="text-xs text-muted-foreground font-semibold">NULL</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Operation Description */}
      <div className="glass p-6 rounded-2xl border-l-4 border-primary">
        <div className="flex items-start gap-3">
          <span className="text-primary text-xl">▸</span>
          <div>
            <p className="font-semibold text-sm uppercase text-primary mb-1">
              {currentStepData.operation.replace(/-/g, ' ')}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
