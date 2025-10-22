export type SearchStep = {
  array: number[];
  checking: number;
  found: number;
  searchRange: number[];
  description: string;
};

interface SearchingVisualizerProps {
  steps: SearchStep[];
  currentStep: number;
  maxValue: number;
}

export const SearchingVisualizer = ({ steps, currentStep, maxValue }: SearchingVisualizerProps) => {
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData) return null;

  const getBarColor = (index: number) => {
    if (currentStepData.found === index) return "bg-accent glow-success";
    if (currentStepData.checking === index) return "bg-[hsl(var(--warning))] glow-warning";
    if (currentStepData.searchRange.includes(index)) return "bg-primary/50 glow-primary";
    return "bg-muted";
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bars Container */}
      <div className="glass p-8 rounded-3xl h-[400px] flex items-end justify-center gap-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        {currentStepData.array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-end flex-1 max-w-[80px] h-full transition-all duration-300 relative z-10"
          >
            <div
              className={`w-full rounded-t-xl transition-all duration-500 ${getBarColor(index)} relative overflow-hidden`}
              style={{ height: `${getBarHeight(value)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            </div>
            <span className="mt-3 text-xs code-font text-foreground font-bold bg-primary/10 px-2 py-1 rounded">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Step Description */}
      <div className="glass p-6 rounded-2xl border-l-4 border-primary">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-bold text-primary mr-2">▸</span>
          {currentStepData.description}
        </p>
      </div>
    </div>
  );
};
