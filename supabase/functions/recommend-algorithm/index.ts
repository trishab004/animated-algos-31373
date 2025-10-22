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

    const systemPrompt = `You are an expert algorithm and data structure consultant. Analyze the user's problem and recommend the most suitable algorithm or data structure.

Available in this app:

SORTING ALGORITHMS:
- Bubble Sort: Simple, O(n²), good for educational purposes or nearly sorted small arrays
- Quick Sort: Efficient, O(n log n) average case, great for general-purpose sorting
- Merge Sort: Stable, O(n log n) guaranteed, good for linked lists or when stability matters

SEARCHING ALGORITHMS:
- Linear Search: O(n), works on unsorted data, simple implementation
- Binary Search: O(log n), requires sorted data, very efficient
- Jump Search: O(√n), good balance between linear and binary for sorted data

DATA STRUCTURES:
- Array: Fast access O(1), fixed/dynamic size
- Stack: LIFO, O(1) push/pop, great for undo/recursion/parsing
- Queue: FIFO, O(1) enqueue/dequeue, perfect for BFS/scheduling
- Linked List: Dynamic size, O(1) insertion/deletion at ends
- Binary Tree: Hierarchical, O(log n) average for balanced trees
- BST: Sorted binary tree, O(log n) search/insert/delete when balanced
- Heap: Priority queue, O(log n) insert/delete, O(1) get min/max
- Graph: Relationships, various algorithms (BFS O(V+E), DFS O(V+E))

Consider:
- Problem type (sorting, searching, storing, traversing)
- Input size and characteristics
- Time/space complexity requirements
- Access patterns needed
- Ordering requirements

Provide:
1. Recommended algorithm/data structure name
2. Brief rationale (2-3 sentences)
3. Key advantage for this specific use case`;

    const userMessage = `Problem: ${problem}
${arraySize ? `Data size: ${arraySize}` : ""}
${constraints ? `Constraints: ${constraints}` : ""}

Which algorithm or data structure should I use?`;

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
