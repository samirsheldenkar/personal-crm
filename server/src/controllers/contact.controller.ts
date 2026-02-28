import { Request, Response } from 'express';
import { contactService } from '../services/contact.service';
import { createContactSchema, updateContactSchema, listContactsQuery } from '../types/contact';
import { AppError } from '../utils/errors';

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const query = listContactsQuery.parse(req.query);
    
    const result = await contactService.list(userId, {
      page: query.page,
      limit: query.limit,
      search: query.search,
      tags: query.tags ? query.tags.split(',') : undefined,
      sort: query.sort,
      order: query.order,
      archived: query.archived,
    });
    
    res.json(result);
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

export async function getById(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    const contact = await contactService.getById(userId, id as string);
    res.json(contact);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const input = createContactSchema.parse(req.body);
    
    const contact = await contactService.create(userId, input);
    res.status(201).json(contact);
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
    const input = updateContactSchema.parse(req.body);
    
    const contact = await contactService.update(userId, id as string, input);
    res.json(contact);
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
    
    await contactService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function archive(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { archived } = req.body;
    
    const contact = await contactService.archive(userId, id as string, archived);
    res.json(contact);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getTimeline(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    const timeline = await contactService.getTimeline(userId, id as string);
    res.json(timeline);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
