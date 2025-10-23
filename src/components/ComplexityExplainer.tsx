import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ComplexityExplainerProps {
  complexity: string;
  type: "time" | "space";
  algorithmContext?: string;
}

const getComplexityExplanation = (complexity: string, type: "time" | "space", context?: string) => {
  const explanations: Record<string, { title: string; explanation: string; visualization: string; example: string }> = {
    "O(1)": {
      title: "Constant Time/Space",
      explanation: `${type === "time" ? "Operations execute" : "Memory usage remains"} in a fixed amount regardless of input size. Direct access or fixed allocation.`,
      visualization: "█ → Result (Single step)",
      example: "Array access by index, stack push/pop, variable assignment"
    },
    "O(log n)": {
      title: "Logarithmic Time/Space",
      explanation: `${type === "time" ? "Operations" : "Space requirements"} grow logarithmically. Input is repeatedly divided (halved) at each step.`,
      visualization: "n → n/2 → n/4 → n/8 → ... → 1\n(Dividing search space each iteration)",
      example: "Binary Search: 1000 elements → ~10 comparisons\nEach step eliminates half the data"
    },
    "O(n)": {
      title: "Linear Time/Space",
      explanation: `${type === "time" ? "Must process" : "Must store"} each element once. Growth is directly proportional to input size.`,
      visualization: "█ █ █ █ █ █ █ █\n(Visit each element once)",
      example: "Linear Search, Array traversal\nn = 100 → 100 operations\nn = 1000 → 1000 operations"
    },
    "O(n log n)": {
      title: "Linearithmic Time/Space",
      explanation: `Combines linear and logarithmic growth. Common in divide-and-conquer algorithms that split data log(n) times and process n elements at each level.`,
      visualization: "Level 1:     [████████]       (n operations)\nLevel 2:   [████][████]      (n operations)\nLevel 3: [██][██][██][██]   (n operations)\n          ↓ log(n) levels ↓",
      example: "Merge Sort, Quick Sort\nSplits: log(n) levels\nMerges: n elements per level\nTotal: n × log(n)"
    },
    "O(n²)": {
      title: "Quadratic Time/Space",
      explanation: `${type === "time" ? "Nested iterations over data" : "Space grows quadratically"}. For each element, we process all elements again.`,
      visualization: "For each item (n):\n  Compare with all items (n):\n    █ █ █ █ █\n    █ █ █ █ █\n    █ █ █ █ █\n(n × n comparisons)",
      example: "Bubble Sort nested loops\nn = 10 → 100 operations\nn = 100 → 10,000 operations\nn = 1000 → 1,000,000 operations"
    },
    "O(n³)": {
      title: "Cubic Time/Space",
      explanation: "Triple nested loops or operations. Very expensive for large datasets.",
      visualization: "For each i (n):\n  For each j (n):\n    For each k (n):\n      █ operation\n(n × n × n operations)",
      example: "Matrix multiplication, certain graph algorithms"
    },
    "O(2ⁿ)": {
      title: "Exponential Time/Space",
      explanation: "Doubles with each additional element. Each element creates branching possibilities.",
      visualization: "              █\n           /     \\\n          █       █\n        /  \\    /  \\\n       █   █   █   █\n(2^n nodes in tree)",
      example: "Recursive Fibonacci, brute force solutions\nn = 10 → 1,024 operations\nn = 20 → 1,048,576 operations\nn = 30 → 1,073,741,824 operations"
    },
    "O(n!)": {
      title: "Factorial Time/Space",
      explanation: "Generates all permutations. Extremely expensive - grows faster than exponential.",
      visualization: "All possible arrangements:\nn = 3: 6 permutations\nn = 4: 24 permutations\nn = 5: 120 permutations\nn = 10: 3,628,800 permutations",
      example: "Traveling Salesman (brute force)\nGenerating all possible orderings"
    }
  };

  return explanations[complexity] || {
    title: complexity,
    explanation: `This represents ${type} complexity of ${complexity}`,
    visualization: "Complexity depends on specific implementation",
    example: context || "Various algorithms may exhibit this complexity"
  };
};

export const ComplexityExplainer = ({ complexity, type, algorithmContext }: ComplexityExplainerProps) => {
  const data = getComplexityExplanation(complexity, type, algorithmContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 hover:bg-primary/20 transition-colors"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span className="text-primary code-font">{complexity}</span>
            <span className="text-lg font-normal text-muted-foreground">- {data.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Explanation */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-2 text-primary">What does this mean?</h4>
            <p className="text-sm leading-relaxed text-foreground">{data.explanation}</p>
          </Card>

          {/* Visualization */}
          <Card className="p-4 bg-accent/5 border-accent/20">
            <h4 className="font-semibold mb-3 text-accent">Visual Representation</h4>
            <pre className="code-font text-xs leading-relaxed bg-card/60 p-4 rounded-lg border border-border overflow-x-auto">
              {data.visualization}
            </pre>
          </Card>

          {/* Example */}
          <Card className="p-4 bg-muted/50 border-muted">
            <h4 className="font-semibold mb-2">Real-world Example</h4>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{data.example}</p>
          </Card>

          {/* Growth Comparison */}
          <Card className="p-4 bg-card border-primary/10">
            <h4 className="font-semibold mb-3">Growth Comparison (n = input size)</h4>
            <div className="space-y-2 text-xs code-font">
              <div className="grid grid-cols-5 gap-2 font-bold text-primary border-b border-border pb-2">
                <span>n</span>
                <span>O(log n)</span>
                <span>O(n)</span>
                <span>O(n log n)</span>
                <span>O(n²)</span>
              </div>
              {[10, 100, 1000, 10000].map(n => (
                <div key={n} className="grid grid-cols-5 gap-2 text-muted-foreground">
                  <span>{n}</span>
                  <span>{Math.ceil(Math.log2(n))}</span>
                  <span>{n}</span>
                  <span>{Math.ceil(n * Math.log2(n))}</span>
                  <span>{n * n}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
