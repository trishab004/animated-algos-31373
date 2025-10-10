import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  disabled = false
}: PlaybackControlsProps) => {
  const getSpeedLabel = (speed: number) => {
    if (speed >= 1000) return "Slow";
    if (speed >= 500) return "Medium";
    return "Fast";
  };

  return (
    <div className="glass p-6 rounded-xl space-y-6">
      {/* Step Counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Progress</p>
        <p className="text-2xl font-bold code-font">
          Step <span className="text-primary">{currentStep + 1}</span> of{" "}
          <span className="text-accent">{totalSteps}</span>
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBack}
          disabled={disabled || currentStep === 0}
          className="glass hover:bg-primary/20"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={disabled}
          className="glass hover:bg-primary/20"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={onPlayPause}
          disabled={disabled}
          className="gradient-primary hover:opacity-90 transition-opacity w-16 h-16 rounded-full glow-primary"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          className="glass hover:bg-primary/20"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="speed" className="text-sm">
            Animation Speed
          </Label>
          <span className="text-sm font-semibold text-primary">
            {getSpeedLabel(speed)}
          </span>
        </div>
        <Slider
          id="speed"
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          min={100}
          max={1500}
          step={100}
          className="cursor-pointer"
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
};
