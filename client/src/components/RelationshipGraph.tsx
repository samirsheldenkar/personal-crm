import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { ContactGraph, GraphEdge, GraphNode } from '../types';
import './RelationshipGraph.css';
const relationshipColors: Record<string, string> = {
  family: '#3b82f6',
  friend: '#10b981',
  colleague: '#8b5cf6',
  mentor: '#f59e0b',
  mentee: '#ec4899',
  partner: '#ef4444',
  spouse: '#6366f1',
  sibling: '#06b6d4',
  parent: '#059669',
  child: '#d97706',
  other: '#6b7280',
};


type GraphSimulationNode = GraphNode & d3.SimulationNodeDatum;
type GraphSimulationLink = Omit<GraphEdge, 'source' | 'target'> & d3.SimulationLinkDatum<GraphSimulationNode>;

interface RelationshipGraphProps {
  graph: ContactGraph;
  onNodeClick?: (contactId: string) => void;
}

export function RelationshipGraph({ graph, onNodeClick }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const minimumWidth = 320;
    const minimumHeight = 320;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = Math.max(Math.round(entry.contentRect.width), minimumWidth);
      const height = Math.max(Math.round(entry.contentRect.height), minimumHeight);

      setDimensions((previousDimensions) => {
        if (previousDimensions.width === width && previousDimensions.height === height) {
          return previousDimensions;
        }

        return { width, height };
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !graph) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    
    svg.attr('width', width).attr('height', height);
    svg.attr('class', 'relationship-graph graph-svg');

    const g = svg.append('g');

    const nodes: GraphSimulationNode[] = graph.nodes.map((node) => ({ ...node }));
    const links: GraphSimulationLink[] = graph.edges.map((edge) => ({
      ...edge,
      source: edge.source,
      target: edge.target,
    }));

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<GraphSimulationNode>(nodes)
      .force('link', d3.forceLink<GraphSimulationNode, GraphSimulationLink>(links).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    const link = g.append('g')
      .selectAll('g')
      .data(links)
      .join('g');

    const linkPath = link.append('path')
      .attr('id', (d) => `edge-${(d.source as GraphSimulationNode).id}-${(d.target as GraphSimulationNode).id}`)
      .style('--edge-color', (d) => relationshipColors[d.type] || relationshipColors.other)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', 'graph-edge');

    link.append('text')
      .attr('dy', -5)
      .append('textPath')
      .attr('href', (d) => `#edge-${(d.source as GraphSimulationNode).id}-${(d.target as GraphSimulationNode).id}`)
      .attr('startOffset', '50%')
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .style('pointer-events', 'none')
      .text((d) => d.type);

    const node = g.append('g')
      .selectAll<SVGGElement, GraphSimulationNode>('g')
      .data(nodes)
      .join<SVGGElement>('g')
      .attr('class', 'graph-node')
      .on('click', (event, d) => {
        if (onNodeClick) {
          event.stopPropagation();
          onNodeClick(d.id);
        }
      })
      .call(d3.drag<SVGGElement, GraphSimulationNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append('circle')
      .attr('r', (d) => d.id === graph.centerId ? 35 : 25)
      .attr('fill', (d) => {
        if (d.id === graph.centerId) return '#6366f1';
        const edge = graph.edges.find(e => 
          (e.source === graph.centerId && e.target === d.id) || 
          (e.target === graph.centerId && e.source === d.id)
        );
        return edge ? (relationshipColors[edge.type] || relationshipColors.other) : relationshipColors.other;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3);

    node.append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d) => `${d.firstName[0]}${d.lastName?.[0] || ''}`)
      .attr('class', 'graph-label');

    node.append('text')
      .attr('dy', 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '12px')
      .text((d) => `${d.firstName} ${d.lastName || ''}`)
      .attr('class', 'graph-label');

    node.append('title')
      .text((d) => `${d.firstName} ${d.lastName || ''}\n${d.company || ''}`);

    simulation.on('tick', () => {
      linkPath.attr('d', (d) => {
        const source = d.source as GraphSimulationNode;
        const target = d.target as GraphSimulationNode;
        return `M${source.x ?? 0},${source.y ?? 0}L${target.x ?? 0},${target.y ?? 0}`;
      });

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graph, onNodeClick, dimensions]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="empty-state">
        <p>No relationships yet</p>
        <p className="text-sm">Add relationships to see the graph</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relationship-graph-container">
      <svg ref={svgRef} className="relationship-graph"></svg>
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#6366f1' }}></span>
          <span>Center Contact</span>
        </div>
        {Object.entries(relationshipColors).map(([type, color]) => (
          <div className="legend-item" key={type}>
            <span className="legend-dot" style={{ backgroundColor: color }}></span>
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
