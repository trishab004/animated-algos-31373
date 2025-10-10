import { useEffect } from "react";

export type SortStep = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
};

interface SortingVisualizerProps {
  steps: SortStep[];
  currentStep: number;
  maxValue: number;
}

export const SortingVisualizer = ({ steps, currentStep, maxValue }: SortingVisualizerProps) => {
  const currentStepData = steps[currentStep] || steps[0];
  
  if (!currentStepData) return null;

  const getBarColor = (index: number) => {
    if (currentStepData.sorted.includes(index)) return "bg-green-500";
    if (currentStepData.swapping.includes(index)) return "bg-destructive";
    if (currentStepData.comparing.includes(index)) return "bg-yellow-500";
    return "bg-primary";
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Bars Container */}
      <div className="glass p-8 rounded-2xl h-[400px] flex items-end justify-center gap-2">
        {currentStepData.array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-end flex-1 max-w-[80px] h-full transition-all duration-300"
          >
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${getBarColor(index)} shadow-lg`}
              style={{ height: `${getBarHeight(value)}%` }}
            />
            <span className="mt-2 text-xs code-font text-muted-foreground font-bold">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Step Description */}
      <div className="glass p-6 rounded-xl">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-accent">Step Description: </span>
          {currentStepData.description}
        </p>
      </div>
    </div>
  );
};
