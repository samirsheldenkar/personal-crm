import { z } from 'zod';

export const createReminderSchema = z.object({
  contactId: z.string().uuid(),
  type: z.enum(['keep_in_touch', 'one_time']).default('keep_in_touch'),
  intervalDays: z.number().int().positive().optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'keep_in_touch') return !!data.intervalDays;
    if (data.type === 'one_time') return !!data.dueDate;
    return true;
  },
  { message: 'keep_in_touch requires intervalDays; one_time requires dueDate' }
);

export const updateReminderSchema = z.object({
  intervalDays: z.number().int().positive().optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
