import { apiClient } from './client';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  company: string | null;
  job_title: string | null;
  birthday: string | null;
  emails: any[];
  phones: any[];
  addresses: any[];
  social_links: Record<string, string>;
  is_archived: boolean;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactWithDetails extends Contact {
  tags: any[];
  customFields: any[];
}

export interface CreateContactInput {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  company?: string;
  jobTitle?: string;
  birthday?: string;
  emails?: any[];
  phones?: any[];
  addresses?: any[];
  socialLinks?: Record<string, string>;
  customFields?: Record<string, any>;
  tagIds?: string[];
}

export const contactsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; tags?: string; sort?: string; order?: string; archived?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.tags) query.set('tags', params.tags);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.order) query.set('order', params.order);
    if (params?.archived !== undefined) query.set('archived', String(params.archived));
    return apiClient.get<{ contacts: Contact[]; total: number; page: number; limit: number }>(`/contacts?${query}`);
  },
  getById: (id: string) => apiClient.get<ContactWithDetails>(`/contacts/${id}`),
  create: (input: CreateContactInput) => apiClient.post<Contact>('/contacts', input),
  update: (id: string, input: Partial<CreateContactInput>) => apiClient.patch<Contact>(`/contacts/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/contacts/${id}`),
  archive: (id: string, archived: boolean) => apiClient.post<Contact>(`/contacts/${id}/archive`, { archived }),
  getTimeline: (id: string) => apiClient.get<{ notes: any[]; reminders: any[]; timeline: any[] }>(`/contacts/${id}/timeline`),
};
