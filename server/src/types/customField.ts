import { z } from 'zod';

export const fieldTypes = ['text', 'number', 'date', 'select', 'multi_select', 'url', 'boolean'] as const;

export const createCustomFieldSchema = z.object({
  name: z.string().min(1).max(255),
  fieldType: z.enum(fieldTypes),
  options: z.array(z.string()).optional(),
  defaultValue: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCustomFieldSchema = createCustomFieldSchema.partial();

export type CreateCustomFieldInput = z.infer<typeof createCustomFieldSchema>;
export type UpdateCustomFieldInput = z.infer<typeof updateCustomFieldSchema>;
