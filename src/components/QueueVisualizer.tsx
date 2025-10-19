import { QueueStep } from "@/utils/queueOperations";
import { ArrowRight } from "lucide-react";

interface QueueVisualizerProps {
  steps: QueueStep[];
  currentStep: number;
}

export const QueueVisualizer = ({ steps, currentStep }: QueueVisualizerProps) => {
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData) return null;

  const getBlockColor = (index: number) => {
    if (currentStepData.highlightIndices?.includes(index)) {
      if (currentStepData.operation === "enqueue-complete") return "bg-accent glow-success";
      if (currentStepData.operation === "dequeue-start") return "bg-destructive glow-destructive";
      if (currentStepData.operation === "peek-front") return "bg-[hsl(var(--warning))] glow-warning";
    }
    return "bg-primary/80 glow-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Queue Container */}
      <div className="glass p-8 rounded-3xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Front Label */}
        {currentStepData.front !== undefined && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-lg">
            <span className="text-xs font-semibold text-accent">FRONT</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        )}

        {/* Rear Label */}
        {currentStepData.rear !== undefined && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-lg">
            <span className="text-xs font-semibold text-primary">REAR</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}

        <div className="flex gap-3 items-center relative z-10">
          {currentStepData.queue.map((value, index) => (
            <div key={`${index}-${value}`} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2 transition-all duration-500">
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
              
              {/* Arrow between elements */}
              {index < currentStepData.queue.length - 1 && (
                <ArrowRight className="w-6 h-6 text-primary/50" />
              )}
            </div>
          ))}
        </div>

        {/* Empty Queue Message */}
        {currentStepData.queue.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Queue is empty</p>
          </div>
        )}
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
