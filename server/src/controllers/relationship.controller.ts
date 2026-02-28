import { Request, Response } from 'express';
import { relationshipService } from '../services/relationship.service';
import { createRelationshipSchema } from '../types/relationship';
import { AppError } from '../utils/errors';

export async function list(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { contactId } = req.query;
    
    const relationships = await relationshipService.list(userId, contactId as string | undefined);
    res.json(relationships);
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
    const input = createRelationshipSchema.parse(req.body);
    
    const relationship = await relationshipService.create(userId, input);
    res.status(201).json(relationship);
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
    
    await relationshipService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getGraph(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    const graph = await relationshipService.getGraph(userId, id as string);
    res.json(graph);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
