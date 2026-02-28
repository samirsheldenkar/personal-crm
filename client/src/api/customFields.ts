import { apiClient } from './client';
import type { CustomField } from '../types';

export const customFieldsApi = {
  list: () => apiClient.get<CustomField[]>('/custom-fields'),
  create: (input: { name: string; fieldType: string; options?: string[]; defaultValue?: string; sortOrder?: number }) =>
    apiClient.post<CustomField>('/custom-fields', input),
  update: (id: string, input: Partial<{ name: string; fieldType: string; options: string[]; defaultValue: string; sortOrder: number }>) =>
    apiClient.patch<CustomField>(`/custom-fields/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/custom-fields/${id}`),
};
