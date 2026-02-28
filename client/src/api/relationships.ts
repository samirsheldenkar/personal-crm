import { apiClient } from './client';
import type { ContactGraph, Relationship } from '../types';

export const relationshipsApi = {
  list: (contactId?: string) => {
    const query = contactId ? `?contactId=${contactId}` : '';
    return apiClient.get<Relationship[]>(`/relationships${query}`);
  },
  create: (input: { fromContactId: string; toContactId: string; type: string; metadata?: Record<string, unknown> }) =>
    apiClient.post<Relationship>('/relationships', input),
  delete: (id: string) => apiClient.delete<void>(`/relationships/${id}`),
  getGraph: (contactId: string) => apiClient.get<ContactGraph>(`/relationships/graph/${contactId}`),
};
