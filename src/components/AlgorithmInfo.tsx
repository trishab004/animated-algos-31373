import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { ComplexityExplainer } from "./ComplexityExplainer";

interface AlgorithmInfoProps {
  name: string;
  description: string;
  pseudocode: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export const AlgorithmInfo = ({
  name,
  description,
  pseudocode,
  timeComplexity,
  spaceComplexity
}: AlgorithmInfoProps) => {
  return (
    <Card className="glass p-6 space-y-6 animate-fade-in border-primary/30">
      {/* Algorithm Description */}
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          {name}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pseudocode */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-accent flex items-center gap-2">
          <span className="w-1 h-4 bg-accent rounded-full" />
          Pseudocode
        </h4>
        <div className="bg-card/60 p-4 rounded-xl border border-primary/20 backdrop-blur-sm">
          <pre className="code-font text-xs leading-relaxed text-foreground">
            {pseudocode.map((line, idx) => (
              <div key={idx} className="hover:bg-primary/10 px-2 py-1 rounded transition-colors">
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Time Complexity</p>
            <ComplexityExplainer complexity={timeComplexity} type="time" algorithmContext={name} />
          </div>
          <p className="text-2xl font-bold code-font text-primary">{timeComplexity}</p>
        </div>
        <div className="space-y-2 p-4 rounded-xl bg-accent/10 border border-accent/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Space Complexity</p>
            <ComplexityExplainer complexity={spaceComplexity} type="space" algorithmContext={name} />
          </div>
          <p className="text-2xl font-bold code-font text-accent">{spaceComplexity}</p>
        </div>
      </div>
    </Card>
  );
};
