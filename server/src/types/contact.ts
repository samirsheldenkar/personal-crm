import { z } from 'zod';

const emailEntry = z.object({
  value: z.string().email(),
  label: z.string().optional(),
  primary: z.boolean().optional(),
});

const phoneEntry = z.object({
  value: z.string(),
  label: z.string().optional(),
  primary: z.boolean().optional(),
});

const addressEntry = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  label: z.string().optional(),
});

const socialLinks = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().optional(),
  website: z.string().url().optional(),
}).passthrough();

export const createContactSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
  company: z.string().max(255).optional(),
  jobTitle: z.string().max(255).optional(),
  birthday: z.string().optional(),
  emails: z.array(emailEntry).optional(),
  phones: z.array(phoneEntry).optional(),
  addresses: z.array(addressEntry).optional(),
  socialLinks: socialLinks.optional(),
  customFields: z.record(z.string(), z.any()).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateContactSchema = createContactSchema.partial();

export const listContactsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tags: z.string().optional(),
  sort: z.enum(['name', 'created_at', 'last_contacted_at']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  archived: z.coerce.boolean().default(false),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

export interface ContactRow {
  id: string;
  user_id: string;
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
