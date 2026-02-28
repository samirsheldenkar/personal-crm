import { Request, Response } from 'express';
import { tagService } from '../services/tag.service';
import { createTagSchema, updateTagSchema, assignTagsSchema } from '../types/tag';
import { AppError } from '../utils/errors';

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const tags = await tagService.list(userId);
    res.json(tags);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const input = createTagSchema.parse(req.body);
    
    const tag = await tagService.create(userId, input);
    res.status(201).json(tag);
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
    const input = updateTagSchema.parse(req.body);
    
    const tag = await tagService.update(userId, id as string, input);
    res.json(tag);
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
    
    await tagService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function assignToContact(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { contactId } = req.params;
    const { tagIds } = assignTagsSchema.parse(req.body);
    
    const tags = await tagService.assignToContact(userId, contactId as string, tagIds);
    res.json(tags);
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

export async function removeFromContact(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { contactId, tagId } = req.params;
    
    await tagService.removeFromContact(userId, contactId as string, tagId as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
