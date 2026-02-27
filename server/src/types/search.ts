import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(500),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export interface SearchResult {
  type: 'contact' | 'note';
  id: string;
  title: string;
  subtitle: string;
  contactId: string;
  rank: number;
}
