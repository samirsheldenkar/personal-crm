import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#6366f1'),
});

export const updateTagSchema = createTagSchema.partial();

export const assignTagsSchema = z.object({
  tagIds: z.array(z.string().uuid()).min(1),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
