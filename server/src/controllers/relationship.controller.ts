import { Request, Response } from 'express';
import { relationshipService } from '../services/relationship.service';
import { createRelationshipSchema } from '../types/relationship';

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { contactId } = req.query;

  const relationships = await relationshipService.list(userId, contactId as string | undefined);
  res.json(relationships);
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const input = createRelationshipSchema.parse(req.body);

  const relationship = await relationshipService.create(userId, input);
  res.status(201).json(relationship);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  await relationshipService.delete(userId, id as string);
  res.status(204).send();
}

export async function getGraph(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const graph = await relationshipService.getGraph(userId, id as string);
  res.json(graph);
}
