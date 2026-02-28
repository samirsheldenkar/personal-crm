import { Request, Response } from 'express';
import { searchService } from '../services/search.service';
import { searchQuerySchema } from '../types/search';
import { AppError } from '../utils/errors';

export async function search(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const query = searchQuerySchema.parse(req.query);
    
    const results = await searchService.search(userId, query.q, query.limit);
    res.json({ results, query: query.q });
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
