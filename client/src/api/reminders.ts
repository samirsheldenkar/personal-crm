import { apiClient } from './client';
import type { Reminder } from '../types';

export const remindersApi = {
  list: () => apiClient.get<Reminder[]>('/reminders'),
  create: (input: { contactId: string; type?: 'keep_in_touch' | 'one_time'; intervalDays?: number; dueDate?: string; note?: string }) =>
    apiClient.post<Reminder>('/reminders', input),
  update: (id: string, input: Partial<{ intervalDays: number; dueDate: string; note: string; isCompleted: boolean }>) =>
    apiClient.patch<Reminder>(`/reminders/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/reminders/${id}`),
};
