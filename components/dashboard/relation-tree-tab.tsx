"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, { Background, Edge, Node, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "reactflow";
import "reactflow/dist/style.css";
import { 
  Network, Check, Loader2, Plus, X 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventData, GuestData } from "./types";

interface RelationTreeTabProps {
  activeEvent: EventData;
  guestsList: GuestData[];
  theme: "light" | "dark";
  onSaveTree: (treeJson: string) => Promise<boolean>;
}

export default function RelationTreeTab({
  activeEvent,
  guestsList,
  theme,
  onSaveTree,
}: RelationTreeTabProps) {
  const [treeNodes, setTreeNodes] = useState<Node[]>([]);
  const [treeEdges, setTreeEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setTreeNodes((nds) => applyNodeChanges(changes, nds)),
    [setTreeNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setTreeEdges((eds) => applyEdgeChanges(changes, eds)),
    [setTreeEdges]
  );

  const [nodeName, setNodeName] = useState("");
  const [nodeSide, setNodeSide] = useState("groom_side");
  const [sourceNodeId, setSourceNodeId] = useState("");
  const [targetNodeId, setTargetNodeId] = useState("");
  const [relationLabel, setRelationLabel] = useState("");
  const [isSavingTree, setIsSavingTree] = useState(false);

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  // Sync tree builder canvas nodes/edges when activeEvent changes
  useEffect(() => {
    if (activeEvent) {
      try {
        if (activeEvent.relationshipTree) {
          const parsed = JSON.parse(activeEvent.relationshipTree);
          setTreeNodes(parsed.nodes || []);
          setTreeEdges(parsed.edges || []);
        } else {
          // Initialize elegant parent union node for empty trees
          const isWedding = activeEvent.type === "wedding";
          const unionLabel = isWedding ? "Groom & Bride" : activeEvent.title.replace("'s Birthday", "");
          const defaultNode: Node = {
            id: "union",
            data: { label: unionLabel },
            position: { x: 250, y: 30 },
            style: {
              background: "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
              color: "#120F0F",
              border: "none",
              borderRadius: "16px",
              padding: "10px 16px",
              fontWeight: "bold",
              fontSize: "12px",
              boxShadow: "0 4px 10px rgba(212,175,55,0.3)"
            }
          };
          setTreeNodes([defaultNode]);
          setTreeEdges([]);
        }
      } catch (e) {
        setTreeNodes([]);
        setTreeEdges([]);
      }
    }
  }, [activeEvent]);

  // ADD NODE IN RELATIONSHIP TREE
  const handleAddTreeNode = () => {
    if (!nodeName.trim()) {
      toast.error("Please enter a name for the connection.");
      return;
    }
    const nodeId = `node-${Date.now()}`;
    const isBride = nodeSide === "bride_side" || nodeSide === "family_side";
    
    const newNode: Node = {
      id: nodeId,
      data: { label: nodeName },
      position: { x: Math.random() * 100 + 180, y: Math.random() * 100 + 150 },
      style: {
        background: "#1A1616",
        color: isBride ? "#B76E79" : "#E6C575",
        border: `1px solid ${isBride ? "#B76E79" : "#D4AF37"}`,
        borderRadius: "12px",
        padding: "8px 12px",
        fontSize: "11px",
        fontFamily: "var(--font-sans)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
      }
    };
    
    setTreeNodes([...treeNodes, newNode]);
    setNodeName("");
    toast.success(`Node added for ${nodeName}!`);
  };

  // DELETE NODE IN RELATIONSHIP TREE
  const handleDeleteTreeNode = (nodeId: string) => {
    if (nodeId === "union") {
      toast.error("Cannot delete the core celebrant node.");
      return;
    }
    setTreeNodes(treeNodes.filter(n => n.id !== nodeId));
    setTreeEdges(treeEdges.filter(e => e.source !== nodeId && e.target !== nodeId));
    toast.success("Connection node deleted.");
  };

  // CONNECT TREE NODES (ADD EDGE)
  const handleConnectTreeNodes = () => {
    if (!sourceNodeId || !targetNodeId) {
      toast.error("Please select both parent and child connections.");
      return;
    }
    if (sourceNodeId === targetNodeId) {
      toast.error("Cannot connect a connection to itself.");
      return;
    }

    const edgeId = `edge-${Date.now()}`;
    const newEdge: Edge = {
      id: edgeId,
      source: sourceNodeId,
      target: targetNodeId,
      label: relationLabel,
      animated: true,
      style: { stroke: "#D4AF37" },
      labelStyle: { fill: "#FAF9F6", fontSize: "9px" },
      labelBgStyle: { fill: "#120F0F", fillOpacity: 0.85 }
    };

    setTreeEdges([...treeEdges, newEdge]);
    setRelationLabel("");
    toast.success("Relationship connected successfully.");
  };

  // SAVE TREE TO DATABASE
  const handleSave = async () => {
    setIsSavingTree(true);
    const treeJson = JSON.stringify({ nodes: treeNodes, edges: treeEdges });
    const success = await onSaveTree(treeJson);
    if (success) {
      toast.success("Relationship tree saved successfully in database!");
    } else {
      toast.error("Failed to save relationship tree configuration.");
    }
    setIsSavingTree(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full animate-fade font-semibold">
      {/* Node & Edge Creation Sidebar */}
      <div className={`lg:col-span-1 space-y-6 border border-solid rounded-3xl p-6 shadow-xl h-fit ${cardBg}`}>
        <div>
          <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${titleCol}`}>
            <Network className="w-5 h-5 text-amber-550" /> Tree Editor
          </h3>
          <p className="text-zinc-555 text-[11px] mt-0.5 font-semibold">Build your interactive connection chart.</p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSavingTree}
          className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs border-0 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer animate-pulse"
        >
          {isSavingTree ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{isSavingTree ? "Saving Tree..." : "Save Tree Configuration"}</span>
        </Button>

        {/* PART A: Add Node */}
        <div className={`space-y-3 border-t border-solid pt-4 ${borderCol}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">Add Connection Node</span>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="e.g. Vikram (Father) or School Friends"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="bg-zinc-900/40 border-zinc-800 focus-visible:border-amber-500 text-xs h-9 rounded-lg"
            />
            
            <select
              value={nodeSide}
              onChange={(e) => setNodeSide(e.target.value)}
              className={`w-full h-9 border border-solid bg-zinc-900/40 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer ${borderCol}`}
            >
              {activeEvent.type === "wedding" ? (
                <>
                  <option value="groom_side" className="bg-[#171313]">Groom's Side Association</option>
                  <option value="bride_side" className="bg-[#171313]">Bride's Side Association</option>
                </>
              ) : (
                <>
                  <option value="family_side" className="bg-[#171313]">Family & Relatives</option>
                  <option value="friends_side" className="bg-[#171313]">Friends & Colleagues</option>
                </>
              )}
            </select>

            <Button
              onClick={handleAddTreeNode}
              className={`w-full h-9 border border-solid bg-transparent text-xs font-semibold rounded-lg cursor-pointer ${
                theme === "dark" ? "border-white/10 text-white hover:bg-white/5" : "border-neutral-200 text-neutral-900 hover:bg-black/5"
              }`}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add to Canvas
            </Button>
          </div>
        </div>

        {/* PART B: Connect Nodes (Add Edges) */}
        <div className={`space-y-3 border-t border-solid pt-4 ${borderCol}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">Connect Connections (Edges)</span>
          <div className="space-y-2">
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className={`w-full h-9 border border-solid bg-zinc-900/40 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 rounded-lg px-2 shadow-sm cursor-pointer ${borderCol}`}
            >
              <option value="">Select Parent Node...</option>
              {treeNodes.map((n) => (
                <option key={n.id} value={n.id}>{String(n.data.label)}</option>
              ))}
            </select>

            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className={`w-full h-9 border border-solid bg-zinc-900/40 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 rounded-lg px-2 shadow-sm cursor-pointer ${borderCol}`}
            >
              <option value="">Select Connected Child...</option>
              {treeNodes.map((n) => (
                <option key={n.id} value={n.id}>{String(n.data.label)}</option>
              ))}
            </select>

            <Input
              type="text"
              placeholder="e.g. Sister, Cousin, Bestie (optional)"
              value={relationLabel}
              onChange={(e) => setRelationLabel(e.target.value)}
              className="bg-zinc-900/40 border-zinc-800 focus-visible:border-amber-500 text-xs h-9 rounded-lg"
            />

            <Button
              onClick={handleConnectTreeNodes}
              className={`w-full h-9 border border-solid bg-transparent text-xs font-semibold rounded-lg cursor-pointer ${
                theme === "dark" ? "border-white/10 text-white hover:bg-white/5" : "border-neutral-200 text-neutral-900 hover:bg-black/5"
              }`}
            >
              <Network className="w-3.5 h-3.5 mr-1" /> Connect Nodes
            </Button>
          </div>
        </div>

        {/* PART C: Nodes List */}
        <div className={`space-y-3 border-t border-solid pt-4 max-h-40 overflow-y-auto ${borderCol}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 block">Current Nodes</span>
          <div className="space-y-1">
            {treeNodes.map((n) => (
              <div key={n.id} className="flex justify-between items-center bg-neutral-950/20 px-3 py-1.5 rounded-lg border border-solid border-[#D4AF37]/10 text-xs">
                <span className={`font-medium truncate max-w-[150px] ${titleCol}`}>{String(n.data.label)}</span>
                <button
                  onClick={() => handleDeleteTreeNode(n.id)}
                  className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Interactive React Flow Board */}
      <div className="lg:col-span-2 space-y-4">
        <div className={`border rounded-3xl h-[500px] overflow-hidden relative shadow-2xl ${cardBg}`}>
          <div className="absolute top-4 right-4 z-10 bg-neutral-950/90 border border-amber-500/20 rounded-lg px-3 py-1.5 text-[9px] text-amber-500 font-semibold uppercase tracking-wider select-none pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Real-time Draggable Board
          </div>

          <ReactFlow
            nodes={treeNodes}
            edges={treeEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnDrag={true}
            preventScrolling={false}
            className="react-flow-wedding animate-fade"
          >
            <Background color="#f59e0b" style={{ opacity: 0.05 }} gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
