import { z } from 'zod';

export const RELATIONSHIP_TYPES = [
  'friend', 'colleague', 'parent', 'child', 'sibling', 'cousin',
  'partner', 'spouse', 'mentor', 'mentee', 'manager', 'report',
  'introduced_by', 'met_at_event', 'acquaintance', 'neighbor', 'other',
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number];

export const createRelationshipSchema = z.object({
  fromContactId: z.string().uuid(),
  toContactId: z.string().uuid(),
  type: z.enum(RELATIONSHIP_TYPES),
  metadata: z.record(z.any()).optional(),
});

export const listRelationshipsQuery = z.object({
  contactId: z.string().uuid().optional(),
});

export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;

export interface RelationshipRow {
  id: string;
  user_id: string;
  from_contact_id: string;
  to_contact_id: string;
  type: RelationshipType;
  metadata: Record<string, any>;
  created_at: string;
}

export interface GraphNode {
  id: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  company: string | null;
  jobTitle: string | null;
  tags: { id: string; name: string; color: string }[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
}

export interface ContactGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  centerId: string;
}
