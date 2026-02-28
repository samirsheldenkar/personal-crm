import { apiClient } from './client';

export interface SearchResult {
  type: 'contact' | 'note';
  id: string;
  title: string;
  subtitle: string;
  contactId: string;
  rank: number;
}

export const searchApi = {
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (limit) params.set('limit', String(limit));
    return apiClient.get<{ results: SearchResult[]; query: string }>(`/search?${params}`);
  },
};
