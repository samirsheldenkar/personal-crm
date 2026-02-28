import { apiClient } from './client';
import type {
  Contact,
  ContactAddress,
  ContactEmail,
  ContactPhone,
  ContactTimelineResponse,
  ContactsListResponse,
  ContactWithDetails,
} from '../types';

export interface CreateContactInput {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  company?: string;
  jobTitle?: string;
  birthday?: string;
  emails?: ContactEmail[];
  phones?: ContactPhone[];
  addresses?: ContactAddress[];
  socialLinks?: Record<string, string>;
  customFields?: Record<string, unknown>;
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
    return apiClient.get<ContactsListResponse>(`/contacts?${query}`);
  },
  getById: (id: string) => apiClient.get<ContactWithDetails>(`/contacts/${id}`),
  create: (input: CreateContactInput) => apiClient.post<Contact>('/contacts', input),
  update: (id: string, input: Partial<CreateContactInput>) => apiClient.patch<Contact>(`/contacts/${id}`, input),
  delete: (id: string) => apiClient.delete<void>(`/contacts/${id}`),
  archive: (id: string, archived: boolean) => apiClient.post<Contact>(`/contacts/${id}/archive`, { archived }),
  getTimeline: (id: string) => apiClient.get<ContactTimelineResponse>(`/contacts/${id}/timeline`),
};
