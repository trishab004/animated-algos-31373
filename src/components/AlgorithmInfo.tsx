import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";

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
    <Card className="glass p-6 space-y-6">
      {/* Algorithm Description */}
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          {name}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pseudocode */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-accent">Pseudocode</h4>
        <div className="bg-secondary/50 p-4 rounded-lg border border-border">
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
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Time Complexity</p>
          <p className="text-lg font-bold code-font text-primary">{timeComplexity}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Space Complexity</p>
          <p className="text-lg font-bold code-font text-accent">{spaceComplexity}</p>
        </div>
      </div>
    </Card>
  );
};
