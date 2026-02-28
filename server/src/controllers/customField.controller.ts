import { Request, Response } from 'express';
import { customFieldService } from '../services/customField.service';
import { createCustomFieldSchema, updateCustomFieldSchema } from '../types/customField';
import { AppError } from '../utils/errors';

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const fields = await customFieldService.list(userId);
    res.json(fields);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const input = createCustomFieldSchema.parse(req.body);
    
    const field = await customFieldService.create(userId, input);
    res.status(201).json(field);
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
    const input = updateCustomFieldSchema.parse(req.body);
    
    const field = await customFieldService.update(userId, id as string, input);
    res.json(field);
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
    
    await customFieldService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
