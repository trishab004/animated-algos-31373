import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problem, arraySize, constraints } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert algorithm consultant. Analyze the user's problem and recommend the most suitable sorting algorithm.

Available algorithms in this app:
- Bubble Sort: Simple, O(n²), good for educational purposes or nearly sorted small arrays
- Quick Sort: Efficient, O(n log n) average case, great for general-purpose sorting
- Merge Sort: Stable, O(n log n) guaranteed, good for linked lists or when stability matters

Consider:
- Input size and characteristics
- Time/space complexity requirements
- Stability needs
- Best/average/worst case scenarios

Provide:
1. Recommended algorithm name
2. Brief rationale (2-3 sentences)
3. Key advantage for this specific use case`;

    const userMessage = `Problem: ${problem}
${arraySize ? `Array size: ${arraySize}` : ""}
${constraints ? `Constraints: ${constraints}` : ""}

Which sorting algorithm should I use?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ recommendation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in recommend-algorithm:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
