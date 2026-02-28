export interface ContactEmail {
  value: string;
  label?: string;
  type?: string;
  primary?: boolean;
}

export interface ContactPhone {
  value: string;
  label?: string;
  type?: string;
  primary?: boolean;
}

export interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  label?: string;
}

export interface ContactSocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CustomField {
  id: string;
  name: string;
  field_type: 'text' | 'number' | 'date' | 'select' | 'multi_select' | 'url' | 'boolean' | string;
  options: string[];
  default_value: string | null;
  sort_order: number;
}

export interface ContactCustomFieldValue {
  name: string;
  value: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  company: string | null;
  job_title: string | null;
  birthday: string | null;
  emails: ContactEmail[];
  phones: ContactPhone[];
  addresses: ContactAddress[];
  social_links: ContactSocialLinks;
  is_archived: boolean;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactWithDetails extends Contact {
  tags: Tag[];
  customFields: ContactCustomFieldValue[];
}

export interface Note {
  id: string;
  contact_id: string;
  body: string;
  format: 'markdown' | 'plaintext';
  tags: string[];
  created_at: string;
  updated_at: string;
}

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

export interface Relationship {
  id: string;
  from_contact_id: string;
  to_contact_id: string;
  type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  from_first_name?: string;
  from_last_name?: string | null;
  to_first_name?: string;
  to_last_name?: string | null;
}

export interface GraphNode {
  id: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  company: string | null;
  jobTitle: string | null;
  tags: Tag[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface ContactGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  centerId: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
}

export interface SearchResult {
  type: 'contact' | 'note';
  id: string;
  title: string;
  subtitle: string;
  contactId: string;
  rank: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ContactsListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
}

export interface ContactTimelineItem {
  type: 'note' | 'reminder';
  date: string;
  data: Note | Reminder;
}

export interface ContactTimelineResponse {
  notes: Note[];
  reminders: Reminder[];
  timeline: ContactTimelineItem[];
}
