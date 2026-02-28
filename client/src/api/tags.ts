import { apiClient } from './client';
import type { Tag } from '../types';

export const tagsApi = {
  list: () => apiClient.get<Tag[]>('/tags'),
  create: (input: { name: string; color?: string }) => apiClient.post<Tag>('/tags', input),
  update: (id: string, input: Partial<{ name: string; color: string }>) => apiClient.patch<Tag>(`/tags/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/tags/${id}`),
  assignToContact: (contactId: string, tagIds: string[]) => apiClient.post<Tag[]>(`/tags/assign/${contactId}`, { tagIds }),
  removeFromContact: (contactId: string, tagId: string) => apiClient.delete<void>(`/tags/assign/${contactId}/${tagId}`),
};
