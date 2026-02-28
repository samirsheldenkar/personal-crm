import { apiClient } from './client';

export interface Reminder {
  id: string;
  contact_id: string;
  type: 'keep_in_touch' | 'one_time';
  interval_days: number | null;
  due_date: string | null;
  note: string | null;
  is_completed: boolean;
  created_at: string;
}

export const remindersApi = {
  list: () => apiClient.get<Reminder[]>('/reminders'),
  create: (input: { contactId: string; type?: 'keep_in_touch' | 'one_time'; intervalDays?: number; dueDate?: string; note?: string }) =>
    apiClient.post<Reminder>('/reminders', input),
  update: (id: string, input: Partial<{ intervalDays: number; dueDate: string; note: string; isCompleted: boolean }>) =>
    apiClient.patch<Reminder>(`/reminders/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/reminders/${id}`),
};
