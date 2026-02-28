import { apiClient } from './client';
import type { Note } from '../types';

export const notesApi = {
  listByContact: (contactId: string) => apiClient.get<Note[]>(`/notes/contact/${contactId}`),
  create: (contactId: string, input: { body: string; format?: 'markdown' | 'plaintext'; tags?: string[] }) =>
    apiClient.post<Note>(`/notes/contact/${contactId}`, input),
  update: (id: string, input: Partial<{ body: string; format: 'markdown' | 'plaintext'; tags: string[] }>) =>
    apiClient.patch<Note>(`/notes/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/notes/${id}`),
};
