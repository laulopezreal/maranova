import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode as BaseGraphNode } from './utils/bookmarkToGraph';

interface Node extends d3.SimulationNodeDatum, BaseGraphNode {}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

interface GraphViewProps {
  data: GraphData;
  width?: number;
  height?: number;
}

const GraphView = ({ data, width = 800, height = 600 }: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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

    // Color scale based on groups
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(data.nodes as Node[])
      .force("link", d3.forceLink<Node, Link>(data.links as Link[])
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as Node).size + 10));

    // Create container for zoom
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create links
    const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2);

    // Create nodes group
    const node = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .join("g") as d3.Selection<SVGGElement, Node, SVGGElement, unknown>;

    node.call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.group ? colorScale(d.group.toString()) : "url(#node-gradient)")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))")
      .style("cursor", "grab")
      .on("mouseenter", function(_event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size * 1.2)
          .attr("filter", "drop-shadow(0 0 20px rgba(167, 139, 250, 0.8))");
        setHoveredNode(d.title);
      })
      .on("mouseleave", function(_event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size)
          .attr("filter", "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))");
        setHoveredNode(null);
      });

    // Add text labels
    node.append("text")
      .text(d => d.title)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none")
      .style("user-select", "none")
      .each(function(d) {
        // Split text into multiple lines if needed
        const text = d3.select(this);
        const words = d.title.split(/\s+/);
        const maxLength = Math.floor((d.size - 16) * 2 / 8);
        
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
          const source = (typeof d.source === 'string' ? data.nodes.find(n => n.id === d.source) : d.source) as Node;
          return source?.x || 0;
        })
        .attr("y1", d => {
          const source = (typeof d.source === 'string' ? data.nodes.find(n => n.id === d.source) : d.source) as Node;
          return source?.y || 0;
        })
        .attr("x2", d => {
          const target = (typeof d.target === 'string' ? data.nodes.find(n => n.id === d.target) : d.target) as Node;
          return target?.x || 0;
        })
        .attr("y2", d => {
          const target = (typeof d.target === 'string' ? data.nodes.find(n => n.id === d.target) : d.target) as Node;
          return target?.y || 0;
        });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target as SVGCircleElement).style("cursor", "grabbing");
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target as SVGCircleElement).style("cursor", "grab");
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
