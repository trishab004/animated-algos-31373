import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AlgorithmRecommender = () => {
  const [problem, setProblem] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    if (!problem.trim()) {
      toast.error("Please describe your problem first!");
      return;
    }

    setIsLoading(true);
    setRecommendation("");

    try {
      const { data, error } = await supabase.functions.invoke("recommend-algorithm", {
        body: { problem },
      });

      if (error) throw error;

      setRecommendation(data.recommendation);
      toast.success("Got recommendation!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to get recommendation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass p-6 animate-fade-in border-accent/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI Algorithm & Data Structure Recommender</h3>
            <p className="text-sm text-muted-foreground">
              Describe your problem and get the best algorithm or data structure suggestion
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="problem">Describe Your Problem</Label>
          <Textarea
            id="problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: I need to store tasks with priorities and always process the highest priority first... OR I have 1000 sorted numbers and need to find if a value exists... OR I need to find the shortest path between two locations..."
            className="glass min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Button */}
        <Button
          onClick={getRecommendation}
          disabled={isLoading || !problem.trim()}
          className="w-full gradient-primary text-white font-semibold py-6 glow-primary"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? "Analyzing..." : "Get AI Recommendation"}
        </Button>

        {/* Recommendation */}
        {recommendation && (
          <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/30 animate-fade-in">
            <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommendation
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{recommendation}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
