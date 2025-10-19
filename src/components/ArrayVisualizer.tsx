import { ArrayStep } from "@/utils/arrayOperations";

interface ArrayVisualizerProps {
  steps: ArrayStep[];
  currentStep: number;
}

export const ArrayVisualizer = ({ steps, currentStep }: ArrayVisualizerProps) => {
  if (!steps || steps.length === 0) return null;
  
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData || !currentStepData.array) return null;

  const getBlockColor = (index: number) => {
    if (currentStepData.highlightIndices.includes(index)) {
      if (currentStepData.operation === "found") return "bg-accent glow-success";
      if (currentStepData.operation === "delete" || currentStepData.operation === "deleted") 
        return "bg-destructive glow-destructive";
      if (currentStepData.operation === "inserted") return "bg-accent glow-success";
      return "bg-[hsl(var(--warning))] glow-warning";
    }
    return "bg-primary/80 glow-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Array Container */}
      <div className="glass p-8 rounded-3xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="flex gap-3 flex-wrap justify-center relative z-10">
          {currentStepData.array.map((value, index) => (
            <div
              key={`${index}-${value}`}
              className="flex flex-col items-center gap-2 transition-all duration-500"
            >
              {/* Index Label */}
              <span className="text-xs text-muted-foreground font-semibold">
                [{index}]
              </span>
              
              {/* Value Block */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-xl transition-all duration-500 ${getBlockColor(index)} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                <span className="text-lg font-bold text-white relative z-10">
                  {value}
                </span>
              </div>
            </div>
          ))}
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
