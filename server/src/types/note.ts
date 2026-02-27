import { z } from 'zod';

export const createNoteSchema = z.object({
  body: z.string().min(1),
  format: z.enum(['markdown', 'plaintext']).default('markdown'),
  tags: z.array(z.string()).optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
