import { Request, Response } from 'express';
import { reminderService } from '../services/reminder.service';
import { createReminderSchema, updateReminderSchema } from '../types/reminder';
import { AppError } from '../utils/errors';

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const reminders = await reminderService.list(userId);
    res.json(reminders);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const input = createReminderSchema.parse(req.body);
    
    const reminder = await reminderService.create(userId, input);
    res.status(201).json(reminder);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const input = updateReminderSchema.parse(req.body);
    
    const reminder = await reminderService.update(userId, id as string, input);
    res.json(reminder);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    await reminderService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
