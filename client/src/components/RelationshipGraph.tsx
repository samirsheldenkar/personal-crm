import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ContactGraph, GraphEdge, GraphNode } from '../types';
import './RelationshipGraph.css';

type GraphSimulationNode = GraphNode & d3.SimulationNodeDatum;
type GraphSimulationLink = Omit<GraphEdge, 'source' | 'target'> & d3.SimulationLinkDatum<GraphSimulationNode>;

const isSimulationNode = (
  value: string | number | GraphSimulationNode
): value is GraphSimulationNode => typeof value === 'object' && value !== null;

interface RelationshipGraphProps {
  graph: ContactGraph;
}

export function RelationshipGraph({ graph }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !graph) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    
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
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('class', 'graph-edge');

    const node = g.append('g')
      .selectAll<SVGGElement, GraphSimulationNode>('g')
      .data(nodes)
      .join<SVGGElement>('g')
      .attr('class', 'graph-node')
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
      .attr('fill', (d) => d.id === graph.centerId ? '#6366f1' : '#8b5cf6')
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
      link
        .attr('x1', (d) => {
          const source = d.source;
          return isSimulationNode(source) ? (source.x ?? 0) : 0;
        })
        .attr('y1', (d) => {
          const source = d.source;
          return isSimulationNode(source) ? (source.y ?? 0) : 0;
        })
        .attr('x2', (d) => {
          const target = d.target;
          return isSimulationNode(target) ? (target.x ?? 0) : 0;
        })
        .attr('y2', (d) => {
          const target = d.target;
          return isSimulationNode(target) ? (target.y ?? 0) : 0;
        });

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graph]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="empty-state">
        <p>No relationships yet</p>
        <p className="text-sm">Add relationships to see the graph</p>
      </div>
    );
  }

  return (
    <div className="relationship-graph-container">
      <svg ref={svgRef} className="relationship-graph"></svg>
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#6366f1' }}></span>
          <span>Center Contact</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#8b5cf6' }}></span>
          <span>Related Contact</span>
        </div>
      </div>
    </div>
  );
}
