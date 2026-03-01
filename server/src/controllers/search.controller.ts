import { Request, Response } from 'express';
import { searchService } from '../services/search.service';
import { searchQuerySchema } from '../types/search';

export async function search(req: Request, res: Response) {
  const userId = req.user!.userId;
  const query = searchQuerySchema.parse(req.query);

  const results = await searchService.search(userId, query.q, query.limit);
  res.json({ results, query: query.q });
}
