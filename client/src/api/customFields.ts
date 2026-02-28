import { apiClient } from './client';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  field_type: string;
  options: string[];
  default_value: string | null;
  sort_order: number;
}

export const customFieldsApi = {
  list: () => apiClient.get<CustomFieldDefinition[]>('/custom-fields'),
  create: (input: { name: string; fieldType: string; options?: string[]; defaultValue?: string; sortOrder?: number }) =>
    apiClient.post<CustomFieldDefinition>('/custom-fields', input),
  update: (id: string, input: Partial<{ name: string; fieldType: string; options: string[]; defaultValue: string; sortOrder: number }>) =>
    apiClient.patch<CustomFieldDefinition>(`/custom-fields/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/custom-fields/${id}`),
};
