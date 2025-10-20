import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Zap } from "lucide-react";
import { toast } from "sonner";
import { SortingVisualizer, SortStep } from "@/components/SortingVisualizer";
import { ArrayVisualizer } from "@/components/ArrayVisualizer";
import { StackVisualizer } from "@/components/StackVisualizer";
import { QueueVisualizer } from "@/components/QueueVisualizer";
import { LinkedListVisualizer } from "@/components/LinkedListVisualizer";
import { PlaybackControls } from "@/components/PlaybackControls";
import { AlgorithmInfo } from "@/components/AlgorithmInfo";
import { bubbleSort, quickSort, mergeSort } from "@/utils/sortingAlgorithms";
import { arrayInsert, arrayDelete, arraySearch, ArrayStep } from "@/utils/arrayOperations";
import { stackPush, stackPop, stackPeek, StackStep } from "@/utils/stackOperations";
import { queueEnqueue, queueDequeue, queuePeekFront, QueueStep } from "@/utils/queueOperations";
import { linkedListInsertHead, linkedListInsertTail, linkedListDelete, linkedListReverse, LinkedListStep } from "@/utils/linkedListOperations";
import { binaryTreeInsert, binaryTreeInorder, binaryTreePreorder, binaryTreePostorder, binaryTreeSearch, BinaryTreeStep } from "@/utils/binaryTreeOperations";
import { bstInsert, bstSearch, bstDelete, BSTStep } from "@/utils/bstOperations";
import { heapBuild, heapInsert, heapExtract, heapPeek, HeapStep } from "@/utils/heapOperations";
import { graphBFS, graphDFS, graphDijkstra, GraphStep, GraphNode, GraphEdge } from "@/utils/graphOperations";
import { BinaryTreeVisualizer } from "@/components/BinaryTreeVisualizer";
import { BSTVisualizer } from "@/components/BSTVisualizer";
import { HeapVisualizer } from "@/components/HeapVisualizer";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { AlgoChatbot } from "@/components/AlgoChatbot";
import { AlgorithmRecommender } from "@/components/AlgorithmRecommender";

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
  const [category, setCategory] = useState<"sorting" | "datastructures">("sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");
  const [inputArray, setInputArray] = useState<string>("64, 34, 25, 12, 22, 11, 90");
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [dataStructureSteps, setDataStructureSteps] = useState<ArrayStep[] | StackStep[] | QueueStep[] | LinkedListStep[] | BinaryTreeStep[] | BSTStep[] | HeapStep[] | GraphStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [hasGenerated, setHasGenerated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Data structure specific states
  const [dsOperation, setDsOperation] = useState<string>("");
  const [dsValue, setDsValue] = useState<string>("");
  const [dsPosition, setDsPosition] = useState<string>("");
  const [currentArray, setCurrentArray] = useState<number[]>([5, 10, 15, 20, 25]);
  const [currentStack, setCurrentStack] = useState<number[]>([]);
  const [currentQueue, setCurrentQueue] = useState<number[]>([]);
  const [currentLinkedList, setCurrentLinkedList] = useState<{ nodes: any[], head: number | null }>({ nodes: [], head: null });
  const [currentBinaryTree, setCurrentBinaryTree] = useState<{ nodes: any[], root: number | null }>({ nodes: [], root: null });
  const [currentBST, setCurrentBST] = useState<{ nodes: any[], root: number | null }>({ nodes: [], root: null });
  const [currentHeap, setCurrentHeap] = useState<{ array: number[], heapType: "min" | "max" }>({ array: [], heapType: "min" });
  const [currentGraph, setCurrentGraph] = useState<{ nodes: GraphNode[], edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [heapType, setHeapType] = useState<"min" | "max">("min");

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
    const totalSteps = category === "sorting" ? sortSteps.length : dataStructureSteps.length;
    
    if (isPlaying && totalSteps > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            toast.success("Visualization complete!");
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
  }, [isPlaying, sortSteps.length, dataStructureSteps.length, speed, category]);

  const handleGenerate = () => {
    if (category === "sorting") {
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
    } else {
      // Data structures
      if (!selectedAlgorithm || !dsOperation) {
        toast.error("Please select a data structure and operation!");
        return;
      }

      let steps: any[] = [];

      if (selectedAlgorithm === "array") {
        const value = parseInt(dsValue);
        const pos = parseInt(dsPosition);
        
        if (dsOperation === "insert" && !isNaN(value) && !isNaN(pos)) {
          steps = arrayInsert(currentArray, value, pos);
          setCurrentArray([...currentArray.slice(0, pos), value, ...currentArray.slice(pos)]);
        } else if (dsOperation === "delete" && !isNaN(pos)) {
          steps = arrayDelete(currentArray, pos);
          setCurrentArray(currentArray.filter((_, i) => i !== pos));
        } else if (dsOperation === "search" && !isNaN(value)) {
          steps = arraySearch(currentArray, value);
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "stack") {
        if (dsOperation === "push") {
          // Handle bulk input for push
          const values = dsValue
            .split(",")
            .map(v => v.trim())
            .filter(v => v && !isNaN(Number(v)))
            .map(v => Number(v));
          
          if (values.length === 0) {
            toast.error("Please enter valid numbers!");
            return;
          }
          
          // Push all values sequentially
          let tempStack = [...currentStack];
          let allSteps: StackStep[] = [];
          
          for (const value of values) {
            const pushSteps = stackPush(tempStack, value);
            allSteps = [...allSteps, ...pushSteps];
            tempStack = [...tempStack, value];
          }
          
          steps = allSteps;
          setCurrentStack(tempStack);
        } else if (dsOperation === "pop") {
          steps = stackPop(currentStack);
          if (currentStack.length > 0) setCurrentStack(currentStack.slice(0, -1));
        } else if (dsOperation === "peek") {
          steps = stackPeek(currentStack);
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "queue") {
        if (dsOperation === "enqueue") {
          // Handle bulk input for enqueue
          const values = dsValue
            .split(",")
            .map(v => v.trim())
            .filter(v => v && !isNaN(Number(v)))
            .map(v => Number(v));
          
          if (values.length === 0) {
            toast.error("Please enter valid numbers!");
            return;
          }
          
          // Enqueue all values sequentially
          let tempQueue = [...currentQueue];
          let allSteps: QueueStep[] = [];
          
          for (const value of values) {
            const enqueueSteps = queueEnqueue(tempQueue, value);
            allSteps = [...allSteps, ...enqueueSteps];
            tempQueue = [...tempQueue, value];
          }
          
          steps = allSteps;
          setCurrentQueue(tempQueue);
        } else if (dsOperation === "dequeue") {
          steps = queueDequeue(currentQueue);
          if (currentQueue.length > 0) setCurrentQueue(currentQueue.slice(1));
        } else if (dsOperation === "peek") {
          steps = queuePeekFront(currentQueue);
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "linkedlist") {
        const value = parseInt(dsValue);
        
        if (dsOperation === "insert-head" && !isNaN(value)) {
          const result = linkedListInsertHead(currentLinkedList.nodes, currentLinkedList.head, value);
          steps = result;
          const lastStep = result[result.length - 1];
          setCurrentLinkedList({ nodes: lastStep.nodes, head: lastStep.head });
        } else if (dsOperation === "insert-tail" && !isNaN(value)) {
          const result = linkedListInsertTail(currentLinkedList.nodes, currentLinkedList.head, value);
          steps = result;
          const lastStep = result[result.length - 1];
          setCurrentLinkedList({ nodes: lastStep.nodes, head: lastStep.head });
        } else if (dsOperation === "delete" && !isNaN(value)) {
          steps = linkedListDelete(currentLinkedList.nodes, currentLinkedList.head, value);
          const lastStep = steps[steps.length - 1];
          setCurrentLinkedList({ nodes: lastStep.nodes, head: lastStep.head });
        } else if (dsOperation === "reverse") {
          steps = linkedListReverse(currentLinkedList.nodes, currentLinkedList.head);
          const lastStep = steps[steps.length - 1];
          setCurrentLinkedList({ nodes: lastStep.nodes, head: lastStep.head });
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "binarytree") {
        const value = parseInt(dsValue);
        
        if (dsOperation === "insert" && !isNaN(value)) {
          const result = binaryTreeInsert(currentBinaryTree.nodes, currentBinaryTree.root, value);
          steps = result;
          const lastStep = result[result.length - 1];
          setCurrentBinaryTree({ nodes: lastStep.nodes, root: lastStep.root });
        } else if (dsOperation === "search" && !isNaN(value)) {
          steps = binaryTreeSearch(currentBinaryTree.nodes, currentBinaryTree.root, value);
        } else if (dsOperation === "inorder") {
          steps = binaryTreeInorder(currentBinaryTree.nodes, currentBinaryTree.root);
        } else if (dsOperation === "preorder") {
          steps = binaryTreePreorder(currentBinaryTree.nodes, currentBinaryTree.root);
        } else if (dsOperation === "postorder") {
          steps = binaryTreePostorder(currentBinaryTree.nodes, currentBinaryTree.root);
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "bst") {
        const value = parseInt(dsValue);
        
        if (dsOperation === "insert" && !isNaN(value)) {
          const result = bstInsert(currentBST.nodes, currentBST.root, value);
          steps = result;
          const lastStep = result[result.length - 1];
          setCurrentBST({ nodes: lastStep.nodes, root: lastStep.root });
        } else if (dsOperation === "search" && !isNaN(value)) {
          steps = bstSearch(currentBST.nodes, currentBST.root, value);
        } else if (dsOperation === "delete" && !isNaN(value)) {
          steps = bstDelete(currentBST.nodes, currentBST.root, value);
          const lastStep = steps[steps.length - 1];
          setCurrentBST({ nodes: lastStep.nodes, root: lastStep.root });
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "heap") {
        const value = parseInt(dsValue);
        
        if (dsOperation === "build") {
          const arrayValues = dsValue
            .split(",")
            .map(v => v.trim())
            .filter(v => v && !isNaN(Number(v)))
            .map(v => Number(v));
          
          if (arrayValues.length === 0) {
            toast.error("Please enter valid numbers!");
            return;
          }
          
          steps = heapBuild(arrayValues, heapType);
          const lastStep = steps[steps.length - 1];
          setCurrentHeap({ array: lastStep.array, heapType });
        } else if (dsOperation === "insert" && !isNaN(value)) {
          steps = heapInsert(currentHeap.array, value, heapType);
          const lastStep = steps[steps.length - 1];
          setCurrentHeap({ array: lastStep.array, heapType });
        } else if (dsOperation === "extract") {
          steps = heapExtract(currentHeap.array, heapType);
          const lastStep = steps[steps.length - 1];
          setCurrentHeap({ array: lastStep.array, heapType });
        } else if (dsOperation === "peek") {
          steps = heapPeek(currentHeap.array, heapType);
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      } else if (selectedAlgorithm === "graph") {
        const startNodeId = parseInt(dsValue);
        
        if (dsOperation === "bfs" && !isNaN(startNodeId)) {
          steps = graphBFS(currentGraph.nodes, currentGraph.edges, startNodeId);
        } else if (dsOperation === "dfs" && !isNaN(startNodeId)) {
          steps = graphDFS(currentGraph.nodes, currentGraph.edges, startNodeId);
        } else if (dsOperation === "dijkstra" && !isNaN(startNodeId)) {
          steps = graphDijkstra(currentGraph.nodes, currentGraph.edges, startNodeId);
        } else if (dsOperation === "add-node" && !isNaN(startNodeId)) {
          const newNode: GraphNode = { id: currentGraph.nodes.length, value: startNodeId };
          setCurrentGraph({ ...currentGraph, nodes: [...currentGraph.nodes, newNode] });
          toast.success(`Added node ${startNodeId}`);
          return;
        } else if (dsOperation === "add-edge") {
          const [from, to, weight] = dsValue.split(",").map(v => parseInt(v.trim()));
          if (!isNaN(from) && !isNaN(to)) {
            const newEdge: GraphEdge = { from, to, weight: !isNaN(weight) ? weight : 1 };
            setCurrentGraph({ ...currentGraph, edges: [...currentGraph.edges, newEdge] });
            toast.success(`Added edge ${from} → ${to}${weight ? ` (weight: ${weight})` : ""}`);
            return;
          } else {
            toast.error("Please provide from,to or from,to,weight!");
            return;
          }
        } else {
          toast.error("Please provide valid inputs!");
          return;
        }
      }

      setDataStructureSteps(steps);
      setCurrentStep(0);
      setIsPlaying(false);
      setHasGenerated(true);
      toast.success("Visualization generated! Press play to start.");
    }
  };

  const handlePlayPause = () => {
    const totalSteps = category === "sorting" ? sortSteps.length : dataStructureSteps.length;
    if (currentStep >= totalSteps - 1) {
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
    const totalSteps = category === "sorting" ? sortSteps.length : dataStructureSteps.length;
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
    setIsPlaying(false);
  };

  const maxValue = sortSteps.length > 0 
    ? Math.max(...sortSteps[0].array)
    : 100;

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
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
          {/* AI Algorithm Recommender */}
          <AlgorithmRecommender />

          {/* Main Control Panel */}
          <Card className="glass p-8 animate-fade-in">
            <Tabs value={category} onValueChange={(v) => { setCategory(v as any); setHasGenerated(false); setSelectedAlgorithm(""); }}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="sorting">Sorting Algorithms</TabsTrigger>
                <TabsTrigger value="datastructures">Data Structures</TabsTrigger>
              </TabsList>

              <TabsContent value="sorting" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Configure Sorting Algorithm</h2>
                  <p className="text-muted-foreground">Select an algorithm and provide input to visualize</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="algorithm" className="text-base">Select Algorithm</Label>
                    <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                      <SelectTrigger id="algorithm" className="glass">
                        <SelectValue placeholder="Choose an algorithm..." />
                      </SelectTrigger>
                      <SelectContent className="glass border-border bg-popover/95 backdrop-blur-xl">
                        {algorithms.map((algo) => (
                          <SelectItem key={algo.id} value={algo.id} className="focus:bg-primary/20 focus:text-primary">
                            {algo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="array" className="text-base">Input Array</Label>
                    <Input
                      id="array"
                      value={inputArray}
                      onChange={(e) => setInputArray(e.target.value)}
                      placeholder="5, 3, 8, 1, 9, 2"
                      className="glass code-font"
                    />
                    <p className="text-xs text-muted-foreground">Enter comma-separated numbers</p>
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={isPlaying} className="w-full md:w-auto gradient-primary hover:opacity-90 transition-opacity text-white font-semibold py-6 px-8 text-lg glow-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Visualization
                </Button>
              </TabsContent>

              <TabsContent value="datastructures" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Configure Data Structure</h2>
                  <p className="text-muted-foreground">Select a data structure and operation to visualize</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ds-type" className="text-base">Data Structure</Label>
                    <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                      <SelectTrigger id="ds-type" className="glass">
                        <SelectValue placeholder="Choose a data structure..." />
                      </SelectTrigger>
                      <SelectContent className="glass border-border bg-popover/95 backdrop-blur-xl">
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="stack">Stack</SelectItem>
                        <SelectItem value="queue">Queue</SelectItem>
                        <SelectItem value="linkedlist">Linked List</SelectItem>
                        <SelectItem value="binarytree">Binary Tree</SelectItem>
                        <SelectItem value="bst">Binary Search Tree</SelectItem>
                        <SelectItem value="heap">Heap (Min/Max)</SelectItem>
                        <SelectItem value="graph">Graph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ds-operation" className="text-base">Operation</Label>
                    <Select value={dsOperation} onValueChange={setDsOperation}>
                      <SelectTrigger id="ds-operation" className="glass">
                        <SelectValue placeholder="Choose an operation..." />
                      </SelectTrigger>
                      <SelectContent className="glass border-border bg-popover/95 backdrop-blur-xl">
                        {selectedAlgorithm === "array" && (
                          <>
                            <SelectItem value="insert">Insert</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                            <SelectItem value="search">Search</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "stack" && (
                          <>
                            <SelectItem value="push">Push</SelectItem>
                            <SelectItem value="pop">Pop</SelectItem>
                            <SelectItem value="peek">Peek</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "queue" && (
                          <>
                            <SelectItem value="enqueue">Enqueue</SelectItem>
                            <SelectItem value="dequeue">Dequeue</SelectItem>
                            <SelectItem value="peek">Peek</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "linkedlist" && (
                          <>
                            <SelectItem value="insert-head">Insert at Head</SelectItem>
                            <SelectItem value="insert-tail">Insert at Tail</SelectItem>
                            <SelectItem value="delete">Delete Node</SelectItem>
                            <SelectItem value="reverse">Reverse List</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "binarytree" && (
                          <>
                            <SelectItem value="insert">Insert</SelectItem>
                            <SelectItem value="search">Search</SelectItem>
                            <SelectItem value="inorder">Inorder Traversal</SelectItem>
                            <SelectItem value="preorder">Preorder Traversal</SelectItem>
                            <SelectItem value="postorder">Postorder Traversal</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "bst" && (
                          <>
                            <SelectItem value="insert">Insert</SelectItem>
                            <SelectItem value="search">Search</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "heap" && (
                          <>
                            <SelectItem value="build">Build Heap</SelectItem>
                            <SelectItem value="insert">Insert</SelectItem>
                            <SelectItem value="extract">Extract {heapType === "min" ? "Min" : "Max"}</SelectItem>
                            <SelectItem value="peek">Peek</SelectItem>
                          </>
                        )}
                        {selectedAlgorithm === "graph" && (
                          <>
                            <SelectItem value="add-node">Add Node</SelectItem>
                            <SelectItem value="add-edge">Add Edge</SelectItem>
                            <SelectItem value="bfs">BFS Traversal</SelectItem>
                            <SelectItem value="dfs">DFS Traversal</SelectItem>
                            <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Heap Type Selector */}
                  {selectedAlgorithm === "heap" && (
                    <div className="space-y-2">
                      <Label htmlFor="heap-type" className="text-base">Heap Type</Label>
                      <Select value={heapType} onValueChange={(v: "min" | "max") => setHeapType(v)}>
                        <SelectTrigger id="heap-type" className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border bg-popover/95 backdrop-blur-xl">
                          <SelectItem value="min">Min Heap</SelectItem>
                          <SelectItem value="max">Max Heap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Stack/Queue/Heap build bulk input */}
                  {(dsOperation === "push" || dsOperation === "enqueue" || dsOperation === "build") && (
                    <div className="space-y-2">
                      <Label htmlFor="ds-bulk-value" className="text-base">Values (comma-separated)</Label>
                      <Input
                        id="ds-bulk-value"
                        value={dsValue}
                        onChange={(e) => setDsValue(e.target.value)}
                        placeholder="e.g., 10, 20, 30, 40"
                        className="glass code-font"
                      />
                      <p className="text-xs text-muted-foreground">Enter comma-separated numbers</p>
                    </div>
                  )}
                  
                  {/* Single value input for tree/graph operations */}
                  {(dsOperation === "insert" || dsOperation === "insert-head" || dsOperation === "insert-tail" || dsOperation === "search" || dsOperation === "delete" || dsOperation === "extract" || dsOperation === "bfs" || dsOperation === "dfs" || dsOperation === "dijkstra" || dsOperation === "add-node") && (
                    <div className="space-y-2">
                      <Label htmlFor="ds-value" className="text-base">Value</Label>
                      <Input
                        id="ds-value"
                        type="number"
                        value={dsValue}
                        onChange={(e) => setDsValue(e.target.value)}
                        placeholder="Enter value"
                        className="glass code-font"
                      />
                      {selectedAlgorithm === "graph" && (dsOperation === "bfs" || dsOperation === "dfs" || dsOperation === "dijkstra") && (
                        <p className="text-xs text-muted-foreground">Enter starting node ID</p>
                      )}
                      {selectedAlgorithm === "graph" && dsOperation === "add-node" && (
                        <p className="text-xs text-muted-foreground">Enter node value</p>
                      )}
                    </div>
                  )}

                  {/* Graph edge input */}
                  {selectedAlgorithm === "graph" && dsOperation === "add-edge" && (
                    <div className="space-y-2">
                      <Label htmlFor="ds-edge" className="text-base">Edge (from,to or from,to,weight)</Label>
                      <Input
                        id="ds-edge"
                        value={dsValue}
                        onChange={(e) => setDsValue(e.target.value)}
                        placeholder="0,1 or 0,1,5"
                        className="glass code-font"
                      />
                      <p className="text-xs text-muted-foreground">Format: from,to,weight (weight is optional)</p>
                    </div>
                  )}

                  {(dsOperation === "insert" || dsOperation === "delete") && selectedAlgorithm === "array" && (
                    <div className="space-y-2">
                      <Label htmlFor="ds-position" className="text-base">Position/Index</Label>
                      <Input
                        id="ds-position"
                        type="number"
                        value={dsPosition}
                        onChange={(e) => setDsPosition(e.target.value)}
                        placeholder="Enter position"
                        className="glass code-font"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleGenerate} disabled={isPlaying} className="gradient-primary hover:opacity-90 transition-opacity text-white font-semibold py-6 px-8 text-lg glow-primary">
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Visualization
                  </Button>
                  
                  {selectedAlgorithm && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (selectedAlgorithm === "array") setCurrentArray([5, 10, 15, 20, 25]);
                        else if (selectedAlgorithm === "stack") setCurrentStack([]);
                        else if (selectedAlgorithm === "queue") setCurrentQueue([]);
                        else if (selectedAlgorithm === "linkedlist") setCurrentLinkedList({ nodes: [], head: null });
                        else if (selectedAlgorithm === "binarytree") setCurrentBinaryTree({ nodes: [], root: null });
                        else if (selectedAlgorithm === "bst") setCurrentBST({ nodes: [], root: null });
                        else if (selectedAlgorithm === "heap") setCurrentHeap({ array: [], heapType });
                        else if (selectedAlgorithm === "graph") setCurrentGraph({ nodes: [], edges: [] });
                        setHasGenerated(false);
                        toast.success("Data structure reset!");
                      }}
                      className="glass"
                    >
                      Reset {selectedAlgorithm}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
          {hasGenerated && (category === "sorting" ? sortSteps.length > 0 : dataStructureSteps.length > 0) && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Visualizer */}
              <div className="lg:col-span-2">
                {category === "sorting" && (
                  <SortingVisualizer
                    steps={sortSteps}
                    currentStep={currentStep}
                    maxValue={maxValue}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "array" && (
                  <ArrayVisualizer
                    steps={dataStructureSteps as ArrayStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "stack" && (
                  <StackVisualizer
                    steps={dataStructureSteps as StackStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "queue" && (
                  <QueueVisualizer
                    steps={dataStructureSteps as QueueStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "linkedlist" && (
                  <LinkedListVisualizer
                    steps={dataStructureSteps as LinkedListStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "binarytree" && (
                  <BinaryTreeVisualizer
                    steps={dataStructureSteps as BinaryTreeStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "bst" && (
                  <BSTVisualizer
                    steps={dataStructureSteps as BSTStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "heap" && (
                  <HeapVisualizer
                    steps={dataStructureSteps as HeapStep[]}
                    currentStep={currentStep}
                  />
                )}
                {category === "datastructures" && selectedAlgorithm === "graph" && (
                  <GraphVisualizer
                    steps={dataStructureSteps as GraphStep[]}
                    currentStep={currentStep}
                  />
                )}
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
                  totalSteps={category === "sorting" ? sortSteps.length : dataStructureSteps.length}
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

      {/* AI Chatbot Mentor */}
      <AlgoChatbot currentStep={currentStep} algorithm={selectedAlgoData?.name} />
    </div>
  );
};

export default Index;
