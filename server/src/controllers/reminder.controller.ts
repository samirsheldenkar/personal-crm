import { Request, Response } from 'express';
import { reminderService } from '../services/reminder.service';
import { createReminderSchema, updateReminderSchema } from '../types/reminder';

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;
  const reminders = await reminderService.list(userId);
  res.json(reminders);
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const input = createReminderSchema.parse(req.body);

  const reminder = await reminderService.create(userId, input);
  res.status(201).json(reminder);
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const input = updateReminderSchema.parse(req.body);

  const reminder = await reminderService.update(userId, id as string, input);
  res.json(reminder);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  await reminderService.delete(userId, id as string);
  res.status(204).send();
}
