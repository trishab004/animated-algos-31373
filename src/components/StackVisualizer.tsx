import { StackStep } from "@/utils/stackOperations";

interface StackVisualizerProps {
  steps: StackStep[];
  currentStep: number;
}

export const StackVisualizer = ({ steps, currentStep }: StackVisualizerProps) => {
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData) return null;

  const getBlockColor = (index: number) => {
    if (currentStepData.highlightIndex === index) {
      if (currentStepData.operation === "push-complete") return "bg-accent glow-success";
      if (currentStepData.operation === "pop-start") return "bg-destructive glow-destructive";
      if (currentStepData.operation === "peek") return "bg-[hsl(var(--warning))] glow-warning";
    }
    return "bg-primary/80 glow-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stack Container */}
      <div className="glass p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-end relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Top Label */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-lg">
          <span className="text-xs font-semibold text-primary">TOP</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>

        <div className="flex flex-col-reverse gap-2 w-full max-w-xs relative z-10">
          {currentStepData.stack.map((value, index) => (
            <div
              key={`${index}-${value}`}
              className="transition-all duration-500"
            >
              <div
                className={`w-full h-16 flex items-center justify-between px-6 rounded-xl transition-all duration-500 ${getBlockColor(index)} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-white/60 font-semibold relative z-10">
                  [{index}]
                </span>
                <span className="text-xl font-bold text-white relative z-10">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Base Line */}
        <div className="w-full max-w-xs h-1 bg-border rounded-full mt-4" />
        <span className="text-xs text-muted-foreground mt-2 font-semibold">STACK BASE</span>
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
