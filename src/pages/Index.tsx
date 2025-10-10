import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Code2, Zap } from "lucide-react";
import { toast } from "sonner";
import { SortingVisualizer, SortStep } from "@/components/SortingVisualizer";
import { PlaybackControls } from "@/components/PlaybackControls";
import { AlgorithmInfo } from "@/components/AlgorithmInfo";
import { bubbleSort, quickSort, mergeSort } from "@/utils/sortingAlgorithms";

const algorithms = [
  { 
    id: "bubble", 
    name: "Bubble Sort",
    description: "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
    pseudocode: [
      "function bubbleSort(array):",
      "  n = length(array)",
      "  for i = 0 to n-1:",
      "    for j = 0 to n-i-2:",
      "      if array[j] > array[j+1]:",
      "        swap(array[j], array[j+1])",
      "  return array"
    ],
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    sortFunction: bubbleSort
  },
  { 
    id: "quick", 
    name: "Quick Sort",
    description: "An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a 'pivot' element and partitioning the array around the pivot, such that elements smaller than the pivot come before it and elements larger come after it.",
    pseudocode: [
      "function quickSort(array, low, high):",
      "  if low < high:",
      "    pivot = partition(array, low, high)",
      "    quickSort(array, low, pivot-1)",
      "    quickSort(array, pivot+1, high)",
      "",
      "function partition(array, low, high):",
      "  pivot = array[high]",
      "  i = low - 1",
      "  for j = low to high-1:",
      "    if array[j] < pivot:",
      "      i++",
      "      swap(array[i], array[j])",
      "  swap(array[i+1], array[high])",
      "  return i+1"
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    sortFunction: quickSort
  },
  { 
    id: "merge", 
    name: "Merge Sort",
    description: "A stable, divide-and-conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves. It guarantees O(n log n) time complexity in all cases, making it highly predictable.",
    pseudocode: [
      "function mergeSort(array):",
      "  if length(array) <= 1:",
      "    return array",
      "  mid = length(array) / 2",
      "  left = mergeSort(array[0...mid])",
      "  right = mergeSort(array[mid...end])",
      "  return merge(left, right)",
      "",
      "function merge(left, right):",
      "  result = []",
      "  while left and right not empty:",
      "    if left[0] <= right[0]:",
      "      append left[0] to result",
      "    else:",
      "      append right[0] to result",
      "  append remaining elements",
      "  return result"
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    sortFunction: mergeSort
  },
];

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");
  const [inputArray, setInputArray] = useState<string>("64, 34, 25, 12, 22, 11, 90");
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [hasGenerated, setHasGenerated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAlgoData = algorithms.find(a => a.id === selectedAlgorithm);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && sortSteps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= sortSteps.length - 1) {
            setIsPlaying(false);
            toast.success("Sorting complete!");
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, sortSteps.length, speed]);

  const handleGenerate = () => {
    if (!selectedAlgorithm) {
      toast.error("Please select an algorithm first!");
      return;
    }

    const arrayValues = inputArray
      .split(",")
      .map(v => v.trim())
      .filter(v => v && !isNaN(Number(v)))
      .map(v => Number(v));

    if (arrayValues.length === 0) {
      toast.error("Please enter valid numbers!");
      return;
    }

    if (arrayValues.length > 20) {
      toast.error("Please enter 20 or fewer numbers for better visualization!");
      return;
    }

    const algo = algorithms.find(a => a.id === selectedAlgorithm);
    if (!algo) return;

    const steps = algo.sortFunction(arrayValues);
    setSortSteps(steps);
    setCurrentStep(0);
    setIsPlaying(false);
    setHasGenerated(true);
    toast.success("Visualization generated! Press play to start.");
  };

  const handlePlayPause = () => {
    if (currentStep >= sortSteps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setCurrentStep((prev) => Math.min(sortSteps.length - 1, prev + 1));
    setIsPlaying(false);
  };

  const maxValue = sortSteps.length > 0 
    ? Math.max(...sortSteps[0].array)
    : 100;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary glow-primary">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AlgoViz
            </h1>
            <p className="text-sm text-muted-foreground">Algorithm Visualizer</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-6 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Control Panel */}
          <Card className="glass p-8 animate-fade-in">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Configure Algorithm</h2>
                <p className="text-muted-foreground">Select an algorithm and provide input to visualize</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <Label htmlFor="algorithm" className="text-base">
                    Select Algorithm
                  </Label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger id="algorithm" className="glass">
                      <SelectValue placeholder="Choose an algorithm..." />
                    </SelectTrigger>
                    <SelectContent className="glass border-border bg-popover/95 backdrop-blur-xl">
                      {algorithms.map((algo) => (
                        <SelectItem 
                          key={algo.id} 
                          value={algo.id}
                          className="focus:bg-primary/20 focus:text-primary"
                        >
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Array Input */}
                <div className="space-y-2">
                  <Label htmlFor="array" className="text-base">
                    Input Array
                  </Label>
                  <Input
                    id="array"
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="5, 3, 8, 1, 9, 2"
                    className="glass code-font"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter comma-separated numbers
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isPlaying}
                className="w-full md:w-auto gradient-primary hover:opacity-90 transition-opacity text-white font-semibold py-6 px-8 text-lg glow-primary"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Visualization
              </Button>
            </div>
          </Card>

          {/* Algorithm Information */}
          {selectedAlgoData && hasGenerated && (
            <div className="animate-fade-in">
              <AlgorithmInfo
                name={selectedAlgoData.name}
                description={selectedAlgoData.description}
                pseudocode={selectedAlgoData.pseudocode}
                timeComplexity={selectedAlgoData.timeComplexity}
                spaceComplexity={selectedAlgoData.spaceComplexity}
              />
            </div>
          )}

          {/* Visualization Area */}
          {hasGenerated && sortSteps.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Sorting Visualizer */}
              <div className="lg:col-span-2">
                <SortingVisualizer
                  steps={sortSteps}
                  currentStep={currentStep}
                  maxValue={maxValue}
                />
              </div>

              {/* Playback Controls */}
              <div>
                <PlaybackControls
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onReset={handleReset}
                  onStepBack={handleStepBack}
                  onStepForward={handleStepForward}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  currentStep={currentStep}
                  totalSteps={sortSteps.length}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center space-y-2">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">AlgoViz</span> - Algorithm Visualizer
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Built with React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
