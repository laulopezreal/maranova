import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode as BaseGraphNode } from './utils/bookmarkToGraph';

interface GraphNode extends d3.SimulationNodeDatum, BaseGraphNode { }

interface Link extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphViewProps {
  data: GraphData;
  width?: number;
  height?: number;
  focusNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

const GraphView = ({ data, width = 800, height = 600, focusNodeId, onNodeClick }: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const hoveredIdsRef = useRef<Set<string>>(new Set());
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, Link> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create gradient definitions
    const defs = svg.append("defs");

    // Gradient for nodes
    const gradient = defs.append("radialGradient")
      .attr("id", "node-gradient");
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#a78bfa")
      .attr("stop-opacity", 0.8);
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#7c3aed")
      .attr("stop-opacity", 0.4);

    const nodes: GraphNode[] = data.nodes.map(node => ({ ...node }));
    const links: Link[] = data.links.map(link => ({ ...link }));

    // Create force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, Link>(links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => d.size + 10));

    simulationRef.current = simulation;

    // Create container for zoom
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Create links
    const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2);

    // Create nodes group
    const node = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g") as d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>;

    node.call(d3.drag<SVGGElement, GraphNode>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", "transparent")
      .attr("stroke", d => d.type === 'folder' ? '#ffea00' : '#ffffff')
      .attr("stroke-width", 3)
      .attr("filter", "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))")
      .style("cursor", "pointer")
      .on("click", function (_event, d) {
        _event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      })
      .on("mouseenter", function (_event, d) {
        hoveredIdsRef.current.add(d.id);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size * 1.2)
          .attr("filter", "drop-shadow(0 0 20px rgba(167, 139, 250, 0.8))");
        simulationRef.current?.alpha(0.08).restart();
        setHoveredNode(d.title);
      })
      .on("mouseleave", function (_event, d) {
        hoveredIdsRef.current.delete(d.id);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size)
          .attr("filter", "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))");
        simulationRef.current?.alpha(0.05).restart();
        setHoveredNode(null);
      });

    // Add text labels
    node.append("text")
      .text(d => d.title)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", d => d.type === 'folder' ? '#ffea00' : '#ffffff')
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none")
      .style("user-select", "none")
      .each(function (d) {
        // Split text into multiple lines if needed
        const text = d3.select(this);
        const words = d.title.split(/\s+/);
        const TEXT_PADDING = 16;
        const AVG_CHAR_WIDTH = 8;
        const maxLength = Math.floor((d.size - TEXT_PADDING) * 2 / AVG_CHAR_WIDTH);

        if (d.title.length > maxLength && words.length > 1) {
          text.text(null);
          words.forEach((word, i) => {
            text.append("tspan")
              .attr("x", 0)
              .attr("dy", i === 0 ? "-0.3em" : "1em")
              .text(word);
          });
        }
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          if (!source || !target) return 0;
          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const srcScale = hoveredIdsRef.current.has(source.id) ? 1.2 : 1;
          const ratio = (source.size * srcScale) / distance;
          return (source.x || 0) + dx * ratio;
        })
        .attr("y1", d => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          if (!source || !target) return 0;
          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const srcScale = hoveredIdsRef.current.has(source.id) ? 1.2 : 1;
          const ratio = (source.size * srcScale) / distance;
          return (source.y || 0) + dy * ratio;
        })
        .attr("x2", d => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          if (!source || !target) return 0;
          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const tgtScale = hoveredIdsRef.current.has(target.id) ? 1.2 : 1;
          const ratio = (target.size * tgtScale) / distance;
          return (target.x || 0) - dx * ratio;
        })
        .attr("y2", d => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          if (!source || !target) return 0;
          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const tgtScale = hoveredIdsRef.current.has(target.id) ? 1.2 : 1;
          const ratio = (target.size * tgtScale) / distance;
          return (target.y || 0) - dy * ratio;
        });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target as SVGCircleElement).style("cursor", "grabbing");
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target as SVGCircleElement).style("cursor", "grab");
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height, onNodeClick]);

  // Handle focus on selected node
  useEffect(() => {
    if (!focusNodeId || !svgRef.current || !zoomRef.current || !simulationRef.current) return;

    const focusNode = data.nodes.find(n => n.id === focusNodeId);
    if (!focusNode) return;

    // Wait for simulation to stabilize a bit
    const timer = setTimeout(() => {
      const node = simulationRef.current?.nodes().find(n => n.id === focusNodeId);
      if (!node || node.x === undefined || node.y === undefined) return;

      const svg = d3.select(svgRef.current!);
      const scale = 1.5; // Zoom level
      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-node.x, -node.y);

      const zoomTransform = zoomRef.current?.transform;
      if (!zoomTransform) return;

      svg.transition()
        .duration(750)
        .call(zoomTransform, transform);
    }, 500);

    return () => clearTimeout(timer);
  }, [focusNodeId, data.nodes, width, height]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ maxWidth: width, maxHeight: height }}
      />
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/30">
          <p className="text-white text-sm font-medium">{hoveredNode}</p>
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/30">
        <p className="text-white/70 text-xs">Drag nodes • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default GraphView;
