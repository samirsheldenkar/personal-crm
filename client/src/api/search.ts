import { apiClient } from './client';
import type { SearchResult } from '../types';

export const searchApi = {
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (limit) params.set('limit', String(limit));
    return apiClient.get<{ results: SearchResult[]; query: string }>(`/search?${params}`);
  },
};
