import { apiClient } from './client';

export interface Relationship {
  id: string;
  from_contact_id: string;
  to_contact_id: string;
  type: string;
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
  tags: any[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface ContactGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  centerId: string;
}

export const relationshipsApi = {
  list: (contactId?: string) => {
    const query = contactId ? `?contactId=${contactId}` : '';
    return apiClient.get<Relationship[]>(`/relationships${query}`);
  },
  create: (input: { fromContactId: string; toContactId: string; type: string; metadata?: Record<string, any> }) =>
    apiClient.post<Relationship>('/relationships', input),
  delete: (id: string) => apiClient.delete<void>(`/relationships/${id}`),
  getGraph: (contactId: string) => apiClient.get<ContactGraph>(`/relationships/graph/${contactId}`),
};
