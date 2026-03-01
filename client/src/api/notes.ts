import { apiClient } from './client';
import type { Note } from '../types';

export const notesApi = {
  listByContact: (contactId: string) => apiClient.get<Note[]>(`/notes/contact/${contactId}`),
  listRecent: (limit: number = 20) => apiClient.get<(Note & { contact_first_name: string; contact_last_name: string | null })[]>(`/notes/recent?limit=${limit}`),
  create: (contactId: string, input: { body: string; format?: 'markdown' | 'plaintext'; tags?: string[] }) =>
    apiClient.post<Note>(`/notes/contact/${contactId}`, input),
  update: (id: string, input: Partial<{ body: string; format: 'markdown' | 'plaintext'; tags: string[] }>) =>
    apiClient.patch<Note>(`/notes/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/notes/${id}`),
};
